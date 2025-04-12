import React, { useState } from "react";
import { TaskList } from "./components/TaskList";
import { ChatRoom } from "./components/ChatRoom";
import { Analytics } from "./components/Analytics";
import { createTestTasks } from './utils/createTestTasks';

const App = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'analytics'>('tasks');
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Work Task Manager</h1>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded ${
                activeTab === 'tasks'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tasks & Chat
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded ${
                activeTab === 'analytics'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analytics
            </button>
          </div>
        </header>

        {activeTab === 'tasks' ? (
          <>
            <div className="max-w-md mx-auto p-4">
              <button
                onClick={createTestTasks}
                className="w-full mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create Test Tasks
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Tasks</h2>
                <TaskList />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">Chat Room</h2>
                <ChatRoom />
              </div>
            </div>
          </>
        ) : (
          <Analytics />
        )}
      </div>
    </div>
  );
};

export default App;
