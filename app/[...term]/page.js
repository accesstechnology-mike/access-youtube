import SearchForm from "../components/SearchForm";
import { redirect } from "next/navigation";
import ClientSearchResults from "./ClientSearchResults";

export async function generateMetadata({ params }) {
  const { term } = params;
  const rawTerm = term?.[0];
  if (!rawTerm) return { title: 'Search YouTube Videos' };
  
  const searchTerm = decodeURIComponent(rawTerm).replace(/\+/g, ' ');
  return {
    title: `Search results for "${searchTerm}" - access: youtube`,
    description: `Search results for YouTube videos matching "${searchTerm}"`,
  };
}

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
