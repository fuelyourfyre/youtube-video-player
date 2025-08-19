'use client';

import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '@/config/themes';
import { themeManager, getAvailableThemes, getCurrentTheme } from '@/utils/themeManager';

interface ThemeSwitcherProps {
  className?: string;
}

export default function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | undefined>();
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initialize themes
    setAvailableThemes(getAvailableThemes());
    setCurrentTheme(getCurrentTheme());

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentTheme(event.detail.theme);
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const handleThemeSelect = (themeName: string) => {
    themeManager.applyTheme(themeName);
    setIsOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'light':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="minimal-button flex items-center gap-2 px-3 py-2"
        aria-label="Switch theme"
      >
        {currentTheme && getCategoryIcon(currentTheme.category)}
        <span className="text-sm font-medium">
          {currentTheme?.displayName || 'Theme'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 minimal-card z-20 shadow-lg">
            <div className="p-2">
              <h3 className="text-subtitle font-medium mb-2">Choose Theme</h3>
              <div className="space-y-1">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => handleThemeSelect(theme.name)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                      currentTheme?.name === theme.name
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: currentTheme?.name === theme.name ? 'var(--color-accent-light)' : 'transparent',
                      color: currentTheme?.name === theme.name ? 'var(--color-accent)' : 'var(--color-text-primary)'
                    }}
                  >
                    <div className="flex-shrink-0">
                      {getCategoryIcon(theme.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{theme.displayName}</div>
                      <div className="text-xs opacity-75 truncate">{theme.description}</div>
                    </div>
                    {currentTheme?.name === theme.name && (
                      <div className="flex-shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
