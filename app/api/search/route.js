import { NextResponse } from "next/server";
import { youtube } from "scrape-youtube";

/**
 * YouTube Search API Route
 * 
 * KNOWN ISSUE: The scrape-youtube library can fail with "Cannot read properties of undefined (reading 'split')"
 * when YouTube changes their HTML structure or blocks requests. This happens when the library tries to extract
 * 'var ytInitialData' from the page but the HTML doesn't contain it.
 * 
 * Mitigations implemented:
 * 1. Retry logic with exponential backoff (up to 3 retries)
 * 2. Enhanced request headers to mimic real browser
 * 3. Better error handling and logging
 * 4. Graceful degradation with informative error messages
 * 
 * Future considerations:
 * - Consider using YouTube Data API v3 (requires API key and has quotas)
 * - Monitor for scrape-youtube package updates
 * - Implement rate limiting to avoid getting blocked
 */

// Enable debug mode for the scraper in development
if (process.env.NODE_ENV === 'development') {
  youtube.debug = true;
}

// Wrap the YouTube search logic with retry capability
async function getYouTubeSearchResults(searchTerm, retryCount = 0, maxRetries = 3) {
  const options = {
    type: "video",
    safeSearch: true,
    request: {
      headers: {
        Cookie: "PREF=f2=8000000",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    },
  };

  try {
    console.log(`[YouTube Search] Attempting search for: "${searchTerm}" (attempt ${retryCount + 1})`);
    const searchResults = await youtube.search(searchTerm, options);
    
    // Validate the response structure
    if (!searchResults || !searchResults.videos) {
      console.error("[YouTube Search] Invalid response structure:", {
        hasResults: !!searchResults,
        hasVideos: !!(searchResults && searchResults.videos),
        resultKeys: searchResults ? Object.keys(searchResults) : []
      });
      throw new Error("Invalid response structure from YouTube");
    }
    
    console.log(`[YouTube Search] Success: Found ${searchResults.videos.length} videos`);
    return { videos: searchResults.videos };
  } catch (error) {
    console.error(`[YouTube Search] Error on attempt ${retryCount + 1}:`, {
      message: error.message,
      type: error.constructor.name,
      searchTerm
    });
    
    // If we get a split error and haven't exhausted retries, try again
    if (retryCount < maxRetries && (
      error.message.includes("split") || 
      error.message.includes("ytInitialData") ||
      error.message.includes("Cannot read properties")
    )) {
      const waitTime = Math.pow(2, retryCount) * 1000;
      console.log(`[YouTube Search] Retrying in ${waitTime}ms (attempt ${retryCount + 2}/${maxRetries + 1})`);
      
      // Wait before retrying (exponential backoff: 1s, 2s, 4s)
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      return getYouTubeSearchResults(searchTerm, retryCount + 1, maxRetries);
    }
    
    // Re-throw if we've exhausted retries or it's a different error
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
      errorMessage = "YouTube response format changed or request was blocked. Try again later.";
      statusCode = 503;
    }
    
    return NextResponse.json({
      error: "Failed to fetch search results",
      message: errorMessage,
      details: error.stack ? error.stack.split('\n').slice(0, 3).join('\n') : undefined,
      timestamp: new Date().toISOString()
    }, { status: statusCode });
  }
}
