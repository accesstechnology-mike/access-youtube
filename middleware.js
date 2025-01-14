import { NextResponse } from "next/server";

export async function middleware(request) {
  const response = NextResponse.next();

  // Store search term in session when navigating to search results
  if (request.nextUrl.pathname.match(/^\/[^/]+$/)) {
    const searchTerm = decodeURIComponent(request.nextUrl.pathname.slice(1));
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
  }

  // Keep the session alive and update index when navigating to video player
  if (request.nextUrl.pathname.startsWith("/play/")) {
    const lastSearchTerm = request.cookies.get("lastSearchTerm")?.value;
    const videoId = request.nextUrl.pathname.split("/")[2];
    if (lastSearchTerm) {
      response.cookies.set("lastSearchTerm", lastSearchTerm, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      // Store the video ID to help track position
      response.cookies.set("lastVideoId", videoId, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
  }

  return response;
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
