import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import SearchForm from "../components/SearchForm";
import VideoResult from "../components/VideoResult";
import Image from "next/image";

const MAX_TERM_LENGTH = 100;

async function getSearchResults(term) {
  "use server";
  try {
    // In production, use the project's production URL, otherwise use localhost
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost:3000";
    const protocol = host === "localhost:3000" ? "http" : "https";
    const apiUrl = new URL(`/api/search`, `${protocol}://${host}`);
    apiUrl.searchParams.set("term", term);

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
