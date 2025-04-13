import React, { useState } from 'react';
import { useUserStore } from '../stores/userStore';

export const UserManagement: React.FC = () => {
  const { users, addUser, getUser } = useUserStore();
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = () => {
    if (newUserName.trim()) {
      addUser(newUserName);
      setNewUserName('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">👥 Manage Users</h2>
        
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Current Users</h3>
          {users.map((user) => (
            <div key={user.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
              <span>{user.name}</span>
              <span className="text-sm text-gray-500">ID: {user.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
