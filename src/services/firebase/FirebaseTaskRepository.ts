import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    query,
    where,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Task, useTasksStore } from '../../stores/useTasksStore';

export const FirebaseTaskRepository = {
    /**
     * Listen to user tasks in real-time and update Zustand
     */
    subscribeToTasks: (userId: string) => {
        if (!userId) return () => { };

        const tasksRef = collection(db, 'users', userId, 'tasks');

        return onSnapshot(tasksRef, (snapshot) => {
            const tasks: Task[] = [];
            snapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() } as Task);
            });

            // Update store directly without triggering save back to Firebase (prevent infinite loop)
            useTasksStore.setState({ tasks });
        }, (error) => {
            console.error('Error listening to tasks:', error);
        });
    },

    /**
     * Add a new task
     */
    addTask: async (userId: string, task: Task) => {
        if (!userId) return;
        try {
            const taskRef = doc(db, 'users', userId, 'tasks', task.id);
            await setDoc(taskRef, task);
        } catch (error) {
            console.error('Error adding task to Firebase:', error);
        }
    },

    /**
     * Update an existing task or toggle completion
     */
    updateTask: async (userId: string, taskId: string, updates: Partial<Task>) => {
        if (!userId) return;
        try {
            const taskRef = doc(db, 'users', userId, 'tasks', taskId);
            await updateDoc(taskRef, updates);
        } catch (error) {
            console.error('Error updating task in Firebase:', error);
        }
    },

    /**
     * Delete a task
     */
    deleteTask: async (userId: string, taskId: string) => {
        if (!userId) return;
        try {
            const taskRef = doc(db, 'users', userId, 'tasks', taskId);
            await deleteDoc(taskRef);
        } catch (error) {
            console.error('Error deleting task in Firebase:', error);
        }
    }
};
