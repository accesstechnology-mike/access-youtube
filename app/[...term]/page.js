import { redirect, RedirectType } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import SearchForm from "../components/SearchForm";
import VideoResult from "../components/VideoResult";
import Image from "next/image";
import sqlite3 from "sqlite3";
import path from "path";

const MAX_TERM_LENGTH = 100;

// Initialize the database connection
const dbPath = path.join(process.cwd(), "lib", "db", "db.sqlite");
const db = new sqlite3.Database(dbPath);

async function checkBadWords(term) {
  "use server";
  const words = term
    .split(/[+\s]+/)
    .map((part) => decodeURIComponent(part.trim()))
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase());

  return new Promise((resolve, reject) => {
    db.all("SELECT word FROM bad_words", [], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        reject(err);
        return;
      }
      const badWords = new Set(rows.map((row) => row.word));
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
    <Suspense>
      <SearchPageContent params={params} />
    </Suspense>
  );
}

async function SearchPageContent({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const termArray = resolvedParams?.term;

  if (!termArray?.[0]) {
    redirect("/");
  }

  const searchTerm = decodeURIComponent(termArray[0]);

  if (searchTerm.length > MAX_TERM_LENGTH) {
    redirect("/");
  }

  try {
    const hasBadWords = await checkBadWords(searchTerm);

    if (hasBadWords) {
      redirect("/", RedirectType.permanent);
    }
  } catch (error) {
    if (!error.message?.includes("NEXT_REDIRECT")) {
      console.error("Bad word check error:", error);
    }
    redirect("/");
  }

  const displayTerm = searchTerm.split("+").join(" ");

  return (
    <main className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        <SearchForm initialTerm={displayTerm} />
        <Suspense
          fallback={
            <div className="text-center py-8 text-light/70">
              Loading search results...
            </div>
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

    // Limit to 12 videos
    const limitedVideos = searchResults.videos?.slice(0, 12);

    return (
      <div className="flex flex-col items-center mt-4">
        <h1 className="text-2xl font-bold text-light/90 mb-8">
          Search Results for "{searchTerm}"
        </h1>

        {searchResults.error ? (
          <div role="alert" className="text-primary-start text-center">
            {searchResults.error}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            role="region"
            aria-label={`${
              limitedVideos?.length || 0
            } search results for ${searchTerm}`}
          >
            {limitedVideos?.map((video, index) => (
              <VideoResult key={video.id} video={video} index={index} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Search results error:", error);
    return (
      <div role="alert" className="text-primary-start text-center">
        An error occurred while fetching search results
      </div>
    );
  }
}
