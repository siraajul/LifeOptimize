import React, { useState } from 'react';
import { MapPin, Target, TrendingUp, Clock, Plus, Award, Calendar, Footprints } from 'lucide-react';
import { UserData, WalkingEntry } from '../types/UserData';

interface WalkingTrackerProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  addWalkingEntry: (entry: Omit<WalkingEntry, 'id'>) => void;
}

const WalkingTracker: React.FC<WalkingTrackerProps> = ({ userData, updateUserData, addWalkingEntry }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const stepsProgress = (userData.dailySteps / userData.targetSteps) * 100;
  const distanceProgress = (userData.dailyDistance / userData.targetDistance) * 100;
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentMonthGoal = userData.monthlyGoals[currentMonth];
  
  // Calculate monthly progress
  const currentDate = new Date();
  const currentMonthEntries = userData.walkingHistory.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === currentDate.getMonth() && 
           entryDate.getFullYear() === currentDate.getFullYear();
  });
  
  const monthlySteps = currentMonthEntries.reduce((sum, entry) => sum + entry.steps, 0);
  const monthlyDistance = currentMonthEntries.reduce((sum, entry) => sum + entry.distance, 0);
  
  const monthlyStepsProgress = currentMonthGoal ? (monthlySteps / currentMonthGoal.stepsTarget) * 100 : 0;
  const monthlyDistanceProgress = currentMonthGoal ? (monthlyDistance / currentMonthGoal.distanceTarget) * 100 : 0;

  const handleAddWalkingEntry = () => {
    if (steps <= 0 && distance <= 0) return;

    addWalkingEntry({
      date: new Date().toISOString().split('T')[0],
      steps,
      distance,
      duration,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined
    });

    // Reset form
    setSteps(0);
    setDistance(0);
    setDuration(0);
    setLocation('');
    setNotes('');
  };

  const getWalkingTips = () => [
    { icon: '🌅', tip: 'Morning walks boost metabolism and energy for the day' },
    { icon: '🏃‍♂️', tip: 'Aim for 120-130 steps per minute for optimal fat burning' },
    { icon: '📱', tip: 'Use a step counter app or fitness tracker for accuracy' },
    { icon: '🎵', tip: 'Listen to podcasts or music to make walks enjoyable' },
    { icon: '🌳', tip: 'Vary your routes - parks, neighborhoods, malls' },
    { icon: '💧', tip: 'Stay hydrated, especially during longer walks' },
    { icon: '👟', tip: 'Invest in good walking shoes to prevent injuries' },
    { icon: '⏰', tip: 'Break it up: 6000 steps morning + 6000 steps evening' }
  ];

  const walkingMilestones = [
    { title: 'First 10K Day', target: 10000, achieved: userData.dailySteps >= 10000, description: 'Reached basic fitness goal' },
    { title: 'Target Achiever', target: 12000, achieved: userData.dailySteps >= 12000, description: 'Daily target accomplished' },
    { title: 'Distance Walker', target: 8, achieved: userData.dailyDistance >= 8, description: '8km+ in a single day' },
    { title: 'Marathon Walker', target: 15000, achieved: userData.dailySteps >= 15000, description: 'Exceeded expectations' },
    { title: 'Week Warrior', target: 7, achieved: userData.walkingStreak >= 7, description: '7-day walking streak' },
    { title: 'Monthly Master', target: 30, achieved: userData.walkingStreak >= 30, description: '30-day consistency' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Steps</p>
              <p className="text-3xl font-bold text-gray-900">{userData.dailySteps.toLocaleString()}</p>
            </div>
            <Footprints className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Distance Today</p>
              <p className="text-3xl font-bold text-blue-600">{userData.dailyDistance.toFixed(1)}km</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Walking Streak</p>
              <p className="text-3xl font-bold text-orange-600">{userData.walkingStreak}</p>
            </div>
            <Award className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Minutes</p>
              <p className="text-3xl font-bold text-purple-600">{userData.totalWalkingMinutes}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Walking Entry Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Plus className="h-6 w-6 text-indigo-600 mr-2" />
          Log Walking Session
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="0"
              max="50000"
              placeholder="e.g., 12000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              step="0.1"
              min="0"
              max="50"
              placeholder="e.g., 8.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="0"
              max="300"
              placeholder="e.g., 60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Park, Neighborhood, Mall"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Great energy, beautiful weather"
          />
        </div>
        <button
          onClick={handleAddWalkingEntry}
          disabled={steps <= 0 && distance <= 0}
          className="w-full md:w-auto bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Walking Entry
        </button>
      </div>

      {/* Daily Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 text-green-600 mr-2" />
            Daily Progress
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Steps: {userData.dailySteps.toLocaleString()} / {userData.targetSteps.toLocaleString()}</span>
                <span>{Math.round(stepsProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, stepsProgress))}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Distance: {userData.dailyDistance.toFixed(1)}km / {userData.targetDistance}km</span>
                <span>{Math.round(distanceProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, distanceProgress))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        {currentMonthGoal && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
              {currentMonth} Progress
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Steps: {monthlySteps.toLocaleString()} / {currentMonthGoal.stepsTarget.toLocaleString()}</span>
                  <span>{Math.round(monthlyStepsProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, monthlyStepsProgress))}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Distance: {monthlyDistance.toFixed(1)}km / {currentMonthGoal.distanceTarget}km</span>
                  <span>{Math.round(monthlyDistanceProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, monthlyDistanceProgress))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Targets */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
          Monthly Walking Targets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(userData.monthlyGoals).map(([month, goal]) => {
            const monthEntries = userData.walkingHistory.filter(entry => {
              const entryDate = new Date(entry.date);
              const monthIndex = ['July', 'August', 'September', 'October', 'November', 'December'].indexOf(month);
              return entryDate.getMonth() === (monthIndex + 6) % 12; // July = 6, Aug = 7, etc.
            });
            
            const monthSteps = monthEntries.reduce((sum, entry) => sum + entry.steps, 0);
            const monthDistance = monthEntries.reduce((sum, entry) => sum + entry.distance, 0);
            const stepsAchieved = monthSteps >= goal.stepsTarget;
            const distanceAchieved = monthDistance >= goal.distanceTarget;
            const isCurrent = month === currentMonth;
            
            return (
              <div
                key={month}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  stepsAchieved && distanceAchieved
                    ? 'border-green-500 bg-green-50'
                    : isCurrent
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{month}</h4>
                  {stepsAchieved && distanceAchieved ? (
                    <div className="text-green-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Steps:</span>
                    <span className={`font-medium ${stepsAchieved ? 'text-green-600' : 'text-gray-900'}`}>
                      {goal.stepsTarget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className={`font-medium ${distanceAchieved ? 'text-green-600' : 'text-gray-900'}`}>
                      {goal.distanceTarget}km
                    </span>
                  </div>
                  {isCurrent && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Current: {monthSteps.toLocaleString()} steps, {monthDistance.toFixed(1)}km
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Walking Milestones */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Award className="h-6 w-6 text-yellow-600 mr-2" />
          Walking Milestones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {walkingMilestones.map((milestone, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                milestone.achieved
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                {milestone.achieved && (
                  <div className="text-yellow-600">
                    <Award className="h-5 w-5" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
              <p className="text-xs text-gray-500">
                Target: {milestone.target.toLocaleString()} {milestone.title.includes('Distance') ? 'km' : milestone.title.includes('Week') || milestone.title.includes('Monthly') ? 'days' : 'steps'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Walking Tips */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          Walking Success Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getWalkingTips().map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-lg flex-shrink-0">{tip.icon}</span>
              <p className="text-sm opacity-90">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Walking History */}
      {userData.walkingHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Walking Sessions</h3>
          <div className="space-y-3">
            {userData.walkingHistory.slice(-10).reverse().map((entry, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {entry.steps.toLocaleString()} steps • {entry.distance.toFixed(1)}km
                    </p>
                    <p className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{entry.duration}min</p>
                    {entry.location && (
                      <p className="text-sm text-gray-600">{entry.location}</p>
                    )}
                  </div>
                </div>
                {entry.notes && (
                  <p className="text-sm text-gray-600 italic">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkingTracker;