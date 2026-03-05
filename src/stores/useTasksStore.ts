import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FirebaseTaskRepository } from '../services/firebase/FirebaseTaskRepository';
import { useAuthStore } from './useAuthStore';
import { Task, SubTask } from '../types/task';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  addSubTask: (taskId: string, subTask: Omit<SubTask, 'id'>) => Promise<void>;
  toggleSubTask: (taskId: string, subTaskId: string) => Promise<void>;
  deleteSubTask: (taskId: string, subTaskId: string) => Promise<void>;
  toggleExpanded: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setTasks: (tasks: Task[]) => void;
}

// Fallback UUID for non-secure contexts
const generateId = () => {
    try {
        return crypto.randomUUID();
    } catch {
        return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    }
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setTasks: (tasks) => set({ tasks }),

      toggleExpanded: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, expanded: !task.expanded } : task
          ),
        }));
      },

      addTask: async (task) => {
        set({ error: null });
        const newTask: Task = {
          ...task,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        
        // Optimistic UI update
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        try {
            const user = useAuthStore.getState().user;
            if (user?.uid) {
              await FirebaseTaskRepository.addTask(user.uid, newTask);
            } else {
                console.warn('addTask: No user authenticated');
            }
        } catch (e: any) {
            console.error('addTask failed:', e);
            set({ error: e.message || 'Error adding task' });
        }
      },

      updateTask: async (id, updates) => {
        set({ error: null });
        // Optimistic UI update
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));

        try {
            const user = useAuthStore.getState().user;
            if (user?.uid) {
              await FirebaseTaskRepository.updateTask(user.uid, id, updates);
            }
        } catch (e: any) {
            set({ error: e.message || 'Error updating task' });
        }
      },

      deleteTask: async (id) => {
        set({ error: null });
        // Optimistic UI update
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));

        try {
            const user = useAuthStore.getState().user;
            if (user?.uid) {
              await FirebaseTaskRepository.deleteTask(user.uid, id);
            }
        } catch (e: any) {
            set({ error: e.message || 'Error deleting task' });
        }
      },

      toggleTask: async (id) => {
        set({ error: null });
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

        try {
            const user = useAuthStore.getState().user;
            if (user?.uid) {
              await FirebaseTaskRepository.updateTask(user.uid, id, updates);
            }
        } catch (e: any) {
             set({ error: e.message || 'Error toggling task' });
        }
      },

      addSubTask: async (taskId, subTask) => {
        set({ error: null });
        const newSubTask: SubTask = {
          ...subTask,
          id: generateId(),
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

        try {
            const user = useAuthStore.getState().user;
            if (user?.uid && updatedTask) {
              await FirebaseTaskRepository.updateTask(user.uid, taskId, { subTasks: updatedTask.subTasks });
            }
        } catch (e: any) {
            set({ error: e.message || 'Error adding subtask' });
        }
      },

      toggleSubTask: async (taskId, subTaskId) => {
        set({ error: null });
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

        try {
            const user = useAuthStore.getState().user;
            if (user?.uid && updatedTask) {
              await FirebaseTaskRepository.updateTask(user.uid, taskId, { subTasks: updatedTask.subTasks });
            }
        } catch (e: any) {
             set({ error: e.message || 'Error toggling subtask' });
        }
      },

      deleteSubTask: async (taskId, subTaskId) => {
        set({ error: null });
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

        try {
            const user = useAuthStore.getState().user;
            if (user?.uid && updatedTask) {
              await FirebaseTaskRepository.updateTask(user.uid, taskId, { subTasks: updatedTask.subTasks });
            }
        } catch (e: any) {
             set({ error: e.message || 'Error deleting subtask' });
        }
      },
    }),
    {
      name: 'mindease-tasks',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
