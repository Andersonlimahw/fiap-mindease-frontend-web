import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FirebaseTaskRepository } from '../services/firebase/FirebaseTaskRepository';
import { useAuthStore } from './useAuthStore';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  subTasks: SubTask[];
  createdAt: string;
  completedAt?: string;
}

interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addSubTask: (taskId: string, subTask: Omit<SubTask, 'id'>) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: async (task) => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        // Optimistic UI update
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        const user = useAuthStore.getState().user;
        if (user?.uid) {
          await FirebaseTaskRepository.addTask(user.uid, newTask);
        }
      },

      updateTask: async (id, updates) => {
        // Optimistic UI update
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));

        const user = useAuthStore.getState().user;
        if (user?.uid) {
          await FirebaseTaskRepository.updateTask(user.uid, id, updates);
        }
      },

      deleteTask: async (id) => {
        // Optimistic UI update
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));

        const user = useAuthStore.getState().user;
        if (user?.uid) {
          await FirebaseTaskRepository.deleteTask(user.uid, id);
        }
      },

      toggleTask: async (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const updates = {
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined,
        };

        // Optimistic UI update
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));

        const user = useAuthStore.getState().user;
        if (user?.uid) {
          await FirebaseTaskRepository.updateTask(user.uid, id, updates);
        }
      },

      addSubTask: async (taskId, subTask) => {
        const newSubTask: SubTask = {
          ...subTask,
          id: crypto.randomUUID(),
        };

        let updatedTask: Task | undefined;

        // Optimistic UI update
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              updatedTask = { ...task, subTasks: [...task.subTasks, newSubTask] };
              return updatedTask;
            }
            return task;
          });
          return { tasks: newTasks };
        });

        const user = useAuthStore.getState().user;
        if (user?.uid && updatedTask) {
          await FirebaseTaskRepository.updateTask(user.uid, taskId, { subTasks: updatedTask.subTasks });
        }
      },

      toggleSubTask: async (taskId, subTaskId) => {
        let updatedTask: Task | undefined;

        // Optimistic UI update
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              updatedTask = {
                ...task,
                subTasks: task.subTasks.map((st) =>
                  st.id === subTaskId ? { ...st, completed: !st.completed } : st
                ),
              };
              return updatedTask;
            }
            return task;
          });
          return { tasks: newTasks };
        });

        const user = useAuthStore.getState().user;
        if (user?.uid && updatedTask) {
          await FirebaseTaskRepository.updateTask(user.uid, taskId, { subTasks: updatedTask.subTasks });
        }
      },

      deleteSubTask: async (taskId, subTaskId) => {
        let updatedTask: Task | undefined;

        // Optimistic UI update
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              updatedTask = {
                ...task,
                subTasks: task.subTasks.filter((st) => st.id !== subTaskId),
              };
              return updatedTask;
            }
            return task;
          });
          return { tasks: newTasks };
        });

        const user = useAuthStore.getState().user;
        if (user?.uid && updatedTask) {
          await FirebaseTaskRepository.updateTask(user.uid, taskId, { subTasks: updatedTask.subTasks });
        }
      },
    }),
    {
      name: 'mindease-tasks',
    }
  )
);
