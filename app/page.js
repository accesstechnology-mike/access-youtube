"use client";

import SearchForm from "./components/SearchForm";
import Image from "next/image";
import { useVisualViewport } from "@/hooks/useVisualViewport";

export default function HomePage() {
  useVisualViewport();

  return (
    <main className="h-[var(--viewport-height)] bg-dark flex flex-col">
      <div className="flex-1 flex items-center justify-center -mt-16">
        <div className="w-full max-w-3xl mx-auto px-6">
          <div className="flex flex-col items-center">
            <Image
              src="/img/logo.png"
              alt="access:youtube logo"
              width={180}
              height={62}
              priority
              className="mb-12 opacity-90"
            />

            <SearchForm autoFocus={true} />
          </div>
        </div>
      </div>

      <footer className="p-4 text-center text-light/40 text-sm">
        <a
          href="https://accesstechnology.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-light/60 transition-colors"
        >
          access: technology
        </a>
      </footer>
    </main>
  );
}
