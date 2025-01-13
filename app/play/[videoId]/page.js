"use client";

import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { useRouter } from 'next/navigation';

export default function PlayPage({ params }) {
  const { videoId, searchTerm } = params;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch search results based on the searchTerm
    const fetchSearchResults = async () => {
      try {
        // Check if searchTerm exists, if not, use an empty string
        const term = searchTerm ? searchTerm.join(' ') : '';
        if (term) {
          const response = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
          const data = await response.json();
          setSearchResults(data.videos);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handlePlayerReady = (event) => {
    // Autoplay the video
    event.target.playVideo();
  };

  const handlePlayerStateChange = (event) => {
    if (event.data === 0) { // Video has ended
      // Move to the next video
      const nextIndex = (currentVideoIndex + 1) % searchResults.length;
      setCurrentVideoIndex(nextIndex);
      
      // Navigate to the next video
      if (searchResults.length > 0) {
        router.push(`/play/${searchResults[nextIndex].id}/${searchTerm?.join('/') || ''}`);
      }
    }
  };

  const currentVideo = searchResults[currentVideoIndex] || { id: videoId };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Now Playing
        </h1>
        <div className="flex justify-center">
          <YouTube
            videoId={currentVideo.id}
            opts={opts}
            onReady={handlePlayerReady}
            onStateChange={handlePlayerStateChange}
          />
        </div>
      </div>
    </main>
  );
} 