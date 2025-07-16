export interface WeightEntry {
  id?: string;
  date: string;
  weight: number;
  notes?: string;
}

export interface StudySession {
  id?: string;
  date: string;
  hours: number;
  modules: number[];
  topics: string[];
  notes?: string;
}

export interface WorkoutSession {
  id?: string;
  date: string;
  type: 'upper' | 'lower' | 'full' | 'hiit' | 'cardio' | 'recovery';
  duration: number;
  exercises: string[];
  notes?: string;
}

export interface WalkingEntry {
  id?: string;
  date: string;
  steps: number;
  distance: number; // in km
  duration: number; // in minutes
  location?: string;
  notes?: string;
}

export interface CravingEntry {
  id?: string;
  date: string;
  time: string;
  food: string;
  intensity: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = intense
  trigger: 'stress' | 'boredom' | 'emotion' | 'hunger' | 'habit' | 'social' | 'other';
  location: string;
  mood: 'happy' | 'sad' | 'stressed' | 'anxious' | 'bored' | 'tired' | 'neutral';
  action: 'resisted' | 'gave_in' | 'substituted' | 'delayed';
  substitute?: string;
  notes?: string;
}

export interface DailySchedule {
  [key: string]: {
    study: boolean;
    gym: boolean;
    completed: boolean;
    studyHours: number;
    gymHours: number;
  };
}

export interface UserData {
  // Personal Info
  name: string;
  age: number;
  height: number;
  
  // Weight Tracking
  currentWeight: number;
  targetWeight: number;
  startWeight: number;
  weightHistory: WeightEntry[];
  
  // Study Progress
  modulesCompleted: number;
  totalModules: number;
  currentPhase: number;
  totalStudyHours: number;
  studyHistory: StudySession[];
  studyStreak: number;
  
  // Workout Progress
  weeklyWorkouts: number;
  targetWorkouts: number;
  totalWorkoutHours: number;
  workoutHistory: WorkoutSession[];
  gymStreak: number;
  
  // Walking Progress
  dailySteps: number;
  targetSteps: number;
  dailyDistance: number; // in km
  targetDistance: number; // in km
  totalWalkingMinutes: number;
  walkingHistory: WalkingEntry[];
  walkingStreak: number;
  
  // Craving Tracking
  cravingHistory: CravingEntry[];
  cravingStreak: number; // Days without giving in to cravings
  totalCravingsResisted: number;
  
  // Daily Tracking
  caloriesConsumed: number;
  targetCalories: number;
  waterIntake: number;
  sleepHours: number;
  
  // Schedule
  weeklySchedule: DailySchedule;
  
  // Goals & Milestones
  monthlyGoals: {
    [month: string]: {
      weightTarget: number;
      modulesTarget: number;
      stepsTarget: number;
      distanceTarget: number; // in km
      achieved: boolean;
    };
  };
  
  // Settings
  fastingWindow: {
    start: string;
    end: string;
  };
  
  // Progress Tracking
  startDate: string;
  lastUpdated: string;
}

export const defaultUserData: UserData = {
  name: 'Sirajul',
  age: 28,
  height: 168, // 5'6" in cm
  
  currentWeight: 114,
  targetWeight: 90,
  startWeight: 114,
  weightHistory: [],
  
  modulesCompleted: 0,
  totalModules: 102,
  currentPhase: 1,
  totalStudyHours: 0,
  studyHistory: [],
  studyStreak: 0,
  
  weeklyWorkouts: 0,
  targetWorkouts: 6,
  totalWorkoutHours: 0,
  workoutHistory: [],
  gymStreak: 0,
  
  dailySteps: 0,
  targetSteps: 12000,
  dailyDistance: 0,
  targetDistance: 8.5, // 8-9km average
  totalWalkingMinutes: 0,
  walkingHistory: [],
  walkingStreak: 0,
  
  cravingHistory: [],
  cravingStreak: 0,
  totalCravingsResisted: 0,
  
  caloriesConsumed: 0,
  targetCalories: 1400,
  waterIntake: 0,
  sleepHours: 0,
  
  weeklySchedule: {
    'Saturday': { study: false, gym: false, completed: false, studyHours: 3.5, gymHours: 1.5 },
    'Sunday': { study: false, gym: false, completed: false, studyHours: 3.5, gymHours: 1.5 },
    'Monday': { study: false, gym: false, completed: false, studyHours: 3.5, gymHours: 1.5 },
    'Tuesday': { study: false, gym: false, completed: false, studyHours: 3.5, gymHours: 1.5 },
    'Wednesday': { study: false, gym: false, completed: false, studyHours: 3.5, gymHours: 1.5 },
    'Thursday': { study: false, gym: false, completed: false, studyHours: 3.5, gymHours: 1.5 },
    'Friday': { study: false, gym: false, completed: false, studyHours: 8, gymHours: 2.5 }
  },
  
  monthlyGoals: {
    'July': { weightTarget: 110, modulesTarget: 9, stepsTarget: 372000, distanceTarget: 263.5, achieved: false },
    'August': { weightTarget: 106, modulesTarget: 18, stepsTarget: 372000, distanceTarget: 263.5, achieved: false },
    'September': { weightTarget: 102, modulesTarget: 27, stepsTarget: 360000, distanceTarget: 255, achieved: false },
    'October': { weightTarget: 98, modulesTarget: 36, stepsTarget: 372000, distanceTarget: 263.5, achieved: false },
    'November': { weightTarget: 94, modulesTarget: 45, stepsTarget: 360000, distanceTarget: 255, achieved: false },
    'December': { weightTarget: 90, modulesTarget: 54, stepsTarget: 372000, distanceTarget: 263.5, achieved: false }
  },
  
  fastingWindow: {
    start: '18:00',
    end: '12:00'
  },
  
  startDate: '2025-07-01',
  lastUpdated: new Date().toISOString()
};