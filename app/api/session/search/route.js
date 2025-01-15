import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get cookie store and wait for it
    const cookieStore = await cookies();
    const searchTerm = cookieStore.get("lastSearchTerm")?.value;

    if (!searchTerm) {
      return NextResponse.json(
        { videos: [] },
        {
          headers: { 
            "x-search-term": "none",
            "Cache-Control": "no-store"
          },
        }
      );
    }

    // Use same URL construction as [...term]/page.js
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost:3000";
    const protocol = host === "localhost:3000" ? "http" : "https";
    const apiUrl = new URL(`/api/search`, `${protocol}://${host}`);
    apiUrl.searchParams.set("term", searchTerm);

    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "x-search-term": searchTerm,
        "Cache-Control": "no-store"
      },
    });
  } catch (error) {
    console.error("Session search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      {
        status: 500,
        headers: {
          "x-search-term": "error",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
