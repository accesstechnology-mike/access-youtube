import { Suspense } from 'react';

export default function SearchLayout({ children }) {
  return (
    <Suspense fallback={<div className="text-center py-8 text-light/70">Loading...</div>}>
      {children}
    </Suspense>
  );
} 