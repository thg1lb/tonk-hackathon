import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';

const testTasks = [
  "Review project documentation",
  "Set up development environment",
  "Create user authentication flow",
  "Design database schema",
  "Implement API endpoints",
  "Write unit tests",
  "Deploy to staging environment",
  "Conduct security audit",
  "Optimize performance",
  "Update dependencies"
];

export const createTestTasks = () => {
  const { addTask } = useTaskStore.getState();
  const { users } = useUserStore.getState();
  
  testTasks.forEach((title) => {
    // Randomly decide whether to assign the task
    const shouldAssign = Math.random() > 0.3;
    if (shouldAssign) {
      // Pick a random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      addTask(title, randomUser.id);
    } else {
      addTask(title);
    }
  });
};
