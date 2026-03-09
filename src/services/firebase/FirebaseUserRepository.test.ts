import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestore from 'firebase/firestore';
import { FirebaseUserRepository } from './FirebaseUserRepository';
import { db } from '../../config/firebase';
import { useThemeStore, usePomodoroStore, useAccessibilityStore } from '../../stores';

describe('FirebaseUserRepository', () => {
  const userId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call setDoc at users/{userId}/preferences/settings when saving preferences', async () => {
    const prefs = { theme: 'dark' as const };
    await FirebaseUserRepository.savePreferences(userId, prefs);

    expect(firestore.doc).toHaveBeenCalledWith(db, 'users', userId, 'preferences', 'settings');
    expect(firestore.setDoc).toHaveBeenCalledWith(expect.anything(), prefs, { merge: true });
  });

  it('should call getDoc at users/{userId}/preferences/settings and sync with stores when loading preferences', async () => {
    const mockData = {
      theme: 'dark',
      focusDuration: 30,
      reduceMotion: true
    };

    (firestore.getDoc as any).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockData
    });

    await FirebaseUserRepository.loadPreferences(userId);

    expect(firestore.doc).toHaveBeenCalledWith(db, 'users', userId, 'preferences', 'settings');
    expect(firestore.getDoc).toHaveBeenCalled();
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(usePomodoroStore.getState().focusDuration).toBe(30);
    expect(useAccessibilityStore.getState().settings.reduceMotion).toBe(true);
  });

  it('should setup subscriptions for all stores and sync on changes', () => {
    const unsub = FirebaseUserRepository.setupStoreSubscriptions(userId);
    expect(unsub).toBeDefined();

    // Trigger a store change
    useThemeStore.getState().setTheme('high-contrast');

    expect(firestore.setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ theme: 'high-contrast' }),
      { merge: true }
    );

    unsub();
  });
});
