import { create } from 'zustand';

export type Screen = 'login' | 'dashboard' | 'settings' | 'focus' | 'tasks' | 'reader' | 'pomodoro' | 'chat' | 'mobile';

const VALID_SCREENS: Screen[] = ['login', 'dashboard', 'settings', 'focus', 'tasks', 'reader', 'pomodoro', 'chat', 'mobile'];

const getScreenFromHash = (): Screen => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return VALID_SCREENS.includes(hash as Screen) ? (hash as Screen) : 'login';
};

const setHash = (screen: Screen) => {
  window.location.hash = `/${screen}`;
};

interface NavigationState {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  history: Screen[];
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentScreen: getScreenFromHash(),
  history: [],

  navigate: (screen: Screen) => {
    const { currentScreen, history } = get();
    setHash(screen);
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
      const screen = previousScreen || 'dashboard';
      setHash(screen);
      set({
        currentScreen: screen,
        history: newHistory,
      });
    }
  },
}));

// Sincroniza mudanças de hash (ex: botão voltar do browser) com o store
window.addEventListener('hashchange', () => {
  const screen = getScreenFromHash();
  const { currentScreen, history } = useNavigationStore.getState();
  if (screen !== currentScreen) {
    useNavigationStore.setState({
      currentScreen: screen,
      history: [...history, currentScreen],
    });
  }
});
