import { useState, useEffect } from 'react';
import { UserData, defaultUserData, WeightEntry, StudySession, WorkoutSession, WalkingEntry, CravingEntry } from '../types/UserData';

export function useLocalStorage() {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('lifeOptimizationData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setUserData({ ...defaultUserData, ...parsed });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage whenever userData changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('lifeOptimizationData', JSON.stringify(userData));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [userData, loading]);

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
  };

  const addWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };

    setUserData(prev => ({
      ...prev,
      weightHistory: [...prev.weightHistory, newEntry],
      currentWeight: entry.weight,
      lastUpdated: new Date().toISOString()
    }));
  };

  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession = {
      ...session,
      id: Date.now().toString()
    };

    // Calculate the highest module number from this session
    const highestModuleInSession = session.modules.length > 0 ? Math.max(...session.modules) : 0;

    setUserData(prev => ({
      ...prev,
      studyHistory: [...prev.studyHistory, newSession],
      totalStudyHours: prev.totalStudyHours + session.hours,
      modulesCompleted: Math.max(prev.modulesCompleted, highestModuleInSession),
      studyStreak: session.hours >= 3 ? prev.studyStreak + 1 : prev.studyStreak,
      lastUpdated: new Date().toISOString()
    }));
  };

  const addWorkoutSession = (session: Omit<WorkoutSession, 'id'>) => {
    const newSession = {
      ...session,
      id: Date.now().toString()
    };

    setUserData(prev => ({
      ...prev,
      workoutHistory: [...prev.workoutHistory, newSession],
      totalWorkoutHours: prev.totalWorkoutHours + session.duration,
      weeklyWorkouts: Math.min(prev.weeklyWorkouts + 1, 7),
      gymStreak: prev.weeklyWorkouts + 1 >= prev.targetWorkouts ? prev.gymStreak + 1 : prev.gymStreak,
      lastUpdated: new Date().toISOString()
    }));
  };

  const addWalkingEntry = (entry: Omit<WalkingEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };

    setUserData(prev => {
      // Add the new entry to the walking history
      const updatedWalkingHistory = [...prev.walkingHistory, newEntry];
      // Get today's date string (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      // Sum all steps and distance for today (including the new entry)
      const todaysEntries = updatedWalkingHistory.filter(e => e.date === today);
      const totalStepsToday = todaysEntries.reduce((sum, e) => sum + e.steps, 0);
      const totalDistanceToday = todaysEntries.reduce((sum, e) => sum + e.distance, 0);
      // Walking streak logic (unchanged)
      const newWalkingStreak = totalStepsToday >= prev.targetSteps || totalDistanceToday >= prev.targetDistance
        ? prev.walkingStreak + 1
        : prev.walkingStreak;
      return {
        ...prev,
        walkingHistory: updatedWalkingHistory,
        dailySteps: totalStepsToday,
        dailyDistance: totalDistanceToday,
        totalWalkingMinutes: prev.totalWalkingMinutes + entry.duration,
        walkingStreak: newWalkingStreak,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const addCravingEntry = (entry: Omit<CravingEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };

    setUserData(prev => {
      const newCravingStreak = entry.action === 'resisted' || entry.action === 'substituted'
        ? prev.cravingStreak + 1
        : 0;

      const newTotalResisted = entry.action === 'resisted' || entry.action === 'substituted'
        ? prev.totalCravingsResisted + 1
        : prev.totalCravingsResisted;

      return {
        ...prev,
        cravingHistory: [...prev.cravingHistory, newEntry],
        cravingStreak: newCravingStreak,
        totalCravingsResisted: newTotalResisted,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life_optimization_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setUserData({ ...defaultUserData, ...importedData });
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const resetData = () => {
    setUserData(defaultUserData);
  };

  return {
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
  };
}