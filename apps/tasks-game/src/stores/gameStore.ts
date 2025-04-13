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
  createdBy: string;
};

type Message = {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
};

interface GameStore {
  // Core state
  users: User[];
  currentUser: User | null;
  tasks: Task[];
  messages: Message[];
  mapMarkers: Array<{
    id: string;
    position: [number, number];
    createdBy: string;
  }>;

  // Methods
  addUser: (name: string) => void;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  sendMessage: (text: string) => void;
  addMapMarker: (position: [number, number]) => void;
  removeMarker: (id: string) => void;
  updateScore: (points: number) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      tasks: [],
      messages: [],
      mapMarkers: [],

      addUser: (name) => {
        const newUser = {
          id: uuid(),
          name,
          avatar: `https://i.pravatar.cc/150?u=${uuid()}`,
          score: 0
        };
        set({ 
          users: [...get().users, newUser],
          currentUser: newUser 
        });
      },

      addTask: (text) => {
        if (!get().currentUser) return;
        set({ 
          tasks: [...get().tasks, {
            id: uuid(),
            text,
            completed: false,
            createdBy: get().currentUser!.id
          }]
        });
      },

      toggleTask: (id) => {
        set({
          tasks: get().tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed} : task
          )
        });
      },

      removeTask: (id) => {
        set({ tasks: get().tasks.filter(task => task.id !== id) });
      },

      sendMessage: (text) => {
        if (!get().currentUser) return;
        set({
          messages: [...get().messages, {
            id: uuid(),
            userId: get().currentUser!.id,
            text,
            timestamp: Date.now()
          }]
        });
      },

      addMapMarker: (position) => {
        if (!get().currentUser) return;
        set({
          mapMarkers: [...get().mapMarkers, {
            id: uuid(),
            position,
            createdBy: get().currentUser!.id
          }]
        });
      },

      removeMarker: (id) => {
        set({ mapMarkers: get().mapMarkers.filter(marker => marker.id !== id) });
      },

      updateScore: (points) => {
        if (!get().currentUser) return;
        set({
          users: get().users.map(user => 
            user.id === get().currentUser!.id 
              ? {...user, score: user.score + points} 
              : user
          ),
          currentUser: {
            ...get().currentUser!,
            score: get().currentUser!.score + points
          }
        });
      }
    }),
    { name: 'game-store' }
  )
);
