import React from 'react';

export default function WelcomeScreen() {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to YouTube Video Player
          </h2>
          <p className="text-gray-600 text-lg">
            A clean, modern way to watch YouTube videos
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-gray-700 mb-4">
            Ready to get started? The URL input feature will be added in the next step.
          </p>
          <div className="text-sm text-gray-500">
            Built with Next.js, TypeScript, and Tailwind CSS
          </div>
        </div>
      </div>
    </div>
  );
}
