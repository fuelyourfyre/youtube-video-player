'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Enter YouTube URL
        </h2>
        <p className="text-gray-600 text-sm">
          Paste any YouTube video URL to get started
        </p>
      </div>
      
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Enter YouTube URL here... (e.g., https://www.youtube.com/watch?v=...)"
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg 
                     focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none
                     hover:border-gray-400 transition-all duration-200 ease-in-out
                     placeholder-gray-400 bg-white shadow-sm"
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* URL Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            className="w-6 h-6 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
            />
          </svg>
        </div>
      </div>
      
      {/* Helper text */}
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-500">
          Supports youtube.com and youtu.be links
        </p>
      </div>
      
      {/* No URL display as per user request */}
    </div>
  );
}
