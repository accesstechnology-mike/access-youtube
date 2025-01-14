import SearchForm from "./components/SearchForm";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-6">
        <div className="flex flex-col items-center">
          <Image
            src="/img/logo.png"
            alt="access:youtube logo"
            width={180}
            height={180}
            priority
            className="mb-16 opacity-90"
          />

          <SearchForm autoFocus={true} />

          <footer className="fixed bottom-8 text-center text-light/40 text-sm">
            {/* <a
              href="https://accesstechnology.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-light/60 transition-colors"
            >
              access: technology
            </a> */}
          </footer>
        </div>
      </div>
    </main>
  );
}
