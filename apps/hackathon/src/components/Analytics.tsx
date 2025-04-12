import React, { useEffect } from 'react';
import { useStatsStore } from '../stores/statsStore';
import { useUserStore } from '../stores/userStore';

export const Analytics: React.FC = () => {
  const { userStats, teamStats, computeStats } = useStatsStore();
  const { users } = useUserStore();

  useEffect(() => {
    // Initial computation
    computeStats();

    // Set up an interval to recompute stats every 5 seconds
    const interval = setInterval(computeStats, 5000);
    return () => clearInterval(interval);
  }, [computeStats]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Team Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-semibold">{teamStats.totalTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Tasks</span>
              <span className="font-semibold">{teamStats.completedTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold">
                {teamStats.taskCompletionRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Messages</span>
              <span className="font-semibold">{teamStats.totalMessages}</span>
            </div>
            {teamStats.mostDiscussedTask && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Most Discussed Task
                </h3>
                <p className="text-gray-800">{teamStats.mostDiscussedTask.title}</p>
                <p className="text-sm text-gray-600">
                  {teamStats.mostDiscussedTask.messageCount} messages
                </p>
              </div>
            )}
            {teamStats.mostActiveUser && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Most Active User
                </h3>
                <p className="text-gray-800">{teamStats.mostActiveUser.name}</p>
                <p className="text-sm text-gray-600">
                  Activity Score: {teamStats.mostActiveUser.activityCount}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">User Statistics</h2>
          <div className="space-y-6">
            {users.map((user) => {
              const stats = userStats[user.id] || {
                tasksCreated: 0,
                tasksCompleted: 0,
                tasksAssigned: 0,
                messagesSent: 0,
                taskRelatedMessages: 0,
              };

              return (
                <div key={user.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Tasks Assigned</span>
                      <p className="font-semibold">{stats.tasksAssigned}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tasks Completed</span>
                      <p className="font-semibold">{stats.tasksCompleted}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Messages Sent</span>
                      <p className="font-semibold">{stats.messagesSent}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Task-Related Messages</span>
                      <p className="font-semibold">{stats.taskRelatedMessages}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Progress Bar */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Task Progress</h2>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  Task Completion
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {teamStats.taskCompletionRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${teamStats.taskCompletionRate}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
