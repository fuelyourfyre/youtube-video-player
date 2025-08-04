'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { VideoHistoryItem, loadVideoHistory, clearVideoHistory, formatRelativeTime } from '@/utils/videoHistory';

interface VideoHistoryProps {
  onVideoSelect: (url: string) => void;
  refreshTrigger?: number; // Optional prop to trigger refresh
}

const VideoHistory = memo(function VideoHistory({ onVideoSelect, refreshTrigger }: VideoHistoryProps) {
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);

  useEffect(() => {
    // Load history on component mount
    const loadedHistory = loadVideoHistory();
    setHistory(loadedHistory);
  }, []);

  // Refresh history when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      const loadedHistory = loadVideoHistory();
      setHistory(loadedHistory);
    }
  }, [refreshTrigger]);

  const handleVideoClick = useCallback((item: VideoHistoryItem) => {
    onVideoSelect(item.url);
  }, [onVideoSelect]);

  const handleClearHistory = useCallback(() => {
    clearVideoHistory();
    setHistory([]);
  }, []);

  if (history.length === 0) {
    return null; // Don't show history section if no videos
  }

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recently Played</h3>
        <button
          onClick={handleClearHistory}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
        >
          Clear History
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleVideoClick(item)}
              className="cursor-pointer group bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative w-full bg-gray-200" style={{ paddingTop: '56.25%' }}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                  loading="lazy"
                />
                
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Video info */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(item.watchedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Export the refresh function type for parent components
export type VideoHistoryRef = {
  refreshHistory: () => void;
};

export default VideoHistory;
