import { NextResponse } from "next/server";
import { SearchHandler } from '@scrappy-scraper/youtube_scraper';

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 searches per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  // Check if over limit
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetIn: Math.ceil((recentRequests[0] + RATE_LIMIT_WINDOW - now) / 1000) };
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  // Clean up old entries periodically (prevent memory leak)
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
      if (valid.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, valid);
      }
    }
  }
  
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - recentRequests.length };
}

/**
 * YouTube Search API Route
 * 
 * Uses @scrappy-scraper/youtube_scraper for scraping YouTube search results.
 * This is more reliable and actively maintained (updated 2025-10-08).
 * Previous libraries (scrape-youtube, youtube-sr) kept breaking due to YouTube structure changes.
 * 
 * Mitigations implemented:
 * 1. Retry logic with exponential backoff
 * 2. Better error handling and logging
 * 3. Graceful degradation with informative error messages
 * 4. Video result normalization to match expected format
 * 5. Bot detection and blocking
 * 
 * Note: All scrapers can break when YouTube changes their structure,
 * but this library is actively maintained and updated frequently.
 */

// Format duration from seconds to MM:SS or HH:MM:SS
function formatDuration(seconds) {
  if (!seconds) return '';
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Normalize scrappy-scraper results to match expected format
function normalizeScrappyScraperResults(searchResults) {
  if (!searchResults || !Array.isArray(searchResults)) return [];
  
  return searchResults
    .filter(item => item.type === 'video' && item.id) // Only include video results with IDs
    .map(video => ({
      id: video.id || '',
      title: video.title || '',
      duration: formatDuration(video.length),
      duration_raw: video.length || 0,
      snippet: '', // This scraper doesn't provide descriptions in search results
      upload_date: video.age ? `${video.age.amount} ${video.age.unit} ago` : '',
      thumbnail: video.thumbnail || '',
      thumbnail_src: video.thumbnail || '',
      views: video.viewCount || 0,
      channel: {
        name: video.channelName || 'Unknown',
        verified: false, // Not provided by this scraper
        id: video.channelId || null,
        url: video.channelId ? `https://www.youtube.com/channel/${video.channelId}` : '',
      },
      url: `https://www.youtube.com/watch?v=${video.id}`,
    }));
}

// Wrap the YouTube search logic with retry capability
async function getYouTubeSearchResults(searchTerm, retryCount = 0, maxRetries = 1) {
  try {
    console.log(`[YouTube Search] Attempting search for: "${searchTerm}" (attempt ${retryCount + 1})`);
    
    const searchHandler = new SearchHandler();
    await searchHandler.search({ query: searchTerm });
    
    const searchResults = searchHandler.toJSON();
    
    // Validate the response structure
    if (!searchResults || !searchResults.items || !Array.isArray(searchResults.items)) {
      console.error("[YouTube Search] Invalid response structure:", {
        hasResults: !!searchResults,
        hasItems: !!searchResults?.items,
        isArray: Array.isArray(searchResults?.items)
      });
      throw new Error("Invalid response structure from YouTube");
    }
    
    console.log(`[YouTube Search] Success: Found ${searchResults.items.length} results`);
    
    // Normalize the results to match the expected format
    const normalizedVideos = normalizeScrappyScraperResults(searchResults.items);
    
    console.log(`[YouTube Search] Normalized to ${normalizedVideos.length} videos`);
    
    // If we got empty results on first try, retry once more
    if (normalizedVideos.length === 0 && retryCount === 0) {
      console.warn(`[YouTube Search] No video results found, retrying`);
      const waitTime = 2000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return getYouTubeSearchResults(searchTerm, retryCount + 1, maxRetries);
    }
    
    return { videos: normalizedVideos };
  } catch (error) {
    console.error(`[YouTube Search] Error on attempt ${retryCount + 1}:`, {
      message: error.message,
      type: error.constructor.name,
      searchTerm,
      stack: error.stack?.split('\n').slice(0, 3)
    });
    
    // Retry on errors if we haven't exhausted retries
    if (retryCount < maxRetries) {
      const waitTime = 3000 + Math.random() * 2000;
      console.log(`[YouTube Search] Retrying in ${Math.round(waitTime)}ms (attempt ${retryCount + 2}/${maxRetries + 1})`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      return getYouTubeSearchResults(searchTerm, retryCount + 1, maxRetries);
    }
    
    // Re-throw if we've exhausted retries
    console.error(`[YouTube Search] Failed after ${retryCount + 1} attempts`);
    throw error;
  }
}

export async function GET(request) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  
  // Log request metadata to help identify source of searches
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || 'direct';
  
  // Enhanced logging for debugging
  console.log(`[API Request] ${request.method} ${request.url}`, {
    timestamp: new Date().toISOString(),
    userAgent: userAgent.substring(0, 100),
    referer: referer.substring(0, 100),
    cfRay: request.headers.get('cf-ray'),
    cfCountry: request.headers.get('cf-ipcountry'),
    cfConnectingIP: request.headers.get('cf-connecting-ip')?.substring(0, 15)
  });
  
  // Cloudflare provides real client IP in CF-Connecting-IP header
  // Fallback to other headers if not behind Cloudflare
  const ip = request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Bot detection patterns (Cloudflare handles most bots, this is backup detection)
  // Focus on patterns that might slip through Cloudflare's Bot Fight Mode
  const botPatterns = /scrapy|wget|curl|python|java|okhttp|axios|headless|phantom|selenium|puppeteer|playwright|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegram|discordbot/i;
  const isBot = botPatterns.test(userAgent);
  
  // Detect truncated/suspicious User-Agents (bots faking browser UAs but doing it poorly)
  // Real browser UAs are typically 110-150+ chars, bots often truncate to exactly 100
  const isTruncatedUA = userAgent.endsWith('.') || userAgent.length === 100 || userAgent.length < 50;
  
  // Detect missing or suspicious headers that real browsers always send
  const acceptHeader = request.headers.get('accept') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const isMissingBrowserHeaders = !acceptLanguage || acceptHeader === '*/*';
  
  // Detect self-referencing searches for full video titles (bots crawling their own results)
  const isSelfReferer = referer.includes('accessyoutube.org.uk');
  
  // Consider it a bot if any suspicious indicators are present
  const isSuspiciousBot = isBot || isTruncatedUA || isMissingBrowserHeaders;
  
  // Handle special requests
  if (term === 'favicon' || request.url.includes('manifest')) {
    return new Response(null, { status: 204 });
  }

  let searchTerm = searchParams.get("term");

  if (!searchTerm) {
    return NextResponse.json(
      { error: "Search term is required" },
      { status: 400 }
    );
  }
  
  // Check rate limit
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    console.log(`[Rate Limit] Blocked IP: ${ip}, resetIn: ${rateLimit.resetIn}s`);
    return NextResponse.json({
      searchTerm: searchTerm,
      videos: [],
      error: "Rate limit exceeded",
      message: `Too many requests. Please wait ${rateLimit.resetIn} seconds.`,
      retryAfter: rateLimit.resetIn
    }, {
      status: 429,
      headers: {
        'Retry-After': rateLimit.resetIn.toString(),
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil((Date.now() + rateLimit.resetIn * 1000) / 1000).toString(),
      }
    });
  }
  
  // Detect if search term looks like a full video title (contains pipe character or is very long)
  const looksLikeVideoTitle = searchTerm.includes(' | ') || searchTerm.length > 60;
  
  // Block suspicious bots searching for video titles (crawlers hitting our search results)
  if (looksLikeVideoTitle && (isSuspiciousBot || isSelfReferer)) {
    console.log(`[YouTube Search] Blocked suspicious bot/crawler:`, {
      term: searchTerm.substring(0, 100),
      termLength: searchTerm.length,
      userAgent: userAgent.substring(0, 100),
      userAgentLength: userAgent.length, // Debug: log actual UA length
      referer: referer.substring(0, 100),
      reasons: {
        isTruncatedUA,
        isBot,
        isMissingBrowserHeaders,
        isSelfReferer,
        looksLikeVideoTitle
      }
    });
    
    return NextResponse.json({
      searchTerm: searchTerm,
      videos: [],
      blocked: true,
      reason: 'Automated traffic detected'
    }, {
      status: 403,
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache blocks for 24 hours
      }
    });
  }
  
  // Log legitimate searches with Cloudflare info
  if (!isSuspiciousBot) {
    console.log(`[YouTube Search] Processing search:`, {
      term: searchTerm.substring(0, 100),
      termLength: searchTerm.length,
      ipSource: request.headers.get('cf-connecting-ip') ? 'cloudflare' : 'direct',
      ip: ip.substring(0, 15) // Only show first 15 chars of IP for privacy
    });
  }

  try {
    const { videos } = await getYouTubeSearchResults(searchTerm);

    // Validate we got actual results
    if (!videos || !Array.isArray(videos)) {
      console.error("Invalid response structure from YouTube scraper");
      return NextResponse.json({
        error: "Failed to parse search results",
        message: "YouTube may have changed their page structure or blocked the request",
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }

    // Only cache successful responses with actual videos
    if (videos.length > 0) {
      const responseTime = Date.now() - startTime;
      console.log(`[API Success] Search completed in ${responseTime}ms`, {
        searchTerm: searchTerm.substring(0, 50),
        videoCount: videos.length,
        responseTime
      });
      
      'use cache'
      return NextResponse.json({
        searchTerm: searchTerm,
        videos: videos,
      });
    }
    
    // Don't cache empty results - might be temporary failure
    const responseTime = Date.now() - startTime;
    console.log(`[API Warning] Empty results in ${responseTime}ms`, {
      searchTerm: searchTerm.substring(0, 50),
      responseTime
    });
    
    return NextResponse.json({
      searchTerm: searchTerm,
      videos: [],
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[API Error] Search failed in ${responseTime}ms:`, {
      searchTerm: searchTerm?.substring(0, 50),
      error: error.message,
      errorType: error.constructor.name,
      stack: error.stack?.split('\n').slice(0, 3),
      responseTime
    });
    
    // Provide more specific error messages based on the error type
    let errorMessage = error.message || "Unknown error";
    let statusCode = 500;
    
    if (error.message && error.message.includes("split")) {
      errorMessage = "YouTube has temporarily blocked our requests or changed their page structure. Please try again in a few minutes.";
      statusCode = 503;
    }
    
    // Return error status so Next.js doesn't cache failures
    console.log(`[API Error] Returning error due to: ${errorMessage}`);
    return NextResponse.json({
      searchTerm: searchTerm,
      videos: [],
      error: "Temporarily unavailable",
      message: errorMessage,
      retryAfter: 300, // Suggest retry after 5 minutes
      timestamp: new Date().toISOString()
    }, { 
      status: statusCode, // Use proper error status to prevent caching
      headers: {
        'Cache-Control': 'no-store, must-revalidate', // Don't cache errors
      }
    });
  }
}
