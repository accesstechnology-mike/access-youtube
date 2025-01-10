// lib/bad-word-filter.js

/**
 * Filters a list of YouTube video results based on a list of bad words.
 *
 * @param {Array<object>} videos - An array of video objects from the scrape-youtube library.
 * @param {Array<string>} badWords - An array of bad words to filter out.
 * @returns {Array<object>} - A filtered array of video objects.
 */
export function filterBadWords(videos, badWords) {
  if (!videos || !badWords || badWords.length === 0) {
    return videos || [];
  }

  const lowerCaseBadWords = badWords.map(word => word.toLowerCase());

  return videos.filter(video => {
    const title = video.title.toLowerCase();
    const description = video.description ? video.description.toLowerCase() : '';

    for (const badWord of lowerCaseBadWords) {
      // Check if the bad word is present as a whole word in the title or description
      const regex = new RegExp(`\\b${badWord}\\b`);
      if (regex.test(title) || regex.test(description)) {
        return false; // Exclude the video if a bad word is found
      }
    }
    return true; // Include the video if no bad words are found
  });
} 