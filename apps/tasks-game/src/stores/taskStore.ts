import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';

type User = {
  id: string;
  name: string;
  avatar: string;
  score: number;
};

type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdBy: string; // user ID
};

type ChatMessage = {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
};

interface GameStore {
  // Task management
  tasks: Task[];
  addTask: (text: string, userId: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearCompleted: () => void;
  
  // User management
  users: User[];
  currentUser: User | null;
  addUser: (name: string) => void;
  updateScore: (userId: string, points: number) => void;
  
  // Chat
  messages: ChatMessage[];
  sendMessage: (userId: string, text: string) => void;
  
  // Map state
  mapState: {
    center: [number, number];
    markers: Array<{
      id: string;
      position: [number, number];
      createdBy: string;
    }>;
  };
  addMarker: (position: [number, number], userId: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      tasks: [],
      users: [],
      currentUser: null,
      messages: [],
      mapState: {
        center: [0, 0],
        markers: []
      },
      
      // Task methods
      addTask: (text, userId) => {
        set((state) => ({
          tasks: [...state.tasks, { 
            id: uuid(), 
            text, 
            completed: false,
            createdBy: userId
          }]
        }));
      },
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },
      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        }));
      },
      
      // User methods
      addUser: (name) => {
        const newUser = {
          id: uuid(),
          name,
          avatar: `https://i.pravatar.cc/150?u=${uuid()}`,
          score: 0
        };
        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser
        }));
      },
      updateScore: (userId, points) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, score: user.score + points } : user
          ),
        }));
      },
      
      // Chat methods
      sendMessage: (userId, text) => {
        set((state) => ({
          messages: [...state.messages, {
            id: uuid(),
            userId,
            text,
            timestamp: new Date()
          }]
        }));
      },
      
      // Map methods
      addMarker: (position, userId) => {
        set((state) => ({
          mapState: {
            ...state.mapState,
            markers: [...state.mapState.markers, {
              id: uuid(),
              position,
              createdBy: userId
            }]
          }
        }));
      }
    }),
    { name: 'game-store' }
  )
);