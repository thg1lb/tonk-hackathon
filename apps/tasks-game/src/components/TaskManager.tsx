import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { FaTrash } from 'react-icons/fa';

export const TaskManager = () => {
  const { tasks, addTask, toggleTask, removeTask } = useGameStore();
  const [taskText, setTaskText] = useState('');

  return (
    <div className="task-manager">
      <h3>Tasks</h3>
      <div className="task-input">
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add task"
        />
        <button onClick={() => {
          addTask(taskText);
          setTaskText('');
        }}>
          Add
        </button>
      </div>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span>{task.text}</span>
            <button 
              className="delete-btn"
              onClick={() => removeTask(task.id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
