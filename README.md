# access: youtube

access: youtube is an accessible interface for users of assistive technologies to search for and play YouTube videos independently.

It is a specialised web application designed to provide a safer, accessible, and distraction-free way to watch YouTube videos. It's particularly useful for:

- users of assistive technologies
- sight-impaired users
- people with brain injuries / cognitive impairments
- parents who want to protect their children from inappropriate content
- teachers looking for a safer way to use YouTube in educational settings
- anyone who wants a cleaner, more focused YouTube viewing experience

## Key Benefits

### 🛡️ Safety First

- **Content Filtering**: Automatically filters out inappropriate content and harmful search terms
- **No Comments**: Removes the often problematic comment sections

### 🎯 Focused Experience

- **Clean Interface**: Simple, intuitive design that puts the content first
- **Distraction-Free**: No ads, pop-ups, or unnecessary UI elements
- **Quick Access**: Direct search-to-play workflow without extra clicks
- **Keyboard Shortcuts**: Efficient navigation using keyboard shortcuts

## How to Use

1. **Search**

   - Type your search term in the search box on the homepage and press enter
   - The search term is automatically filtered for inappropriate content
   - If any harmful word are detected, you'll be redirected to the homepage

2. **Browse Results**

   - Search results are filtered through YouTube's own SafeSearch algorithm to ensure they are appropriate
   - Accessible grid of video thumbnails
   - Each result shows just the essential information
   - `Tab` and `Enter` to navigate, orClick any video, to start playing
   - Also use keys `1-9`, `0`, `a` or `b` for quick access to the 12 search results

3. **Watch Videos**
   - Videos play automatically in a distraction-free environment, no ads!
   - Simple controls: Play/Pause, Repeat, Next, and Back
   - Keyboard shortcuts available for all controls
   - No distracting sidebars or recommendations

### Direct URL Access

- Link to search results directly using URLs in the format: `https://accessyoutube.org.uk/search-term`
- Direct video playback links: `https:///accessyoutube.org.uk/play/video-id`
- Perfect for creating bookmarks or sharing specific content
- Compatible with assistive technology or AAC software that uses direct URL navigation

### Grid3 Integration

This site is fully compatible with the [access: youtube Grid Set](https://grids.sensorysoftware.com/en/sensory-software/ea70325b-6368-4da6-b5e9-7d291f67cb68) for Grid3, featuring:

- Dedicated keyboard layouts (ABC, QWERTY, and High Frequency)
- Customisable word filtering
- Simple navigation controls
- Seamless integration with Grid3's access and control features

### Keyboard Shortcuts

While watching a video:

- `p` - Play/Pause
- `r` - Repeat current video
- `n` - Next video
- `b` - Back to search results

## Privacy & Safety Features

- **No Data Collection**: We don't track or store your viewing history
- **No Account Required**: Watch videos without signing in
- **Safe Search**: Built-in filtering of inappropriate content

## Technical Details

- Built with Next.js for optimal performance
- Server-side content filtering
- Responsive design works on all devices
- Accessibility-first approach
- No cookies or tracking
- Session-based search history for navigation
- The core functionality of the search is handled by the `scrape-youtube` npm package. Integration is happening within the `app/api/search/route.js` Next.js API route.
  - *Historically the official YouTube Data API was used, however they reduced our quota to zero (with no warning) due to the accessible layout not meeting their design requirements. An appeal was made, but it was rejected.*
- The "strict" search functionality is achieved by setting the `PREF=f2=8000000` cookie in the request headers when using the `scrape-youtube` package.

### Implementation

- Multi-layer content filtering:
  - Server-side search term filtering checking against a SQLite database of inappropriate words
  - Automatic graceful redirect to homepage when bad words are detected
  - YouTube's Strict SafeSearch integration for video search results
- Caching strategy for popular searches to improve performance
- No client-side storage or tracking

### Accessibility Features

- Keyboard navigation support
- Screen reader optimized
- High contrast

## Get Started

Simply visit the [access: youtube](https://accessyoutube.org.uk) and start searching! No setup or account creation required.

## Feedback

Found an issue or have a suggestion? Please let us know by:

1. Opening an issue on [GitHub](https://github.com/accesstechnology-mike/access-youtube)
2. Contacting [mike@accesstechnology.co.uk](mailto:mike@accesstechnology.co.uk)
3. Filling in the form on our [contact page](https://accesstechnology.co.uk/contact)

---

_access: youtube is not affiliated with YouTube or Google. It's an independent project focused on providing an accessible viewing experience._
