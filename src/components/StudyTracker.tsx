import React, { useState } from 'react';
import { BookOpen, Clock, Target, Award, Plus, TrendingUp } from 'lucide-react';
import { UserData, StudySession } from '../types/UserData';

interface StudyTrackerProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  addStudySession: (session: Omit<StudySession, 'id'>) => void;
}

const StudyTracker: React.FC<StudyTrackerProps> = ({ userData, updateUserData, addStudySession }) => {
  const [sessionHours, setSessionHours] = useState(0);
  const [sessionModules, setSessionModules] = useState('');
  const [sessionTopics, setSessionTopics] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const studyProgress = (userData.modulesCompleted / userData.totalModules) * 100;
  const weeklyHoursTarget = 25.5;
  const totalTargetHours = weeklyHoursTarget * 24; // 24 weeks

  const phases = [
    { name: 'Phase 1: Fundamentals', modules: '1-11', weeks: '6-8', focus: 'Data Structures & Algorithms' },
    { name: 'Phase 2: Systems Programming', modules: '12-20', weeks: '8-10', focus: 'Redis Implementation, Networking' },
    { name: 'Phase 3: Web Development', modules: '21-31', weeks: '8-10', focus: 'FastAPI, Authentication, APIs' },
    { name: 'Phase 4: Containerization', modules: '32-45', weeks: '6-8', focus: 'Docker, DevOps, CI/CD' },
    { name: 'Phase 5: Cloud & AWS', modules: '46-49', weeks: '4-6', focus: 'AWS Services, Deployment' },
    { name: 'Phase 6: Advanced Backend', modules: '50-83', weeks: '12-14', focus: 'Distributed Systems, Real-time' },
    { name: 'Phase 7: Workflow Orchestration', modules: '84-91', weeks: '4-6', focus: 'Temporal, Complex Workflows' },
    { name: 'Phase 8: Platform Engineering', modules: '92-102', weeks: '6-8', focus: 'Multi-tenant Cloud Platform' }
  ];

  const handleAddStudySession = async () => {
    if (sessionHours <= 0) return;


    const modules = sessionModules.split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m));
    const topics = sessionTopics.split(',').map(t => t.trim()).filter(t => t.length > 0);

    // Calculate the highest module number completed
    const highestModule = modules.length > 0 ? Math.max(...modules) : 0;
    
    // Update modules completed if we have a higher module number
    const newModulesCompleted = Math.max(userData.modulesCompleted, highestModule);
    addStudySession({
      date: new Date().toISOString().split('T')[0],
      hours: sessionHours,
      modules,
      topics,
      notes: sessionNotes.trim() || undefined
    });

    // Update the modules completed count
    if (newModulesCompleted > userData.modulesCompleted) {
      updateUserData({ 
        modulesCompleted: newModulesCompleted,
        lastUpdated: new Date().toISOString()
      });
    }
    // Reset form
    setSessionHours(0);
    setSessionModules('');
    setSessionTopics('');
    setSessionNotes('');
  };

  const getCurrentPhase = () => {
    if (userData.modulesCompleted <= 11) return 1;
    if (userData.modulesCompleted <= 20) return 2;
    if (userData.modulesCompleted <= 31) return 3;
    if (userData.modulesCompleted <= 45) return 4;
    if (userData.modulesCompleted <= 49) return 5;
    if (userData.modulesCompleted <= 83) return 6;
    if (userData.modulesCompleted <= 91) return 7;
    return 8;
  };

  const currentPhase = getCurrentPhase();

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Modules Completed</p>
              <p className="text-3xl font-bold text-gray-900">{userData.modulesCompleted}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-3xl font-bold text-green-600">{userData.totalStudyHours}h</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-3xl font-bold text-orange-600">{userData.studyStreak}</p>
            </div>
            <Award className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Phase</p>
              <p className="text-3xl font-bold text-purple-600">{currentPhase}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Study Session Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Plus className="h-6 w-6 text-indigo-600 mr-2" />
          Log Study Session
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hours Studied</label>
            <input
              type="number"
              value={sessionHours}
              onChange={(e) => setSessionHours(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              step="0.5"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modules Covered (comma-separated)</label>
            <input
              type="text"
              value={sessionModules}
              onChange={(e) => setSessionModules(e.target.value)}
              placeholder="e.g., 15, 16, 17"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topics Studied (comma-separated)</label>
            <input
              type="text"
              value={sessionTopics}
              onChange={(e) => setSessionTopics(e.target.value)}
              placeholder="e.g., Redis, Networking, TCP"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="e.g., Completed lab exercise, struggled with concept"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={handleAddStudySession}
          disabled={sessionHours <= 0}
          className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Study Session
        </button>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
          Course Progress
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Modules: {userData.modulesCompleted} / {userData.totalModules}</span>
            <span>Hours: {userData.totalStudyHours} / {totalTargetHours}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, studyProgress))}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            {Math.round(studyProgress)}% Complete
          </div>
        </div>
      </div>

      {/* Course Phases */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Course Phases</h3>
        <div className="space-y-4">
          {phases.map((phase, index) => {
            const phaseNumber = index + 1;
            const isCompleted = currentPhase > phaseNumber;
            const isCurrent = currentPhase === phaseNumber;
            
            return (
              <div
                key={phaseNumber}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isCompleted
                    ? 'border-green-500 bg-green-50'
                    : isCurrent
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{phase.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">Modules {phase.modules} • {phase.weeks} weeks</p>
                    <p className="text-sm text-gray-700 mt-2">{phase.focus}</p>
                  </div>
                  <div className="ml-4">
                    {isCompleted ? (
                      <div className="text-green-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : isCurrent ? (
                      <div className="text-indigo-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Study Sessions */}
      {userData.studyHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Study Sessions</h3>
          <div className="space-y-3">
            {userData.studyHistory.slice(-10).reverse().map((session, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{session.hours}h study session</p>
                    <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                  {session.modules.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Modules: {session.modules.join(', ')}
                    </div>
                  )}
                </div>
                {session.topics.length > 0 && (
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Topics:</strong> {session.topics.join(', ')}
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

export default StudyTracker;