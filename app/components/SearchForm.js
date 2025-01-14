"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default function SearchForm({ initialTerm = "", autoFocus = false }) {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const debouncedSetSearchTerm = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      router.push("/");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      await router.push(`/${encodeURIComponent(searchTerm.trim())}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Search YouTube videos"
        className="relative"
        method="POST"
        action={`/${encodeURIComponent(searchTerm.trim())}`}
      >
        <div className="grid-clickable-group">
          <input
            ref={inputRef}
            type="search"
            name="v"
            value={searchTerm}
            onChange={(e) => {
              setError("");
              const newValue = e.target.value;
              setSearchTerm(newValue);
              debouncedSetSearchTerm(newValue);
            }}
            placeholder="type here..."
            className="input-primary text-2xl h-16"
            aria-label="Search YouTube videos"
            aria-invalid={!!error}
            aria-describedby={error ? "search-error" : undefined}
            disabled={isSearching}
            autoComplete="off"
            role="searchbox"
          />

          <button
            type="submit"
            className="absolute right-2 top-2 btn-primary h-12 w-24"
            aria-label={isSearching ? "Searching..." : "Search"}
            disabled={isSearching}
            role="button"
          >
            Search
          </button>
        </div>

        {error && (
          <div
            id="search-error"
            role="alert"
            className="absolute top-full left-0 mt-2 text-primary-start"
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
