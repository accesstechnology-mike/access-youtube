import { NextResponse } from "next/server";


export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  const userAgent = request.headers.get('user-agent') || ''
  const referer = request.headers.get('referer') || ''
  
  // Block known bots and crawlers from hitting search pages
  // Note: Cloudflare's Bot Fight Mode handles most bots, this is backup detection
  const botPatterns = /bot|crawler|spider|scrapy|wget|curl|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegram|discordbot|googlebot|bingbot|yandex|baidu/i
  const isBot = botPatterns.test(userAgent)
  
  // Detect bots with fake User-Agents (they loop back to their own pages)
  const isSelfReferer = referer.includes('accessyoutube.org.uk') && pathname.split('/').filter(Boolean).length === 1
  const isSuspiciousBehavior = isSelfReferer && userAgent.endsWith('.')  // Truncated UA is suspicious
  
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
  if (isBot || isSuspiciousBehavior) {
    console.log(`[Middleware] Blocked ${isBot ? 'bot' : 'suspicious behavior'} from search page:`, {
      pathname,
      userAgent: userAgent.substring(0, 100),
      referer: referer.substring(0, 100),
      reason: isBot ? 'bot pattern' : 'self-referer with truncated UA'
    })
    return NextResponse.redirect(new URL('/', request.url), 307)
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
        return NextResponse.redirect(new URL('/', request.url), 307)
      }
      
      // If the URL contains %20, rewrite it to use + instead
      if (pathname.includes('%20')) {
        const newUrl = new URL(request.url)
        newUrl.pathname = `/${term}`
        return NextResponse.redirect(newUrl, 307)
      }
    }
    
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url), 307)
  }
}

export const config = {
  matcher: '/:path*', // Match all paths but we'll filter in the middleware
};
