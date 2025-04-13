import React, { useState } from "react";
import { TaskList } from "./components/TaskList";
import { ChatRoom } from "./components/ChatRoom";
import { Leaderboard } from "./components/Leaderboard";
import { UserManagement } from './components/UserManagement';
import { createTestTasks } from './utils/createTestTasks';

type Tab = 'tasks' | 'chat' | 'leaderboard' | 'users';

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded ${
                activeTab === 'tasks'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded ${
                activeTab === 'users'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Users
            </button>
          </div>
        </header>

        {activeTab === 'tasks' && (
          <div className="max-w-md mx-auto p-4">
            <button
              onClick={createTestTasks}
              className="w-full mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Test Tasks
            </button>
            <TaskList />
          </div>
        )}

        {activeTab === 'chat' && <ChatRoom />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default App;
