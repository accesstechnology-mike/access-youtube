"use client";

import { useState, useEffect, useCallback, use, Suspense } from "react";
import YouTube from "react-youtube";
import { useRouter } from "next/navigation";

import SearchForm from "@/components/SearchForm";
import {
  HiPlayCircle,
  HiPauseCircle,
  HiForward,
  HiArrowLeftCircle,
} from "react-icons/hi2";
import { FaRepeat } from "react-icons/fa6";
import { useAppHeight } from "@/hooks/useAppHeight";

function VideoPlayer({ params }) {
  const { videoId } = use(params);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState("loading...");
  const router = useRouter();
  const [player, setPlayer] = useState(null);

  useAppHeight();

  useEffect(() => {
    // Clear out searchResults or skip it entirely
    setSearchResults([]);
    // Just rely on the direct videoId
    setCurrentVideoIndex(0);
    setSearchTerm("direct");
  }, [videoId]);

  const handlePlayerReady = (event) => {
    setPlayer(event.target);
    event.target.playVideo();
  };

  const handlePlayerStateChange = (event) => {
    setIsPlaying(event.data === 1);
    if (event.data === 0) {
      // Video ended - do nothing
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

  useEffect(() => {
    const handleKeyboardShortcuts = (event) => {
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case "n":
            handleNext();
            event.preventDefault();
            break;
          case "p":
            handlePlayPause();
            event.preventDefault();
            break;
          case "r":
            handleRepeat();
            event.preventDefault();
            break;
          case "b":
            handleBack();
            event.preventDefault();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [handleNext, handlePlayPause, handleRepeat, handleBack]);

  return (
    <main className="h-[100dvh] bg-dark flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-shrink-0">
        <SearchForm autoFocus={false} />
      </div>

      <div className="container mx-auto px-4 flex-shrink-0">
        <div className="grid grid-cols-4 gap-2 mb-4 mt-2">
          <button
            onClick={handlePlayPause}
            className="bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start group-hover:scale-110 transition-transform">
                {isPlaying ? <HiPauseCircle /> : <HiPlayCircle />}
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold">
                {isPlaying ? "Pause" : "Play"}
              </h2>
            </div>
          </button>

          <button
            onClick={handleRepeat}
            className="bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start group-hover:scale-110 transition-transform">
                <FaRepeat />
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold">Repeat</h2>
            </div>
          </button>

          <button
            onClick={handleNext}
            className="bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start group-hover:scale-110 transition-transform">
                <HiForward />
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold">Next</h2>
            </div>
          </button>

          <button
            onClick={handleBack}
            className="bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start group-hover:scale-110 transition-transform">
                <HiArrowLeftCircle />
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold">Back</h2>
            </div>
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

export default function PlayPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPlayer params={params} />
    </Suspense>
  );
}
