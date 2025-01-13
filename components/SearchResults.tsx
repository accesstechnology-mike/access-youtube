async function SearchResults({ searchTerm }: { searchTerm: string }) {
  // Your data fetching logic here
  const results = await fetchSearchResults(searchTerm); // Replace with your actual fetch function

  return <div>{/* Render your search results */}</div>;
}

export default SearchResults;
