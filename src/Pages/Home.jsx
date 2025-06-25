import React, { useState, useEffect } from 'react';
import { AddWorkoutForm } from '../components/AddWorkoutForm';
import { WorkoutList } from '../components/WorkoutList';
import { OverloadSuggestion } from '../components/OverloadSuggestion';
import { saveWorkouts } from '../utils/storage';
import { getOverloadSuggestions } from '../utils/overload';
import { ExerciseHistoryModal } from '../components/ExerciseHistoryModal';

export const Home = ({ workouts, onWorkoutsChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // State for the exercise history modal
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const overloadSuggestions = getOverloadSuggestions(workouts);
    setSuggestions(overloadSuggestions);
  }, [workouts]);

  const handleAddWorkout = (workout) => {
    const newWorkouts = [workout, ...workouts];
    onWorkoutsChange(newWorkouts);
    saveWorkouts(newWorkouts);
    setSuggestions(getOverloadSuggestions(newWorkouts));
    setIsFormVisible(false);
  };

  const handleDeleteWorkout = (workoutId) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    onWorkoutsChange(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
    setSuggestions(getOverloadSuggestions(updatedWorkouts));
  };
  
  const handleExerciseClick = (exerciseName) => {
    setSelectedExercise(exerciseName);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <OverloadSuggestion suggestions={suggestions} />
        
        <div className="text-center">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            {isFormVisible ? 'Cancel' : 'Log New Workout'}
          </button>
        </div>

        {isFormVisible && <AddWorkoutForm onAddWorkout={handleAddWorkout} />}
        
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Recent Workouts</h2>
          <WorkoutList 
            workouts={workouts.slice(0, 5)} 
            onDelete={handleDeleteWorkout}
            onExerciseClick={handleExerciseClick}
          />
        </div>
      </div>
      {isModalOpen && (
        <ExerciseHistoryModal 
            exerciseName={selectedExercise}
            workouts={workouts}
            onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};