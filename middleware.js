import { NextResponse } from "next/server";

// We'll move the bad words check to an API route and call it from middleware
async function checkBadWords(term) {
  try {
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost:3000";
    const protocol = host === "localhost:3000" ? "http" : "https";
    const apiUrl = new URL(`/api/check-bad-words`, `${protocol}://${host}`);
    apiUrl.searchParams.set("term", term);

    const response = await fetch(apiUrl, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Bad words check failed');
    }
    
    const { hasBadWords } = await response.json();
    return hasBadWords;
  } catch (error) {
    console.error('Bad words check error:', error);
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = new URL(request.url);

  // Only check paths that are direct children of root (e.g., /search-term)
  // Ignore /play/*, /api/*, and other special paths
  if (pathname.split('/').length !== 2) {
    return NextResponse.next();
  }

  // Ignore special system files and paths
  if (pathname === '/' || 
      pathname.includes('favicon') || 
      pathname.includes('.webmanifest') ||
      pathname.includes('.ico') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/play/')) {
    return NextResponse.next();
  }

  // At this point, we're only dealing with search terms
  const searchTerm = pathname.slice(1); // Remove leading slash
  
  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/check-bad-words?term=${encodeURIComponent(searchTerm)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { hasBadWords } = await response.json();

    if (hasBadWords) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error('Bad words check error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Match all paths but we'll filter in the middleware
};
