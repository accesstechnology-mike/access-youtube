# Bot Search Filtering

## Issue Description

The application was receiving search requests for full video titles like:
- `"How to make cheese | Do Try This At Home | We The Curious"`
- Other long, formatted video titles with pipe characters

These searches were **not** initiated by actual users, but by bots and crawlers.

## Root Cause

The app uses a catch-all route `[...term]` which treats **any URL path** as a search term. When bots crawl the site, they may:

1. **Generate URLs from page content** - Bots see video titles and create URLs like `/Video+Title+Here`
2. **Follow analytics tracking links** - Google Analytics or social media tracking may create URLs with video titles
3. **Social media link previews** - Facebook, Twitter, LinkedIn bots crawl for OpenGraph metadata
4. **Browser prefetching** - Modern browsers may prefetch links they predict users will click
5. **Search engine indexing** - Google, Bing, etc. crawling every possible URL pattern

### How It Happens

1. Bot visits your site
2. Bot sees video title text on the page
3. Bot either:
   - Generates a URL from the text to crawl
   - Follows a malformed tracking/analytics link
   - Tries to index what it thinks might be a valid URL
4. Your catch-all route `[...term]` treats this as a search request
5. The API receives a search for a full video title

## Solution Implemented

### 1. Request Logging
Added comprehensive logging to identify the source of searches:
- User-Agent (to identify bots)
- Referer (to see where the request came from)
- Search term length
- Whether the term looks like a video title

### 2. Bot Detection
Implemented bot detection based on User-Agent patterns:
- Common crawlers: GoogleBot, BingBot, etc.
- Social media bots: FacebookExternalHit, TwitterBot, LinkedInBot
- Messaging apps: WhatsApp, Telegram, Slack
- Dev tools: wget, curl

### 3. Video Title Pattern Detection
Identifies suspicious search terms by checking if they:
- Contain pipe characters ` | ` (common in YouTube titles)
- Are longer than 100 characters (unusually long for user searches)

### 4. Smart Blocking
When a bot searches for what looks like a video title:
- Log the details for monitoring
- Return empty results immediately
- Avoid wasting YouTube scraping resources
- Prevent unnecessary API calls

For **human users** searching for video titles:
- Allow the search to proceed normally
- They might legitimately want to search for a specific video by title

## Benefits

1. **Reduced API Load**: Bots no longer trigger expensive YouTube scraping
2. **Better Logging**: Can now identify patterns in bot behavior
3. **Cost Savings**: Fewer unnecessary searches = lower hosting costs
4. **Debugging**: Logs show exactly who is making each request

## Monitoring

Check your Vercel logs for these messages:

### Normal Search
```
[YouTube Search] New search request: {
  term: "how to cook pasta",
  termLength: 17,
  isBot: false,
  userAgent: "Mozilla/5.0 ...",
  referer: "https://your-app.vercel.app/"
}
```

### Suspicious Search (Human)
```
[YouTube Search] Suspicious search term detected: {
  term: "How to make cheese | Do Try This At Home | We The Curious",
  isBot: false,
  ...
}
```
*Still processes the search because it's from a human*

### Blocked Bot Search
```
[YouTube Search] Suspicious search term detected: {
  term: "How to make cheese | Do Try This At Home | We The Curious",
  isBot: true,
  userAgent: "facebookexternalhit/1.1",
  ...
}
[YouTube Search] Blocked bot search for video title
```
*Returns empty results without searching*

## Future Improvements

1. **Rate Limiting**: Add rate limiting per IP address
2. **Allowlist**: Maintain a list of known good bots (Google, Bing) that should be allowed
3. **Analytics**: Track bot vs. human traffic separately
4. **robots.txt**: Update to guide crawlers on what to index
5. **Meta Tags**: Add proper `noindex` tags where appropriate
6. **Honeypot**: Create trap URLs to identify aggressive crawlers

## Related Files

- `/app/api/search/route.js` - Main search API with bot filtering
- `/middleware.js` - URL routing and bad words checking
- `/app/[...term]/page.js` - Catch-all route that processes search terms

## Statistics to Monitor

Track in your logs:
- Percentage of bot vs. human searches
- Most common bot User-Agents
- Search terms that trigger video title detection
- Referer patterns (where searches originate)

