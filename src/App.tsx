import React, { useState } from 'react';
import { Calendar, Target, BookOpen, Dumbbell, TrendingUp, Award, Clock, Heart } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import WeightTracker from './components/WeightTracker';
import StudyTracker from './components/StudyTracker';
import WorkoutTracker from './components/WorkoutTracker';
import WalkingTracker from './components/WalkingTracker';
import CravingTracker from './components/CravingTracker';
import ScheduleView from './components/ScheduleView';
import ProgressReport from './components/ProgressReport';
import DataManager from './components/DataManager';
import Navigation from './components/Navigation';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { 
    userData, 
    loading, 
    updateUserData, 
    addWeightEntry, 
    addStudySession, 
    addWorkoutSession,
    addWalkingEntry,
    addCravingEntry,
    exportData,
    importData,
    resetData
  } = useLocalStorage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl inline-block mb-4">
            <Target className="h-12 w-12 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Progress</h2>
          <p className="text-gray-600">Setting up your transformation tracker...</p>
        </div>
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userData={userData} updateUserData={updateUserData} />;
      case 'weight':
        return <WeightTracker userData={userData} updateUserData={updateUserData} addWeightEntry={addWeightEntry} />;
      case 'study':
        return <StudyTracker userData={userData} updateUserData={updateUserData} addStudySession={addStudySession} />;
      case 'workout':
        return <WorkoutTracker userData={userData} updateUserData={updateUserData} addWorkoutSession={addWorkoutSession} />;
      case 'walking':
        return <WalkingTracker userData={userData} updateUserData={updateUserData} addWalkingEntry={addWalkingEntry} />;
      case 'cravings':
        return <CravingTracker userData={userData} updateUserData={updateUserData} addCravingEntry={addCravingEntry} />;
      case 'schedule':
        return <ScheduleView userData={userData} updateUserData={updateUserData} />;
      case 'progress':
        return <ProgressReport userData={userData} />;
      case 'data':
        return <DataManager onExport={exportData} onImport={importData} onReset={resetData} />;
      default:
        return <Dashboard userData={userData} updateUserData={updateUserData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Life Optimization Tracker
                </h1>
                <p className="text-gray-600 text-sm">
                  6-Month Transformation: Backend Engineering + 24kg Weight Loss
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="text-gray-700">July - December 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-gray-700">Target: 90kg & 102 Modules</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Browser Storage</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveComponent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Comprehensive Life Optimization Plan - Professional Growth + Health Transformation
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Stay consistent, track progress, achieve greatness • Data stored locally in your browser
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;