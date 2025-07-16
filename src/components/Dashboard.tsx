import React from 'react';
import { Target, BookOpen, Dumbbell, Calendar, TrendingUp, Award, Clock, Heart, Brain, MapPin } from 'lucide-react';
import { UserData } from '../types/UserData';
import StatCard from './StatCard';
import ProgressCard from './ProgressCard';

interface DashboardProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, updateUserData }) => {
  const weightLoss = userData.startWeight - userData.currentWeight;
  const weightProgress = ((weightLoss / (userData.startWeight - userData.targetWeight)) * 100);
  const studyProgress = (userData.modulesCompleted / userData.totalModules) * 100;
  const gymProgress = (userData.weeklyWorkouts / userData.targetWorkouts) * 100;
  const walkingProgress = (userData.dailySteps / userData.targetSteps) * 100;
  const cravingResistanceRate = userData.cravingHistory.length > 0 
    ? (userData.totalCravingsResisted / userData.cravingHistory.length) * 100 
    : 0;

  const quickUpdate = (field: keyof UserData, value: any) => {
    updateUserData({ [field]: value, lastUpdated: new Date().toISOString() });
  };

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard
          title="Weight Lost"
          value={`${weightLoss.toFixed(1)}kg`}
          subtitle={`${(userData.startWeight - userData.targetWeight - weightLoss).toFixed(1)}kg to go`}
          icon={Target}
          color="red"
          progress={Math.max(0, Math.min(100, weightProgress))}
        />
        <StatCard
          title="Modules Completed"
          value={`${userData.modulesCompleted}`}
          subtitle={`${userData.totalModules - userData.modulesCompleted} remaining`}
          icon={BookOpen}
          color="blue"
          progress={studyProgress}
        />
        <StatCard
          title="Study Hours"
          value={`${userData.totalStudyHours}h`}
          subtitle={`${userData.studyStreak} day streak`}
          icon={Clock}
          color="green"
          progress={(userData.totalStudyHours / 612) * 100} // 25.5h/week * 24 weeks
        />
        <StatCard
          title="Gym Sessions"
          value={`${userData.weeklyWorkouts}/${userData.targetWorkouts}`}
          subtitle={`${userData.gymStreak} week streak`}
          icon={Dumbbell}
          color="purple"
          progress={gymProgress}
        />
        <StatCard
          title="Daily Steps"
          value={`${(userData.dailySteps / 1000).toFixed(1)}K`}
          subtitle={`${userData.walkingStreak} day streak`}
          icon={MapPin}
          color="green"
          progress={walkingProgress}
        />
        <StatCard
          title="Craving Control"
          value={`${Math.round(cravingResistanceRate)}%`}
          subtitle={`${userData.cravingStreak} day streak`}
          icon={Brain}
          color="indigo"
          progress={cravingResistanceRate}
        />
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProgressCard
          title="Weight Loss Journey"
          icon={Target}
          color="red"
          progress={Math.max(0, Math.min(100, weightProgress))}
          current={userData.currentWeight}
          target={userData.targetWeight}
          unit="kg"
          description="Aggressive 6-month transformation targeting 24kg loss through intermittent fasting and intensive workouts."
        />
        <ProgressCard
          title="Backend Engineering Course"
          icon={BookOpen}
          color="blue"
          progress={studyProgress}
          current={userData.modulesCompleted}
          target={userData.totalModules}
          unit="modules"
          description="Comprehensive backend engineering education covering Python, AWS, and platform engineering."
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
          Quick Updates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Current Weight (kg)</label>
            <input
              type="number"
              value={userData.currentWeight}
              onChange={(e) => quickUpdate('currentWeight', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              step="0.1"
              min="70"
              max="150"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Modules Completed</label>
            <input
              type="number"
              value={userData.modulesCompleted}
              onChange={(e) => quickUpdate('modulesCompleted', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="0"
              max="102"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Weekly Workouts</label>
            <input
              type="number"
              value={userData.weeklyWorkouts}
              onChange={(e) => quickUpdate('weeklyWorkouts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="0"
              max="7"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Study Hours Today</label>
            <input
              type="number"
              value={0}
              onChange={(e) => {
                const hours = parseFloat(e.target.value);
                quickUpdate('totalStudyHours', userData.totalStudyHours + hours);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              step="0.5"
              min="0"
              max="10"
              placeholder="Add hours"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Daily Steps</label>
            <input
              type="number"
              value={userData.dailySteps}
              onChange={(e) => quickUpdate('dailySteps', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="0"
              max="50000"
              placeholder="12000"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Craving Streak</label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
              {userData.cravingStreak} days
            </div>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Award className="h-6 w-6 mr-2" />
          Today's Focus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🎯 Weight Goal</h4>
            <p className="text-sm opacity-90">Maintain 1400 calorie limit</p>
            <p className="text-sm opacity-90">18:6 Intermittent Fasting</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📚 Study Goal</h4>
            <p className="text-sm opacity-90">Complete 3.5 hours of study</p>
            <p className="text-sm opacity-90">Focus on current phase modules</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">💪 Fitness Goal</h4>
            <p className="text-sm opacity-90">1.5-hour gym session</p>
            <p className="text-sm opacity-90">Include strength training</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🚶‍♂️ Walking Goal</h4>
            <p className="text-sm opacity-90">12,000 steps daily</p>
            <p className="text-sm opacity-90">8-9km morning walk</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🧠 Craving Control</h4>
            <p className="text-sm opacity-90">Resist unhealthy cravings</p>
            <p className="text-sm opacity-90">Use healthy substitutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;