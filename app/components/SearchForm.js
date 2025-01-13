"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";

export default function SearchForm({ initialTerm = "" }) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update search term when initialTerm prop changes
  useEffect(() => {
    if (initialTerm !== searchTerm) {
      setSearchTerm(initialTerm);
    }
  }, [initialTerm]);

  // Debounced input handler
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Sanitize the search term
    const sanitizedTerm = searchTerm
      .split(/[\s+]+/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join("+");

    if (!sanitizedTerm) {
      setError("Please enter a search term");
      return;
    }

    if (sanitizedTerm.length > 100) {
      setError("Search term is too long");
      return;
    }

    try {
      setIsSearching(true);
      // Update: Remove leading slash to match Next.js catch-all route
      await router.push(`${sanitizedTerm}`);
    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred while navigating");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        role="search"
        aria-label="Search YouTube videos"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          access:youtube
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Search YouTube videos with enhanced accessibility
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setError("");
                const newValue = e.target.value;
                setSearchTerm(newValue);
                debouncedSetSearchTerm(newValue);
              }}
              placeholder="Search YouTube videos..."
              className="w-full px-6 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search YouTube videos"
              aria-invalid={!!error}
              aria-describedby={error ? "search-error" : undefined}
              disabled={isSearching}
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={isSearching ? "Searching..." : "Submit search"}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div
            id="search-error"
            role="alert"
            className="text-red-600 text-sm"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <div aria-live="polite" className="sr-only">
          {isSearching ? "Searching for videos..." : ""}
        </div>
      </form>
    </div>
  );
}
