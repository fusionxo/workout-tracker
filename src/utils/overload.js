import { calculateExerciseVolume } from './calculations';

// Analyze trends and suggest progressive overload
export const getOverloadSuggestions = (workouts) => {
  if (workouts.length < 2) {
    return [];
  }

  const suggestions = [];
  const exerciseHistory = {}; // { 'Bench Press': [ {date, volume}, ... ] }

  // Group volumes by exercise name
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const volume = calculateExerciseVolume(exercise);
      if (!exerciseHistory[exercise.name]) {
        exerciseHistory[exercise.name] = [];
      }
      exerciseHistory[exercise.name].push({ date: workout.date, volume });
    });
  });
  
  // Analyze each exercise
  for (const exerciseName in exerciseHistory) {
    const history = exerciseHistory[exerciseName].sort((a,b) => new Date(a.date) - new Date(b.date));
    if (history.length < 2) continue;

    const lastWorkout = history[history.length - 1];
    const prevWorkout = history[history.length - 2];

    const volumeChange = lastWorkout.volume - prevWorkout.volume;
    
    if (lastWorkout.volume > 0 && volumeChange <= 0) {
      suggestions.push({
        exercise: exerciseName,
        type: 'volume',
        message: `Your volume for ${exerciseName} was the same or lower than last time. Try increasing reps or weight next session for progressive overload.`,
        lastVolume: lastWorkout.volume,
        prevVolume: prevWorkout.volume
      });
    } else if (volumeChange > 0) {
        // Positive progress, no suggestion needed, but we could add encouragement
    }
  }

  return suggestions;
};