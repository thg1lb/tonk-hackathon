import { sync } from "@tonk/keepsync";
import { create } from "zustand";
import { useChatStore } from "./chatStore";
import { useUserStore } from "./userStore";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  assignedTo?: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (title: string, assignedTo?: string, location?: Task['location']) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  assignTask: (id: string, assignedTo: string) => void;
  getLeaderboard: () => Array<{userId: string; points: number}>;
  completions: Record<string, number>; // userId -> completion count
}

export const useTaskStore = create<TaskState>(
  sync(
    (set, get) => ({
      tasks: [],
      completions: {},
      
      addTask: (title: string, assignedTo?: string, location?: Task['location']) => {
        const taskId = crypto.randomUUID();
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: taskId,
              title,
              completed: false,
              createdAt: new Date().toISOString(),
              assignedTo,
              location
            },
          ],
        }));
        
        if (assignedTo) {
          const user = useUserStore.getState().getUser(assignedTo);
          useChatStore.getState().addSystemMessage(
            `Task "${title}" was created and assigned to ${user?.name}`,
            'task_assignment',
            taskId
          );
        } else {
          useChatStore.getState().addSystemMessage(
            `Task "${title}" was created`,
            'task_update',
            taskId
          );
        }
      },

      toggleTask: (id: string) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;
          
          const newStatus = !task.completed;
          const taskTitle = task.title;
          const userId = task.assignedTo;
          
          // Update completion count if task is being marked complete
          if (newStatus && userId) {
            return {
              ...state,
              tasks: state.tasks.map((t) => 
                t.id === id ? { ...t, completed: newStatus } : t
              ),
              completions: {
                ...state.completions,
                [userId]: (state.completions[userId] || 0) + 1
              }
            };
          }
          
          return {
            ...state,
            tasks: state.tasks.map((t) => 
              t.id === id ? { ...t, completed: newStatus } : t
            )
          };
        });

        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          useChatStore.getState().addSystemMessage(
            `Task "${task.title}" was marked as ${task.completed ? 'completed' : 'incomplete'}`,
            'task_update',
            id
          );
        }
      },

      removeTask: (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          useChatStore.getState().addSystemMessage(
            `Task "${task.title}" was deleted`,
            'task_update',
            id
          );
        }
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      assignTask: (id: string, assignedTo: string) => {
        const user = useUserStore.getState().getUser(assignedTo);
        const task = get().tasks.find((t) => t.id === id);
        
        if (task && user) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, assignedTo } : t
            ),
          }));

          useChatStore.getState().addSystemMessage(
            `Task "${task.title}" was assigned to ${user.name}`,
            'task_assignment',
            id
          );
        }
      },

      getLeaderboard: () => {
        const { completions } = get();
        return Object.entries(completions)
          .map(([userId, points]) => ({ userId, points }))
          .sort((a, b) => b.points - a.points);
      },
    }),
    {
      docId: "family-app"
    }
  )
);
