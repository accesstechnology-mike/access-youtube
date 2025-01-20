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

export default function SearchForm({ autoFocus = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const inputRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear the form after submission
    }
  };

  // Focus the input on mount if autoFocus is true and not on mobile
  useEffect(() => {
    if (autoFocus && !isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, isMobile]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search YouTube..."
          className="w-full px-4 py-3 text-xl text-dark rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-start/50 input-primary"
          aria-label="Search YouTube"
        />
      </div>
    </form>
  );
}
