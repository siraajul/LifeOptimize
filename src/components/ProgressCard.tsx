import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  icon: LucideIcon;
  color: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'indigo';
  progress: number;
  current: number;
  target: number;
  unit: string;
  description: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  icon: Icon,
  color,
  progress,
  current,
  target,
  unit,
  description
}) => {
  const colorClasses = {
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{current} / {target} {unit}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default ProgressCard;