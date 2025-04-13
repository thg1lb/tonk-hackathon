import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  color: string;
  points: number;
};

type Task = {
  id: string;
  title: string;
  points: number;
  assignedTo: string | null;
  locationSet: boolean;
  completed: boolean;
};

type GameStore = {
  users: User[];
  tasks: Task[];
  activeTab: 'tasks' | 'map' | 'scoreboard' | 'chat';
  messages: string[];
  addUser: (name: string) => void;
  removeUser: (id: string) => void;
  addTask: (title: string, points: number) => void;
  removeTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  assignUserToTask: (taskId: string, userId: string) => void;
  toggleLocationStatus: (taskId: string) => void;
  setActiveTab: (tab: 'tasks' | 'map' | 'scoreboard' | 'chat') => void;
  addMessage: (message: string) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  users: [],
  tasks: [],
  activeTab: 'tasks',
  messages: [],
  
  addUser: (name) => set((state) => ({
    users: [...state.users, {
      id: crypto.randomUUID(),
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      points: 0
    }]
  })),
  
  removeUser: (id) => set((state) => ({
    users: state.users.filter(user => user.id !== id)
  })),
  
  addTask: (title, points) => set((state) => ({
    tasks: [...state.tasks, {
      id: crypto.randomUUID(),
      title,
      points,
      assignedTo: null,
      locationSet: false,
      completed: false
    }]
  })),
  
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  toggleTaskCompletion: (id) => set((state) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return state;
    
    const updatedTasks = state.tasks.map(t => 
      t.id === id ? {...t, completed: !t.completed} : t
    );
    
    const pointsChange = task.completed ? -task.points : task.points;
    
    const updatedUsers = state.users.map(user => 
      user.id === task.assignedTo 
        ? {...user, points: user.points + pointsChange}
        : user
    );
    
    return { tasks: updatedTasks, users: updatedUsers };
  }),
  
  assignUserToTask: (taskId, userId) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === taskId ? {...task, assignedTo: userId} : task
    )
  })),
  
  toggleLocationStatus: (taskId) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === taskId ? {...task, locationSet: !task.locationSet} : task
    )
  })),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  }))
}));
