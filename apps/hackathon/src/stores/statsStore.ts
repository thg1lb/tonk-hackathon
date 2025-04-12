import { create } from "zustand";
import { useTaskStore } from "./taskStore";
import { useChatStore } from "./chatStore";
import { useUserStore } from "./userStore";

interface UserStats {
  tasksCreated: number;
  tasksCompleted: number;
  tasksAssigned: number;
  messagesSent: number;
  taskRelatedMessages: number;
}

interface TeamStats {
  totalTasks: number;
  completedTasks: number;
  totalMessages: number;
  taskCompletionRate: number;
  mostDiscussedTask: {
    taskId: string;
    title: string;
    messageCount: number;
  } | null;
  mostActiveUser: {
    userId: string;
    name: string;
    activityCount: number;
  } | null;
}

interface StatsState {
  userStats: Record<string, UserStats>;
  teamStats: TeamStats;
  computeStats: () => void;
}

const createEmptyUserStats = (): UserStats => ({
  tasksCreated: 0,
  tasksCompleted: 0,
  tasksAssigned: 0,
  messagesSent: 0,
  taskRelatedMessages: 0,
});

export const useStatsStore = create<StatsState>((set) => ({
  userStats: {},
  teamStats: {
    totalTasks: 0,
    completedTasks: 0,
    totalMessages: 0,
    taskCompletionRate: 0,
    mostDiscussedTask: null,
    mostActiveUser: null,
  },
  computeStats: () => {
    const tasks = useTaskStore.getState().tasks;
    const messages = useChatStore.getState().messages;
    const users = useUserStore.getState().users;
    
    // Initialize user stats
    const userStats: Record<string, UserStats> = {};
    users.forEach(user => {
      userStats[user.id] = createEmptyUserStats();
    });

    // Compute task-related stats
    tasks.forEach(task => {
      if (task.assignedTo) {
        userStats[task.assignedTo].tasksAssigned++;
      }
      if (task.completed && task.assignedTo) {
        userStats[task.assignedTo].tasksCompleted++;
      }
    });

    // Compute message-related stats
    const taskMessageCount: Record<string, number> = {};
    let mostDiscussedTask = null;
    let maxTaskMessages = 0;

    messages.forEach(msg => {
      if (msg.userId !== 'system' && userStats[msg.userId]) {
        userStats[msg.userId].messagesSent++;
        if (msg.relatedTaskId) {
          userStats[msg.userId].taskRelatedMessages++;
          taskMessageCount[msg.relatedTaskId] = (taskMessageCount[msg.relatedTaskId] || 0) + 1;
          
          if (taskMessageCount[msg.relatedTaskId] > maxTaskMessages) {
            maxTaskMessages = taskMessageCount[msg.relatedTaskId];
            const task = tasks.find(t => t.id === msg.relatedTaskId);
            if (task) {
              mostDiscussedTask = {
                taskId: task.id,
                title: task.title,
                messageCount: maxTaskMessages
              };
            }
          }
        }
      }
    });

    // Find most active user
    let mostActiveUser = null;
    let maxActivity = 0;

    users.forEach(user => {
      const stats = userStats[user.id];
      const activityCount = 
        stats.messagesSent + 
        stats.tasksCompleted * 2 + 
        stats.tasksCreated;
      
      if (activityCount > maxActivity) {
        maxActivity = activityCount;
        mostActiveUser = {
          userId: user.id,
          name: user.name,
          activityCount
        };
      }
    });

    // Compute team stats
    const completedTasks = tasks.filter(t => t.completed).length;
    
    set({
      userStats,
      teamStats: {
        totalTasks: tasks.length,
        completedTasks,
        totalMessages: messages.filter(m => m.userId !== 'system').length,
        taskCompletionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
        mostDiscussedTask,
        mostActiveUser
      }
    });
  }
}));
