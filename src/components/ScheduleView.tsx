import React from 'react';
import { Calendar, Clock, BookOpen, Dumbbell, CheckCircle } from 'lucide-react';
import { UserData } from '../types/UserData';

interface ScheduleViewProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ userData, updateUserData }) => {
  const toggleDayCompletion = (day: string) => {
    const updatedSchedule = {
      ...userData.weeklySchedule,
      [day]: {
        ...userData.weeklySchedule[day],
        completed: !userData.weeklySchedule[day].completed,
        study: userData.weeklySchedule[day].completed ? false : userData.weeklySchedule[day].study,
        gym: userData.weeklySchedule[day].completed ? false : userData.weeklySchedule[day].gym
      }
    };

    updateUserData({
      weeklySchedule: updatedSchedule,
      lastUpdated: new Date().toISOString()
    });
  };

  const toggleActivity = (day: string, activity: 'study' | 'gym') => {
    const updatedSchedule = {
      ...userData.weeklySchedule,
      [day]: {
        ...userData.weeklySchedule[day],
        [activity]: !userData.weeklySchedule[day][activity]
      }
    };

    updateUserData({
      weeklySchedule: updatedSchedule,
      lastUpdated: new Date().toISOString()
    });
  };

  const dailySchedules = {
    'Regular Days (Sat-Thu)': [
      { time: '05:00-06:00', activity: 'Morning routine + Prayer', duration: '1 hour' },
      { time: '06:00-08:00', activity: 'Study Time (Morning)', duration: '2 hours', type: 'study' },
      { time: '08:00-09:00', activity: 'Morning Walk', duration: '1 hour' },
      { time: '09:00-10:00', activity: 'Bath + Breakfast + Commute', duration: '1 hour' },
      { time: '10:00-02:00', activity: 'Office work (Morning)', duration: '4 hours' },
      { time: '02:00-03:00', activity: 'Prayer + Healthy lunch', duration: '1 hour' },
      { time: '03:00-06:00', activity: 'Office work (Afternoon)', duration: '3 hours' },
      { time: '06:00-06:30', activity: 'Commute home', duration: '30 minutes' },
      { time: '06:30-08:00', activity: 'GYM (Weight Loss Focus)', duration: '1.5 hours', type: 'gym' },
      { time: '08:00-09:00', activity: 'Bath + Dinner', duration: '1 hour' },
      { time: '09:00-10:30', activity: 'Study Time (Evening)', duration: '1.5 hours', type: 'study' },
      { time: '11:00-05:00', activity: 'Sleep', duration: '6 hours' }
    ],
    'Friday (Holiday)': [
      { time: '06:00-07:00', activity: 'Morning routine + Prayer', duration: '1 hour' },
      { time: '06:00-08:00', activity: 'Extended Study Session 1', duration: '2 hours', type: 'study' },
      { time: '08:00-09:00', activity: 'Morning Walk', duration: '1 hour' },
      { time: '09:00-10:00', activity: 'Bath + Breakfast', duration: '1 hour' },
      { time: '10:00-01:00', activity: 'Extended Study Session 2', duration: '3 hours', type: 'study' },
      { time: '01:00-02:00', activity: 'Prayer + Lunch', duration: '1 hour' },
      { time: '02:00-04:30', activity: 'Extended GYM Session', duration: '2.5 hours', type: 'gym' },
      { time: '04:30-05:30', activity: 'Rest + Snack', duration: '1 hour' },
      { time: '05:30-07:00', activity: 'Study Session 3', duration: '1.5 hours', type: 'study' },
      { time: '07:00-08:00', activity: 'Bath + Personal care', duration: '1 hour' },
      { time: '08:00-09:00', activity: 'Dinner + Family time', duration: '1 hour' },
      { time: '09:00-10:30', activity: 'Study Session 4', duration: '1.5 hours', type: 'study' },
      { time: '11:00-06:00', activity: 'Sleep', duration: '7 hours' }
    ]
  };

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-8">
      {/* Weekly Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
          Weekly Schedule Tracker
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {days.map(day => {
            const dayData = userData.weeklySchedule[day];
            const isCompleted = dayData.completed;
            const studyCompleted = dayData.study;
            const gymCompleted = dayData.gym;
            
            return (
              <div
                key={day}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{day}</h4>
                  <button
                    onClick={() => toggleDayCompletion(day)}
                    className={`p-1 rounded-full transition-colors ${
                      isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Study ({dayData.studyHours}h)</span>
                    </div>
                    <button
                      onClick={() => toggleActivity(day, 'study')}
                      className={`w-4 h-4 rounded border-2 transition-colors ${
                        studyCompleted
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {studyCompleted && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Dumbbell className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-700">Gym ({dayData.gymHours}h)</span>
                    </div>
                    <button
                      onClick={() => toggleActivity(day, 'gym')}
                      className={`w-4 h-4 rounded border-2 transition-colors ${
                        gymCompleted
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {gymCompleted && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Daily Schedules */}
      <div className="space-y-6">
        {Object.entries(dailySchedules).map(([scheduleType, schedule]) => (
          <div key={scheduleType} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="h-6 w-6 text-indigo-600 mr-2" />
              {scheduleType}
            </h3>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    item.type === 'study'
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : item.type === 'gym'
                      ? 'bg-purple-50 border-l-4 border-purple-500'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900 min-w-[120px]">
                      {item.time}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.type === 'study' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      {item.type === 'gym' && <Dumbbell className="h-4 w-4 text-purple-600" />}
                      <span className="text-gray-700">{item.activity}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {item.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Intermittent Fasting Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Intermittent Fasting Schedule (18:6)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Fasting Window (18 hours)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">6:00 PM - 11:00 PM</span>
                <span className="text-sm text-gray-600">Evening routine</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">11:00 PM - 5:00 AM</span>
                <span className="text-sm text-gray-600">Sleep (natural fasting)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">5:00 AM - 12:00 PM</span>
                <span className="text-sm text-gray-600">Morning routine, study, work</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Eating Window (6 hours)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">12:00 PM</span>
                <span className="text-sm text-gray-600">Protein shake + boiled egg (200 cal)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">2:00 PM</span>
                <span className="text-sm text-gray-600">Rice + fish/chicken + vegetables (450 cal)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">4:00 PM</span>
                <span className="text-sm text-gray-600">Almonds + green tea (100 cal)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">6:30 PM</span>
                <span className="text-sm text-gray-600">Small apple + black coffee (80 cal)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">11:30 PM</span>
                <span className="text-sm text-gray-600">Large salad + soup + protein (570 cal)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h5 className="font-semibold text-indigo-900 mb-2">Daily Caloric Target: 1400 calories</h5>
          <p className="text-sm text-indigo-700">
            Maintain strict adherence to eating window for optimal weight loss results. 
            Stay hydrated with 4-5 liters of water throughout the day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;