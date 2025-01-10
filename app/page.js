import SearchForm from '@/app/components/SearchForm';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <SearchForm />
          
          <footer className="mt-16 text-center text-gray-600">
            <p>
              provided by{' '}
              <a 
                href="https://accesstechnology.co.uk" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
              >
                access:technology
              </a>
            </p>
            <p className="mt-2">
              working with people. empowering through technology
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
} 