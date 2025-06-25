const WORKOUTS_KEY = 'workouts';

// Get all workouts from localStorage
export const getWorkouts = () => {
  const workouts = localStorage.getItem(WORKOUTS_KEY);
  return workouts ? JSON.parse(workouts) : [];
};

// Save workouts to localStorage
export const saveWorkouts = (workouts) => {
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
};

// Add a new workout
export const addWorkout = (workout) => {
  const workouts = getWorkouts();
  workouts.unshift(workout); // Add to the beginning of the array
  saveWorkouts(workouts);
};

// Update an existing workout
export const updateWorkout = (updatedWorkout) => {
    const workouts = getWorkouts();
    const index = workouts.findIndex(w => w.id === updatedWorkout.id);
    if(index !== -1) {
        workouts[index] = updatedWorkout;
        saveWorkouts(workouts);
    }
};

// Delete a workout
export const deleteWorkout = (workoutId) => {
    const workouts = getWorkouts();
    const filteredWorkouts = workouts.filter(w => w.id !== workoutId);
    saveWorkouts(filteredWorkouts);
};