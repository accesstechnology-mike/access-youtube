import { redirect, RedirectType } from "next/navigation";
import { Suspense } from "react";
import SearchForm from "../components/SearchForm";
import VideoResult from "../components/VideoResult";
import sqlite3 from "sqlite3";
import path from "path";

const MAX_TERM_LENGTH = 100;

// Initialize the database connection
const dbPath = path.join(process.cwd(), "lib", "db", "db.sqlite");
const db = new sqlite3.Database(dbPath);

async function checkBadWords(term) {
  "use server";
  // Split on both + and spaces to get all individual words
  const words = term
    .split(/[+\s]+/) // Split on either + or whitespace
    .map((part) => decodeURIComponent(part.trim()))
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase());

  return new Promise((resolve, reject) => {
    // Get all bad words from DB first
    db.all("SELECT word FROM bad_words", [], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        reject(err);
        return;
      }

      // Create a Set of bad words for faster lookup
      const badWords = new Set(rows.map((row) => row.word));

      // Check if any word in our search term is a bad word
      const hasBadWord = words.some((word) => badWords.has(word));
      resolve(hasBadWord);
    });
  });
}

async function getSearchResults(term) {
  "use server";
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/search?term=${encodeURIComponent(term)}`,
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
    return data;
  } catch (error) {
    console.error("Search error:", error);
    return { error: "Failed to fetch search results" };
  }
}

export default async function SearchPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent params={params} />
    </Suspense>
  );
}

async function SearchPageContent({ params }) {
  // Properly await params
  const resolvedParams = await Promise.resolve(params);

  // Get and validate the search term
  const termArray = resolvedParams?.term;
  if (!termArray?.[0]) {
    redirect("/");
  }

  // Decode the term BEFORE validation
  const searchTerm = decodeURIComponent(termArray[0]);

  if (searchTerm.length > MAX_TERM_LENGTH) {
    redirect("/");
  }

  try {
    const hasBadWords = await checkBadWords(searchTerm);

    if (hasBadWords) {
      // Use permanent redirect for bad words
      redirect("/", RedirectType.permanent);
    }
  } catch (error) {
    // Don't log the redirect error
    if (!error.message?.includes("NEXT_REDIRECT")) {
      console.error("Bad word check error:", error);
    }
    redirect("/");
  }

  // If we get here, the term is safe for display
  const displayTerm = searchTerm.split("+").join(" ");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SearchForm initialTerm={displayTerm} />
        <Suspense
          fallback={
            <div className="text-center py-8">Loading search results...</div>
          }
        >
          <SearchResults searchTerm={displayTerm} />
        </Suspense>
      </div>
    </main>
  );
}

async function SearchResults({ searchTerm }) {
  try {
    const searchResults = await getSearchResults(searchTerm);

    return (
      <div className="mt-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Search Results for "{searchTerm}"
        </h1>

        {searchResults.error ? (
          <div role="alert" className="text-red-600 text-center">
            {searchResults.error}
          </div>
        ) : (
          <div
            className="flex flex-col gap-4"
            role="region"
            aria-label={`${
              searchResults.videos?.length || 0
            } search results for ${searchTerm}`}
          >
            {searchResults.videos?.map((video) => (
              <VideoResult key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Search results error:", error);
    return (
      <div role="alert" className="text-red-600 text-center">
        An error occurred while fetching search results
      </div>
    );
  }
}
