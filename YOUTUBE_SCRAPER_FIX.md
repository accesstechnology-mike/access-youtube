# YouTube Scraper Error Fix

## Issue Description

The application was experiencing consistent errors:

```
TypeError: Cannot read properties of undefined (reading 'split')
    at extractRenderData (.next/server/app/api/search/route.js:1:4518)
```

## Root Cause

The `scrape-youtube` library (v2.4.0) fails when YouTube's HTML response doesn't contain the expected `var ytInitialData` JavaScript variable. The library's `extractRenderData` method tries to:

1. Split the page by `'var ytInitialData'` and access index `[1]`
2. If the split doesn't find the string, `[1]` returns `undefined`
3. The next line tries to call `.split('=')` on `undefined`, causing the error

This typically happens when:
- YouTube changes their HTML structure
- YouTube blocks/rate-limits the request
- YouTube serves a CAPTCHA page instead of search results
- The response is malformed or incomplete

## Solutions Implemented

### 1. Retry Logic with Exponential Backoff
- Automatically retries failed requests up to 3 times
- Uses exponential backoff: 1s, 2s, 4s between retries
- Only retries on specific "split" related errors

### 2. Enhanced HTTP Headers
Added more realistic browser headers to reduce blocking:
- Updated User-Agent to Chrome 120
- Added Accept, Accept-Encoding, Accept-Language headers
- Added DNT (Do Not Track) and Connection headers
- Maintained the PREF cookie for strict search

### 3. Better Error Handling
- Validates response structure before returning results
- Provides specific HTTP status codes (503 for service unavailable)
- Includes detailed error logging with structured data
- Returns informative error messages to clients

### 4. Comprehensive Logging
Added logging at key points:
- Search attempt initiation
- Success with video count
- Error details including attempt number
- Retry attempts with timing information

### 5. Debug Mode
- Automatically enables debug mode in development environment
- Provides more detailed output from the scraper library

## Code Changes

The main changes were made to `/app/api/search/route.js`:

1. **Function signature updated** to support retry logic
2. **Enhanced headers** to better mimic a real browser
3. **Try-catch blocks** with retry logic
4. **Validation** of response structure
5. **Detailed logging** throughout the process
6. **Better error responses** with specific status codes

## Monitoring

When the error occurs, you'll now see detailed logs like:

```
[YouTube Search] Attempting search for: "example" (attempt 1)
[YouTube Search] Error on attempt 1: {
  message: "Cannot read properties of undefined (reading 'split')",
  type: "TypeError",
  searchTerm: "example"
}
[YouTube Search] Retrying in 1000ms (attempt 2/4)
```

## Future Considerations

1. **YouTube Data API v3**: Consider migrating to the official API
   - Pros: Reliable, officially supported
   - Cons: Requires API key, has daily quotas, costs money at scale

2. **Rate Limiting**: Implement request rate limiting to avoid getting blocked

3. **Caching**: Cache successful search results to reduce requests

4. **Monitoring**: Set up alerts for high error rates

5. **Alternative Libraries**: Research other YouTube scraping libraries if issues persist

## Testing

The fix has been validated:
- ✅ No linter errors
- ✅ Application builds successfully
- ✅ Error handling properly returns 503 status codes
- ✅ Retry logic implemented correctly

## When to Escalate

If after these fixes you still see consistent errors:

1. Check Vercel logs for the detailed error messages
2. Look for patterns (specific search terms, times of day)
3. Consider that YouTube may have implemented stronger anti-scraping measures
4. Evaluate migrating to YouTube Data API v3

## Package Information

- **Package**: scrape-youtube
- **Current Version**: 2.4.0
- **Latest Version**: 2.4.0 (up to date)
- **Last Updated**: Verified October 9, 2025

