"use client";

import { useState, useCallback, useEffect, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
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

export default function SearchForm() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);
  const pathname = usePathname();
  const hasMounted = useRef(false);
  const [isPending, startTransition] = useTransition();

  // Always focus on desktop, never on mobile

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMobile && inputRef.current) {
        inputRef.current?.focus();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isMobile]);
  

  // Clear search term when we're on the home page
  useEffect(() => {
    if (pathname === '/') {
      setSearchTerm("");
    }
  }, [pathname]);

  const debouncedSetSearchTerm = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      router.push('/');
      return;
    }
    const encodedTerm = searchTerm.trim().toLowerCase().replace(/ /g, '+');
    router.push(`/${encodedTerm}`);
  };

  return (
    <div className="w-full">
      {/* Debug indicator */}
      {/* <div className="fixed top-0 right-0 bg-primary-start text-light px-2 py-1 text-xs z-50">
        isMobile: {isMobile ? 'true' : 'false'}
      </div> */}

      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Search YouTube videos"
        className="relative"
        method="GET"
        action={`/${searchTerm.trim().toLowerCase().replace(/ /g, '+')}`}
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
