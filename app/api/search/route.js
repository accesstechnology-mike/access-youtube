import { NextResponse } from "next/server";
import { youtube } from "scrape-youtube";

// Wrap the YouTube search logic in use cache
async function getYouTubeSearchResults(searchTerm) {

  

  // Log the exact options we're using
  const options = {
    type: "video",
    safeSearch: true,
    request: {
      headers: {
        Cookie: "PREF=f2=8000000", // Cookie restored
        // Add User-Agent as YouTube might be checking this
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        // Add Accept-Language to ensure we get English results
        "Accept-Language": "en-US,en;q=0.9",
      },
    },
  };

  const searchResults = await youtube.search(searchTerm, options);
 

  return { videos: searchResults.videos };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

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

  if (!searchTerm) {
    return NextResponse.json(
      { error: "Search term cannot be empty" },
      { status: 400 }
    );
  }

  try {
    const { videos } = await getYouTubeSearchResults(searchTerm);




    // Create the response object as before

    'use cache'
    const searchResponse = NextResponse.json({
      searchTerm: searchTerm,
      videos: videos || [],
    });

    return searchResponse;
  } catch (error) {
    console.error("Error during scraping:", error);
    return NextResponse.json({
      error: "Failed to fetch search results",
      message: error.message || "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
