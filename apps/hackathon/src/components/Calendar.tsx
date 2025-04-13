import React, { useState } from 'react';
import { useCalendarStore } from '../stores/calendarStore';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';

export const Calendar: React.FC = () => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    relatedTaskId: '',
    attendees: [] as string[],
  });

  const { events, addEvent, removeEvent } = useCalendarStore();
  const { tasks } = useTaskStore();
  const { users } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.startTime && newEvent.endTime) {
      addEvent(newEvent);
      setNewEvent({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        relatedTaskId: '',
        attendees: [],
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Related Task</label>
            <select
              value={newEvent.relatedTaskId}
              onChange={(e) => setNewEvent({ ...newEvent, relatedTaskId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">None</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Attendees</label>
            <select
              multiple
              value={newEvent.attendees}
              onChange={(e) => setNewEvent({
                ...newEvent,
                attendees: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Event
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {events
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map((event) => {
              const relatedTask = tasks.find((t) => t.id === event.relatedTaskId);
              return (
                <div key={event.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                      </p>
                      {relatedTask && (
                        <p className="text-sm text-blue-600">Related Task: {relatedTask.title}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {event.attendees.map((attendeeId) => {
                          const user = users.find((u) => u.id === attendeeId);
                          return (
                            <span
                              key={attendeeId}
                              className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                            >
                              {user?.name || 'Unknown User'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => removeEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
