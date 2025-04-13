import React from 'react';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';

export const Leaderboard: React.FC = () => {
  const { getLeaderboard } = useTaskStore();
  const { getUser } = useUserStore();
  const leaderboard = getLeaderboard();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">🏆 Leaderboard</h2>
        
        <div className="space-y-4">
          {leaderboard.map(({ userId, points }, index) => {
            const user = getUser(userId);
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            
            return (
              <div
                key={userId}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index < 3 ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{medal || `#${index + 1}`}</span>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user?.name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {points} point{points !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-3xl">
                  {points >= 100
                    ? '🌟'
                    : points >= 50
                    ? '⭐'
                    : points >= 25
                    ? '✨'
                    : ''}
                </div>
              </div>
            );
          })}

          {leaderboard.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg">No points earned yet!</p>
              <p className="text-sm mt-2">Complete tasks to earn points and appear on the leaderboard</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">How to Earn Points</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Complete tasks to earn their assigned points</li>
          <li>• Tasks can be worth different point values</li>
          <li>• Earn special badges at 25 ✨, 50 ⭐, and 100 🌟 points</li>
          <li>• Top 3 players get medals: 🥇 Gold, 🥈 Silver, 🥉 Bronze</li>
        </ul>
      </div>
    </div>
  );
};
