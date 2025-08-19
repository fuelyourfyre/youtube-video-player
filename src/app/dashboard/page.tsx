'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';

interface VideoHistoryItem {
  url: string;
  videoId: string;
  title: string;
  addedAt: string;
}

export default function Dashboard() {
  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load video history from localStorage
    const loadVideoHistory = () => {
      try {
        const savedHistory = localStorage.getItem('videoHistory');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          setVideoHistory(history.slice(0, 3)); // Show only recent 3 videos
        }
      } catch (error) {
        console.error('Error loading video history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoHistory();
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const hasApiKey = Boolean(apiKey);

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-title mb-3">
          Welcome to VideoHub
        </h1>
        <p className="text-body max-w-xl mx-auto">
          Your minimalist YouTube video player with search, history, and seamless playback.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="minimal-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-body font-medium" style={{ color: 'var(--color-text-secondary)' }}>Videos Watched</h3>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-accent)' }}>{videoHistory.length}</p>
            </div>
            <div style={{ color: 'var(--color-accent)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="minimal-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-body font-medium" style={{ color: 'var(--color-text-secondary)' }}>Search Queries</h3>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-success)' }}>0</p>
            </div>
            <div style={{ color: 'var(--color-success)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="minimal-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-body font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total Watch Time</h3>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-warning)' }}>~</p>
            </div>
            <div style={{ color: 'var(--color-warning)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/youtube" className="block">
          <div className="minimal-card hover:shadow-md transition-all duration-200 border" 
               style={{ 
                 borderColor: 'var(--color-accent)',
                 backgroundColor: 'var(--color-accent-light)'
               }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: 'var(--color-accent)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-subtitle font-medium">Watch Video</h3>
                <p className="text-caption" style={{ color: 'var(--color-text-secondary)' }}>Enter a YouTube URL to start watching</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/youtube" className={`block ${!hasApiKey ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="minimal-card hover:shadow-md transition-all duration-200 border" 
               style={{ 
                 borderColor: hasApiKey ? 'var(--color-success)' : 'var(--color-border)',
                 backgroundColor: hasApiKey ? 'var(--color-success-light)' : 'var(--color-surface)'
               }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: hasApiKey ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-subtitle font-medium">Search Videos</h3>
                <p className="text-caption" style={{ color: 'var(--color-text-secondary)' }}>
                  {hasApiKey ? 'Find videos using YouTube search' : 'Requires YouTube API key'}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Videos */}
      {videoHistory.length > 0 && (
        <div className="minimal-card">
          <h2 className="text-subtitle font-medium mb-3">Recent Videos</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" 
                   style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
            </div>
          ) : (
            <div className="space-y-2">
              {videoHistory.slice(0, 3).map((video) => (
                <div key={video.videoId} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-16 h-9 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-caption font-medium truncate">{video.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {new Date(video.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/youtube?url=${encodeURIComponent(video.url)}`}
                    className="minimal-button text-xs px-2 py-1"
                  >
                    Watch
                  </Link>
                </div>
              ))}
              {videoHistory.length > 3 && (
                <Link href="/youtube" className="block text-center pt-2">
                  <span className="text-caption" style={{ color: 'var(--color-accent)' }}>View all {videoHistory.length} videos →</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  </AppLayout>
  );
}
