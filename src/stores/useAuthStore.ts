import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FirebaseAuthService } from '../services/firebase/FirebaseAuthService';
import { FirebaseUserRepository } from '../services/firebase/FirebaseUserRepository';
import { FirebaseTaskRepository } from '../services/firebase/FirebaseTaskRepository';
import { FirebaseChatRepository } from '../services/firebase/FirebaseChatRepository';
import { useTasksStore } from './useTasksStore';

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
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// Initialize remote listener to sync Firebase user state with Zustand
FirebaseAuthService.init();

// Use a more robust check for authentication status
let lastUid: string | null = null;

useAuthStore.subscribe((state) => {
  const currentUid = state.isAuthenticated ? state.user?.uid : null;
  
  if (currentUid && currentUid !== lastUid) {
    console.log('useAuthStore: User authenticated, initializing data for', currentUid);
    lastUid = currentUid;
    
    // 1. Load User Preferences
    FirebaseUserRepository.loadPreferences(currentUid);
    
    // 2. Setup save subscriptions for subsequent changes
    if (unsubscribeStore) unsubscribeStore();
    unsubscribeStore = FirebaseUserRepository.setupStoreSubscriptions(currentUid);
    
    // 3. Subscribe to tasks
    if (unsubscribeTasks) unsubscribeTasks();
    unsubscribeTasks = FirebaseTaskRepository.subscribeToTasks(currentUid, (tasks) => {
        // Use the intelligent merge logic
        useTasksStore.getState().syncFromFirebase(tasks);
    });
    
    // 4. Load Chat History
    FirebaseChatRepository.loadHistory(currentUid);
  } else if (!currentUid && lastUid) {
    console.log('useAuthStore: User logged out, cleaning up');
    lastUid = null;
    if (unsubscribeStore) unsubscribeStore();
    if (unsubscribeTasks) unsubscribeTasks();
  }
});
