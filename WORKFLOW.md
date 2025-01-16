## User Workflow Documentation for access: youtube

This document outlines the various user workflows within the access: youtube application, detailing user actions and corresponding application activities.

### 1. Initial Entry - Homepage

**User Action:** User navigates to the root URL (`/`).

**App Activity:**

- The `HomePage` component in `app/page.js` is rendered.
- The `useVisualViewport` hook is called to detect keyboard visibility and adjust layout. (TODO: check if this works or is necessary)
- The logo and `SearchForm` component are displayed.

### 2. Performing a Search

**User Action:** User enters a search term in the `SearchForm` and submits the form (presses Enter or clicks "Search").

**App Activity:**

- **`SearchForm` Component (`app/components/SearchForm.js`):**
  - The `handleSubmit` function is triggered.
  - The input is trimmed. If empty, the user is redirected to `/`.
  - `setIsSearching` is set to `true`. (why is this necessary?)
  - The `router.push` function navigates to the URL path corresponding to the search term (e.g., `/search+term`).
- **Middleware (`middleware.js`):**
  - The middleware intercepts the navigation to the search results page (`/[...term]/page.js`). 

  
  - The `searchTerm` is extracted from the URL.
  - The `lastSearchTerm` cookie is set with the current search term if it's different from the existing value. (why not just wipe and reset the cookie? Are there any performance benefits to the current approach? Why is this called lastSearchTerm, not just searchTerm?)
  - The `currentIndex` cookie is reset to `"0"`.
- **Search Results Page (`app/[...term]/page.js`):**
  - The `SearchPage` component is rendered.
  - `generateMetadata` function fetches the search term and sets the page title and description.
  - The `SearchPageContent` component is rendered.
  - The search term is extracted and decoded.
  - **Bad Word Check:** The `checkBadWords` server action is called. (why are we setting cookies in middleware before the bad word check?)
    - **`checkBadWords` Server Action (`app/[...term]/page.js`):**
      - Splits the search term into words.
      - Queries the SQLite database (`bad_words` table) for any matching words.
      - If bad words are found, the user is redirected to `/` with a permanent redirect.
  - If no bad words are found, the `SearchForm` is rendered with the initial search term.
  - The `SearchResults` component is rendered within a `Suspense` boundary. (what does this boundary do?)
    - **`SearchResults` Component (`app/[...term]/page.js`):**
      - The `getSearchResults` server action is called. (why aren't we checking the cache for the search results first?)
        - **`getSearchResults` Server Action (`app/[...term]/page.js`):**
          - Constructs the API URL for `/api/search` with the search term.
          - Fetches search results from the `/api/search` endpoint.
            - **`/api/search` Route (`app/api/search/route.js`):**
              - Extracts the `searchTerm` from the query parameters.
              - Sanitizes the search term.
              - Calls the `getYouTubeSearchResults` function.
                - **`getYouTubeSearchResults` Function (`app/api/search/route.js`):**
                  - Uses the `scrape-youtube` library to fetch video results from YouTube.
                  - Includes `safeSearch: true` and a `Cookie` header for stricter filtering.
                  - Logs search options and results.
                    (if a search term is not found in the cache, that's when we should be calling the scraper again, and we then should be caching the results in the cache)
              - Returns the video results as a JSON response.
      - The `SearchResults` component receives the search results.
      - If there's an error, an error message is displayed.
      - If no videos are found, a "No videos found" message is displayed.
      - Otherwise, the `VideoResult` components for the first 12 videos are rendered.

### 3. Playing a Video from Search Results

**User Action:** User clicks on a video result.

**App Activity:**

- **`VideoResult` Component (`app/components/VideoResult.js`):**
  - The `Link` component navigates to the `/play/[videoId]` route for the selected video.
- **Play Page (`app/play/[videoId]/page.js`):**

  - The `PlayPage` component is rendered.
  - The `VideoPlayer` component is rendered within a `Suspense` boundary.

    - **`VideoPlayer` Component (`app/play/[videoId]/page.js`):**

      - The `videoId` is extracted from the URL parameters.
      - **Session Data Check (useEffect):**
        - Fetches session data from `/api/session/search`.
          - **`/api/session/search` Route (`app/api/session/search/route.js`):**
            - Retrieves the `lastSearchTerm` cookie.
            - If the cookie exists, it fetches search results for that term from `/api/search`. (we should be using the session data to list the playlist, not the cookie, and certainly not fetching the search results again)
            - Returns the video results and the search term in the headers.
        - If the `videoId` exists in the session's search results:
          - `hasPlaylist` is set to `true`.
          - `isDirectVideo` is set to `false`. (this check is performed by checking if the videoId is in the session data - or if session data exists)
          - `searchResults` is populated from the session data. (this is the playlist, it should be renamed to playlist)
          - `currentVideoIndex` is set to the index of the current video.
          - `searchTerm` is set from the `x-search-term` header. (what's this? Is this the cookie or session)
        - Otherwise, `isDirectVideo` is set to `true`.
      - **Bad Word Check Function:** The `checkBadWords` function is defined to check video titles for inappropriate content. (only if the video is not in the playlist, e.g a direct video)

      - **YouTube Player (`react-youtube`):**
        - The `YouTube` component is rendered with the `videoId`.
        - **`handlePlayerReady`:**
          - Sets the `player` state.
          - Attempts autoplay (muted if not on mobile). (THIS SHOULD NOT BE MUTED EVER!)
          - If `isDirectVideo` is true:
            - Fetches video data (including title).
              Bad word check should happen before we render the player.
            - Calls `checkBadWords` on the video title. If bad words are found, redirects to `/`.
            - Sets `searchTerm` to the video title.
            - Fetches related videos from `/api/search`. - THIS SHOULD ONLY HAPPEN IF THE VIDEO IS DIRECT
            - Updates `searchResults`, sets `hasPlaylist`, and `currentVideoIndex`.
              (Do we need a separate 'store' route?)
            - Stores the playlist in the session via `/api/session/store`.
              - **`/api/session/store` Route (`app/api/session/store/route.js`):**
                - Receives the `videos` and `searchTerm` from the request body.
                - Sets the `lastSearchTerm` cookie.
                - Makes a POST request to `/api/search` to potentially cache the playlist (this part is redundant as the search results are already fetched).
        - **`handlePlayerStateChange`:**
          - Handles different player states (playing, paused, ended, etc.).
          - Sends Google Analytics events for video play, pause, and completion.
      - **Playback Controls:** Buttons for Play/Pause, Repeat, Next, and Back are rendered.
        - **`handlePlayPause`:** Toggles the video's play state.
        - **`handleRepeat`:** Seeks to the beginning and plays the video.
        - **`handleNext`:**
          - If there's a playlist, navigates to the next video in the `searchResults`.
        - **`handleBack`:**
          - If `isDirectVideo`, navigates back to the homepage.
          - Otherwise, navigates back to the search results page using the `searchTerm`.
      - **Keyboard Shortcuts (useEffect):**
        - Adds event listeners for keyboard shortcuts (`Alt + n`, `Alt + p`, `Alt + r`, `Alt + b`).
          (at the end of the video, we should not be calling handleNext)

### 4. Playing a Video via Direct Link

**User Action:** User navigates directly to a video URL (e.g., `/play/VIDEO_ID`).

**App Activity:**

- The application flow is similar to playing a video from search results (see section 3), but with the following key differences in the `VideoPlayer` component's initial `useEffect`:
  - The session data check might not find the `videoId` in the session, leading to `isDirectVideo` being set to `true` earlier.
  - The `handlePlayerReady` function will be responsible for fetching the video title and setting up a potential playlist based on related videos.

### 5. Navigating Back from the Play Page

**User Action:** User clicks the "Back" button or uses the `Alt + b` keyboard shortcut.

**App Activity:**

- **`handleBack` Function (`app/play/[videoId]/page.js`):**
  - If `isDirectVideo` is true, the user is navigated to the homepage (`/`).
  - If `searchTerm` exists, the user is navigated back to the search results page (`/${encodeURIComponent(searchTerm)}`).
  - Otherwise, the user is navigated to the homepage (`/`).

### 6. Using Playback Controls

**User Action:** User interacts with the Play/Pause, Repeat, or Next buttons, or uses the corresponding keyboard shortcuts.

**App Activity:**

- **`handlePlayPause`:** Calls `player.playVideo()` or `player.pauseVideo()`.
- **`handleRepeat`:** Calls `player.seekTo(0)` and `player.playVideo()`.
- **`handleNext`:**
  - If a playlist exists, calculates the index of the next video and navigates to its `/play/[videoId]` route.

### 7. Direct Navigation to Search Results

**User Action:** User navigates directly to a search results URL (e.g., `/search+query`).

**App Activity:**

- The application flow is similar to performing a search from the homepage (see section 2), starting from the `Search Results Page` component. The middleware and bad word checks will still be executed.

## Plan for Improvements

This plan outlines the steps to address the identified issues and enhance the application's functionality and performance.

**Phase 1: Core Improvements**

1. **Refactor Session Management (using Vercel KV):**

   - Install and configure the `@vercel/kv` library.
   - Create session management utilities:
     - Function to generate and validate session IDs.
     - Wrapper functions for KV operations (`getSession`, `setSession`, `updateSession`).
   - Store in Vercel KV:
     - Playlist data (array of video objects)
     - Current video index
     - Search term history
     - User preferences (future)
   - Update components and routes:
     - Replace cookie logic in middleware with KV session handling
     - Update `/api/session/search` to read directly from KV
     - Update `/api/session/store` to write directly to KV
     - Remove redundant API calls in the VideoPlayer component
   - **(Tasks:** Install `@vercel/kv`, implement session utilities, update API routes, remove cookie logic)

2. **Implement Server-Side Caching for Search Results:**

   - Apply the `'use cache'` directive to the `getYouTubeSearchResults` function in `app/api/search/route.js`.
   - Consider adjusting the revalidation time based on the expected frequency of new content.
   - **(Tasks:** Add `'use cache'` directive, test caching behavior, determine appropriate revalidation strategy).

3. **Optimize API Calls:**
   - Eliminate the redundant fetch for search results in the `/api/session/search` route. The playlist should be retrieved directly from the session.
   - Update the `VideoPlayer` component to fetch playlist data from the session instead of re-fetching search results.
   - **(Tasks:** Modify `/api/session/search` to read from session, update `VideoPlayer` data fetching).

**Phase 2: Enhanced Functionality and Refinements**

4. **Enhance Direct Video Handling with Middleware:**

   - Implement the `fetchVideoData` function in `middleware.js` to fetch video details (including title) for direct video requests.
   - Ensure the bad word check is performed in the middleware for direct videos before reaching the `VideoPlayer` component.
   - Pass the fetched video data to the `VideoPlayer` component via request headers or context.
   - **(Tasks:** Implement `fetchVideoData`, refine middleware logic for bad word check and data passing).

5. **Review Autoplay Logic:**

   - Re-evaluate the video autoplay behavior, particularly on desktop.
   - Consider providing a clear "unmute" affordance if autoplay with sound is restricted by the browser.
   - **(Tasks:** Investigate browser autoplay policies, adjust `handlePlayerReady`, implement unmute UI if needed).

6. **Improve Code Clarity:**

   - Rename variables like `searchResults` to `playlist` in relevant components (`VideoPlayer`, `/api/session/search`, etc.) for better clarity.
   - Add comments and improve code structure where necessary.
   - **(Tasks:** Perform a code review, rename variables, add comments).

7. **Address `handleNext` Issue:**
   - Review the `handlePlayerStateChange` function in the `VideoPlayer` component.
   - Ensure that `handleNext` is not called unintentionally when the video ends, especially if it's the last video in the playlist.
   - **(Tasks:** Debug `handlePlayerStateChange`, adjust logic to prevent unintended `handleNext` calls).

**Phase 3: Future Considerations**

- **Implement "Play from History" Feature:** Utilize the session data to allow users to easily replay previous searches.
- **User Preferences:** Allow users to customize settings like autoplay behavior or default video quality, storing these preferences in the session.
- **Error Handling and User Feedback:** Implement more robust error handling and provide informative feedback to the user in case of API failures or other issues.

This plan provides a structured approach to improving the application. Each phase focuses on specific areas, building upon the previous one. By following this plan, we can create a more efficient, robust, and user-friendly application.
