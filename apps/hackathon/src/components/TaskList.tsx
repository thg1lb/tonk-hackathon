import React, { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';

export const TaskList: React.FC = () => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const { tasks, addTask, toggleTask, removeTask } = useTaskStore();
  const { users, getUser } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), selectedUser);
      setNewTaskTitle('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
        <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
        </div>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Select user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </form>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-3 bg-white rounded shadow"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4"
              />
              <div className="flex flex-col">
                <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                <span className="text-sm text-gray-500">
                  {task.assignedTo ? `Assigned to: ${getUser(task.assignedTo)?.name}` : 'Unassigned'}
                </span>
              </div>
            </div>
            <button
              onClick={() => removeTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
