import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseTaskRepository } from './FirebaseTaskRepository';
import { collection, setDoc, doc, updateDoc, deleteDoc, onSnapshot, orderBy, query } from 'firebase/firestore';

// Mock firestore functions
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn((...args) => ({ path: args.slice(1).join('/') })),
  doc: vi.fn((...args) => ({ id: args[args.length - 1], args })),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn((...args) => args[0]),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn(() => ({ type: 'serverTimestamp' })),
  deleteField: vi.fn(() => ({ type: 'deleteField' })),
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

  it('should call setDoc inside users/{userId}/tasks subcollection when adding a task', async () => {
    await FirebaseTaskRepository.addTask(userId, task);

    expect(collection).toHaveBeenCalledWith(db, 'users', userId, 'tasks');
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId,
        title: task.title,
        createdAt: { type: 'serverTimestamp' },
      }),
    );
    // id and expanded should NOT be stored
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.not.objectContaining({ id: task.id }),
    );
  });

  it('should call updateDoc inside users/{userId}/tasks subcollection when updating a task', async () => {
    const updates = { completed: true };
    await FirebaseTaskRepository.updateTask(userId, task.id, updates);

    expect(collection).toHaveBeenCalledWith(db, 'users', userId, 'tasks');
    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ completed: true }),
    );
  });

  it('should use deleteField() for completedAt when uncompleting a task', async () => {
    const updates = { completed: false, completedAt: undefined };
    await FirebaseTaskRepository.updateTask(userId, task.id, updates);

    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ completedAt: { type: 'deleteField' } }),
    );
  });

  it('should call deleteDoc inside users/{userId}/tasks subcollection when deleting a task', async () => {
    await FirebaseTaskRepository.deleteTask(userId, task.id);

    expect(collection).toHaveBeenCalledWith(db, 'users', userId, 'tasks');
    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
  });

  it('should subscribe to users/{userId}/tasks subcollection with orderBy', () => {
    const unsubscribeMock = vi.fn();
    (onSnapshot as any).mockReturnValue(unsubscribeMock);

    const unsub = FirebaseTaskRepository.subscribeToTasks(userId, vi.fn());

    expect(collection).toHaveBeenCalledWith(db, 'users', userId, 'tasks');
    expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(onSnapshot).toHaveBeenCalled();
    expect(typeof unsub).toBe('function');
  });
});
