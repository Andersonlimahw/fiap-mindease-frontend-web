import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Task } from '../../types/task';

const COLLECTION_NAME = 'tasks';
const USERS_COLLECTION = 'users';

export const FirebaseTaskRepository = {
    /**
     * Listen to user tasks in real-time
     */
    subscribeToTasks: (userId: string, onUpdate: (tasks: Task[]) => void) => {
        if (!userId) return () => { };

        // Point to the user-specific subcollection
        const tasksRef = collection(db, USERS_COLLECTION, userId, COLLECTION_NAME);

        return onSnapshot(tasksRef, (snapshot) => {
            const tasks: Task[] = [];
            snapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() } as Task);
            });
            console.log(`FirebaseTaskRepository: Received ${tasks.length} tasks for user ${userId}`);
            onUpdate(tasks);
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
            console.log(`FirebaseTaskRepository: Adding task at ${USERS_COLLECTION}/${userId}/${COLLECTION_NAME}/${task.id}`);
            const taskRef = doc(db, USERS_COLLECTION, userId, COLLECTION_NAME, task.id);
            // Ensure no undefined fields are sent to Firestore
            const taskToSave = JSON.parse(JSON.stringify(task));
            await setDoc(taskRef, taskToSave);
            console.log(`FirebaseTaskRepository: Task added successfully`);
        } catch (error) {
            console.error('Error adding task to Firebase:', error);
            throw error;
        }
    },

    /**
     * Update an existing task or toggle completion
     */
    updateTask: async (userId: string, taskId: string, updates: Partial<Task>) => {
        if (!userId) return;
        try {
            console.log(`FirebaseTaskRepository: Updating task ${USERS_COLLECTION}/${userId}/${COLLECTION_NAME}/${taskId}`);
            const taskRef = doc(db, USERS_COLLECTION, userId, COLLECTION_NAME, taskId);
            // Ensure no undefined fields
            const dataToUpdate = JSON.parse(JSON.stringify(updates));
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
            console.log(`FirebaseTaskRepository: Deleting task ${USERS_COLLECTION}/${userId}/${COLLECTION_NAME}/${taskId}`);
            const taskRef = doc(db, USERS_COLLECTION, userId, COLLECTION_NAME, taskId);
            await deleteDoc(taskRef);
        } catch (error) {
            console.error('Error deleting task in Firebase:', error);
            throw error;
        }
    }
};
