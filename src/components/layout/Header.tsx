'use client';

interface HeaderProps {
  onSidebarToggle: () => void;
  title: string;
}

export default function Header({ onSidebarToggle, title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Hamburger menu and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800">
            {title}
          </h1>
        </div>

        {/* Right side - Optional actions */}
        <div className="flex items-center space-x-2">
          {/* You can add additional header actions here */}
        </div>
      </div>
    </header>
  );
}
