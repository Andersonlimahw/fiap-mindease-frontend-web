import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/useAuthStore';
import { FirebaseAuthService } from '../services/firebase/FirebaseAuthService';
import { FirebaseUserRepository } from '../services/firebase/FirebaseUserRepository';
import { FirebaseTaskRepository } from '../services/firebase/FirebaseTaskRepository';
import { FirebaseChatRepository } from '../services/firebase/FirebaseChatRepository';

// Mock services
vi.mock('../services/firebase/FirebaseAuthService', () => ({
  FirebaseAuthService: {
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    init: vi.fn(),
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
  }
}));

vi.mock('../services/firebase/FirebaseChatRepository', () => ({
  FirebaseChatRepository: {
    loadHistory: vi.fn(),
  }
}));

// Mock the firebase config
vi.mock('../config/firebase', () => ({
    db: { type: 'mock-db' },
    auth: { type: 'mock-auth' }
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
  });

  it('should call FirebaseAuthService.login when login is called', async () => {
    await useAuthStore.getState().login('test@test.com', 'password');
    expect(FirebaseAuthService.login).toHaveBeenCalledWith('test@test.com', 'password');
  });

  it('should call FirebaseAuthService.loginWithGoogle when loginWithGoogle is called', async () => {
    await useAuthStore.getState().loginWithGoogle();
    expect(FirebaseAuthService.loginWithGoogle).toHaveBeenCalled();
  });

  it('should cleanup and reset state when logout is called', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: 'user-123', email: 'test@test.com' }
    });

    await useAuthStore.getState().logout();

    expect(FirebaseAuthService.logout).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
  });

  it('should trigger initialization logic when user becomes authenticated', async () => {
    // This tests the subscriber logic in useAuthStore.ts
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: 'user-123', email: 'test@test.com' }
    });

    // Wait a bit for the subscriber to run
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(FirebaseUserRepository.loadPreferences).toHaveBeenCalledWith('user-123');
    expect(FirebaseUserRepository.setupStoreSubscriptions).toHaveBeenCalledWith('user-123');
    expect(FirebaseTaskRepository.subscribeToTasks).toHaveBeenCalledWith('user-123', expect.any(Function));
    expect(FirebaseChatRepository.loadHistory).toHaveBeenCalledWith('user-123');
  });
});
