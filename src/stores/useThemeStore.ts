import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      
      setTheme: (theme: Theme) => {
        // Update DOM classes
        document.documentElement.classList.remove('light', 'dark', 'high-contrast');
        document.documentElement.classList.add(theme);
        
        set({ theme });
      },
    }),
    {
      name: 'mindease-theme',
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mindease-theme');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.theme) {
        document.documentElement.classList.add(state.theme);
      }
    } catch (e) {
      console.error('Failed to parse theme from localStorage', e);
    }
  }
}
