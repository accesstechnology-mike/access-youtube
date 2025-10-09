import { NextResponse } from "next/server";
import YouTube from "youtube-sr";

/**
 * YouTube Search API Route
 * 
 * Uses youtube-sr library for scraping YouTube search results.
 * This is more reliable than scrape-youtube which was failing with "Cannot read properties of undefined (reading 'split')".
 * 
 * CRITICAL: The Cookie header with PREF=f2=8000000 is essential for:
 * - Enabling SafeSearch filtering
 * - Getting consistent, appropriate search results
 * - Avoiding age-restricted or inappropriate content
 * 
 * Mitigations implemented:
 * 1. Retry logic with exponential backoff
 * 2. Custom request headers including critical PREF cookie
 * 3. Better error handling and logging
 * 4. Graceful degradation with informative error messages
 * 5. Video result normalization to match expected format
 * 
 * Note: youtube-sr is actively maintained and more resilient,
 * but all scrapers can break when YouTube changes their HTML structure.
 */

// Normalize youtube-sr results to match expected format
function normalizeYouTubeSRResults(searchResults) {
  return searchResults.map(video => ({
    id: video.id,
    title: video.title || '',
    duration: video.duration_formatted || '',
    duration_raw: video.duration || 0,
    snippet: video.description || '',
    upload_date: video.uploadedAt || '',
    thumbnail: video.thumbnail?.url || '',  // Component expects 'thumbnail' not 'thumbnail_src'
    thumbnail_src: video.thumbnail?.url || '',  // Keep for backwards compatibility
    views: video.views || 0,
    channel: {
      name: video.channel?.name || 'Unknown',
      verified: video.channel?.verified || false,
      id: video.channel?.id || null,
      url: video.channel?.url || '',
    },
    url: video.url || `https://www.youtube.com/watch?v=${video.id}`,
  }));
}

// Wrap the YouTube search logic with retry capability
async function getYouTubeSearchResults(searchTerm, retryCount = 0, maxRetries = 1) {
  // Vary User-Agent between retries to avoid pattern detection
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  ];

  try {
    console.log(`[YouTube Search] Attempting search for: "${searchTerm}" (attempt ${retryCount + 1})`);
    
    // Configure youtube-sr with custom request options
    // Note: safeSearch: true automatically adds PREF=f2=8000000 cookie
    const searchResults = await YouTube.search(searchTerm, {
      limit: 12,
      type: "video",
      safeSearch: true, // CRITICAL: Automatically adds PREF=f2=8000000 cookie
      requestOptions: {
        headers: {
          "User-Agent": userAgents[retryCount % userAgents.length],
          "Accept-Language": "en-US,en;q=0.9",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
      },
    });
    
    // Validate the response structure
    if (!searchResults || !Array.isArray(searchResults)) {
      console.error("[YouTube Search] Invalid response structure:", {
        hasResults: !!searchResults,
        isArray: Array.isArray(searchResults),
        type: typeof searchResults
      });
      throw new Error("Invalid response structure from YouTube");
    }
    
    console.log(`[YouTube Search] Success: Found ${searchResults.length} videos`);
    
    // Normalize the results to match the expected format
    const normalizedVideos = normalizeYouTubeSRResults(searchResults);
    
    return { videos: normalizedVideos };
  } catch (error) {
    console.error(`[YouTube Search] Error on attempt ${retryCount + 1}:`, {
      message: error.message,
      type: error.constructor.name,
      searchTerm,
      stack: error.stack?.split('\n').slice(0, 3)
    });
    
    // Retry on any error if we haven't exhausted retries
    if (retryCount < maxRetries) {
      // Exponential backoff: 3s, 9s with jitter
      const waitTime = Math.pow(3, retryCount + 1) * 1000 + Math.random() * 2000;
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
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  
  // Log request metadata to help identify source of searches
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || 'direct';
  
  // Check if this is a bot/crawler
  const botPatterns = /bot|crawler|spider|scrapy|wget|curl|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegram/i;
  const isBot = botPatterns.test(userAgent);
  
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
  
  // Log all searches with metadata
  console.log(`[YouTube Search] New search request:`, {
    term: searchTerm.substring(0, 150), // Limit length in logs
    termLength: searchTerm.length,
    isBot,
    userAgent: userAgent.substring(0, 100),
    referer
  });
  
  // Detect if search term looks like a full video title (contains pipe character or is very long)
  const looksLikeVideoTitle = searchTerm.includes(' | ') || searchTerm.length > 100;
  
  if (looksLikeVideoTitle) {
    console.log(`[YouTube Search] Suspicious search term detected:`, {
      term: searchTerm,
      isBot,
      userAgent: userAgent.substring(0, 100),
      referer,
      length: searchTerm.length
    });
    
    // If it's a bot searching for a video title, return empty results instead of actually searching
    if (isBot) {
      console.log(`[YouTube Search] Blocked bot search for video title`);
      return NextResponse.json({
        searchTerm: searchTerm,
        videos: [],
        blocked: true,
        reason: 'Bot search for video title'
      });
    }
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

    // Create the response object as before
    'use cache'
    const searchResponse = NextResponse.json({
      searchTerm: searchTerm,
      videos: videos || [],
    });

    return searchResponse;
  } catch (error) {
    console.error("Error during scraping:", error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = error.message || "Unknown error";
    let statusCode = 500;
    
    if (error.message && error.message.includes("split")) {
      errorMessage = "YouTube has temporarily blocked our requests or changed their page structure. Please try again in a few minutes.";
      statusCode = 503;
    }
    
    // Return empty results instead of error for better UX
    console.log(`[YouTube Search] Returning empty results due to error: ${errorMessage}`);
    return NextResponse.json({
      searchTerm: searchTerm,
      videos: [],
      error: "Temporarily unavailable",
      message: errorMessage,
      retryAfter: 300, // Suggest retry after 5 minutes
      timestamp: new Date().toISOString()
    }, { status: 200 }); // Return 200 with empty results instead of error
  }
}
