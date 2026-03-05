import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FirebaseAuthService } from '../services/firebase/FirebaseAuthService';
import { FirebaseUserRepository } from '../services/firebase/FirebaseUserRepository';
import { FirebaseTaskRepository } from '../services/firebase/FirebaseTaskRepository';
import { FirebaseChatRepository } from '../services/firebase/FirebaseChatRepository';

interface AuthState {
  isAuthenticated: boolean;
  isLoading?: boolean;
  user: {
    uid: string;
    email: string;
    name?: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

// Global subscriptions cleanup
let unsubscribeStore: () => void;
let unsubscribeTasks: () => void;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      loginWithGoogle: async () => {
        await FirebaseAuthService.loginWithGoogle();
      },

      login: async (email: string, password: string) => {
        // Use Firebase Auth Adapter
        await FirebaseAuthService.login(email, password);
      },

      logout: async () => {
        await FirebaseAuthService.logout();

        // Cleanup subscriptions
        if (unsubscribeStore) unsubscribeStore();
        if (unsubscribeTasks) unsubscribeTasks();

        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'mindease-auth',
      partialize: (state) => ({
        // We persist isAuthenticated state temporarily for optimistic UI, 
        // but the source of truth is the FirebaseAuthService.init listener.
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// Initialize remote listener to sync Firebase user state with Zustand
FirebaseAuthService.init();

// When user value changes to authenticated, setup their data
useAuthStore.subscribe((state, prevState) => {
  if (state.isAuthenticated && state.user?.uid && !prevState.isAuthenticated) {
    const uid = state.user.uid;
    // 1. Load User Preferences
    FirebaseUserRepository.loadPreferences(uid);
    // 2. Setup save subscriptions for subsequent changes
    unsubscribeStore = FirebaseUserRepository.setupStoreSubscriptions(uid);
    // 3. Subscribe to tasks
    unsubscribeTasks = FirebaseTaskRepository.subscribeToTasks(uid);
    // 4. Load Chat History
    FirebaseChatRepository.loadHistory(uid);
  }
});
