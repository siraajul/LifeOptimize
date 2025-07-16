import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'indigo';
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, progress }) => {
  const colorClasses = {
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  const iconColorClasses = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
};

export default StatCard;