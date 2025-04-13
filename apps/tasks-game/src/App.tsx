import React, { useState } from 'react';
import './App.css';

interface User {
  id: string;
  name: string;
  color: string;
  points: number;
}

interface Task {
  id: string;
  title: string;
  points: number;
  assignedTo: string | null;
  completed: boolean;
  locationSet: boolean;
}

interface Message {
  id: string;
  text: string;
  user: User;
  timestamp: Date;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'map' | 'scoreboard' | 'chat'>('tasks');
  const [newUser, setNewUser] = useState('');
  const [newTask, setNewTask] = useState('');
  const [taskPoints, setTaskPoints] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // User Management
  const addUser = () => {
    if (newUser.trim()) {
      const newUserObj: User = {
        id: Date.now().toString(),
        name: newUser,
        color: `hsl(${Math.random() * 360}, 70%, 70%)`,
        points: 0
      };
      setUsers([...users, newUserObj]);
      if (!currentUserId) setCurrentUserId(newUserObj.id);
      setNewUser('');
    }
  };

  // Task Management
  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        title: newTask,
        points: taskPoints,
        assignedTo: null,
        completed: false,
        locationSet: false
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
      setTaskPoints(1);
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const completed = !task.completed;
        if (completed && task.assignedTo) {
          setUsers(users.map(user => 
            user.id === task.assignedTo 
              ? {...user, points: user.points + task.points}
              : user
          ));
        }
        return {...task, completed};
      }
      return task;
    }));
  };

  const assignUserToTask = (taskId: string, userId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, assignedTo: userId} : task
    ));
  };

  const toggleLocationStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, locationSet: !task.locationSet} : task
    ));
  };

  // Chat
  const sendMessage = () => {
    if (newMessage.trim()) {
      const currentUser = users.find(u => u.id === currentUserId);
      const newMessageObj: Message = {
        id: Date.now().toString(),
        text: newMessage,
        user: currentUser as User,
        timestamp: new Date()
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage('');
    }
  };

  // Tab components
  const renderTab = () => {
    switch(activeTab) {
      case 'tasks':
        return (
          <div>
            <div className="flex mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task"
                className="flex-1 p-2 border rounded-l"
              />
              <input
                type="number"
                min="1"
                value={taskPoints}
                onChange={(e) => setTaskPoints(parseInt(e.target.value) || 1)}
                className="w-16 p-2 border-t border-b"
              />
              <button 
                onClick={addTask}
                className="bg-blue-500 text-white p-2 rounded-r"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-3 border rounded flex flex-col ${task.completed ? 'bg-gray-100' : ''}`}
                >
                  <div className="flex justify-between">
                    <span className={`${task.completed ? 'line-through' : ''}`}>
                      {task.title} ({task.points} pts)
                    </span>
                    <button 
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`p-1 rounded ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                      {task.completed ? '✓' : 'Complete'}
                    </button>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <select
                      value={task.assignedTo || ''}
                      onChange={(e) => assignUserToTask(task.id, e.target.value)}
                      className="border p-1 rounded text-sm"
                    >
                      <option value="">Unassigned</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => toggleLocationStatus(task.id)}
                      className={`p-1 rounded text-sm ${task.locationSet ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {task.locationSet ? '📍 Location Set' : 'Set Location'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p>Map Placeholder (Leaflet integration coming soon)</p>
          </div>
        );
      case 'scoreboard':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
            <div className="space-y-2">
              {[...users]
                .sort((a, b) => b.points - a.points)
                .map(user => (
                  <div key={user.id} className="flex justify-between p-2 border rounded items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{backgroundColor: user.color}}
                      />
                      {user.name}
                    </div>
                    <div className="font-bold">{user.points} pts</div>
                  </div>
                ))
              }
            </div>
          </div>
        );
      case 'chat':
        return (
          <div>
            <div className="h-48 overflow-y-auto border rounded p-2 mb-2">
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div key={msg.id} className="mb-1">{msg.user.name}: {msg.text}</div>
                ))
              ) : (
                <p className="text-gray-500">No messages yet</p>
              )}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 p-2 border rounded-l"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-r"
              >
                Send
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <div className="flex mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task"
                className="flex-1 p-2 border rounded-l"
              />
              <input
                type="number"
                min="1"
                value={taskPoints}
                onChange={(e) => setTaskPoints(parseInt(e.target.value) || 1)}
                className="w-16 p-2 border-t border-b"
              />
              <button 
                onClick={addTask}
                className="bg-blue-500 text-white p-2 rounded-r"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-3 border rounded flex flex-col ${task.completed ? 'bg-gray-100' : ''}`}
                >
                  <div className="flex justify-between">
                    <span className={`${task.completed ? 'line-through' : ''}`}>
                      {task.title} ({task.points} pts)
                    </span>
                    <button 
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`p-1 rounded ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                      {task.completed ? '✓' : 'Complete'}
                    </button>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <select
                      value={task.assignedTo || ''}
                      onChange={(e) => assignUserToTask(task.id, e.target.value)}
                      className="border p-1 rounded text-sm"
                    >
                      <option value="">Unassigned</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => toggleLocationStatus(task.id)}
                      className={`p-1 rounded text-sm ${task.locationSet ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {task.locationSet ? '📍 Location Set' : 'Set Location'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Game</h1>
      
      {/* User Management */}
      <div className="mb-6">
        <div className="flex mb-2">
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="New user name"
            className="flex-1 p-2 border rounded-l"
          />
          <button 
            onClick={addUser}
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            Add User
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {users.map(user => (
            <button
              key={user.id} 
              className={`px-3 py-1 rounded-full ${currentUserId === user.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{backgroundColor: user.color}}
              onClick={() => setCurrentUserId(user.id)}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {['tasks', 'map', 'scoreboard', 'chat'].map((tab) => (
          <button
            key={tab}
            className={`pb-2 px-4 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default App;
