import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name?: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (email: string, _password: string) => {
        // Mock authentication - Replace with real API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set({
          isAuthenticated: true,
          user: {
            email,
            name: email.split('@')[0],
          },
        });
      },

      logout: () => {
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
