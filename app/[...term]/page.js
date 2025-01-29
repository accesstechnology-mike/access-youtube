import SearchForm from "../components/SearchForm";
import VideoResult from "../components/VideoResult";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Main page component
export default function SearchPage({ params }) {
  return (
    <main className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-8 text-light/70">Loading...</div>}>
          <SearchPageContent paramsPromise={params} />
        </Suspense>
      </div>
    </main>
  );
}

// Component that handles params and renders content
async function SearchPageContent({ paramsPromise }) {
  const { term } = await paramsPromise;
  const rawTerm = term?.[0];

  if (!rawTerm) redirect("/");

  // Handle special files server-side
  if (['favicon', 'site.webmanifest'].includes(rawTerm) || rawTerm.endsWith('.ico')) {
    redirect("/");
  }

  const searchTerm = decodeURIComponent(rawTerm).replace(/\+/g, ' ');

  return (
    <>
      <SearchForm initialTerm={searchTerm} />
      <Suspense fallback={<div className="text-center py-8 text-light/70">Loading search results...</div>}>
        <SearchResultsWrapper searchTerm={searchTerm} />
      </Suspense>
    </>
  );
}

async function SearchResultsWrapper({ searchTerm }) {
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

    return <SearchResults searchTerm={searchTerm} videos={results?.videos?.slice(0, 12) || []} />;
  } catch (error) {
    console.error("Search failed:", error);
    return (
      <div role="alert" className="text-center text-red-500 p-4">
        Failed to load results. Please try again later.
      </div>
    );
  }
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
