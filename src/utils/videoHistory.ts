export interface VideoHistoryItem {
  id: string;
  url: string;
  videoId: string;
  title: string;
  thumbnail: string;
  watchedAt: Date;
}

const HISTORY_STORAGE_KEY = 'youtube-player-history';
const MAX_HISTORY_ITEMS = 12;

/**
 * Get video thumbnail URL from YouTube video ID
 */
export function getVideoThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/**
 * Generate a simple title from video ID (fallback when title extraction isn't available)
 */
export function generateFallbackTitle(videoId: string): string {
  return `YouTube Video ${videoId.substring(0, 8)}...`;
}

/**
 * Load video history from localStorage
 */
export function loadVideoHistory(): VideoHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((item: VideoHistoryItem) => ({
      ...item,
      watchedAt: new Date(item.watchedAt)
    }));
  } catch (error) {
    console.error('Error loading video history:', error);
    return [];
  }
}

/**
 * Save video history to localStorage
 */
export function saveVideoHistory(history: VideoHistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving video history:', error);
  }
}

/**
 * Add a video to history
 */
export function addVideoToHistory(url: string, videoId: string, title?: string): VideoHistoryItem[] {
  const currentHistory = loadVideoHistory();
  
  // Remove existing entry if it exists
  const filteredHistory = currentHistory.filter(item => item.videoId !== videoId);
  
  // Create new history item
  const newItem: VideoHistoryItem = {
    id: `${videoId}-${Date.now()}`,
    url,
    videoId,
    title: title || generateFallbackTitle(videoId),
    thumbnail: getVideoThumbnail(videoId),
    watchedAt: new Date()
  };
  
  // Add to beginning of array and limit to MAX_HISTORY_ITEMS
  const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
  
  saveVideoHistory(updatedHistory);
  return updatedHistory;
}

/**
 * Clear all video history
 */
export function clearVideoHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing video history:', error);
  }
}

/**
 * Format relative time for display
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}
