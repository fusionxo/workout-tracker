import React, { useState, useEffect, useMemo } from 'react';
import { saveWorkouts } from '../utils/storage';
import { groupWorkoutsByWeek } from '../utils/calculations';
import { WorkoutList } from '../components/WorkoutList';
import { ExerciseSearch } from '../components/ExerciseSearch';
import Fuse from 'fuse.js';
import { ExerciseHistoryModal } from '../components/ExerciseHistoryModal';

export const History = ({ workouts, onWorkoutsChange }) => {
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);

  // State for the exercise history modal
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    setFilteredWorkouts(workouts);
  }, [workouts]);

  const fuse = useMemo(() => new Fuse(workouts, {
    keys: ['exercises.name', 'date'],
    includeScore: true,
    threshold: 0.4,
  }), [workouts]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredWorkouts(workouts);
      return;
    }
    const results = fuse.search(query);
    setFilteredWorkouts(results.map(result => result.item));
  };

  const handleDeleteWorkout = (workoutId) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    onWorkoutsChange(updatedWorkouts);
    setFilteredWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
  };
  
  const handleExerciseClick = (exerciseName) => {
    setSelectedExercise(exerciseName);
    setIsModalOpen(true);
  };

  const groupedWorkouts = groupWorkoutsByWeek(filteredWorkouts);
  const sortedWeeks = Object.keys(groupedWorkouts).sort().reverse();

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Workout History</h1>
        <ExerciseSearch onSearch={handleSearch} />
        
        {sortedWeeks.length > 0 ? (
          sortedWeeks.map(weekKey => (
            <div key={weekKey}>
              <h2 className="text-xl font-semibold my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">{groupedWorkouts[weekKey].label}</h2>
              <WorkoutList 
                workouts={groupedWorkouts[weekKey].workouts} 
                onDelete={handleDeleteWorkout}
                onExerciseClick={handleExerciseClick}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No workouts found. Log your first one!</p>
        )}
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