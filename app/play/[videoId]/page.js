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

// Helper function to grab a cookie value by name
function getCookieValue(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

function VideoPlayer({ params }) {
  const { videoId } = use(params);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [videoIndex, setVideoIndex] = useState(0);

  useAppHeight();

  useEffect(() => {
    // Clear out searchResults or skip it entirely
    setSearchResults([]);
    // Just rely on the direct videoId
    setCurrentVideoIndex(0);
    // Pull initial searchTerm from cookie at mount time
    const cookieVal = getCookieValue("searchTerm");
    setSearchTerm(cookieVal || "direct");

    // Also pull and parse the "videoResults" cookie
    const videoResultsVal = getCookieValue("videoResults");
    if (videoResultsVal) {
      try {
        const parsed = JSON.parse(videoResultsVal);
        setSearchResults(parsed);
      } catch (error) {
        console.error("Failed to parse videoResults cookie:", error);
      }
    }

    // Pull 'videoIndex' from the cookie
    const indexVal = getCookieValue("videoIndex");
    setVideoIndex(parseInt(indexVal || "0", 10));

    // Once searchResults is loaded and we have a videoId, figure out the correct index
    if (searchResults.length > 0 && videoId) {
      const foundIndex = searchResults.findIndex((v) => v.id === videoId);
      if (foundIndex !== -1) {
        setVideoIndex(foundIndex);
        // Update cookie to ensure "Next" logic continues from the right spot
        document.cookie = `videoIndex=${foundIndex};path=/`;
      }
    }
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
    // Move to the next index (loop around)
    const newIndex = (videoIndex + 1) % searchResults.length;
    setVideoIndex(newIndex);
    // Update 'videoIndex' in the cookie as well
    document.cookie = `videoIndex=${newIndex};path=/`;

    router.push(`/play/${searchResults[newIndex].id}`);
  }, [videoIndex, searchResults, router]);

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

  // Alternatively, do this in a separate effect that depends on [searchResults, videoId]:
  useEffect(() => {
    if (searchResults.length > 0 && videoId) {
      const foundIndex = searchResults.findIndex((v) => v.id === videoId);
      if (foundIndex !== -1 && foundIndex !== videoIndex) {
        setVideoIndex(foundIndex);
        document.cookie = `videoIndex=${foundIndex};path=/`;
      }
    }
  }, [searchResults, videoId]);

  return (
    <main className="h-[100dvh] bg-dark flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-shrink-0">
        <SearchForm autoFocus={false} />
      </div>

      <div className="container mx-auto px-4 flex-shrink-0">
        {/* <p>search term: {searchTerm}</p> */}

        {/* Debug: Show the current index and the video's id/title at this index */}
        {/* <p className="text-white">
          Debug → current videoIndex: {videoIndex}
          {searchResults[videoIndex] && (
            <>
              , id: {searchResults[videoIndex].id},
              title: {searchResults[videoIndex].title}
            </>
          )}
        </p> */}

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

        {/* Show a list of video links from the cookie */}
        {/* {searchResults.length > 0 && (
          <div className="my-4">
            <h2 className="text-white font-bold mb-2">
              Your search results:
            </h2>
            {searchResults.map((video) => (
              <p key={video.id}>
                <a
                  href={`/play/${video.id}`}
                  className="text-primary-start underline"
                >
                  {video.title}
                </a>
              </p>
            ))}
          </div>
        )} */}
      </div>

      {/* Video player */}
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
