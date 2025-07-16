import React, { useState } from 'react';
import { Scale, TrendingDown, Target, Calendar, Plus } from 'lucide-react';
import { UserData, WeightEntry } from '../types/UserData';

interface WeightTrackerProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({ userData, updateUserData, addWeightEntry }) => {
  const [newWeight, setNewWeight] = useState(userData.currentWeight);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const weightLoss = userData.startWeight - userData.currentWeight;
  const weightProgress = ((weightLoss / (userData.startWeight - userData.targetWeight)) * 100);
  const remainingWeight = userData.currentWeight - userData.targetWeight;

  const handleAddWeightEntry = async () => {
    addWeightEntry({
      date: new Date().toISOString().split('T')[0],
      weight: newWeight,
      notes: notes.trim() || undefined
    });
    
    setNotes('');
  };

  const monthlyTargets = [
    { month: 'July', target: 110, current: userData.currentWeight },
    { month: 'August', target: 106, current: userData.currentWeight },
    { month: 'September', target: 102, current: userData.currentWeight },
    { month: 'October', target: 98, current: userData.currentWeight },
    { month: 'November', target: 94, current: userData.currentWeight },
    { month: 'December', target: 90, current: userData.currentWeight }
  ];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Weight</p>
              <p className="text-3xl font-bold text-gray-900">{userData.currentWeight}kg</p>
            </div>
            <Scale className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weight Lost</p>
              <p className="text-3xl font-bold text-green-600">{weightLoss.toFixed(1)}kg</p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-3xl font-bold text-orange-600">{remainingWeight.toFixed(1)}kg</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-3xl font-bold text-purple-600">{Math.round(weightProgress)}%</p>
            </div>
            <div className="text-purple-600">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Weight Entry Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Plus className="h-6 w-6 text-indigo-600 mr-2" />
          Log Weight Entry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              step="0.1"
              min="70"
              max="150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., morning weigh-in, after workout"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddWeightEntry}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Weight Loss Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Start: {userData.startWeight}kg</span>
            <span>Current: {userData.currentWeight}kg</span>
            <span>Target: {userData.targetWeight}kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, weightProgress))}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            {weightLoss.toFixed(1)}kg lost of {(userData.startWeight - userData.targetWeight).toFixed(1)}kg target
          </div>
        </div>
      </div>

      {/* Monthly Targets */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
          Monthly Weight Targets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthlyTargets.map((target, index) => {
            const isAchieved = userData.currentWeight <= target.target;
            const isCurrent = index === new Date().getMonth() - 6; // July = 0
            
            return (
              <div
                key={target.month}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isAchieved
                    ? 'border-green-500 bg-green-50'
                    : isCurrent
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{target.month}</h4>
                    <p className="text-sm text-gray-600">Target: {target.target}kg</p>
                  </div>
                  <div className="text-right">
                    {isAchieved ? (
                      <div className="text-green-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {(userData.currentWeight - target.target).toFixed(1)}kg to go
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Weight History */}
      {userData.weightHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Weight Entries</h3>
          <div className="space-y-3">
            {userData.weightHistory.slice(-10).reverse().map((entry, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{entry.weight}kg</p>
                  <p className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</p>
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

export default WeightTracker;