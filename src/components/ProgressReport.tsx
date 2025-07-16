import React from 'react';
import { Calendar, Target, BookOpen, Dumbbell, TrendingUp, Award, Clock, Heart, Brain, MapPin, Scale } from 'lucide-react';
import { UserData } from '../types/UserData';

interface ProgressReportProps {
  userData: UserData;
}

const ProgressReport: React.FC<ProgressReportProps> = ({ userData }) => {
  const weightLoss = userData.startWeight - userData.currentWeight;
  const weightProgress = ((weightLoss / (userData.startWeight - userData.targetWeight)) * 100);
  const studyProgress = (userData.modulesCompleted / userData.totalModules) * 100;
  const gymProgress = (userData.weeklyWorkouts / userData.targetWorkouts) * 100;
  const walkingProgress = (userData.dailySteps / userData.targetSteps) * 100;
  const cravingResistanceRate = userData.cravingHistory.length > 0 
    ? (userData.totalCravingsResisted / userData.cravingHistory.length) * 100 
    : 0;

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

  const getRecommendations = () => {
    const recommendations = [];
    
    if (weightLoss < 4) {
      recommendations.push('Consider reviewing your diet and increasing cardio intensity');
    }
    
    if (userData.totalStudyHours < 100) {
      recommendations.push('Aim for consistent 3+ hours of daily study');
    }
    
    if (userData.weeklyWorkouts < 6) {
      recommendations.push('Try to complete 6 gym sessions per week');
    }
    
    if (userData.dailySteps < 10000) {
      recommendations.push('Increase daily steps to at least 10,000');
    }
    
    if (userData.cravingStreak < 7) {
      recommendations.push('Focus on building craving resistance streak');
    }
    
    return recommendations;
  };

  return (
    <div className="space-y-8">
      {/* Overall Progress Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <TrendingUp className="h-8 w-8 mr-3" />
          6-Month Transformation Progress Report
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Scale className="h-6 w-6 mr-2" />
              <h3 className="font-semibold">Weight Loss</h3>
            </div>
            <p className="text-2xl font-bold">{weightLoss.toFixed(1)}kg</p>
            <p className="text-sm opacity-90">{Math.round(weightProgress)}% of target</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <BookOpen className="h-6 w-6 mr-2" />
              <h3 className="font-semibold">Study Progress</h3>
            </div>
            <p className="text-2xl font-bold">{userData.modulesCompleted}/102</p>
            <p className="text-sm opacity-90">{Math.round(studyProgress)}% complete</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Dumbbell className="h-6 w-6 mr-2" />
              <h3 className="font-semibold">Fitness</h3>
            </div>
            <p className="text-2xl font-bold">{userData.totalWorkoutHours}h</p>
            <p className="text-sm opacity-90">{userData.gymStreak} week streak</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <MapPin className="h-6 w-6 mr-2" />
              <h3 className="font-semibold">Walking</h3>
            </div>
            <p className="text-2xl font-bold">{(userData.dailySteps / 1000).toFixed(1)}K</p>
            <p className="text-sm opacity-90">{userData.walkingStreak} day streak</p>
          </div>
        </div>
      </div>

      {/* Detailed Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weight Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="h-6 w-6 text-red-600 mr-2" />
            Weight Loss Journey
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Start Weight:</span>
              <span className="font-medium">{userData.startWeight}kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current Weight:</span>
              <span className="font-medium">{userData.currentWeight}kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Target Weight:</span>
              <span className="font-medium">{userData.targetWeight}kg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600"
                style={{ width: `${Math.min(100, Math.max(0, weightProgress))}%` }}
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              {weightLoss.toFixed(1)}kg lost • {(userData.currentWeight - userData.targetWeight).toFixed(1)}kg remaining
            </div>
          </div>
        </div>

        {/* Study Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            Backend Engineering Course
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Current Phase:</span>
              <span className="font-medium">Phase {currentPhase}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Modules Completed:</span>
              <span className="font-medium">{userData.modulesCompleted}/102</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Study Hours:</span>
              <span className="font-medium">{userData.totalStudyHours}h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                style={{ width: `${Math.min(100, Math.max(0, studyProgress))}%` }}
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              {Math.round(studyProgress)}% Complete • {userData.studyStreak} day streak
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Goals Progress */}
      {currentMonthGoal && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
            {currentMonth} Goals Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Weight Target</h4>
              <p className="text-2xl font-bold text-red-600">{currentMonthGoal.weightTarget}kg</p>
              <p className="text-sm text-gray-600">Current: {userData.currentWeight}kg</p>
              <div className="mt-2">
                {userData.currentWeight <= currentMonthGoal.weightTarget ? (
                  <span className="text-green-600 text-sm">✅ Achieved</span>
                ) : (
                  <span className="text-orange-600 text-sm">
                    {(userData.currentWeight - currentMonthGoal.weightTarget).toFixed(1)}kg to go
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Study Modules</h4>
              <p className="text-2xl font-bold text-blue-600">{currentMonthGoal.modulesTarget}</p>
              <p className="text-sm text-gray-600">Current: {userData.modulesCompleted}</p>
              <div className="mt-2">
                {userData.modulesCompleted >= currentMonthGoal.modulesTarget ? (
                  <span className="text-green-600 text-sm">✅ Achieved</span>
                ) : (
                  <span className="text-orange-600 text-sm">
                    {currentMonthGoal.modulesTarget - userData.modulesCompleted} to go
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Steps Target</h4>
              <p className="text-2xl font-bold text-green-600">{currentMonthGoal.stepsTarget.toLocaleString()}</p>
              <p className="text-sm text-gray-600">This month: {monthlySteps.toLocaleString()}</p>
              <div className="mt-2">
                {monthlySteps >= currentMonthGoal.stepsTarget ? (
                  <span className="text-green-600 text-sm">✅ Achieved</span>
                ) : (
                  <span className="text-orange-600 text-sm">
                    {Math.round(((currentMonthGoal.stepsTarget - monthlySteps) / currentMonthGoal.stepsTarget) * 100)}% to go
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Distance Target</h4>
              <p className="text-2xl font-bold text-purple-600">{currentMonthGoal.distanceTarget}km</p>
              <p className="text-sm text-gray-600">This month: {monthlyDistance.toFixed(1)}km</p>
              <div className="mt-2">
                {monthlyDistance >= currentMonthGoal.distanceTarget ? (
                  <span className="text-green-600 text-sm">✅ Achieved</span>
                ) : (
                  <span className="text-orange-600 text-sm">
                    {(currentMonthGoal.distanceTarget - monthlyDistance).toFixed(1)}km to go
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streaks and Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Award className="h-6 w-6 text-yellow-600 mr-2" />
          Current Streaks & Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Study Streak</h4>
            <p className="text-2xl font-bold text-blue-600">{userData.studyStreak}</p>
            <p className="text-sm text-gray-600">days</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Dumbbell className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Gym Streak</h4>
            <p className="text-2xl font-bold text-purple-600">{userData.gymStreak}</p>
            <p className="text-sm text-gray-600">weeks</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Walking Streak</h4>
            <p className="text-2xl font-bold text-green-600">{userData.walkingStreak}</p>
            <p className="text-sm text-gray-600">days</p>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <Brain className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Craving Control</h4>
            <p className="text-2xl font-bold text-indigo-600">{userData.cravingStreak}</p>
            <p className="text-sm text-gray-600">days</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Target className="h-6 w-6 mr-2" />
          Recommendations for Better Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getRecommendations().map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-lg">💡</span>
              <p className="text-sm opacity-90">{recommendation}</p>
            </div>
          ))}
          {getRecommendations().length === 0 && (
            <div className="col-span-2 text-center">
              <p className="text-lg font-semibold">🎉 Excellent Progress!</p>
              <p className="text-sm opacity-90">You're on track with all your goals. Keep up the great work!</p>
            </div>
          )}
        </div>
      </div>

      {/* Time Remaining */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Clock className="h-6 w-6 text-indigo-600 mr-2" />
          Transformation Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="text-lg font-semibold text-gray-900">July 1, 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Target Date</p>
            <p className="text-lg font-semibold text-gray-900">December 31, 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-lg font-semibold text-gray-900">6 Months</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-indigo-900 font-medium">
            🎯 Stay focused on your daily habits - they compound into extraordinary results!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;