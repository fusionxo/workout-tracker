import { parseISO, getWeek, getYear, format, startOfWeek, endOfWeek } from 'date-fns';

// Calculate total volume for an exercise (sets * reps * weight)
export const calculateExerciseVolume = (exercise) => {
  return exercise.sets.reduce((total, set) => {
    if (!set.weight || !set.reps) return total;
    return total + (parseFloat(set.weight) * parseInt(set.reps, 10));
  }, 0);
};

// Calculate max weight for an exercise in a given workout
export const calculateMaxWeight = (exercise) => {
    return Math.max(...exercise.sets.map(s => parseFloat(s.weight || 0)));
}

// Calculate total volume for a workout
export const calculateWorkoutVolume = (workout) => {
  return workout.exercises.reduce((total, exercise) => {
    return total + calculateExerciseVolume(exercise);
  }, 0);
};

// Calculate average intensity for a workout (total volume / total reps)
export const calculateAverageIntensity = (workout) => {
  let totalVolume = 0;
  let totalReps = 0;
  workout.exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      if(set.weight && set.reps) {
          totalVolume += parseFloat(set.weight) * parseInt(set.reps, 10);
          totalReps += parseInt(set.reps, 10);
      }
    });
  });
  return totalReps > 0 ? (totalVolume / totalReps) : 0;
};

// Group workouts by week
export const groupWorkoutsByWeek = (workouts) => {
  const grouped = {};
  workouts.forEach(workout => {
    const date = parseISO(workout.date);
    const year = getYear(date);
    const week = getWeek(date, { weekStartsOn: 1 }); // Monday as start of week
    const key = `${year}-W${week.toString().padStart(2, '0')}`;
    
    if (!grouped[key]) {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      grouped[key] = {
        label: `Week of ${format(weekStart, 'MMM d')}`,
        workouts: [],
      };
    }
    grouped[key].workouts.push(workout);
  });
  return grouped;
};

// Get personal records for each exercise
export const getPersonalRecords = (workouts) => {
  const prs = {}; // { exerciseName: { maxWeight: 0, date: '' } }
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const exerciseName = exercise.name.toLowerCase().trim();
      if (!prs[exerciseName]) {
        prs[exerciseName] = { maxWeight: 0, date: null };
      }
      exercise.sets.forEach(set => {
        const weight = parseFloat(set.weight);
        if (weight > prs[exerciseName].maxWeight) {
          prs[exerciseName].maxWeight = weight;
          prs[exerciseName].date = workout.date;
        }
      });
    });
  });
  return prs;
};

// NEW: Get historical performance for a specific exercise
export const getExerciseHistory = (workouts, exerciseName) => {
    const history = [];
    // Iterate backwards to process from oldest to newest
    for (let i = workouts.length - 1; i >= 0; i--) {
        const workout = workouts[i];
        const relevantExercise = workout.exercises.find(ex => ex.name.toLowerCase().trim() === exerciseName.toLowerCase().trim());

        if (relevantExercise) {
            history.push({
                date: format(parseISO(workout.date), 'MMM d'),
                volume: calculateExerciseVolume(relevantExercise),
                maxWeight: calculateMaxWeight(relevantExercise),
            });
        }
    }
    return history;
}