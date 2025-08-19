'use client';

import React, { useState, useEffect } from 'react';
import { isValidYouTubeUrl } from '@/utils/youtube';

interface URLInputProps {
  onURLChange?: (url: string) => void;
  value?: string;
}

export default function URLInput({ onURLChange, value }: URLInputProps) {
  const [url, setUrl] = useState<string>(value || '');

  // Update internal state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setUrl(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // Call the optional callback if provided
    if (onURLChange) {
      onURLChange(newUrl);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="https://www.youtube.com/watch?v=..."
          className="minimal-input w-full"
        />
        
        {/* URL validation indicator */}
        {url && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValidYouTubeUrl(url) ? (
              <svg className="w-4 h-4" style={{ color: 'var(--color-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" style={{ color: 'var(--color-error)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-500">
          Supports youtube.com and youtu.be links
        </p>
      </div>
      
      {/* No URL display as per user request */}
    </div>
  );
}
