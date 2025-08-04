/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - youtube.com/v/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Try to match common YouTube URL patterns
  const patterns = [
    // youtube.com/watch?v=ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
    // youtu.be/ID
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&/]+)/i,
    // youtube.com/embed/ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&/]+)/i,
    // youtube.com/v/ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?&/]+)/i,
    // youtube.com/shorts/ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?&/]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Validates if a URL is a valid YouTube URL by attempting to extract a video ID
 */
export function isValidYouTubeUrl(url: string): boolean {
  return !!extractYouTubeVideoId(url);
}
