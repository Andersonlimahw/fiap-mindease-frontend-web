import { useEffect } from 'react';
import { useThemeStore, useAccessibilityStore, useAuthStore } from '@/stores';

interface StoreInitializerProps {
  children: React.ReactNode;
}

/**
 * StoreInitializer ensures initial state and settings are applied
 * before rendering the app.
 */
export function StoreInitializer({ children }: StoreInitializerProps) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const theme = useThemeStore((state) => state.theme);
  const settings = useAccessibilityStore((state) => state.settings);

  // Apply theme and accessibility settings to DOM
  useEffect(() => {
    // Ensure theme is applied to DOM
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark', 'high-contrast');
      document.documentElement.classList.add(theme);

      // Ensure accessibility settings are applied to DOM
      document.documentElement.style.setProperty('--font-size-base', `${settings.fontSize}px`);
      document.documentElement.style.setProperty('--line-height-base', `${settings.lineHeight}`);
      document.documentElement.style.setProperty('--letter-spacing-base', `${settings.letterSpacing}em`);

      if (settings.reduceMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }

      if (settings.colorBlindMode && settings.colorBlindMode !== 'none') {
        document.documentElement.setAttribute('data-color-blind', settings.colorBlindMode);
      } else {
        document.documentElement.setAttribute('data-color-blind', 'none');
      }
    }
  }, [theme, settings]);

  // Show loading state while Firebase auth is initializing
  if (isLoading !== false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando MindEase...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}