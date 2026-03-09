import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    orderBy,
    limit,
    deleteDoc,
    where
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ChatMessage, useChatStore } from '../../stores/useChatStore';

const COLLECTION_NAME = 'chats';

export const FirebaseChatRepository = {
    /**
     * Load recent chat history from root 'chats' collection
     */
    loadHistory: async (userId: string) => {
        if (!userId) return;

        try {
            const messagesRef = collection(db, COLLECTION_NAME);
            const q = query(
                messagesRef,
                where('userId', '==', userId),
                orderBy('timestamp', 'desc'),
                limit(50)
            );

            const snapshot = await getDocs(q);
            const messages: ChatMessage[] = [];

            snapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
            });

            // Reverse to get chronological order
            useChatStore.setState({ messages: messages.reverse() });
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    },

    /**
     * Add a single message to root 'chats' collection with userId field
     */
    addMessage: async (userId: string, message: ChatMessage) => {
        if (!userId) return;
        try {
            const msgRef = doc(db, COLLECTION_NAME, message.id);
            await setDoc(msgRef, { ...message, userId });
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
            const messagesRef = collection(db, COLLECTION_NAME);
            const q = query(messagesRef, where('userId', '==', userId));
            const snapshot = await getDocs(q);

            const deletePromises = snapshot.docs.map(document =>
                deleteDoc(doc(db, COLLECTION_NAME, document.id))
            );

            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }
};
