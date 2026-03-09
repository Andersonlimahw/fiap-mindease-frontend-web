import { create } from 'zustand';
import { FirebaseAuthService } from '../services/firebase/FirebaseAuthService';
import { FirebaseUserRepository } from '../services/firebase/FirebaseUserRepository';
import { FirebaseTaskRepository } from '../services/firebase/FirebaseTaskRepository';
import { FirebaseChatRepository } from '../services/firebase/FirebaseChatRepository';
import { useTasksStore } from './useTasksStore';

interface AuthState {
  isAuthenticated: boolean;
  isLoading?: boolean;
  user: {
    id: string; // Alterado de uid para id para seguir o padrão Mobile
    email: string;
    name?: string;
    photoUrl?: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

// Global subscriptions cleanup
let unsubscribeStore: () => void;
let unsubscribeTasks: () => void;

export const useAuthStore = create<AuthState>()(
  (set) => ({
    isAuthenticated: false,
    isLoading: true,
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
  })
);


// Initialize remote listener to sync Firebase user state with Zustand
FirebaseAuthService.init();

// Use a more robust check for authentication status
let lastId: string | null = null;

useAuthStore.subscribe((state) => {
  const currentId = state.isAuthenticated ? state.user?.id : null;
  
  if (currentId && currentId !== lastId) {
    console.log('useAuthStore: User authenticated, initializing data for', currentId);
    lastId = currentId;
    
    // 1. Load User Preferences
    FirebaseUserRepository.loadPreferences(currentId);
    
    // 2. Setup save subscriptions for subsequent changes
    if (unsubscribeStore) unsubscribeStore();
    unsubscribeStore = FirebaseUserRepository.setupStoreSubscriptions(currentId);
    
    // 3. Subscribe to tasks
    if (unsubscribeTasks) unsubscribeTasks();
    unsubscribeTasks = FirebaseTaskRepository.subscribeToTasks(currentId, (tasks) => {
        // Use the intelligent merge logic
        useTasksStore.getState().syncFromFirebase(tasks);
    });
    
    // 4. Load Chat History
    FirebaseChatRepository.loadHistory(currentId);
  } else if (!currentId && lastId) {
    console.log('useAuthStore: User logged out, cleaning up');
    lastId = null;
    if (unsubscribeStore) unsubscribeStore();
    if (unsubscribeTasks) unsubscribeTasks();
  }
});
