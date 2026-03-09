import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useThemeStore } from '../stores/useThemeStore';

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset Zustand store
    useThemeStore.setState({ theme: 'light' });
    vi.clearAllMocks();
  });

  it('should initialize with default value light', () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBe('light');
  });

  it('should change theme and apply to document classList', () => {
    // Mock classList.add and remove
    const mockAdd = vi.fn();
    const mockRemove = vi.fn();
    
    vi.stubGlobal('document', {
      documentElement: {
        classList: {
          add: mockAdd,
          remove: mockRemove
        }
      }
    });

    useThemeStore.getState().setTheme('dark');

    const state = useThemeStore.getState();
    expect(state.theme).toBe('dark');
    expect(mockRemove).toHaveBeenCalledWith('light', 'dark', 'high-contrast');
    expect(mockAdd).toHaveBeenCalledWith('dark');

    vi.unstubAllGlobals();
  });
});
