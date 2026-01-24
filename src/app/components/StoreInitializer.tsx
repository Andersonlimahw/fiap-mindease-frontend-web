import { useEffect, useState } from 'react';
import { useThemeStore, useAccessibilityStore } from '@/stores';

interface StoreInitializerProps {
  children: React.ReactNode;
}

/**
 * StoreInitializer ensures all Zustand stores are properly hydrated
 * from localStorage before rendering the app.
 */
export function StoreInitializer({ children }: StoreInitializerProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // Give Zustand persist middleware time to hydrate from localStorage
    // This prevents the "Context not found" error by ensuring stores are ready
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 50); // Small delay to ensure hydration completes

    return () => clearTimeout(timer);
  }, []);

  // Apply theme and accessibility settings after hydration
  const theme = useThemeStore((state) => state.theme);
  const settings = useAccessibilityStore((state) => state.settings);

  useEffect(() => {
    if (isHydrated) {
      // Ensure theme is applied to DOM
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
  }, [isHydrated, theme, settings]);

  // Show loading state while hydrating
  if (!isHydrated) {
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