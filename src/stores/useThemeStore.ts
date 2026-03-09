import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  (set) => ({
    theme: 'light',
    
    setTheme: (theme: Theme) => {
      // Update DOM classes
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark', 'high-contrast');
        document.documentElement.classList.add(theme);
      }
      
      set({ theme });
    },
  })
);
