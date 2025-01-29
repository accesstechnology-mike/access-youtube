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

function VideoPlayer({ params }) {
  const { videoId } = use(params);
  const [isPlaying, setIsPlaying] = useState(true);
  const [player, setPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isCheckingPlaylist, setIsCheckingPlaylist] = useState(true);

  useAppHeight();

  useEffect(() => {
    const term = Cookies.get('searchTerm');
    setSearchTerm(term);
  }, []);

  useEffect(() => {
    setIsCheckingPlaylist(true);
    
    // Add delay before checking playlist status
    const timeoutId = setTimeout(() => {
      // Get search term and video results from cookies
      const videoResults = Cookies.get('videoResults');
      
      if (videoResults) {
        try {
          const playlist = JSON.parse(videoResults);
          const index = playlist.findIndex(video => video.id === videoId);
          
          if (index === -1) {
            // Video not in playlist - clear cookies and disable navigation
            Cookies.remove('videoResults');
            Cookies.remove('searchTerm');
            setCurrentPlaylist([]);
            setCurrentIndex(-1);
            setSearchTerm(null);
          } else {
            setCurrentPlaylist(playlist);
            setCurrentIndex(index);
          }
        } catch (err) {
          console.error('Error parsing playlist:', err);
          setCurrentPlaylist([]);
          setCurrentIndex(-1);
        }
      } else {
        setCurrentPlaylist([]);
        setCurrentIndex(-1);
      }
      setIsCheckingPlaylist(false);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [videoId]);

  // Handle next video navigation
  const handleNext = useCallback(() => {
    if (currentPlaylist.length === 0 || currentIndex === -1) return;
    
    // Get next video, cycling back to start if at end
    const nextIndex = currentIndex >= currentPlaylist.length - 1 ? 0 : currentIndex + 1;
    const nextVideo = currentPlaylist[nextIndex];
    
    window.location.href = `/play/${nextVideo.id}`;
  }, [currentPlaylist, currentIndex]);

  const handleBack = useCallback(() => {
    if (searchTerm) {
      window.location.href = `/${encodeURIComponent(searchTerm)}`;
    }
  }, [searchTerm]);

  const handlePlayerReady = (event) => {
    setPlayer(event.target);
    event.target.playVideo();
    
    // Get video data and update page title
    const videoData = event.target.getVideoData();
    if (videoData?.title) {
      document.title = `${videoData.title} - access: youtube`;
    }
  };

  const handlePlayerStateChange = (event) => {
    setIsPlaying(event.data === 1);
    
    // Backup title update in case data wasn't ready in handlePlayerReady
    if (event.data === 1 && player) {
      const videoData = player.getVideoData();
      if (videoData?.title) {
        document.title = `${videoData.title} - access: youtube`;
      }
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
          case "n":
            handleNext();
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
  }, [handlePlayPause, handleRepeat, handleNext, handleBack]);

  // Reset title on unmount
  useEffect(() => {
    return () => {
      document.title = 'access: youtube';
    };
  }, []);

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
    <main className="h-[100dvh] bg-dark flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-shrink-0">
        <SearchForm autoFocus={false} />
      </div>

      <div className="container mx-auto px-4 flex-shrink-0">
        <div className="grid grid-cols-4 gap-4 sm:gap-6 mb-4 mt-2">
          <button
            onClick={handlePlayPause}
            className="bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group relative"
            aria-label={`${isPlaying ? 'Pause' : 'Play'} video - Alt plus P`}
          >
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm hidden sm:block" aria-hidden="true">
              Alt+P
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start group-hover:scale-110 transition-transform" aria-hidden="true">
                {isPlaying ? <HiPauseCircle /> : <HiPlayCircle />}
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold" aria-hidden="true">
                {isPlaying ? "Pause" : "Play"}
              </h2>
            </div>
          </button>

          <button
            onClick={handleRepeat}
            className="bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring transition-all group relative"
            aria-label="Restart video from beginning - Alt plus R"
          >
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm hidden sm:block" aria-hidden="true">
              Alt+R
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start group-hover:scale-110 transition-transform" aria-hidden="true">
                <FaRepeat />
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold" aria-hidden="true">
                Repeat
              </h2>
            </div>
          </button>

          <button
            onClick={handleNext}
            disabled={!isCheckingPlaylist && currentPlaylist.length === 0}
            className={`bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center transition-all group relative ${
              isCheckingPlaylist || currentPlaylist.length > 0
                ? "hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring"
                : "opacity-50 cursor-not-allowed"
            }`}
            aria-label={currentPlaylist.length > 0 ? "Play next video in playlist - Alt plus N" : "Next video not available - no playlist active"}
          >
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm hidden sm:block" aria-hidden="true">
              Alt+N
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start group-hover:scale-110 transition-transform" aria-hidden="true">
                <HiForward />
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold" aria-hidden="true">
                Next
              </h2>
            </div>
          </button>

          <a
            href={searchTerm ? `/${encodeURIComponent(searchTerm)}` : '/'}
            className={`bg-light rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center transition-all group relative ${
              isCheckingPlaylist || searchTerm
                ? "hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark focus-ring"
                : "opacity-50 pointer-events-none"
            }`}
            aria-label={searchTerm ? "Return to search results - Alt plus B" : "Back not available - direct video mode"}
          >
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm hidden sm:block" aria-hidden="true">
              Alt+B
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl mb-1 text-primary-start" aria-hidden="true">
                <HiArrowLeftCircle />
              </span>
              <h2 className="text-dark text-sm sm:text-lg font-bold" aria-hidden="true">
                Back
              </h2>
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
