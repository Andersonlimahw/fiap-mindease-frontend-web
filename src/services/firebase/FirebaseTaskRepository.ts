import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Task } from '../../types/task';

const COLLECTION_NAME = 'tasks';

/**
 * Convert a Firestore Timestamp, ISO string, or any date-like value to ISO string.
 * Ensures consistent createdAt/completedAt format in the web Task model.
 */
const toISOString = (value: unknown): string => {
    if (!value) return new Date().toISOString();
    // Firestore Timestamp has toDate()
    if (typeof (value as any).toDate === 'function') {
        return (value as any).toDate().toISOString();
    }
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return new Date(value).toISOString();
    return new Date().toISOString();
};

export const FirebaseTaskRepository = {
    /**
     * Listen to user tasks in real-time from root 'tasks' collection.
     * Ordered by createdAt desc to match mobile subscription behaviour.
     */
    subscribeToTasks: (userId: string, onUpdate: (tasks: Task[]) => void) => {
        if (!userId) return () => { };

        const tasksRef = collection(db, COLLECTION_NAME);
        const userTasksQuery = query(
            tasksRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
        );

        return onSnapshot(userTasksQuery, (snapshot) => {
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
            console.error('Error listening to tasks:', error);
        });
    },

    /**
     * Add a new task to root 'tasks' collection.
     * Uses serverTimestamp() for createdAt to stay consistent with the mobile app
     * and allow correct orderBy('createdAt') queries across platforms.
     * Does NOT store redundant `id` or UI-only `expanded` fields.
     */
    addTask: async (userId: string, task: Task) => {
        if (!userId) return;
        try {
            console.log(`FirebaseTaskRepository: Adding task at ${COLLECTION_NAME}/${task.id}`);
            const taskRef = doc(db, COLLECTION_NAME, task.id);
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
     * Strips UI-only fields before persisting.
     */
    updateTask: async (userId: string, taskId: string, updates: Partial<Task>) => {
        if (!userId) return;
        try {
            console.log(`FirebaseTaskRepository: Updating task ${COLLECTION_NAME}/${taskId}`);
            const taskRef = doc(db, COLLECTION_NAME, taskId);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, expanded, ...dataToUpdate } = updates as any;
            await updateDoc(taskRef, dataToUpdate);
        } catch (error) {
            console.error('Error updating task in Firebase:', error);
            throw error;
        }
    },

    /**
     * Delete a task
     */
    deleteTask: async (userId: string, taskId: string) => {
        if (!userId) return;
        try {
            console.log(`FirebaseTaskRepository: Deleting task ${COLLECTION_NAME}/${taskId}`);
            const taskRef = doc(db, COLLECTION_NAME, taskId);
            await deleteDoc(taskRef);
        } catch (error) {
            console.error('Error deleting task in Firebase:', error);
            throw error;
        }
    }
};
