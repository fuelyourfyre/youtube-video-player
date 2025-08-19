// Theme Configuration System
export interface ThemeConfig {
  name: string;
  displayName: string;
  cssFile: string;
  description: string;
  category: 'light' | 'dark' | 'custom';
}

export const availableThemes: ThemeConfig[] = [
  {
    name: 'minimalist',
    displayName: 'Minimalist Light',
    cssFile: '/themes/minimalist.css',
    description: 'Clean, minimal design with light backgrounds and neutral colors',
    category: 'light'
  },
  {
    name: 'dark',
    displayName: 'Video-Focused Dark',
    cssFile: '/themes/dark.css',
    description: 'Dark theme optimized for video viewing with YouTube red accents',
    category: 'dark'
  },
  {
    name: 'youtube',
    displayName: 'YouTube Classic',
    cssFile: '/themes/youtube.css',
    description: 'Classic YouTube-inspired design with brand colors',
    category: 'light'
  }
];

export const defaultTheme = 'dark'; // Current active theme

// Theme switching utility
export function getThemeConfig(themeName: string): ThemeConfig | undefined {
  return availableThemes.find(theme => theme.name === themeName);
}

export function getActiveTheme(): ThemeConfig {
  const theme = getThemeConfig(defaultTheme);
  return theme || availableThemes[0];
}
