import React from 'react';
import { format, parseISO } from 'date-fns';
import { calculateWorkoutVolume, calculateAverageIntensity } from '../utils/calculations';
import { Trash2, LineChart } from 'lucide-react';

export const WorkoutList = ({ workouts, onDelete, onExerciseClick }) => {
  if (!workouts || workouts.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No workouts to display.</p>;
  }

  const WorkoutItem = ({ workout }) => {
    const volume = calculateWorkoutVolume(workout);
    const intensity = calculateAverageIntensity(workout);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3 transition-shadow hover:shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{format(parseISO(workout.date), 'EEEE, MMM d, yyyy')}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Volume: {volume.toFixed(1)} kg | Avg Intensity: {intensity.toFixed(1)} kg
                </div>
            </div>
            <button onClick={() => onDelete(workout.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1">
                <Trash2 size={18} />
            </button>
        </div>
        <ul className="space-y-2">
          {workout.exercises.map((exercise, index) => (
            <li key={index} className="text-sm">
              <button 
                onClick={() => onExerciseClick(exercise.name)} 
                className="w-full text-left font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center group"
              >
                {exercise.name}
                <LineChart size={16} className="ml-2 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="text-gray-600 dark:text-gray-300 pl-2 border-l-2 border-gray-200 dark:border-gray-600 ml-1">
                {exercise.sets.map((set, setIndex) => (
                  <span key={setIndex} className="block text-xs">
                    {set.reps} reps @ {set.weight} kg
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {workouts.map(workout => (
        <WorkoutItem key={workout.id} workout={workout} />
      ))}
    </div>
  );
};