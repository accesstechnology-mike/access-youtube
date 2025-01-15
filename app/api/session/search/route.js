import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getSessionResults() {
  // Get cookie store and wait for it
  const cookieStore = await cookies();
  const searchTerm = cookieStore.get("lastSearchTerm")?.value;

  if (!searchTerm) {
    return { videos: [], searchTerm: null };
  }

  // Use same URL construction as [...term]/page.js
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost:3000";
  const protocol = host === "localhost:3000" ? "http" : "https";
  const apiUrl = new URL(`/api/search`, `${protocol}://${host}`);
  apiUrl.searchParams.set("term", searchTerm);

  const response = await fetch(apiUrl, {
    cache: 'force-cache',
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Search failed");
  }

  const data = await response.json();
  return { ...data, searchTerm };
}

export async function GET(request) {
  const cacheKey = request.url; // Use full URL as cache key
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  
  console.log(`/api/session/search: Checking session for videoId: ${videoId}`);
  
  try {
    // Get the current session's search results
    const sessionResults = await getSessionResults();
    const { searchTerm, videos } = sessionResults;
    console.log(`/api/session/search: Session has ${videos?.length || 0} videos`);
    
    if (videoId && videos) {
      // Check if video exists in current session results
      const videoInSession = videos.find(v => v.id === videoId);
      console.log(`/api/session/search: Video ${videoId} ${videoInSession ? 'found' : 'not found'} in session`);
      
      if (videoInSession) {
        return NextResponse.json({ video: videoInSession }, {
          headers: {
            "x-search-term": searchTerm || "none",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }

    return NextResponse.json({ videos: videos || [] }, {
      headers: {
        "x-search-term": searchTerm || "none",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Session search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
