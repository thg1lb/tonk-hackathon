import React, { useState } from 'react';
import { useGameStore } from './stores/gameStore';
import { TaskManager } from './components/TaskManager';
import { Chat } from './components/Chat';
import { Map } from './components/Map';
import { Tabs } from './components/Tabs';

export const Game = () => {
  const { currentUser, users, addUser } = useGameStore();
  const [username, setUsername] = useState('');

  if (!currentUser) {
    return (
      <div className="login">
        <h2>Enter Your Name</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
        />
        <button onClick={() => username.trim() && addUser(username)}>
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="user-panel">
        <img src={currentUser.avatar} alt={currentUser.name} />
        <div>
          <h3>{currentUser.name}</h3>
          <p>Score: {currentUser.score}</p>
        </div>
      </div>
      <Tabs tabs={[
        {
          id: 'tasks',
          label: 'Tasks',
          content: <TaskManager />
        },
        {
          id: 'chat',
          label: 'Chat',
          content: <Chat />
        },
        {
          id: 'map',
          label: 'Map',
          content: <Map />
        }
      ]} />
    </div>
  );
};
