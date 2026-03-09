import { create } from 'zustand';

export type PomodoroMode = 'focus' | 'short-break' | 'long-break';

interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  completedSessions: number;
  totalFocusTime: number; // in seconds
  
  // Settings
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
  
  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  setMode: (mode: PomodoroMode) => void;
  updateSettings: (settings: Partial<{
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
  }>) => void;
}

const DEFAULT_FOCUS = 25;
const DEFAULT_SHORT_BREAK = 5;
const DEFAULT_LONG_BREAK = 15;
const DEFAULT_SESSIONS = 4;

export const usePomodoroStore = create<PomodoroState>()(
  (set, get) => ({
    mode: 'focus',
    timeLeft: DEFAULT_FOCUS * 60,
    isRunning: false,
    completedSessions: 0,
    totalFocusTime: 0,
    focusDuration: DEFAULT_FOCUS,
    shortBreakDuration: DEFAULT_SHORT_BREAK,
    longBreakDuration: DEFAULT_LONG_BREAK,
    sessionsUntilLongBreak: DEFAULT_SESSIONS,

    start: () => set({ isRunning: true }),
    
    pause: () => set({ isRunning: false }),
    
    reset: () => {
      const { mode, focusDuration, shortBreakDuration, longBreakDuration } = get();
      const duration = 
        mode === 'focus' ? focusDuration :
        mode === 'short-break' ? shortBreakDuration :
        longBreakDuration;
      
      set({
        timeLeft: duration * 60,
        isRunning: false,
      });
    },
    
    skip: () => {
      const { mode, completedSessions, sessionsUntilLongBreak } = get();
      
      if (mode === 'focus') {
        const newSessions = completedSessions + 1;
        const shouldLongBreak = newSessions % sessionsUntilLongBreak === 0;
        
        set({
          mode: shouldLongBreak ? 'long-break' : 'short-break',
          timeLeft: shouldLongBreak ? get().longBreakDuration * 60 : get().shortBreakDuration * 60,
          completedSessions: newSessions,
          isRunning: false,
        });
      } else {
        set({
          mode: 'focus',
          timeLeft: get().focusDuration * 60,
          isRunning: false,
        });
      }
    },
    
    tick: () => {
      const { timeLeft, isRunning, mode } = get();
      
      if (!isRunning || timeLeft <= 0) return;
      
      const newTimeLeft = timeLeft - 1;
      
      // Track focus time
      if (mode === 'focus') {
        set((state) => ({
          totalFocusTime: state.totalFocusTime + 1,
        }));
      }
      
      if (newTimeLeft <= 0) {
        get().skip();
        
        // Play sound notification
        if (typeof window !== 'undefined' && 'Audio' in window) {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIHm3A7cuOOQkRU6vo9blLDAA2k9j0yXQkBSl+zPLaizsKE1626/G/bx0ENo/Y89N5LgUmesz01Ik0ChRgrOr1vmEcBTqO2fXMdywFJ3vN9deNPwoTW7Lq9b5uHgU6jNn1zHgsBy17zvXVikAHGWa46/K+bx4ENo/Y89V4LgUme8321IlACxhltun1wm8dBTmO2fXMeCwHLnzO9NSKPwoTXrLq9b5uHQU6jdn1y3gsBy17zvXUiz8KE1ux6va+bx4FOIzZ9cx4KwUtfM710otAChdmten1wmweBS+ByPXWi0AGGWe56/O+bh4FNY7Z9Mx3KwUrfc721ItBBxdpuuv1wm8eBTSN2fXMdysFK37P9dOLPwoWZ7rr9cJuHgUzjdn1zHcsBS1+z/XUi0AHF2i56/XDbh0ENYzZ9cx3KwUtfM710YtAChdnuer1wm4eBTSM2fXMdisGLXzP9dSLPwoVaLnq9cNuHQUzjdn1zHYqBi18z/XUikAHGGa56/XDbhwFM4zZ9cx2KgYtfM/11IpABxdmuer1wm4dBTKM2fXMdisFLXzO9dSKQAcXZrnr9cJuHQUyjNn1zHYqBi18zvXUij8HGGa56/XCbhwFM4vZ9s12KgYtfM710YtABxhouev1wm0eBTSL2vbNdioGLXvO9dGLQQcWZ7nr9cJuHQUzi9r2zXUqBi18zvXRi0EHFma56/XCbh0FM4vZ9cx1KwYte8711YlACBZmuev1wm4cBTOL2fbMdSsGLXvP9dWJQQcVaLnr9cNuHAU0i9n2zHQqBi57z/XUikAHF2e56/XCbhwFM4vZ9sx0KgYte8/11IpABxdnuev1wm0cBTSL2fbMdCoGLXvO9dSJQAcWZ7nr9cJuHAU0i9n2zHQqBi17z/XUiUAHFme56/XCbhsGNIvZ9sx0KgYte8/11IlABxdouev1wm0cBTOL2fbMdCoGLXvP9dSJPwcXaLnr9cNuGwYzi9n2zHQqBi17z/XUiT8HF2e56/XDbhsGM4vZ9sx0KgYue8/11IlABxdnuev1wm0cBTOL2fbMdSoGLXrP9dSJPwcXZ7nr9cNuGwY0i9n2zHQpBi17z/XUiT8HF2e56/XDbhoGNIvZ9sx0KgYte8/11Ik/BxdmueP1w24bBjSL2PbMdCoGLXvP9dOJPwcXZ7nr9cNuGwY0i9n2zHQqBi17z/XUiT8GF2e46/XDbhsGNIvZ9sx0KgYte8/104k/BxdnuOv1w24aBjSL2fbMdCoGLnvP9dOJPwcWZ7nr9cNuGwY0i9j2zHUpBi57z/XTiT4HFma56/XDbhoGNYvZ9sx1KQYte8/104k+BxZmuuv1w20aBjSL2fbMdSkGLXvP9dOJPgcWZ7nr9cNuGQY1i9n2zHUpBi17z/XTiT4HFme56/XDbhkGNYvY9sx1KQYte8/104k+BxZnuev1w20ZBjSL2PbMdSkFLnvP9dOJPgcWZ7nr9cJuGQY1i9j2zHUpBi17z/XTiT4HFme56/XDbhkGNYvY9sx1KQYte8/104k+BxVnueP1w24ZBjWL2PbMdSkGLXvP9dOJPgcVaLnr9cNuGQY1i9j2zHUpBi17z/XTiT4HFWe56/XDbhkGNYvZ9sx1KQYte8/104k+BxVnuer1wm4ZBjWL2PbMdSkGLXvP9dOJPgcVZ7nq9cNuGQU2i9j2y3UqBi57z/XTiT4HFWe56/XCbhkGNYvZ9sx1KQYte8/104k+BxZnuer1wm4ZBjSL2fb');
            audio.play();
          } catch (e) {
            console.error('Failed to play notification sound', e);
          }
        }
      } else {
        set({ timeLeft: newTimeLeft });
      }
    },
    
    setMode: (mode: PomodoroMode) => {
      const { focusDuration, shortBreakDuration, longBreakDuration } = get();
      const duration = 
        mode === 'focus' ? focusDuration :
        mode === 'short-break' ? shortBreakDuration :
        longBreakDuration;
      
      set({
        mode,
        timeLeft: duration * 60,
        isRunning: false,
      });
    },
    
    updateSettings: (settings) => {
      set(settings);
      
      // Reset timer with new duration if not running
      const { mode, isRunning } = get();
      if (!isRunning) {
        get().reset();
      }
    },
  })
);
