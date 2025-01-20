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
  // Only check bad words for the [...term] route
  if (request.nextUrl.pathname.match(/^\/[^/]+$/)) {
    const searchTerm = decodeURIComponent(request.nextUrl.pathname.slice(1));
    
    try {
      const hasBadWords = await checkBadWords(searchTerm);
      
      if (hasBadWords) {
        return NextResponse.redirect(new URL('/', request.url), {
          status: 308 // Permanent redirect
        });
      }
    } catch (error) {
      console.error("Bad word check error:", error);
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If no bad words, continue with the existing middleware logic
    const response = NextResponse.next();
    
    // Only update the session if it's a new search term
    const currentSearchTerm = request.cookies.get("lastSearchTerm")?.value;
    if (searchTerm !== currentSearchTerm) {
      response.cookies.set("lastSearchTerm", searchTerm, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      // Reset the index when starting a new search
      response.cookies.set("currentIndex", "0", {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
    
    return response;
  }

  // Handle other routes
  if (request.nextUrl.pathname.startsWith("/play/")) {
    const response = NextResponse.next();
    const lastSearchTerm = request.cookies.get("lastSearchTerm")?.value;
    const videoId = request.nextUrl.pathname.split("/")[2];
    if (lastSearchTerm) {
      response.cookies.set("lastSearchTerm", lastSearchTerm, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      response.cookies.set("lastVideoId", videoId, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - img (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|img).*)",
  ],
};
