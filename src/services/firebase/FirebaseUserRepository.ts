import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { usePomodoroStore } from '../../stores/usePomodoroStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useAccessibilityStore } from '../../stores/useAccessibilityStore';

interface UserPreferences {
    // Pomodoro
    completedSessions?: number;
    totalFocusTime?: number;
    focusDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
    sessionsUntilLongBreak?: number;

    // Theme
    theme?: 'light' | 'dark' | 'system' | 'high-contrast';
    isHighContrast?: boolean;
    colorBlindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

    // Accessibility
    reduceMotion?: boolean;
}

export const FirebaseUserRepository = {
    /**
     * Save user preferences to Firestore
     */
    savePreferences: async (userId: string, preferences: Partial<UserPreferences>) => {
        if (!userId) return;

        try {
            const userRef = doc(db, 'users', userId, 'preferences', 'settings');
            await setDoc(userRef, preferences, { merge: true });
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    },

    /**
     * Load user preferences from Firestore and sync with Zustand stores
     */
    loadPreferences: async (userId: string) => {
        if (!userId) return;

        try {
            const userRef = doc(db, 'users', userId, 'preferences', 'settings');
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as UserPreferences;

                // Sync Pomodoro
                if (data.focusDuration !== undefined) {
                    usePomodoroStore.getState().updateSettings({
                        focusDuration: data.focusDuration,
                        shortBreakDuration: data.shortBreakDuration,
                        longBreakDuration: data.longBreakDuration,
                        sessionsUntilLongBreak: data.sessionsUntilLongBreak,
                    });
                }

                if (data.completedSessions !== undefined) {
                    usePomodoroStore.setState({
                        completedSessions: data.completedSessions,
                        totalFocusTime: data.totalFocusTime || 0
                    });
                }

                // Sync Theme
                if (data.theme && ['light', 'dark', 'high-contrast'].includes(data.theme)) {
                    useThemeStore.getState().setTheme(data.theme as any);
                }

                // Sync Accessibility
                if (data.reduceMotion !== undefined) {
                    useAccessibilityStore.getState().updateSettings({ reduceMotion: data.reduceMotion });
                }
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
        }
    },

    /**
     * Sync stores to Firebase when they change
     */
    setupStoreSubscriptions: (userId: string) => {
        if (!userId) return () => { };

        // Subscribe to Pomodoro settings changes
        const unsubPomodoro = usePomodoroStore.subscribe((state, prevState) => {
            // Only save if settings or statistics changed
            if (
                state.focusDuration !== prevState.focusDuration ||
                state.shortBreakDuration !== prevState.shortBreakDuration ||
                state.longBreakDuration !== prevState.longBreakDuration ||
                state.sessionsUntilLongBreak !== prevState.sessionsUntilLongBreak ||
                state.completedSessions !== prevState.completedSessions ||
                state.totalFocusTime !== prevState.totalFocusTime
            ) {
                FirebaseUserRepository.savePreferences(userId, {
                    focusDuration: state.focusDuration,
                    shortBreakDuration: state.shortBreakDuration,
                    longBreakDuration: state.longBreakDuration,
                    sessionsUntilLongBreak: state.sessionsUntilLongBreak,
                    completedSessions: state.completedSessions,
                    totalFocusTime: state.totalFocusTime
                });
            }
        });

        // Subscribe to Theme changes
        const unsubTheme = useThemeStore.subscribe((state, prevState) => {
            if (
                state.theme !== prevState.theme
            ) {
                FirebaseUserRepository.savePreferences(userId, {
                    theme: state.theme
                });
            }
        });

        // Subscribe to Accessibility changes
        const unsubA11y = useAccessibilityStore.subscribe((state, prevState) => {
            if (state.settings.reduceMotion !== prevState.settings.reduceMotion) {
                FirebaseUserRepository.savePreferences(userId, {
                    reduceMotion: state.settings.reduceMotion
                });
            }
        });

        return () => {
            unsubPomodoro();
            unsubTheme();
            unsubA11y();
        };
    }
};
