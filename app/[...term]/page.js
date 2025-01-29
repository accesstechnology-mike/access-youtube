import SearchForm from "../components/SearchForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ClientSearchResults from "./ClientSearchResults";

export default async function SearchPage({ params }) {
  const { term } = await params;
  const rawTerm = term?.[0];

  if (!rawTerm || ['favicon', 'site.webmanifest'].includes(rawTerm) || rawTerm.endsWith('.ico')) {
    redirect("/");
  }

  const searchTerm = decodeURIComponent(rawTerm).replace(/\+/g, ' ');

  return (
    <main className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        <SearchForm initialTerm={searchTerm} />
        <ClientSearchResults searchTerm={searchTerm} />
      </div>
    </main>
  );
}
