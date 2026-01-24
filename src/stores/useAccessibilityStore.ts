import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccessibilitySettings {
  fontSize: number; // 12-24px
  lineHeight: number; // 1.2-2.0
  letterSpacing: number; // 0-0.2em
  reduceMotion: boolean;
  highContrast: boolean;
  keyboardNavigation: boolean;
  screenReaderMode: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  reduceMotion: false,
  highContrast: false,
  keyboardNavigation: true,
  screenReaderMode: false,
  colorBlindMode: 'none',
};

interface AccessibilityState {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      updateSettings: (newSettings: Partial<AccessibilitySettings>) => {
        const updatedSettings = { ...get().settings, ...newSettings };
        
        // Apply CSS variables
        document.documentElement.style.setProperty(
          '--font-size-base',
          `${updatedSettings.fontSize}px`
        );
        document.documentElement.style.setProperty(
          '--line-height-base',
          `${updatedSettings.lineHeight}`
        );
        document.documentElement.style.setProperty(
          '--letter-spacing-base',
          `${updatedSettings.letterSpacing}em`
        );

        // Apply motion preference
        if (updatedSettings.reduceMotion) {
          document.documentElement.classList.add('reduce-motion');
        } else {
          document.documentElement.classList.remove('reduce-motion');
        }

        // Apply color blind mode
        document.documentElement.setAttribute(
          'data-color-blind',
          updatedSettings.colorBlindMode
        );

        set({ settings: updatedSettings });
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
        
        // Reset CSS variables
        document.documentElement.style.setProperty('--font-size-base', '16px');
        document.documentElement.style.setProperty('--line-height-base', '1.5');
        document.documentElement.style.setProperty('--letter-spacing-base', '0');
        document.documentElement.classList.remove('reduce-motion');
        document.documentElement.setAttribute('data-color-blind', 'none');
      },
    }),
    {
      name: 'mindease-accessibility',
    }
  )
);

// Initialize accessibility settings on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mindease-accessibility');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.settings) {
        const s = state.settings;
        document.documentElement.style.setProperty('--font-size-base', `${s.fontSize}px`);
        document.documentElement.style.setProperty('--line-height-base', `${s.lineHeight}`);
        document.documentElement.style.setProperty('--letter-spacing-base', `${s.letterSpacing}em`);
        
        if (s.reduceMotion) {
          document.documentElement.classList.add('reduce-motion');
        }
        
        if (s.colorBlindMode && s.colorBlindMode !== 'none') {
          document.documentElement.setAttribute('data-color-blind', s.colorBlindMode);
        }
      }
    } catch (e) {
      console.error('Failed to parse accessibility settings from localStorage', e);
    }
  }
}
