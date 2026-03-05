import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseTaskRepository } from './FirebaseTaskRepository';
import { setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Mock firestore functions
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn((...args) => ({ id: args[args.length - 1], args })),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
}));

// Mock the firebase config to provide a mock db object
vi.mock('../../config/firebase', () => ({
  db: { type: 'mock-db' }
}));

import { db } from '../../config/firebase';

describe('FirebaseTaskRepository', () => {
  const userId = 'user-123';
  const task = {
    id: 'task-1',
    title: 'Test Task',
    description: '',
    priority: 'medium' as const,
    completed: false,
    subTasks: [],
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call setDoc when adding a task', async () => {
    await FirebaseTaskRepository.addTask(userId, task);
    
    expect(doc).toHaveBeenCalledWith(db, 'users', userId, 'tasks', task.id);
    expect(setDoc).toHaveBeenCalled();
  });

  it('should call updateDoc when updating a task', async () => {
    const updates = { completed: true };
    await FirebaseTaskRepository.updateTask(userId, task.id, updates);
    
    expect(doc).toHaveBeenCalledWith(db, 'users', userId, 'tasks', task.id);
    expect(updateDoc).toHaveBeenCalled();
  });

  it('should call deleteDoc when deleting a task', async () => {
    await FirebaseTaskRepository.deleteTask(userId, task.id);
    
    expect(doc).toHaveBeenCalledWith(db, 'users', userId, 'tasks', task.id);
    expect(deleteDoc).toHaveBeenCalled();
  });
});
