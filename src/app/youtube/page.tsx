'use client';

import { useState, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import URLInput from '@/components/ui/URLInput';
import VideoPlayer from '@/components/ui/VideoPlayer';
import VideoInfo from '@/components/ui/VideoInfo';
import VideoHistory from '@/components/ui/VideoHistory';
import SearchVideos from '@/components/ui/SearchVideos';

export default function YouTube() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleURLChange = useCallback((url: string) => {
    setCurrentUrl(url);
  }, []);

  const handleVideoAdded = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleVideoSelect = useCallback((videoUrl: string) => {
    setCurrentUrl(videoUrl);
  }, []);

  return (
    <AppLayout title="YouTube Video Player">
      <div className="max-w-7xl mx-auto">
        {/* URL Input Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Enter YouTube URL
            </h2>
            <URLInput onURLChange={handleURLChange} value={currentUrl} />
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Search YouTube Videos
            </h2>
            <SearchVideos onVideoSelect={handleVideoSelect} />
          </div>
        </div>

        {/* Video Player and Info Section */}
        {currentUrl && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Now Playing
              </h2>
              
              {/* Desktop: Side by side, Mobile: Stacked */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video Player */}
                <div className="lg:col-span-1">
                  <VideoPlayer 
                    url={currentUrl} 
                    onVideoAdded={handleVideoAdded}
                  />
                </div>
                
                {/* Video Info */}
                <div className="lg:col-span-1">
                  <VideoInfo url={currentUrl} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video History Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Video History
            </h2>
            <VideoHistory 
              onVideoSelect={handleVideoSelect}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
