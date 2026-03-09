import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFocusModeStore } from '../stores/useFocusModeStore';

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

describe('useFocusModeStore', () => {
  beforeEach(() => {
    // Reset store to default
    useFocusModeStore.setState({
      isActive: false,
      duration: 25,
      timeLeft: 25 * 60,
      isRunning: false,
      ambientSound: 'none',
      dimBrightness: false,
      blockNotifications: true,
    });
    vi.clearAllMocks();
  });

  it('should activate and deactivate focus mode', () => {
    // Mock classList
    const mockAdd = vi.fn();
    const mockRemove = vi.fn();
    vi.stubGlobal('document', {
      body: {
        classList: {
          add: mockAdd,
          remove: mockRemove
        }
      }
    });

    useFocusModeStore.getState().activate();
    expect(useFocusModeStore.getState().isActive).toBe(true);
    expect(mockAdd).toHaveBeenCalledWith('focus-mode-active');
    
    useFocusModeStore.getState().deactivate();
    expect(useFocusModeStore.getState().isActive).toBe(false);
    expect(mockRemove).toHaveBeenCalledWith('focus-mode-active');

    vi.unstubAllGlobals();
  });

  it('should start and pause the timer', () => {
    useFocusModeStore.getState().start();
    expect(useFocusModeStore.getState().isRunning).toBe(true);
    
    useFocusModeStore.getState().pause();
    expect(useFocusModeStore.getState().isRunning).toBe(false);
  });

  it('should tick correctly', () => {
    useFocusModeStore.setState({ isRunning: true, timeLeft: 60 });
    useFocusModeStore.getState().tick();
    
    const state = useFocusModeStore.getState();
    expect(state.timeLeft).toBe(59);
  });

  it('should update settings', () => {
    useFocusModeStore.getState().setDuration(30);
    useFocusModeStore.getState().setAmbientSound('rain');
    useFocusModeStore.getState().setDimBrightness(true);
    useFocusModeStore.getState().setBlockNotifications(false);
    
    const state = useFocusModeStore.getState();
    expect(state.duration).toBe(30);
    expect(state.ambientSound).toBe('rain');
    expect(state.dimBrightness).toBe(true);
    expect(state.blockNotifications).toBe(false);
  });
});
