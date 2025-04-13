import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

export const Chat = () => {
  const { messages, users, sendMessage } = useGameStore();
  const [messageText, setMessageText] = useState('');

  return (
    <div className="chat">
      <h3>Chat</h3>
      <div className="messages">
        {messages.map(msg => {
          const user = users.find(u => u.id === msg.userId);
          return (
            <div key={msg.id} className="message">
              <strong>{user?.name}:</strong> {msg.text}
            </div>
          );
        })}
      </div>
      <div className="message-input">
        <input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type message"
        />
        <button onClick={() => {
          sendMessage(messageText);
          setMessageText('');
        }}>
          Send
        </button>
      </div>
    </div>
  );
};
