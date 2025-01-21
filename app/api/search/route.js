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

  console.log("Search options:", JSON.stringify(options, null, 2));

  const searchResults = await youtube.search(searchTerm, options);

  // Log more details about the results
  if (searchResults.videos.length > 0) {
    console.log(`Found ${searchResults.videos.length} results`);
    console.log("First result:", {
      title: searchResults.videos[0].title,
      duration: searchResults.videos[0].duration,
      uploaded: searchResults.videos[0].uploaded,
      views: searchResults.videos[0].views,
    });
  }

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

  // Sanitize the search term
  searchTerm = searchTerm
    .split("+")
    .map((part) => decodeURIComponent(part.trim()))
    .filter((part) => part.length > 0)
    .join(" ")
    .trim();

  if (!searchTerm) {
    return NextResponse.json(
      { error: "Search term cannot be empty" },
      { status: 400 }
    );
  }

  try {
    const { videos } = await getYouTubeSearchResults(searchTerm);
    
    // Build a minimal array containing only id, title, and thumbnail
    const minimalVideos = videos.map(({ id, title, thumbnail }) => ({
      id,
      title,
      thumbnail: thumbnail?.url ?? ""
    }));

    // Create the response object as before
    const response = NextResponse.json({
      videos: videos || [],
      timestamp: new Date().toISOString()
    });

    // Save the current search term into the cookie
    response.cookies.set('searchTerm', searchTerm, {
      path: '/',
      // You can optionally add an expiration or 'maxAge' here if needed
    });

    // Also store the minimal video results in a separate cookie
    response.cookies.set('videoResults', JSON.stringify(minimalVideos), {
      path: '/',
    });

    // Reset the 'videoIndex' cookie to 0 on every new search
    response.cookies.set('videoIndex', '0', {
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Error during scraping:", error);
    return NextResponse.json({
      error: "Failed to fetch search results",
      message: error.message || "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
