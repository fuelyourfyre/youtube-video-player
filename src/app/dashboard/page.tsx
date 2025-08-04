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
      <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to YouTube Video Player
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your modern YouTube video player with search, history, and seamless playback experience.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Videos Watched</h3>
              <p className="text-3xl font-bold text-blue-600">{videoHistory.length}</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Search Available</h3>
              <p className="text-3xl font-bold text-green-600">{hasApiKey ? 'Yes' : 'No'}</p>
            </div>
            <div className={hasApiKey ? 'text-green-500' : 'text-red-500'}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">API Status</h3>
              <p className="text-3xl font-bold text-green-600">{hasApiKey ? 'Active' : 'Inactive'}</p>
            </div>
            <div className={`w-4 h-4 rounded-full ${hasApiKey ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/youtube" className="block">
          <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md p-6 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Watch Video</h3>
                <p className="text-blue-100">Enter a YouTube URL to start watching</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/youtube" className={`block ${!hasApiKey ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md p-6 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Search Videos</h3>
                <p className="text-red-100">
                  {hasApiKey ? 'Find videos using YouTube search' : 'Requires YouTube API key'}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Videos */}
      {videoHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Videos</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {videoHistory.map((video) => (
                <div key={video.videoId} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 truncate">{video.title}</h4>
                    <p className="text-sm text-gray-500">
                      Added {new Date(video.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/youtube?url=${encodeURIComponent(video.url)}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Watch Again
                  </Link>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/youtube"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All History →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </AppLayout>
  );
}
