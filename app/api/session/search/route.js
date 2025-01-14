import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const searchTerm = cookieStore.get("lastSearchTerm")?.value;
  const lastVideoId = cookieStore.get("lastVideoId")?.value;

  if (!searchTerm) {
    return NextResponse.json(
      { videos: [] },
      {
        headers: {
          "x-search-term": "none",
        },
      }
    );
  }

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/search?term=${encodeURIComponent(searchTerm)}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();
    const videos = data.videos || [];

    // Find the current index if we have a video ID
    let currentIndex = 0;
    if (lastVideoId) {
      const foundIndex = videos.findIndex((v) => v.id === lastVideoId);
      if (foundIndex !== -1) {
        currentIndex = foundIndex;
      }
    }

    return NextResponse.json(
      { videos, currentIndex },
      {
        headers: {
          "x-search-term": searchTerm,
          "x-current-index": currentIndex.toString(),
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      {
        status: 500,
        headers: {
          "x-search-term": "error",
        },
      }
    );
  }
}
