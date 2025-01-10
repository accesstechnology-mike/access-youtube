import SearchForm from '@/app/components/SearchForm';
import VideoResult from '@/app/components/VideoResult';

const MAX_TERM_LENGTH = 100;

async function getSearchResults(term) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/search?term=${encodeURIComponent(term)}`, {
      cache: 'no-store' // Ensure fresh results on each search
    });
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export default async function SearchPage({ params }) {
  try {
    // Get the search term from the URL parameters
    const searchTerm = params.term.join('/');

    // Basic validation
    if (!searchTerm || searchTerm.length > MAX_TERM_LENGTH) {
      return (
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <SearchForm />
            <div role="alert" className="mt-4 text-red-600 text-center">
              Invalid search term. Please try again.
            </div>
          </div>
        </main>
      );
    }

    // Remove any potentially harmful characters
    const cleanTerm = searchTerm.replace(/[^\w\s+\-]/g, '');

    // Sanitize and format the search term
    const sanitizedTerm = cleanTerm
      .split(/[\s+]+/)
      .map(part => part.trim())
      .filter(part => part.length > 0)
      .join(' '); // Join with space for display

    if (!sanitizedTerm) {
      return (
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <SearchForm />
            <div role="alert" className="mt-4 text-red-600 text-center">
              Please enter a valid search term.
            </div>
          </div>
        </main>
      );
    }

    // Fetch search results
    const searchResults = await getSearchResults(sanitizedTerm);

    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <SearchForm initialTerm={sanitizedTerm} />
          
          <div className="mt-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Search Results for "{sanitizedTerm}"
            </h1>
            
            {searchResults.error ? (
              <div role="alert" className="text-red-600 text-center">
                {searchResults.error}
              </div>
            ) : (
              <div 
                className="flex flex-col gap-4"
                role="region" 
                aria-label={`${searchResults.videos.length} search results for ${sanitizedTerm}`}
              >
                {searchResults.videos.map((video) => (
                  <VideoResult key={video.id} video={video} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Search page error:', error);
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <SearchForm />
          <div role="alert" className="mt-4 text-red-600 text-center">
            An error occurred while searching. Please try again.
          </div>
        </div>
      </main>
    );
  }
} 