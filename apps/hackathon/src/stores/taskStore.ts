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
  addTask: (title: string, assignedTo?: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  assignTask: (id: string, assignedTo: string) => void;
}

export const useTaskStore = create<TaskState>(
  sync(
    (set, get) => ({
    tasks: [],
    
    addTask: (title: string, assignedTo?: string) => {
      const taskId = crypto.randomUUID();
      set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: taskId,
            title,
            completed: false,
            createdAt: new Date().toISOString(),
            assignedTo
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
      let taskTitle = '';
      let newStatus = false;
      
      set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          taskTitle = task.title;
          newStatus = !task.completed;
        }
        return {
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: newStatus } : task
          ),
        };
      });

      useChatStore.getState().addSystemMessage(
        `Task "${taskTitle}" was marked as ${newStatus ? 'completed' : 'incomplete'}`,
        'task_update',
        id
      );
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
    }),
    {
      docId: "family-tasks"
    }
  )
);
