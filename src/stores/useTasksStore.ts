import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  completedAt: !task.completed ? new Date().toISOString() : undefined,
                }
              : task
          ),
        }));
      },

      addSubTask: (taskId, subTask) => {
        const newSubTask: SubTask = {
          ...subTask,
          id: crypto.randomUUID(),
        };
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, subTasks: [...task.subTasks, newSubTask] }
              : task
          ),
        }));
      },

      toggleSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks.map((st) =>
                    st.id === subTaskId ? { ...st, completed: !st.completed } : st
                  ),
                }
              : task
          ),
        }));
      },

      deleteSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks.filter((st) => st.id !== subTaskId),
                }
              : task
          ),
        }));
      },
    }),
    {
      name: 'mindease-tasks',
    }
  )
);
