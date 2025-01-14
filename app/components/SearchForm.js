"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

export default function SearchForm({ initialTerm = "", autoFocus = false }) {
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
      router.push(`/${encodeURIComponent(searchTerm.trim())}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
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
      >
        <input
          ref={inputRef}
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setError("");
            const newValue = e.target.value;
            setSearchTerm(newValue);
            debouncedSetSearchTerm(newValue);
          }}
          placeholder="Search YouTube videos..."
          className="input-primary text-2xl h-16"
          aria-label="Search YouTube videos"
          aria-invalid={!!error}
          aria-describedby={error ? "search-error" : undefined}
          disabled={isSearching}
        />

        <button
          type="submit"
          className="absolute right-2 top-2 btn-primary h-12 w-24"
          aria-label={isSearching ? "Searching..." : "Search"}
          disabled={isSearching}
        >
          Search
        </button>

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
