import SearchForm from "./components/SearchForm";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] bg-dark flex flex-col justify-center sm:justify-center items-center p-6 sm:p-0">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center -mt-16 sm:mt-0">
        <Image
          src="/img/logo.png"
          alt="access:youtube logo"
          width={180}
          height={180}
          priority
          className="mb-8 sm:mb-12 opacity-90 w-32 sm:w-[180px]"
        />

        <SearchForm autoFocus={true} />

        <footer className="mt-auto pt-8 text-center text-light/40 text-sm">
          <a
            href="https://accesstechnology.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-light/60 transition-colors"
          >
            access: technology
          </a>
        </footer>
      </div>
    </main>
  );
}
