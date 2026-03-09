import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Task } from '../../types/task';

/**
 * Firebase Task Repository (Web).
 * Collection path: users/{userId}/tasks/{taskId}
 * Matches mobile structure for cross-platform sync.
 */

/** Returns the tasks subcollection for a given user. */
const getUserTasksCollection = (userId: string) =>
    collection(db, 'users', userId, 'tasks');

/**
 * Convert a Firestore Timestamp, ISO string, or number to ISO string.
 */
const toISOString = (value: unknown): string => {
    if (!value) return new Date().toISOString();
    if (typeof (value as any).toDate === 'function') {
        return (value as any).toDate().toISOString();
    }
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return new Date(value).toISOString();
    return new Date().toISOString();
};

export const FirebaseTaskRepository = {
    /**
     * Listen to user tasks in real-time from users/{userId}/tasks subcollection.
     * orderBy is safe here since no extra where() is needed on a subcollection.
     */
    subscribeToTasks: (userId: string, onUpdate: (tasks: Task[]) => void) => {
        if (!userId) return () => { };

        console.log(`FirebaseTaskRepository: Subscribing to tasks for user ${userId}`);

        const q = query(
            getUserTasksCollection(userId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const tasks: Task[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                tasks.push({
                    ...data,
                    id: docSnap.id,
                    createdAt: toISOString(data.createdAt),
                    completedAt: data.completedAt ? toISOString(data.completedAt) : undefined,
                } as Task);
            });

            console.log(`FirebaseTaskRepository: Received ${tasks.length} tasks for user ${userId}`);
            onUpdate(tasks);
        }, (error) => {
            console.error('FirebaseTaskRepository: Error listening to tasks:', error);
        });
    },

    /**
     * Add a new task to users/{userId}/tasks/{task.id}
     */
    addTask: async (userId: string, task: Task) => {
        if (!userId) return;
        try {
            console.log(`FirebaseTaskRepository: Adding task at users/${userId}/tasks/${task.id}`);
            const taskRef = doc(getUserTasksCollection(userId), task.id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, expanded, createdAt, completedAt, ...rest } = task;
            const taskToSave: Record<string, unknown> = {
                ...rest,
                userId,
                createdAt: serverTimestamp(),
            };
            if (completedAt) {
                taskToSave.completedAt = completedAt;
            }
            await setDoc(taskRef, taskToSave);
            console.log(`FirebaseTaskRepository: Task added successfully`);
        } catch (error) {
            console.error('Error adding task to Firebase:', error);
            throw error;
        }
    },

    /**
     * Update an existing task.
     */
    updateTask: async (userId: string, taskId: string, updates: Partial<Task>) => {
        if (!userId) return;
        try {
            const taskRef = doc(getUserTasksCollection(userId), taskId);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, expanded, ...dataToUpdate } = updates as any;
            await updateDoc(taskRef, dataToUpdate);
        } catch (error) {
            console.error('Error updating task in Firebase:', error);
            throw error;
        }
    },

    /**
     * Delete a task.
     */
    deleteTask: async (userId: string, taskId: string) => {
        if (!userId) return;
        try {
            const taskRef = doc(getUserTasksCollection(userId), taskId);
            await deleteDoc(taskRef);
        } catch (error) {
            console.error('Error deleting task in Firebase:', error);
            throw error;
        }
    }
};
