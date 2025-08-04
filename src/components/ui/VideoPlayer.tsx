'use client';

import React, { useEffect, useState } from 'react';
import { extractYouTubeVideoId, isValidYouTubeUrl } from '@/utils/youtube';
import { addVideoToHistory } from '@/utils/videoHistory';
import { getCachedVideoTitle } from '@/utils/videoTitle';

interface VideoPlayerProps {
  url: string;
  onVideoAdded?: () => void;
}

export default function VideoPlayer({ url, onVideoAdded }: VideoPlayerProps) {
  const videoId = extractYouTubeVideoId(url);
  const isValidUrl = isValidYouTubeUrl(url);
  const [videoTitle, setVideoTitle] = useState<string>('Loading...');
  
  // Fetch video title and add to history when component mounts with a valid video
  useEffect(() => {
    if (videoId && url && isValidUrl) {
      // Fetch video title
      getCachedVideoTitle(videoId).then(title => {
        setVideoTitle(title);
      });
      
      // Add a small delay to ensure the video is actually being played
      const timer = setTimeout(async () => {
        const title = await getCachedVideoTitle(videoId);
        addVideoToHistory(url, videoId, title);
        if (onVideoAdded) {
          onVideoAdded();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [videoId, url, onVideoAdded, isValidUrl]);
  
  if (!isValidUrl || !videoId) {
    return null; // Don't render anything if the URL is not valid
  }

  // YouTube embed URL with basic parameters for clean playback
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto">
      <div className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          title="YouTube Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      
      {/* Video Title */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {videoTitle}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Video ID: {videoId}
        </p>
      </div>
    </div>
  );
}
