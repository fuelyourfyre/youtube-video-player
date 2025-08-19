// Theme Management Utility
import { ThemeConfig, availableThemes, getThemeConfig, defaultTheme } from '@/config/themes';

export class ThemeManager {
  private currentTheme: string = defaultTheme;
  private themeStyleElement: HTMLLinkElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeTheme();
    }
  }

  /**
   * Initialize theme on page load
   */
  private initializeTheme(): void {
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem('app-theme') || defaultTheme;
    this.applyTheme(savedTheme);
  }

  /**
   * Apply a theme by name
   */
  public applyTheme(themeName: string): boolean {
    const themeConfig = getThemeConfig(themeName);
    
    if (!themeConfig) {
      console.warn(`Theme "${themeName}" not found. Available themes:`, availableThemes.map(t => t.name));
      return false;
    }

    // Remove existing theme stylesheet
    if (this.themeStyleElement) {
      this.themeStyleElement.remove();
    }

    // Create new theme stylesheet
    this.themeStyleElement = document.createElement('link');
    this.themeStyleElement.rel = 'stylesheet';
    this.themeStyleElement.href = themeConfig.cssFile;
    this.themeStyleElement.id = 'theme-stylesheet';

    // Add error handling for CSS loading
    this.themeStyleElement.onerror = () => {
      console.error(`Failed to load theme CSS: ${themeConfig.cssFile}`);
    };

    // Add to head
    document.head.appendChild(this.themeStyleElement);

    // Update current theme
    this.currentTheme = themeName;

    // Save to localStorage
    localStorage.setItem('app-theme', themeName);

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: themeConfig } 
    }));

    return true;
  }

  /**
   * Get current theme configuration
   */
  public getCurrentTheme(): ThemeConfig | undefined {
    return getThemeConfig(this.currentTheme);
  }

  /**
   * Get all available themes
   */
  public getAvailableThemes(): ThemeConfig[] {
    return availableThemes;
  }

  /**
   * Switch to next theme (for testing)
   */
  public switchToNextTheme(): void {
    const currentIndex = availableThemes.findIndex(theme => theme.name === this.currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    const nextTheme = availableThemes[nextIndex];
    this.applyTheme(nextTheme.name);
  }

  /**
   * Switch theme by category
   */
  public switchToCategory(category: 'light' | 'dark' | 'custom'): void {
    const themesInCategory = availableThemes.filter(theme => theme.category === category);
    if (themesInCategory.length > 0) {
      this.applyTheme(themesInCategory[0].name);
    }
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();

// Export convenience functions
export const applyTheme = (themeName: string) => themeManager.applyTheme(themeName);
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const getAvailableThemes = () => themeManager.getAvailableThemes();
export const switchToNextTheme = () => themeManager.switchToNextTheme();
export const switchToCategory = (category: 'light' | 'dark' | 'custom') => themeManager.switchToCategory(category);
