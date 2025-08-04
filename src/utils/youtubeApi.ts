// YouTube Data API v3 integration utility

export interface YouTubeSearchResult {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  channelId: string;
}

export interface YouTubeVideoDetails {
  duration: string;
  viewCount: string;
  likeCount?: string;
  commentCount?: string;
}

interface YouTubeApiItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium?: { url: string };
      default?: { url: string };
    };
    publishedAt: string;
    description: string;
    channelId: string;
  };
}

interface YouTubeVideoApiItem {
  id: string;
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

// Note: In production, you would set this in environment variables
// For demo purposes, we'll provide instructions for API key setup
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

/**
 * Search YouTube videos using the YouTube Data API v3
 */
export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 12
): Promise<YouTubeSearchResult[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured. Using fallback search.');
    return getFallbackSearchResults(query, maxResults);
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `q=${encodeURIComponent(query)}&` +
      `type=video&` +
      `maxResults=${maxResults}&` +
      `order=relevance&` +
      `key=${YOUTUBE_API_KEY}`;

    console.log('YouTube API Search URL:', searchUrl);
    const response = await fetch(searchUrl);
    
    const data = await response.json();
    
    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || `HTTP ${response.status} - ${response.statusText}`;
      
      console.error('YouTube API Error:', {
        status: response.status,
        message: errorMessage,
        fullResponse: data
      });
      
      throw new Error(errorMessage);
    }

    return data.items.map((item: YouTubeApiItem) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url || 
                item.snippet.thumbnails.default?.url ||
                `https://img.youtube.com/vi/${item.id.videoId}/mqdefault.jpg`,
      publishedAt: formatPublishDate(item.snippet.publishedAt),
      description: item.snippet.description,
      channelId: item.snippet.channelId
    }));
  } catch (error) {
    console.error('YouTube API search error:', error);
    // Fallback to mock results if API fails
    return getFallbackSearchResults(query, maxResults);
  }
}

/**
 * Get video details (duration, view count) using YouTube Data API v3
 */
export async function getYouTubeVideoDetails(
  videoIds: string[]
): Promise<Record<string, YouTubeVideoDetails>> {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) {
    return {};
  }

  try {
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
      `part=statistics,contentDetails&` +
      `id=${videoIds.join(',')}&` +
      `key=${YOUTUBE_API_KEY}`;

    const response = await fetch(detailsUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    const details: Record<string, YouTubeVideoDetails> = {};
    
    data.items?.forEach((item: YouTubeVideoApiItem) => {
      details[item.id] = {
        duration: formatDuration(item.contentDetails.duration),
        viewCount: formatViewCount(parseInt(item.statistics.viewCount || '0')),
        likeCount: item.statistics.likeCount,
        commentCount: item.statistics.commentCount
      };
    });

    return details;
  } catch (error) {
    console.error('YouTube API details error:', error);
    return {};
  }
}

/**
 * Format ISO 8601 duration to readable format (PT4M13S -> 4:13)
 */
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'N/A';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Format view count to readable format
 */
function formatViewCount(views: number): string {
  if (views >= 1000000000) {
    return `${(views / 1000000000).toFixed(1)}B views`;
  } else if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
}

/**
 * Format publish date to relative time
 */
function formatPublishDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  } catch {
    return 'Unknown';
  }
}

/**
 * Fallback search results when YouTube API is not available
 * This provides a demo experience without requiring API key setup
 */
function getFallbackSearchResults(query: string, maxResults: number): YouTubeSearchResult[] {
  const queryLower = query.toLowerCase();
  
  // Curated fallback database for demo purposes
  const fallbackVideos = [
    // Music
    { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up (Official Video)', channel: 'Rick Astley', keywords: ['music', 'song', 'classic', 'rick', 'astley', 'never', 'gonna', 'give', 'up', '80s'], date: '2009-10-25T07:57:33Z' },
    { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee (Official Music Video)', channel: 'Luis Fonsi', keywords: ['music', 'despacito', 'luis', 'fonsi', 'latin', 'spanish', 'reggaeton'], date: '2017-01-12T16:00:01Z' },
    { id: 'fJ9rUzIMcZQ', title: 'Queen - Bohemian Rhapsody (Official Video)', channel: 'Queen Official', keywords: ['music', 'queen', 'bohemian', 'rhapsody', 'rock', 'classic', 'freddie', 'mercury'], date: '2008-08-01T15:53:05Z' },
    
    // Programming/Tech
    { id: 'jNQXAC9IVRw', title: 'Learn JavaScript - Full Course for Beginners', channel: 'freeCodeCamp.org', keywords: ['tutorial', 'javascript', 'programming', 'learn', 'coding', 'web', 'development', 'course'], date: '2019-12-18T16:00:11Z' },
    { id: 'ScMzIvxBSi4', title: 'React Course - Beginner\'s Tutorial for React JavaScript Library [2022]', channel: 'freeCodeCamp.org', keywords: ['tutorial', 'react', 'javascript', 'web', 'development', 'beginners', 'library'], date: '2021-12-09T14:00:32Z' },
    { id: 'L_jWHffIx5E', title: 'Python Tutorial - Python Full Course for Beginners', channel: 'Programming with Mosh', keywords: ['tutorial', 'python', 'programming', 'beginners', 'course', 'learn', 'coding'], date: '2019-02-18T15:00:01Z' },
    
    // Gaming
    { id: 'fC7oUOUEEi4', title: 'Minecraft, But Everything is 10x Bigger!', channel: 'MrBeast Gaming', keywords: ['minecraft', 'gaming', 'mrbeast', 'challenge', 'bigger', 'survival'], date: '2021-08-14T20:00:01Z' },
    { id: 'BxV14h0kFs0', title: 'Among Us But With 1000 Players!', channel: 'MrBeast Gaming', keywords: ['among', 'us', 'gaming', 'mrbeast', '1000', 'players', 'challenge'], date: '2020-11-28T21:00:15Z' },
    
    // Cooking
    { id: 'ixlgm_XXzJg', title: 'Gordon Ramsay\'s perfect scrambled eggs', channel: 'Gordon Ramsay', keywords: ['cooking', 'gordon', 'ramsay', 'eggs', 'scrambled', 'recipe', 'food', 'chef'], date: '2016-04-25T13:00:01Z' },
    { id: 'PUP7U5vTMM0', title: 'How to Make Perfect Pasta Every Time', channel: 'Bon Appétit', keywords: ['cooking', 'pasta', 'recipe', 'italian', 'food', 'how', 'to', 'perfect'], date: '2022-03-15T17:00:01Z' },
    
    // Science/Education
    { id: 'wJyUtbn0O5Y', title: 'How Does WiFi Work?', channel: 'Veritasium', keywords: ['science', 'wifi', 'technology', 'how', 'works', 'internet', 'wireless'], date: '2022-05-12T14:00:01Z' },
    { id: 'aircAruvnKk', title: 'But what is a neural network? | Chapter 1, Deep learning', channel: '3Blue1Brown', keywords: ['science', 'neural', 'network', 'ai', 'machine', 'learning', 'math', 'deep'], date: '2017-10-05T15:00:01Z' }
  ];
  
  // Filter and score results based on relevance
  const relevantResults = fallbackVideos
    .map(video => {
      let relevanceScore = 0;
      
      // Title matching
      if (video.title.toLowerCase().includes(queryLower)) {
        relevanceScore += 100;
      }
      
      // Keyword matching
      const matchingKeywords = video.keywords.filter(keyword => 
        keyword.includes(queryLower) || queryLower.includes(keyword)
      );
      relevanceScore += matchingKeywords.length * 20;
      
      // Channel matching
      if (video.channel.toLowerCase().includes(queryLower)) {
        relevanceScore += 30;
      }
      
      // Partial word matching
      const queryWords = queryLower.split(' ');
      queryWords.forEach(word => {
        if (word.length > 2) {
          if (video.title.toLowerCase().includes(word)) relevanceScore += 15;
          if (video.keywords.some(keyword => keyword.includes(word))) relevanceScore += 10;
        }
      });
      
      return { ...video, relevanceScore };
    })
    .filter(video => video.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
  
  return relevantResults.map(video => ({
    id: video.id,
    title: video.title,
    channelTitle: video.channel,
    thumbnail: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
    publishedAt: formatPublishDate(video.date),
    description: `${video.title} - Watch this amazing video from ${video.channel}`,
    channelId: 'fallback-channel'
  }));
}
