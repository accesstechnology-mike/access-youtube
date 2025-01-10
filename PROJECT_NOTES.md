# Project Notes: AccessYouTube Next.js Migration

**Goal:** Consolidate the existing Laravel frontend and Node.js backend of AccessYouTube into a single, performant, and highly accessible Next.js application hosted on Vercel.

**Key Considerations:**

- **Accessibility First:** All development decisions must prioritize accessibility for users with visual impairments and learning difficulties. This includes semantic HTML, ARIA attributes, keyboard navigation, and sufficient color contrast.
- **YouTube Scraper Integration:** The core functionality of the existing Node.js `youtube_scraper` is being replaced by the `scrape-youtube` npm package. Integration is happening within the `app/api/search/route.js` Next.js API route.
- **Strict Search and Restricted Mode:** The "strict" search functionality is achieved by setting the `PREF=f2=8000000` cookie in the request headers when using the `scrape-youtube` package.
- **Bad Word Filtering:** All search queries are now filtered through a bad word filter. This involves checking the search query against a SQLite database and filtering the YouTube results using the `filterBadWords` function. If a bad word is found, the API will return an error, and the frontend should redirect the user to the home page.
- **Caching Strategy:** Implement robust caching to minimize redundant scraping of YouTube. Aim for daily updates for popular queries.
- **Vercel Deployment:** The application will be hosted on Vercel, leveraging its features and integrations.
- **Maintain Existing Functionality:** The core features of searching and playing YouTube videos must be replicated in the Next.js application.
- **Reference Existing Codebases:** The Laravel frontend ([https://github.com/accesstechnology/accessyoutube](https://github.com/accesstechnology/accessyoutube)) and Node.js backend ([https://github.com/accesstechnology/youtube_scraper](https://github.com/accesstechnology/youtube_scraper)) are the primary sources of truth for existing logic and functionality where applicable.
- **Package Management:** Using `npm` as the package manager, as evidenced by the `package.json` file.

**Technology Stack:**

- **Frontend & Backend:** Next.js (React framework)
- **Styling:** (To be determined - consider Tailwind CSS for rapid development and accessibility)
- **Caching:** (Potentially Next.js built-in caching, Vercel Data Cache, or Redis via Vercel integration)
- **YouTube Scraping:** `scrape-youtube` npm package
