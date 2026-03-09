import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTasksStore } from '../stores/useTasksStore';
import { FirebaseTaskRepository } from '../services/firebase/FirebaseTaskRepository';
import { useAuthStore } from '../stores/useAuthStore';
import { Task } from '../types/task';

// Mock the FirebaseTaskRepository directly to avoid firestore calls during store tests
vi.mock('../services/firebase/FirebaseTaskRepository', () => ({
  FirebaseTaskRepository: {
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    subscribeToTasks: vi.fn((uid, cb) => vi.fn()),
  }
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

vi.mock('../services/firebase/FirebaseAuthService', () => ({
    FirebaseAuthService: {
        init: vi.fn(),
    }
}));

// Mock the firebase config
vi.mock('../config/firebase', () => ({
    db: { type: 'mock-db' },
    auth: { type: 'mock-auth' }
}));

describe('useTasksStore', () => {
  beforeEach(() => {
    // Reset Zustand store
    useTasksStore.setState({ tasks: [], error: null, isLoading: false });
    // Mock authenticated user
    useAuthStore.setState({
      user: { id: 'user-123', email: 'test@test.com' },
      isAuthenticated: true
    });
    vi.clearAllMocks();
  });

  it('should add a task and call FirebaseTaskRepository', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high' as const,
      completed: false,
      subTasks: []
    };

    await useTasksStore.getState().addTask(taskData);

    const state = useTasksStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].title).toBe('Test Task');
    
    // Check if Firebase was called
    expect(FirebaseTaskRepository.addTask).toHaveBeenCalledWith(
      'user-123',
      expect.objectContaining({ title: 'Test Task' })
    );
  });

  it('should toggle a task and update Firebase', async () => {
    const initialTask: Task = {
      id: 'task-1',
      title: 'Task 1',
      description: '',
      priority: 'low' as const,
      completed: false,
      subTasks: [],
      createdAt: new Date().toISOString()
    };
    
    useTasksStore.setState({ tasks: [initialTask] });

    await useTasksStore.getState().toggleTask('task-1');

    const state = useTasksStore.getState();
    expect(state.tasks[0].completed).toBe(true);
    expect(FirebaseTaskRepository.updateTask).toHaveBeenCalledWith(
      'user-123',
      'task-1',
      expect.objectContaining({ completed: true })
    );
  });

  it('should delete a task and update Firebase', async () => {
    const initialTask: Task = {
        id: 'task-1',
        title: 'Task 1',
        description: '',
        priority: 'low' as const,
        completed: false,
        subTasks: [],
        createdAt: new Date().toISOString()
      };
      
      useTasksStore.setState({ tasks: [initialTask] });
  
      await useTasksStore.getState().deleteTask('task-1');
  
      const state = useTasksStore.getState();
      expect(state.tasks).toHaveLength(0);
      expect(FirebaseTaskRepository.deleteTask).toHaveBeenCalledWith('user-123', 'task-1');
  });
});
