"use client";

import { useState, useEffect, useCallback } from "react";
import YouTube from "react-youtube";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import {
  HiPlayCircle,
  HiPauseCircle,
  HiArrowPath,
  HiForward,
  HiArrowLeft,
} from "react-icons/hi2";

export default function PlayPage({ params }) {
  const { videoId } = params;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState("loading...");
  const router = useRouter();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    // Fetch search results based on the session search term
    const fetchSearchResults = async () => {
      try {
        const response = await fetch("/api/session/search");
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = await response.json();
        setSearchResults(data.videos || []);

        // Get the search term from the API response headers
        const apiSearchTerm = response.headers.get("x-search-term");
        if (apiSearchTerm) {
          setSearchTerm(decodeURIComponent(apiSearchTerm));
        }

        // Set the current index from the API
        const apiIndex = parseInt(
          response.headers.get("x-current-index") || "0",
          10
        );
        setCurrentVideoIndex(apiIndex);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchTerm("error");
      }
    };

    fetchSearchResults();
  }, [videoId]);

  const handlePlayerReady = (event) => {
    setPlayer(event.target);
    event.target.playVideo();
  };

  const handlePlayerStateChange = (event) => {
    setIsPlaying(event.data === 1);
    if (event.data === 0) {
      // Video ended
      handleNext();
    }
  };

  const handlePlayPause = useCallback(() => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [player, isPlaying]);

  const handleRepeat = useCallback(() => {
    if (!player) return;
    player.seekTo(0);
    player.playVideo();
  }, [player]);

  const handleNext = useCallback(() => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentVideoIndex + 1) % searchResults.length;
    setCurrentVideoIndex(nextIndex);
    router.push(`/play/${searchResults[nextIndex].id}`);
  }, [currentVideoIndex, searchResults, router]);

  const handleBack = useCallback(() => {
    if (
      searchTerm &&
      searchTerm !== "loading..." &&
      searchTerm !== "error" &&
      searchTerm !== "none"
    ) {
      router.push(`/${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/");
    }
  }, [router, searchTerm]);

  const currentVideo = searchResults[currentVideoIndex] || { id: videoId };

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      disablekb: 0,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  return (
    <main className="h-screen bg-dark flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-shrink-0">
        <SearchForm autoFocus={false} />
      </div>

      <div className="container mx-auto px-4 flex-shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 mt-2">
          <button
            onClick={handlePlayPause}
            accessKey="p"
            className="bg-light rounded-lg py-3 px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <span className="text-4xl mb-1 block text-primary-start group-hover:scale-110 transition-transform">
              {isPlaying ? <HiPauseCircle /> : <HiPlayCircle />}
            </span>
            <h2 className="text-dark text-lg font-bold">
              {isPlaying ? "Pause" : "Play"}
            </h2>
          </button>

          <button
            onClick={handleRepeat}
            accessKey="r"
            className="bg-light rounded-lg py-3 px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <span className="text-4xl mb-1 block text-primary-start group-hover:scale-110 transition-transform">
              <HiArrowPath />
            </span>
            <h2 className="text-dark text-lg font-bold">Repeat video</h2>
          </button>

          <button
            onClick={handleNext}
            accessKey="n"
            className="bg-light rounded-lg py-3 px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <span className="text-4xl mb-1 block text-primary-start group-hover:scale-110 transition-transform">
              <HiForward />
            </span>
            <h2 className="text-dark text-lg font-bold">Next video</h2>
          </button>

          <button
            onClick={handleBack}
            accessKey="b"
            className="bg-light rounded-lg py-3 px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <span className="text-4xl mb-1 block text-primary-start group-hover:scale-110 transition-transform">
              <HiArrowLeft />
            </span>
            <h2 className="text-dark text-lg font-bold">Back to results</h2>
          </button>
        </div>
      </div>

      {/* Video player */}
      <div className="flex-1 bg-black">
        <YouTube
          videoId={currentVideo.id}
          opts={opts}
          onReady={handlePlayerReady}
          onStateChange={handlePlayerStateChange}
          className="w-full h-full"
          iframeClassName="w-full h-full"
        />
      </div>
    </main>
  );
}
