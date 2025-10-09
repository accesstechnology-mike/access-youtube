import { NextResponse } from "next/server";


export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  const userAgent = request.headers.get('user-agent') || ''
  
  // Block known bots and crawlers from hitting search pages
  const botPatterns = /bot|crawler|spider|scrapy|wget|curl|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegram|discordbot|googlebot|bingbot|yandex|baidu/i
  const isBot = botPatterns.test(userAgent)
  
  // Split path into segments
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // Only process root-level search terms (e.g. /search+term)
  const isSearchTermPath = pathSegments.length === 1
  
  // Ignore special paths and files
  const isExcludedPath = [
    /\/api\//,              // API routes
    /\/play\//,             // Play routes
    /^\/_next\//,           // Next.js internal
    /\/favicon/,            // Favicon
    /\.(ico|webmanifest)$/, // Static assets
    /^\/$/                  // Homepage
  ].some(regex => regex.test(pathname))

  if (!isSearchTermPath || isExcludedPath) {
    return NextResponse.next()
  }
  
  // Block bots from accessing search result pages
  // They can access homepage and videos, but not search pages to prevent crawling every search term
  if (isBot) {
    console.log(`[Middleware] Blocked bot from search page:`, {
      pathname,
      userAgent: userAgent.substring(0, 100)
    })
    return NextResponse.redirect(new URL('/', request.url), 308)
  }

  try {
    // Split term with + instead of %20
    const term = pathSegments[0].replace(/%20/g, '+')
    
    // Bad words check ONLY
    const badWordsCheck = await fetch(
      `${request.nextUrl.origin}/api/check-bad-words?term=${term}`
    )
    
    if (badWordsCheck.ok) {
      const { hasBadWords } = await badWordsCheck.json()
      if (hasBadWords) {
        return NextResponse.redirect(new URL('/', request.url), 308)
      }
      
      // If the URL contains %20, rewrite it to use + instead
      if (pathname.includes('%20')) {
        const newUrl = new URL(request.url)
        newUrl.pathname = `/${term}`
        return NextResponse.redirect(newUrl, 308)
      }
    }
    
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url), 308)
  }
}

export const config = {
  matcher: '/:path*', // Match all paths but we'll filter in the middleware
};
