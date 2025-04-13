import { create } from "zustand";

export interface User {
  id: string;
  name: string;
}

interface UserState {
  users: User[];
  addUser: (name: string) => void;
  removeUser: (id: string) => void;
  updateUser: (id: string, newName: string) => void;
  getUser: (id: string) => User | undefined;
  getAllUsers: () => User[];
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" }
  ],
  
  addUser: (name: string) =>
    set((state) => ({
      users: [...state.users, { id: crypto.randomUUID(), name }],
    })),
    
  removeUser: (id: string) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
    
  updateUser: (id: string, newName: string) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, name: newName } : user
      ),
    })),
    
  getUser: (id: string) => get().users.find((user) => user.id === id),
  
  getAllUsers: () => get().users,
}));
