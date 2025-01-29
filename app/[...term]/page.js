"use client"; // Make this a client component to use useEffect

import SearchForm from "../components/SearchForm";
import VideoResult from "../components/VideoResult";
import { redirect } from "next/navigation";
import { Suspense, useState, useEffect } from "react"; // Import useState and useEffect
import Cookies from 'js-cookie'; // Import js-cookie

export default async function SearchPage({ params }) {
  // Wait for params to be available
  const { term } = await params;
  const rawTerm = term?.[0];

  if (!rawTerm) redirect("/");

  // Handle special files server-side
  if (['favicon', 'site.webmanifest'].includes(rawTerm) || rawTerm.endsWith('.ico')) {
    redirect("/");
  }

  const searchTerm = decodeURIComponent(rawTerm).replace(/\+/g, ' ');

  return (
    <main className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        <SearchForm initialTerm={searchTerm} />
        <Suspense fallback={<div className="text-center py-8 text-light/70">Loading search results...</div>}>
          <SearchResultsWrapper searchTerm={searchTerm} />
        </Suspense>
      </div>
    </main>
  );
}

function SearchResultsWrapper({ searchTerm }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('');

  useEffect(() => {
    // Try to get cached results first
    const cachedResults = Cookies.get('videoResults');
    const cachedSearchTerm = Cookies.get('searchTerm');
    
    // Only use cache if search terms match
    if (cachedResults && cachedSearchTerm === searchTerm) {
      try {
        const parsedResults = JSON.parse(cachedResults);
        const fullVideos = parsedResults.map(video => ({
          ...video,
          thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
          link: `https://youtu.be/${video.id}`
        }));
        setVideos(fullVideos);
        setLoading(false);
        setDataSource('cache');
        return;
      } catch (err) {
        console.error('Error parsing cached results:', err);
      }
    }

    // Fetch from API if no cache, terms don't match, or cache parsing failed
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setDataSource('api');
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search?term=${encodeURIComponent(searchTerm)}`,
          {
            next: { revalidate: 3600 },
            cache: 'force-cache'
          }
        );

        if (!res.ok) throw new Error('Failed to fetch');
        const results = await res.json();
        const videoResults = results?.videos || [];
        setVideos(videoResults);
        
        // Save both the search term and video results
        Cookies.set('searchTerm', searchTerm);
        const minimalVideoData = videoResults.map(video => ({
          id: video.id,
          title: video.title
        }));
        Cookies.set('videoResults', JSON.stringify(minimalVideoData));
      } catch (err) {
        console.error("Search failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  if (loading) {
    return <div className="text-center py-8 text-light/70">Loading search results...</div>;
  }

  return (
    <>
      {error ? (
        <div role="alert" className="text-center text-red-500 p-4">
          Failed to load results. Please try again later.
        </div>
      ) : (
        <SearchResults searchTerm={searchTerm} videos={videos} />
      )}
    </>
  );
}

function SearchResults({ searchTerm, videos }) {
  return (
    <section aria-labelledby="search-results-heading" className="mt-8">
      <h1 id="search-results-heading" className="text-2xl font-bold text-light/90 text-center mb-8">
        Results for "{searchTerm}"
      </h1>

      {videos.length === 0 ? (
        <p className="text-center text-light/70">No results found</p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Search results"
        >
          {videos.map((video, index) => (
            <article key={video.id} role="listitem">
              <VideoResult video={video} priority={index < 4} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
