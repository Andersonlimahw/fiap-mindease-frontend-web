import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestore from 'firebase/firestore';
import { FirebaseChatRepository } from './FirebaseChatRepository';
import { db } from '../../config/firebase';
import { useChatStore } from '../../stores/useChatStore';

describe('FirebaseChatRepository', () => {
  const userId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.setState({ messages: [] });
    // collection mock returns an object with path info for assertions
    (firestore.collection as any).mockImplementation((...args: string[]) => ({
      path: args.slice(1).join('/'),
    }));
  });

  it('should query users/{userId}/chats subcollection when loading history', async () => {
    const mockMessages = [
      { id: '1', role: 'user', content: 'Hi', timestamp: '2023-01-01T00:00:00Z' }
    ];

    (firestore.getDocs as any).mockResolvedValueOnce({
      docs: mockMessages.map(m => ({
        id: m.id,
        data: () => ({ ...m })
      })),
      forEach: function(cb: any) { this.docs.forEach(cb); }
    });

    await FirebaseChatRepository.loadHistory(userId);

    expect(firestore.collection).toHaveBeenCalledWith(db, 'users', userId, 'chats');
    expect(firestore.getDocs).toHaveBeenCalled();
    expect(useChatStore.getState().messages).toContainEqual(
      expect.objectContaining({ content: 'Hi' })
    );
  });

  it('should call setDoc inside users/{userId}/chats when adding a message', async () => {
    const message = { id: 'm-1', role: 'user' as const, content: 'Test', timestamp: '2023-01-01T00:00:00Z' };
    await FirebaseChatRepository.addMessage(userId, message);

    expect(firestore.collection).toHaveBeenCalledWith(db, 'users', userId, 'chats');
    expect(firestore.setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ content: 'Test', role: 'user' })
    );
    // userId should NOT be stored inside the subcollection document
    expect(firestore.setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.not.objectContaining({ userId })
    );
  });

  it('should call deleteDoc for each message inside users/{userId}/chats when clearing history', async () => {
    (firestore.getDocs as any).mockResolvedValueOnce({
      docs: [
        { id: 'msg-1' },
        { id: 'msg-2' }
      ]
    });

    await FirebaseChatRepository.clearHistory(userId);

    expect(firestore.collection).toHaveBeenCalledWith(db, 'users', userId, 'chats');
    expect(firestore.deleteDoc).toHaveBeenCalledTimes(2);
  });
});
