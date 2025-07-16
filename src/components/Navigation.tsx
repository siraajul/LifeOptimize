import React from 'react';
import { BarChart3, Scale, BookOpen, Dumbbell, Calendar, TrendingUp, Save, Brain, MapPin } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'weight', label: 'Weight', icon: Scale },
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'walking', label: 'Walking', icon: MapPin },
    { id: 'cravings', label: 'Cravings', icon: Brain },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'data', label: 'Data', icon: Save }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;