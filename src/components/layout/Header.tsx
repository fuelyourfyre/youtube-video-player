'use client';

import { useEffect } from 'react';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { themeManager } from '@/utils/themeManager';

interface HeaderProps {
  onSidebarToggle: () => void;
  title?: string;
}

export default function Header({ onSidebarToggle, title }: HeaderProps) {
  useEffect(() => {
    // Initialize theme manager on component mount
    if (typeof window !== 'undefined') {
      // Load saved theme or apply default theme
      const savedTheme = localStorage.getItem('app-theme');
      const themeToApply = savedTheme || 'dark'; // Default to dark theme
      themeManager.applyTheme(themeToApply);
    }
  }, []);
  return (
    <header className="minimal-header">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onSidebarToggle}
            className="minimal-button p-2"
            style={{ minWidth: 'auto' }}
            aria-label="Toggle sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-title">VideoHub</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <div className="flex items-center gap-1 px-2 py-1 rounded text-xs" 
               style={{ 
                 backgroundColor: 'var(--color-success-light)', 
                 color: 'var(--color-success)' 
               }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" 
                 style={{ backgroundColor: 'var(--color-success)' }} />
            <span>Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
