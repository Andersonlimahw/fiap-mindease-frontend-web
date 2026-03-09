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
  });

  it('should call getDocs and update store when loading history', async () => {
    const mockMessages = [
        { id: '1', role: 'user', content: 'Hi', timestamp: '2023-01-01T00:00:00Z' }
    ];
    
    // Mock getDocs response
    (firestore.getDocs as any).mockResolvedValueOnce({
        docs: mockMessages.map(m => ({
            id: m.id,
            data: () => ({ ...m })
        })),
        forEach: function(cb: any) { this.docs.forEach(cb) }
    });

    await FirebaseChatRepository.loadHistory(userId);
    
    expect(firestore.getDocs).toHaveBeenCalled();
    expect(useChatStore.getState().messages).toContainEqual(expect.objectContaining({ content: 'Hi' }));
  });

  it('should call setDoc when adding a message', async () => {
    const message = { id: 'm-1', role: 'user' as const, content: 'Test', timestamp: '...' };
    await FirebaseChatRepository.addMessage(userId, message);
    
    expect(firestore.doc).toHaveBeenCalledWith(db, 'chats', message.id);
    expect(firestore.setDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ userId, content: 'Test' }));
  });

  it('should call deleteDoc for each message when clearing history', async () => {
    (firestore.getDocs as any).mockResolvedValueOnce({
        docs: [
            { id: 'msg-1' },
            { id: 'msg-2' }
        ]
    });

    await FirebaseChatRepository.clearHistory(userId);
    
    expect(firestore.deleteDoc).toHaveBeenCalledTimes(2);
  });
});
