import React, { useState } from 'react';
import { Brain, Clock, TrendingDown, Target, Plus, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { UserData, CravingEntry } from '../types/UserData';

interface CravingTrackerProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  addCravingEntry: (entry: Omit<CravingEntry, 'id'>) => void;
}

const CravingTracker: React.FC<CravingTrackerProps> = ({ userData, updateUserData, addCravingEntry }) => {
  const [food, setFood] = useState('');
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [trigger, setTrigger] = useState<'stress' | 'boredom' | 'emotion' | 'hunger' | 'habit' | 'social' | 'other'>('hunger');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState<'happy' | 'sad' | 'stressed' | 'anxious' | 'bored' | 'tired' | 'neutral'>('neutral');
  const [action, setAction] = useState<'resisted' | 'gave_in' | 'substituted' | 'delayed'>('resisted');
  const [substitute, setSubstitute] = useState('');
  const [notes, setNotes] = useState('');

  const totalCravings = userData.cravingHistory.length;
  const resistedCravings = userData.cravingHistory.filter(c => c.action === 'resisted' || c.action === 'substituted').length;
  const resistanceRate = totalCravings > 0 ? (resistedCravings / totalCravings) * 100 : 0;

  const triggers = [
    { id: 'stress', name: 'Stress', icon: '😰', color: 'red' },
    { id: 'boredom', name: 'Boredom', icon: '😑', color: 'yellow' },
    { id: 'emotion', name: 'Emotional', icon: '😢', color: 'purple' },
    { id: 'hunger', name: 'Hunger', icon: '🍽️', color: 'green' },
    { id: 'habit', name: 'Habit', icon: '🔄', color: 'blue' },
    { id: 'social', name: 'Social', icon: '👥', color: 'indigo' },
    { id: 'other', name: 'Other', icon: '❓', color: 'gray' }
  ];

  const moods = [
    { id: 'happy', name: 'Happy', icon: '😊', color: 'green' },
    { id: 'sad', name: 'Sad', icon: '😢', color: 'blue' },
    { id: 'stressed', name: 'Stressed', icon: '😰', color: 'red' },
    { id: 'anxious', name: 'Anxious', icon: '😟', color: 'orange' },
    { id: 'bored', name: 'Bored', icon: '😑', color: 'yellow' },
    { id: 'tired', name: 'Tired', icon: '😴', color: 'purple' },
    { id: 'neutral', name: 'Neutral', icon: '😐', color: 'gray' }
  ];

  const actions = [
    { id: 'resisted', name: 'Successfully Resisted', icon: '💪', color: 'green' },
    { id: 'substituted', name: 'Healthy Substitute', icon: '🔄', color: 'blue' },
    { id: 'delayed', name: 'Delayed Decision', icon: '⏰', color: 'yellow' },
    { id: 'gave_in', name: 'Gave In', icon: '😔', color: 'red' }
  ];

  const handleAddCraving = () => {
    if (!food.trim()) return;

    const now = new Date();
    addCravingEntry({
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].substring(0, 5),
      food: food.trim(),
      intensity,
      trigger,
      location: location.trim() || 'Not specified',
      mood,
      action,
      substitute: action === 'substituted' ? substitute.trim() : undefined,
      notes: notes.trim() || undefined
    });

    // Reset form
    setFood('');
    setIntensity(3);
    setTrigger('hunger');
    setLocation('');
    setMood('neutral');
    setAction('resisted');
    setSubstitute('');
    setNotes('');
  };

  const getTriggerStats = () => {
    const triggerCounts = userData.cravingHistory.reduce((acc, craving) => {
      acc[craving.trigger] = (acc[craving.trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return triggers.map(trigger => ({
      ...trigger,
      count: triggerCounts[trigger.id] || 0,
      percentage: totalCravings > 0 ? ((triggerCounts[trigger.id] || 0) / totalCravings) * 100 : 0
    }));
  };

  const getIntensityStats = () => {
    const intensityCounts = userData.cravingHistory.reduce((acc, craving) => {
      acc[craving.intensity] = (acc[craving.intensity] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return [1, 2, 3, 4, 5].map(level => ({
      level,
      count: intensityCounts[level] || 0,
      percentage: totalCravings > 0 ? ((intensityCounts[level] || 0) / totalCravings) * 100 : 0
    }));
  };

  const getRecentCravings = () => {
    return userData.cravingHistory
      .slice(-10)
      .reverse()
      .map(craving => ({
        ...craving,
        triggerInfo: triggers.find(t => t.id === craving.trigger),
        moodInfo: moods.find(m => m.id === craving.mood),
        actionInfo: actions.find(a => a.id === craving.action)
      }));
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cravings</p>
              <p className="text-3xl font-bold text-gray-900">{totalCravings}</p>
            </div>
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successfully Resisted</p>
              <p className="text-3xl font-bold text-green-600">{resistedCravings}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resistance Rate</p>
              <p className="text-3xl font-bold text-blue-600">{Math.round(resistanceRate)}%</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-orange-600">{userData.cravingStreak}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Craving Entry Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Plus className="h-6 w-6 text-indigo-600 mr-2" />
          Log Craving Experience
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Craved</label>
            <input
              type="text"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="e.g., Chocolate, Pizza, Ice cream"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Home, Office, Restaurant"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Intensity (1-5)</label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={1}>1 - Mild</option>
              <option value={2}>2 - Light</option>
              <option value={3}>3 - Moderate</option>
              <option value={4}>4 - Strong</option>
              <option value={5}>5 - Intense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {triggers.map(t => (
                <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {moods.map(m => (
                <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action Taken</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {actions.map(a => (
                <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
              ))}
            </select>
          </div>
          {action === 'substituted' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Healthy Substitute</label>
              <input
                type="text"
                value={substitute}
                onChange={(e) => setSubstitute(e.target.value)}
                placeholder="e.g., Apple, Nuts, Water"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional thoughts, strategies used, etc."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleAddCraving}
          disabled={!food.trim()}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Log Craving
        </button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trigger Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
            Trigger Analysis
          </h3>
          <div className="space-y-4">
            {getTriggerStats().map(trigger => (
              <div key={trigger.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{trigger.icon}</span>
                  <span className="font-medium text-gray-900">{trigger.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${trigger.color}-500`}
                      style={{ width: `${trigger.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{trigger.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intensity Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Intensity Distribution</h3>
          <div className="space-y-4">
            {getIntensityStats().map(stat => (
              <div key={stat.level} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">Level {stat.level}</span>
                  <span className="text-sm text-gray-600">
                    {stat.level === 1 ? 'Mild' : 
                     stat.level === 2 ? 'Light' :
                     stat.level === 3 ? 'Moderate' :
                     stat.level === 4 ? 'Strong' : 'Intense'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.level <= 2 ? 'bg-green-500' :
                        stat.level === 3 ? 'bg-yellow-500' :
                        stat.level === 4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Tips */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <CheckCircle className="h-6 w-6 mr-2" />
          Craving Management Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">🧠 Mental Strategies</h4>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Practice the 10-minute rule</li>
              <li>• Use mindful breathing techniques</li>
              <li>• Identify emotional triggers</li>
              <li>• Visualize your goals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🥗 Physical Strategies</h4>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Drink water first</li>
              <li>• Keep healthy substitutes ready</li>
              <li>• Go for a short walk</li>
              <li>• Brush your teeth</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Cravings */}
      {userData.cravingHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="h-6 w-6 text-indigo-600 mr-2" />
            Recent Craving Logs
          </h3>
          <div className="space-y-4">
            {getRecentCravings().map((craving, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{craving.food}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(craving.date).toLocaleDateString()} at {craving.time} • {craving.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{craving.actionInfo?.icon}</span>
                    <span className={`text-sm font-medium ${
                      craving.action === 'resisted' || craving.action === 'substituted' 
                        ? 'text-green-600' 
                        : craving.action === 'delayed' 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {craving.actionInfo?.name}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span>Intensity: {craving.intensity}/5</span>
                  <span>{craving.triggerInfo?.icon} {craving.triggerInfo?.name}</span>
                  <span>{craving.moodInfo?.icon} {craving.moodInfo?.name}</span>
                </div>
                
                {craving.substitute && (
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Substitute:</strong> {craving.substitute}
                  </p>
                )}
                
                {craving.notes && (
                  <p className="text-sm text-gray-600 italic">{craving.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CravingTracker;