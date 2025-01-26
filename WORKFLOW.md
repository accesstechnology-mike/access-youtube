## Workflow Documentation for access: youtube

This document outlines the intended workflows within the access: youtube application, detailing user actions and corresponding application activities.

### 1. Initial Entry - Homepage

**User Action:** User navigates to the root URL (`/`).

**App Activity:**

- The logo and `SearchForm` component are displayed.
- The searchForm is immediately focused on desktop, and the user can immediately start typing.
- Note, this is not the case on mobile, where the user must first click the search form to focus it.

### 2. Performing a Search

**User Action:** User enters a search term in the `SearchForm` and submits the form (presses Enter or clicks "Search").

**App Activity:**

- **`SearchForm` Component (`app/components/SearchForm.js`):**
  - If empty, the user is redirected to `/`.
  - The app navigates to the URL path corresponding to the sanitizedsearch term (e.g., `/search+term`).
  - Note, the user can directly navigate to the search results page by typing the URL in the browser.
- **Middleware (`middleware.js`):**
  - The middleware intercepts the navigation to the search results page (`/[...term]/page.js`). 
  - The search term is checked against the bad words database, using the check-bad-words API route
- **check-bad-words API route (`app/api/check-bad-words/route.js`):**
  - Splits the search term into words.
      - Queries the SQLite database (`bad_words` table) for any matching words.
      - If bad words are found, the user is redirected to `/` with a permanent redirect.
  - Note, it is of vital importance that the search form is re-rendered EMPTY when this redirect happens.
  - If the search term does not contain bad words, the search results page is rendered.
- **Search Results Page (`app/[...term]/page.js`):**
  - The search results are fetched from the `/api/search` route.
  - If the search term matches the cookie, the app will use the playlist stored in the cookie and return the search results page.
  - If the search term does not match the cookie, the search results are updated in the cookie as a playlist of video IDs and titles along with the search term.
  - The search results page is rendered as a grid of video IDs and titles.
  - On desktop the searchForm is autofocused, and the user can immediately start typing. This is not the case on mobile.

### 3. Playing a Video from Search Results

**User Action:** User clicks on a video result.

**App Activity:**

- **Play Page (`app/play/[videoId]/page.js`):**
  - On desktop the searchForm is autofocused, and the user can immediately start typing. This is not the case on mobile.

  - The `videoId` is extracted from the URL parameters.
  - There is absolutely no other mechanism required to determine which video to play.
  - It is essential the video autoplays, regardless of user devices
  - THe video stops at the end, awaiting further user action

  - The vidoeID of the URL is matched against the playlist of video IDs stored in the session cookie, to determine the index of the current video.
  - The index is used to determine the next video to play, incrementing the index.
  - The searchterm in the session cookie is used to determine the backlink to the search results page.

### 4. Direct Navigation to Play Page

**User Action:** User navigates to the play page by typing the URL with videoId /play/videoId in the browser.

**App Activity:**

- The app checks finds the video title and checks it for bad words.
- If the video title contains bad words, the user is redirected to `/` with a permanent redirect.
- If the video title does not contain bad words, the video is played
- A playlist is created in the session cookie, containing video IDs and titles and image links, along with the search term based on the video title.
- The current video is considered the first video in the playlist.
- The searchterm in the session cookie is used to determine the backlink to the search results page.