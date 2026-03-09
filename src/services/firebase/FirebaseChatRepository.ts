import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    orderBy,
    limit,
    deleteDoc,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ChatMessage, useChatStore } from '../../stores/useChatStore';

// Mobile path: users/{userId}/chats/{messageId}
const getUserChatsCollection = (userId: string) =>
    collection(db, 'users', userId, 'chats');

export const FirebaseChatRepository = {
    /**
     * Load recent chat history from users/{userId}/chats subcollection.
     * Matches the mobile path: users/{userId}/chats/{messageId}
     */
    loadHistory: async (userId: string) => {
        if (!userId) return;

        try {
            const q = query(
                getUserChatsCollection(userId),
                orderBy('timestamp', 'asc'),
                limit(50)
            );

            const snapshot = await getDocs(q);
            const messages: ChatMessage[] = [];

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                // Handle both Firestore Timestamp and ISO string timestamps
                const timestamp =
                    typeof data.timestamp?.toDate === 'function'
                        ? data.timestamp.toDate().toISOString()
                        : typeof data.timestamp === 'string'
                        ? data.timestamp
                        : new Date().toISOString();

                messages.push({
                    id: docSnap.id,
                    role: data.role,
                    content: data.content,
                    timestamp,
                } as ChatMessage);
            });

            useChatStore.setState({ messages });
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    },

    /**
     * Add a single message to users/{userId}/chats/{messageId}
     * Matches the mobile subcollection path.
     */
    addMessage: async (userId: string, message: ChatMessage) => {
        if (!userId) return;
        try {
            const msgRef = doc(getUserChatsCollection(userId), message.id);
            await setDoc(msgRef, {
                role: message.role,
                content: message.content,
                timestamp: message.timestamp,
            });
        } catch (error) {
            console.error('Error adding chat message to Firebase:', error);
        }
    },

    /**
     * Clear all chat history for user
     */
    clearHistory: async (userId: string) => {
        if (!userId) return;
        try {
            const snapshot = await getDocs(getUserChatsCollection(userId));
            const deletePromises = snapshot.docs.map((docSnap) =>
                deleteDoc(doc(getUserChatsCollection(userId), docSnap.id))
            );
            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }
};
