import { create } from "zustand";

export interface User {
  id: string;
  name: string;
}

interface UserState {
  users: User[];
  addUser: (name: string) => void;
  getUser: (id: string) => User | undefined;
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
  getUser: (id: string) => get().users.find((user) => user.id === id),
}));
