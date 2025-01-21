"use client";

import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import SearchForm from "../components/SearchForm";
import VideoResult from "../components/VideoResult";
import Image from "next/image";

const MAX_TERM_LENGTH = 100;

export default function SearchPage({ params }) {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(false);
  const fetchController = useRef(null);

  useEffect(() => {
    const termArray = params?.term;
    if (!termArray?.[0]) {
      window.location.href = "/";
      return;
    }

    const searchTerm = decodeURIComponent(termArray[0]);

    // Skip checks for special system files
    if (searchTerm === 'favicon' || 
        searchTerm === 'site.webmanifest' || 
        searchTerm.endsWith('.ico')) {
      window.location.href = "/";
      return;
    }

    if (searchTerm.length > MAX_TERM_LENGTH) {
      window.location.href = "/";
      return;
    }

    // Abort any existing request
    if (fetchController.current) {
      fetchController.current.abort();
    }

    // Create new AbortController
    fetchController.current = new AbortController();
    const controller = fetchController.current;

    const fetchResults = async () => {
      try {
        console.log('Starting fetch for:', searchTerm);
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/search?term=${encodeURIComponent(searchTerm)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: 'no-store',
            signal: controller.signal
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetch completed for:', searchTerm);
        setSearchResults(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Search error:", error);
          setError(error.message || "Search failed");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      if (fetchController.current) {
        console.log('Cleaning up fetch for:', searchTerm);
        fetchController.current.abort();
      }
    };
  }, [params?.term?.[0]]); // Only run when the search term changes

  const displayTerm = params?.term?.[0] ? 
    decodeURIComponent(params.term[0]).split("+").join(" ") : "";

  return (
    <main className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        <SearchForm initialTerm={displayTerm} />
        {isLoading ? (
          <div className="text-center py-8 text-light/70">
            Loading search results...
          </div>
        ) : error ? (
          <div role="alert" className="text-primary-start text-center text-xl">
            {error}. Please try again.
          </div>
        ) : (
          <SearchResults searchTerm={displayTerm} searchResults={searchResults} />
        )}
      </div>
    </main>
  );
}

function SearchResults({ searchTerm, searchResults }) {
  const limitedVideos = searchResults?.videos?.slice(0, 12) || [];

    return (
      <div className="flex flex-col items-center mt-4">
        <h1 className="text-2xl font-bold text-light/90 mb-8">
          Search Results for "{searchTerm}"
        </h1>

      {!limitedVideos.length ? (
        <div 
          role="alert" 
          className="text-primary-start text-center text-xl"
          aria-live="polite"
        >
          No videos found for "{searchTerm}". Please try a different search.
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="region"
          aria-label={`${limitedVideos.length} search results for ${searchTerm}`}
        >
          {limitedVideos.map((video, index) => (
            <VideoResult key={video.id} video={video} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
