import React, { useState, useEffect, useRef } from 'react';
import { useChatStore, ChatChannel } from '../stores/chatStore';
import { useUserStore } from '../stores/userStore';
import { useTaskStore } from '../stores/taskStore';

export const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');

  const [selectedTask, setSelectedTask] = useState('');
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('public');
  const [directMessageUser, setDirectMessageUser] = useState<string>('');
  const { messages, currentUserId, setCurrentUser, getChannelMessages } = useChatStore();
  const { users } = useUserStore();
  const { tasks } = useTaskStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set current user if not set
  useEffect(() => {
    if (!currentUserId && users.length > 0) {
      setCurrentUser(users[0].id);
    }
  }, [currentUserId, users, setCurrentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentUserId) {
      const chatStore = useChatStore.getState();
      if (activeChannel === 'direct' && directMessageUser) {
        chatStore.addMessage(currentUserId, message.trim(), 'direct', { recipientId: directMessageUser });
      } else if (activeChannel === 'tasks' && selectedTask) {
        chatStore.addMessage(currentUserId, message.trim(), 'tasks', { relatedTaskId: selectedTask });
      } else {
        chatStore.addMessage(currentUserId, message.trim(), activeChannel);
      }
      setMessage('');
    }
  };

  const displayMessages = activeChannel === 'direct'
    ? getChannelMessages('direct', directMessageUser)
    : getChannelMessages(activeChannel);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md">
        {/* Channel Selection */}
        <div className="p-4 border-b flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveChannel('public')}
              className={`px-3 py-1 rounded ${activeChannel === 'public' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Public
            </button>
            <button
              onClick={() => setActiveChannel('tasks')}
              className={`px-3 py-1 rounded ${activeChannel === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveChannel('direct')}
              className={`px-3 py-1 rounded ${activeChannel === 'direct' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Direct Messages
            </button>
          </div>

          {/* User Selection */}
          <select
            value={currentUserId || ''}
            onChange={(e) => setCurrentUser(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="">Select your user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {displayMessages.map((msg) => {
            const user = useUserStore.getState().getUser(msg.userId);
            const task = msg.relatedTaskId 
              ? useTaskStore.getState().tasks.find(t => t.id === msg.relatedTaskId)
              : null;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.type === 'message' ? 'bg-gray-50' : 'bg-blue-50'
                } rounded-lg p-3`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">
                    {msg.userId === 'system' ? 'System' : user?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{msg.content}</p>
                {task && (
                  <div className="mt-2 text-sm text-gray-500">
                    Re: {task.title}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          {activeChannel === 'direct' && (
            <div className="mb-2">
              <select
                value={directMessageUser}
                onChange={(e) => setDirectMessageUser(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required={activeChannel === 'direct'}
              >
                <option value="">Select user to message...</option>
                {users
                  .filter(user => user.id !== currentUserId)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {activeChannel === 'tasks' && (
            <div className="mb-2">
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required={activeChannel === 'tasks'}
              >
                <option value="">Select related task...</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!currentUserId || !message.trim() || 
                (activeChannel === 'direct' && !directMessageUser) ||
                (activeChannel === 'tasks' && !selectedTask)}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
