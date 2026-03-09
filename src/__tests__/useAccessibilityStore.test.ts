import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAccessibilityStore } from '../stores/useAccessibilityStore';

describe('useAccessibilityStore', () => {
  beforeEach(() => {
    // Reset Zustand store
    useAccessibilityStore.getState().resetSettings();
    vi.clearAllMocks();
  });

  it('should initialize with default settings', () => {
    const state = useAccessibilityStore.getState();
    expect(state.settings.fontSize).toBe(16);
    expect(state.settings.reduceMotion).toBe(false);
  });

  it('should update settings and apply to document', () => {
    const mockSetProperty = vi.fn();
    const mockAdd = vi.fn();
    const mockRemove = vi.fn();
    const mockSetAttribute = vi.fn();

    vi.stubGlobal('document', {
      documentElement: {
        style: { setProperty: mockSetProperty },
        classList: { add: mockAdd, remove: mockRemove },
        setAttribute: mockSetAttribute
      }
    });

    useAccessibilityStore.getState().updateSettings({ fontSize: 20, reduceMotion: true, colorBlindMode: 'protanopia' });

    const state = useAccessibilityStore.getState();
    expect(state.settings.fontSize).toBe(20);
    expect(state.settings.reduceMotion).toBe(true);
    expect(state.settings.colorBlindMode).toBe('protanopia');
    
    expect(mockSetProperty).toHaveBeenCalledWith('--font-size-base', '20px');
    expect(mockAdd).toHaveBeenCalledWith('reduce-motion');
    expect(mockSetAttribute).toHaveBeenCalledWith('data-color-blind', 'protanopia');

    vi.unstubAllGlobals();
  });

  it('should reset settings', () => {
    useAccessibilityStore.getState().updateSettings({ fontSize: 20 });
    useAccessibilityStore.getState().resetSettings();

    const state = useAccessibilityStore.getState();
    expect(state.settings.fontSize).toBe(16);
  });
});
