/**
 * Utility functions for extracting and managing YouTube video titles
 */

/**
 * Extract video title from YouTube URL using oEmbed API (client-side friendly)
 * This is a fallback method since we can't directly access YouTube Data API without API key
 */
export async function extractVideoTitle(videoId: string): Promise<string> {
  try {
    // Try to use YouTube's oEmbed API (CORS-friendly)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    const response = await fetch(oEmbedUrl);
    if (response.ok) {
      const data = await response.json();
      return data.title || generateFallbackTitle(videoId);
    }
  } catch (error) {
    console.log('Could not fetch video title:', error);
  }
  
  return generateFallbackTitle(videoId);
}

/**
 * Generate a user-friendly fallback title
 */
export function generateFallbackTitle(videoId: string): string {
  return `YouTube Video (${videoId.substring(0, 8)}...)`;
}

/**
 * Extract title from URL patterns (basic heuristics)
 */
export function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Check if there's a title in the URL parameters (some URLs have this)
    const titleParam = urlObj.searchParams.get('title');
    if (titleParam) {
      return decodeURIComponent(titleParam);
    }
    
    // Check for common URL patterns that might contain title info
    const pathname = urlObj.pathname;
    if (pathname.includes('/watch')) {
      return 'YouTube Video';
    }
    
    return 'YouTube Video';
  } catch (error) {
    return 'YouTube Video';
  }
}

/**
 * Get video title with caching to avoid repeated API calls
 */
const titleCache = new Map<string, string>();

export async function getCachedVideoTitle(videoId: string): Promise<string> {
  // Check cache first
  if (titleCache.has(videoId)) {
    return titleCache.get(videoId)!;
  }
  
  // Try to extract title
  const title = await extractVideoTitle(videoId);
  
  // Cache the result
  titleCache.set(videoId, title);
  
  return title;
}
