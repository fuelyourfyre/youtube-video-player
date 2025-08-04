'use client';

import { useState, useCallback, memo, useEffect, useMemo } from 'react';
import { searchYouTubeVideos, getYouTubeVideoDetails, YouTubeSearchResult } from '@/utils/youtubeApi';

interface SearchResult {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  url: string;
}

interface SearchVideosProps {
  onVideoSelect: (url: string) => void;
}

const SearchVideos = memo(function SearchVideos({ onVideoSelect }: SearchVideosProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // YouTube API search function with real-time results
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(true);

    try {
      // Search YouTube videos using the API
      const youtubeResults = await searchYouTubeVideos(query, 12);
      
      // Get video details (duration, view count) for the results
      const videoIds = youtubeResults.map(result => result.id);
      const videoDetails = await getYouTubeVideoDetails(videoIds);
      
      // Combine search results with video details
      const enhancedResults: SearchResult[] = youtubeResults.map(result => ({
        id: result.id,
        title: result.title,
        channelTitle: result.channelTitle,
        thumbnail: result.thumbnail,
        duration: videoDetails[result.id]?.duration || 'N/A',
        viewCount: videoDetails[result.id]?.viewCount || 'N/A',
        publishedAt: result.publishedAt,
        url: `https://www.youtube.com/watch?v=${result.id}`
      }));
      
      setSearchResults(enhancedResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search videos. Please try again.';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);



  // Debounce search query for real-time search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery, performSearch]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Real-time search is handled by useEffect, but we can trigger immediate search on form submit
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  const handleVideoClick = useCallback((result: SearchResult) => {
    onVideoSelect(result.url);
    setShowResults(false); // Hide search results after selection
  }, [onVideoSelect]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setError(null);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search YouTube videos..."
              className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!searchQuery.trim() || loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {/* Search Results */}
      {showResults && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h3>
            <button
              onClick={() => setShowResults(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                <span>Searching for videos...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {!loading && !error && searchResults.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No videos found. Try a different search term.</p>
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleVideoClick(result)}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 hover:border-red-300"
                >
                  {/* Thumbnail */}
                  <div className="relative mb-3">
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-full h-32 object-cover rounded-md"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to standard quality thumbnail if maxres fails
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('mqdefault')) {
                          target.src = `https://img.youtube.com/vi/${result.id}/default.jpg`;
                        }
                      }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {result.duration}
                    </div>
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-md">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l8-5-8-5z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {result.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{result.channelTitle}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{result.viewCount}</span>
                      <span>•</span>
                      <span>{result.publishedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default SearchVideos;
