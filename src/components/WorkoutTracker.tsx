import React, { useState } from 'react';
import { Dumbbell, Clock, Target, Zap, Plus, TrendingUp } from 'lucide-react';
import { UserData, WorkoutSession } from '../types/UserData';

interface WorkoutTrackerProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  addWorkoutSession: (session: Omit<WorkoutSession, 'id'>) => void;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ userData, updateUserData, addWorkoutSession }) => {
  const [workoutType, setWorkoutType] = useState<'upper' | 'lower' | 'full' | 'hiit' | 'cardio' | 'recovery'>('upper');
  const [duration, setDuration] = useState(0);
  const [exercises, setExercises] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const gymProgress = (userData.weeklyWorkouts / userData.targetWorkouts) * 100;
  const weeklyTargetHours = 12;
  const totalTargetHours = weeklyTargetHours * 24; // 24 weeks

  const workoutTypes = [
    { id: 'upper', name: 'Upper Body Power', duration: 2, description: 'Chest, Back, Shoulders, Arms' },
    { id: 'lower', name: 'Lower Body Power', duration: 2, description: 'Legs, Glutes, Calves' },
    { id: 'full', name: 'Full Body Circuit', duration: 2, description: 'Compound movements, circuits' },
    { id: 'hiit', name: 'HIIT + Core', duration: 2, description: 'High intensity intervals, core work' },
    { id: 'cardio', name: 'Cardio Focus', duration: 2, description: 'Battle rope, cycling, jogging' },
    { id: 'recovery', name: 'Active Recovery', duration: 2, description: 'Light cardio, stretching' }
  ];

  const weeklySchedule = [
    { day: 'Saturday', type: 'Upper Body Power + Cardio', duration: 2 },
    { day: 'Sunday', type: 'Lower Body Power + Cardio', duration: 2 },
    { day: 'Monday', type: 'Full Body Circuit + Cardio', duration: 2 },
    { day: 'Tuesday', type: 'Upper Body Strength + Cardio', duration: 2 },
    { day: 'Wednesday', type: 'HIIT + Core Blast', duration: 2 },
    { day: 'Thursday', type: 'Active Recovery + Cardio', duration: 2 },
    { day: 'Friday', type: 'Extended Gym Session', duration: 2.5 }
  ];

  const handleAddWorkoutSession = async () => {
    if (duration <= 0) return;


    const exerciseList = exercises.split(',').map(e => e.trim()).filter(e => e.length > 0);

    addWorkoutSession({
      date: new Date().toISOString().split('T')[0],
      type: workoutType,
      duration,
      exercises: exerciseList,
      notes: notes.trim() || undefined
    });

    // Reset form
    setDuration(0);
    setExercises('');
    setNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Workouts</p>
              <p className="text-3xl font-bold text-gray-900">{userData.weeklyWorkouts}/{userData.targetWorkouts}</p>
            </div>
            <Dumbbell className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-3xl font-bold text-green-600">{userData.totalWorkoutHours}h</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gym Streak</p>
              <p className="text-3xl font-bold text-orange-600">{userData.gymStreak}</p>
            </div>
            <Zap className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Progress</p>
              <p className="text-3xl font-bold text-blue-600">{Math.round(gymProgress)}%</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Workout Session Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Plus className="h-6 w-6 text-indigo-600 mr-2" />
          Log Workout Session
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workout Type</label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {workoutTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              step="0.5"
              min="0"
              max="4"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercises (comma-separated)</label>
            <input
              type="text"
              value={exercises}
              onChange={(e) => setExercises(e.target.value)}
              placeholder="e.g., Bench Press, Squats, Deadlifts"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Great energy, increased weights"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={handleAddWorkoutSession}
          disabled={duration <= 0}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Workout Session
        </button>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
          Weekly Workout Progress
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Workouts: {userData.weeklyWorkouts} / {userData.targetWorkouts}</span>
            <span>Hours: {userData.totalWorkoutHours} / {totalTargetHours}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, gymProgress))}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            {Math.round(gymProgress)}% of weekly target completed
          </div>
        </div>
      </div>

      {/* Workout Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Workout Schedule</h3>
        <div className="space-y-3">
          {weeklySchedule.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">{schedule.day}</h4>
                <p className="text-sm text-gray-600">{schedule.type}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{schedule.duration}h</p>
                <p className="text-sm text-gray-600">Target</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Types Guide */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Workout Types Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workoutTypes.map(type => (
            <div key={type.id} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{type.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{type.description}</p>
              <p className="text-sm text-indigo-600 font-medium">{type.duration} hours</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workout Sessions */}
      {userData.workoutHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Workout Sessions</h3>
          <div className="space-y-3">
            {userData.workoutHistory.slice(-10).reverse().map((session, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {workoutTypes.find(t => t.id === session.type)?.name || session.type}
                    </p>
                    <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{session.duration}h</p>
                  </div>
                </div>
                {session.exercises.length > 0 && (
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Exercises:</strong> {session.exercises.join(', ')}
                  </p>
                )}
                {session.notes && (
                  <p className="text-sm text-gray-600 italic">{session.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutTracker;