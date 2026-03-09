import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChatStore } from '../stores/useChatStore';
import { FirebaseChatRepository } from '../services/firebase/FirebaseChatRepository';
import { GeminiService } from '../services/ai/GeminiService';
import { useAuthStore } from '../stores/useAuthStore';

// Mock services
vi.mock('../services/firebase/FirebaseChatRepository', () => ({
  FirebaseChatRepository: {
    addMessage: vi.fn(),
    clearHistory: vi.fn(),
    loadHistory: vi.fn(),
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

vi.mock('../services/ai/GeminiService', () => ({
  GeminiService: {
    streamMessage: vi.fn(async (content, cb) => {
        cb('Streamed content');
        return 'Streamed content';
    }),
    clearChat: vi.fn(),
  }
}));

// Mock the firebase config
vi.mock('../config/firebase', () => ({
    db: { type: 'mock-db' },
    auth: { type: 'mock-auth' }
  }));

describe('useChatStore', () => {
  beforeEach(() => {
    // Reset Zustand store
    useChatStore.setState({ 
        messages: [{ id: 'initial', role: 'assistant', content: 'Initial message', timestamp: new Date().toISOString() }], 
        isLoading: false, 
        error: null 
    });
    // Mock authenticated user
    useAuthStore.setState({
      user: { id: 'user-123', email: 'test@test.com' },
      isAuthenticated: true
    });
    vi.clearAllMocks();
  });

  it('should add a message and call FirebaseChatRepository', async () => {
    const messageContent = 'Hello AI';
    const messageId = useChatStore.getState().addMessage(messageContent, 'user');

    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(2); // Initial + New
    expect(state.messages[1].content).toBe(messageContent);
    
    // Check if Firebase was called
    expect(FirebaseChatRepository.addMessage).toHaveBeenCalledWith(
      'user-123',
      expect.objectContaining({ content: messageContent, role: 'user' })
    );
    expect(messageId).toBeDefined();
  });

  it('should append chunk to message', () => {
    useChatStore.setState({
        messages: [{ id: 'msg-1', role: 'assistant', content: 'Hello', timestamp: '...' }]
    });

    useChatStore.getState().appendChunkToMessage('msg-1', ' World');

    const state = useChatStore.getState();
    expect(state.messages[0].content).toBe('Hello World');
  });

  it('should send message stream and update Firebase with final content', async () => {
    await useChatStore.getState().sendMessageStream('How are you?');

    const state = useChatStore.getState();
    // 1 User message + 1 Assistant message added during stream
    expect(state.messages).toHaveLength(3); 
    
    expect(GeminiService.streamMessage).toHaveBeenCalled();
    expect(FirebaseChatRepository.addMessage).toHaveBeenCalledTimes(3); // User message, empty assistant, final assistant
  });

  it('should clear history and reset store', async () => {
    await useChatStore.getState().clearHistory();

    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].content).toContain('Conversa reiniciada');
    expect(FirebaseChatRepository.clearHistory).toHaveBeenCalledWith('user-123');
    expect(GeminiService.clearChat).toHaveBeenCalled();
  });
});
