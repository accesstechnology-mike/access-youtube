"use client";

import { useState, useCallback, use, Suspense, useEffect } from "react";
import YouTube from "react-youtube";
import SearchForm from "@/components/SearchForm";
import {
  HiPlayCircle,
  HiPauseCircle,
  HiForward,
  HiArrowLeftCircle,
} from "react-icons/hi2";
import { FaRepeat } from "react-icons/fa6";
import { useAppHeight } from "@/hooks/useAppHeight";
import Cookies from 'js-cookie'


async function fetchCachedResults(term) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user_cache?term=${encodeURIComponent(term)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch cached results');
  }
  return response.json();
}
console.log("cookies", Cookies.get()) // => { name: 'value' }


function VideoPlayer({ params }) {
  const { videoId } = use(params);
  const [isPlaying, setIsPlaying] = useState(true);
  const [player, setPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);

  useAppHeight();

  useEffect(() => {
    const term = Cookies.get('searchTerm');
    console.log('Cookie searchTerm:', term);
    setSearchTerm(term);
  }, []);

  const handlePlayerReady = (event) => {
    setPlayer(event.target);
    event.target.playVideo();
  };

  const handlePlayerStateChange = (event) => {
    setIsPlaying(event.data === 1);
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
          case "p":
            handlePlayPause();
            event.preventDefault();
            break;
          case "r":
            handleRepeat();
            event.preventDefault();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [handlePlayPause, handleRepeat]);

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
            disabled
            className="bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center opacity-50 cursor-not-allowed"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start">
                <HiForward />
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold">Next</h2>
            </div>
          </button>

          <a
            href={searchTerm ? `/${encodeURIComponent(searchTerm)}` : '/'}
            className="bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start">
                <HiArrowLeftCircle />
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold">Back</h2>
            </div>
          </a>
        </div>
      </div>

      <div className="flex-1 bg-black">
        <YouTube
          videoId={videoId}
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
