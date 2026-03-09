import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePomodoroStore } from '../stores/usePomodoroStore';

// Mock the firebase config
vi.mock('../config/firebase', () => ({
    db: { type: 'mock-db' },
    auth: { type: 'mock-auth' }
}));

// Mock repositories to avoid circular dependency issues during store init
vi.mock('../services/firebase/FirebaseChatRepository', () => ({
    FirebaseChatRepository: {
        loadHistory: vi.fn(),
        addMessage: vi.fn(),
    }
}));

vi.mock('../services/firebase/FirebaseUserRepository', () => ({
    FirebaseUserRepository: {
        loadPreferences: vi.fn(),
        setupStoreSubscriptions: vi.fn(() => vi.fn()),
    }
}));

vi.mock('../services/firebase/FirebaseTaskRepository', () => ({
    FirebaseTaskRepository: {
        subscribeToTasks: vi.fn(() => vi.fn()),
        addTask: vi.fn(),
    }
}));

vi.mock('../services/firebase/FirebaseAuthService', () => ({
    FirebaseAuthService: {
        init: vi.fn(),
    }
}));

describe('usePomodoroStore', () => {
  beforeEach(() => {
    // Reset store to default
    usePomodoroStore.setState({
      mode: 'focus',
      timeLeft: 25 * 60,
      isRunning: false,
      completedSessions: 0,
      totalFocusTime: 0,
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
    });
    vi.clearAllMocks();
  });

  it('should start and pause the timer', () => {
    usePomodoroStore.getState().start();
    expect(usePomodoroStore.getState().isRunning).toBe(true);
    
    usePomodoroStore.getState().pause();
    expect(usePomodoroStore.getState().isRunning).toBe(false);
  });

  it('should reset the timer', () => {
    usePomodoroStore.setState({ timeLeft: 100 });
    usePomodoroStore.getState().reset();
    expect(usePomodoroStore.getState().timeLeft).toBe(25 * 60);
  });

  it('should tick correctly in focus mode', () => {
    usePomodoroStore.setState({ isRunning: true, mode: 'focus', timeLeft: 60, totalFocusTime: 0 });
    usePomodoroStore.getState().tick();
    
    const state = usePomodoroStore.getState();
    expect(state.timeLeft).toBe(59);
    expect(state.totalFocusTime).toBe(1);
  });

  it('should skip to break after focus', () => {
    usePomodoroStore.setState({ mode: 'focus', completedSessions: 0, sessionsUntilLongBreak: 4 });
    usePomodoroStore.getState().skip();
    
    const state = usePomodoroStore.getState();
    expect(state.mode).toBe('short-break');
    expect(state.completedSessions).toBe(1);
    expect(state.timeLeft).toBe(5 * 60);
  });

  it('should skip to long break after enough focus sessions', () => {
    usePomodoroStore.setState({ mode: 'focus', completedSessions: 3, sessionsUntilLongBreak: 4 });
    usePomodoroStore.getState().skip();
    
    const state = usePomodoroStore.getState();
    expect(state.mode).toBe('long-break');
    expect(state.completedSessions).toBe(4);
    expect(state.timeLeft).toBe(15 * 60);
  });

  it('should update settings and reset timer if not running', () => {
    usePomodoroStore.getState().updateSettings({ focusDuration: 30 });
    const state = usePomodoroStore.getState();
    expect(state.focusDuration).toBe(30);
    expect(state.timeLeft).toBe(30 * 60);
  });
});
