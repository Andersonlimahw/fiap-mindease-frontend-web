import { create } from 'zustand';

export type Screen = 'login' | 'dashboard' | 'settings' | 'focus' | 'tasks' | 'reader' | 'pomodoro' | 'chat';

interface NavigationState {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  history: Screen[];
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentScreen: 'login',
  history: [],

  navigate: (screen: Screen) => {
    const { currentScreen, history } = get();
    set({
      currentScreen: screen,
      history: [...history, currentScreen],
    });
  },

  goBack: () => {
    const { history } = get();
    if (history.length > 0) {
      const newHistory = [...history];
      const previousScreen = newHistory.pop();
      set({
        currentScreen: previousScreen || 'dashboard',
        history: newHistory,
      });
    }
  },
}));
