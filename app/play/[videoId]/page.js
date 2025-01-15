"use client";

import { useState, useEffect, useCallback, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import YouTube from "react-youtube";
import SearchForm from "@/components/SearchForm";
import {
  HiPlayCircle,
  HiPauseCircle,
  HiForward,
  HiArrowLeftCircle,
} from "react-icons/hi2";
import { FaRepeat } from "react-icons/fa6";
import { sendGAEvent } from '@next/third-parties/google';

function VideoPlayer({ params }) {
  const { videoId } = use(params);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlaylist, setHasPlaylist] = useState(false);
  const [isDirectVideo, setIsDirectVideo] = useState(false);
  const router = useRouter();
  const [player, setPlayer] = useState(null);

  // Check session data on mount
  useEffect(() => {
    const fetchSessionResults = async () => {
      try {
        setIsLoading(true);
        const protocol = window.location.protocol;
        const host = window.location.host;

        const sessionResponse = await fetch(
          new URL("/api/session/search", `${protocol}//${host}`),
          { cache: 'no-store' }
        );
        
        if (sessionResponse.ok) {
          const data = await sessionResponse.json();
          const videos = data.videos || [];
          const currentVideoIndex = videos.findIndex(v => v.id === videoId);
          
          // If video is in search results, use those
          if (currentVideoIndex !== -1) {
            setHasPlaylist(true);
            setIsDirectVideo(false);
            setSearchResults(videos);
            setCurrentVideoIndex(currentVideoIndex);
            
            const apiSearchTerm = sessionResponse.headers.get("x-search-term");
            if (apiSearchTerm && apiSearchTerm !== "none") {
              setSearchTerm(decodeURIComponent(apiSearchTerm));
            }
          } else {
            setIsDirectVideo(true);
          }
        } else {
          setIsDirectVideo(true);
        }
      } catch (error) {
        console.error("Error fetching session results:", error);
        setIsDirectVideo(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionResults();
  }, [videoId]);

  const checkBadWords = async (title) => {
    try {
      const protocol = window.location.protocol;
      const host = window.location.host;
      const checkUrl = new URL("/api/check-words", `${protocol}//${host}`);
      const response = await fetch(checkUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: title }),
      });

      if (!response.ok) {
        throw new Error('Bad word check failed');
      }

      const { hasBadWords } = await response.json();
      return hasBadWords;
    } catch (error) {
      console.error('Bad word check error:', error);
      return false;
    }
  };

  const handlePlayerReady = async (event) => {
    setPlayer(event.target);
    
    // If this is a direct video access, get title and set up playlist
    if (isDirectVideo) {
      const videoData = event.target.getVideoData();
      if (videoData?.title) {
        // Track video load
        sendGAEvent('video_start', {
          video_id: videoId,
          video_title: videoData.title
        });

        // Check for bad words in title
        const hasBadWords = await checkBadWords(videoData.title);
        if (hasBadWords) {
          router.push('/');
          return;
        }

        setSearchTerm(videoData.title);
        // Fetch related videos using title
        const protocol = window.location.protocol;
        const host = window.location.host;
        const searchUrl = new URL("/api/search", `${protocol}//${host}`);
        searchUrl.searchParams.set("term", videoData.title);

        try {
          const response = await fetch(searchUrl, { cache: 'no-store' });
          if (response.ok) {
            const data = await response.json();
            const videos = (data.videos || []).filter(v => v.id !== videoId);
            setSearchResults(videos);
            setHasPlaylist(videos.length > 0);
          }
        } catch (error) {
          console.error("Error fetching related videos:", error);
        }
      }
    }

    // Start playback
    setTimeout(() => {
      event.target.playVideo();
    }, 100);
  };

  const handlePlayerStateChange = (event) => {
    setIsPlaying(event.data === 1);
    
    // Track video events based on player state
    const videoData = player?.getVideoData();
    const videoTitle = videoData?.title || 'Unknown';
    
    switch(event.data) {
      case YouTube.PlayerState.PLAYING:
        sendGAEvent('video_play', {
          video_id: videoId,
          video_title: videoTitle
        });
        break;
      case YouTube.PlayerState.PAUSED:
        sendGAEvent('video_pause', {
          video_id: videoId,
          video_title: videoTitle
        });
        break;
      case YouTube.PlayerState.ENDED:
        sendGAEvent('video_complete', {
          video_id: videoId,
          video_title: videoTitle
        });
        handleNext();
        break;
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
    if (!hasPlaylist || searchResults.length === 0) return;
    
    if (isDirectVideo) {
      // For direct videos, just go to the first related video
      router.push(`/play/${searchResults[0].id}`);
    } else {
      // For search results, cycle through the playlist
      const nextIndex = (currentVideoIndex + 1) % searchResults.length;
      setCurrentVideoIndex(nextIndex);
      router.push(`/play/${searchResults[nextIndex].id}`);
    }
  }, [currentVideoIndex, searchResults, router, hasPlaylist, isDirectVideo]);

  const handleBack = useCallback(() => {
    if (isDirectVideo) {
      // For direct videos, search for the video title
      router.push(`/${encodeURIComponent(searchTerm)}`);
    } else if (searchTerm && searchTerm !== "none") {
      // For videos from search, go back to search results
      router.push(`/${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/");
    }
  }, [router, searchTerm, isDirectVideo]);

  const currentVideo = {
    id: videoId,
    ...(searchResults.find(v => v.id === videoId) || {})
  };

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
    <main className="h-screen bg-dark flex flex-col">
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
            aria-label={hasPlaylist ? "Next video" : "Next video (no playlist available)"}
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
          videoId={videoId}
          opts={{
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
              playsinline: 1,
              mute: 1, // Start muted to help with autoplay
              enablejsapi: 1, // Enable JavaScript API
            },
          }}
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
