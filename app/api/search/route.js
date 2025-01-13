import { NextResponse } from "next/server";
import { youtube } from "scrape-youtube";
import sqlite3 from "sqlite3";
import path from "path";

// Construct the path to the SQLite database file
const dbPath = path.join(process.cwd(), "lib", "db", "db.sqlite");

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err);
  } else {
    console.log("Successfully connected to the database.");
  }
});

async function isBadWordPresent(query) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT word FROM bad_words WHERE ? LIKE '% ' || word || ' %' OR ? LIKE word || ' %' OR ? LIKE '% ' || word OR ? = word`;
    db.get(
      sql,
      [
        query.toLowerCase(),
        query.toLowerCase(),
        query.toLowerCase(),
        query.toLowerCase(),
      ],
      (err, row) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else {
          const isBad = !!row;
          resolve(isBad);
        }
      }
    );
  });
}

// Wrap the YouTube search logic in use cache
async function getYouTubeSearchResults(searchTerm) {
  "use cache"; // Re-enabled caching
  console.log("Fetching results from YouTube (uncached)...");

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
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error during scraping:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
