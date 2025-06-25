import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const AddWorkoutForm = ({ onAddWorkout }) => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [exercises, setExercises] = useState([{ id: 1, name: '', sets: [{ reps: '', weight: '' }] }]);

  const handleExerciseChange = (exIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exIndex][field] = value;
    setExercises(newExercises);
  };

  const handleSetChange = (exIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { id: Date.now(), name: '', sets: [{ reps: '', weight: '' }] }]);
  };

  const removeExercise = (exIndex) => {
    const newExercises = exercises.filter((_, index) => index !== exIndex);
    setExercises(newExercises);
  };

  const addSet = (exIndex) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets.push({ reps: '', weight: '' });
    setExercises(newExercises);
  };

  const removeSet = (exIndex, setIndex) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets = newExercises[exIndex].sets.filter((_, index) => index !== setIndex);
    setExercises(newExercises);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const workout = {
      id: Date.now(),
      date,
      exercises: exercises.filter(ex => ex.name.trim() !== ''),
    };
    onAddWorkout(workout);
    // Reset form
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setExercises([{ id: 1, name: '', sets: [{ reps: '', weight: '' }] }]);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
          required
        />
      </div>

      {exercises.map((exercise, exIndex) => (
        <div key={exercise.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Exercise Name (e.g., Bench Press)"
              value={exercise.name}
              onChange={(e) => handleExerciseChange(exIndex, 'name', e.target.value)}
              className="text-lg font-semibold bg-transparent w-full focus:outline-none"
              required
            />
            <button type="button" onClick={() => removeExercise(exIndex)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>

          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className="flex items-center space-x-2">
              <span className="font-bold text-gray-500 dark:text-gray-400">Set {setIndex + 1}</span>
              <input
                type="number"
                placeholder="Reps"
                inputMode="numeric"
                pattern="[0-9]*"
                value={set.reps}
                onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                className="w-full p-2 rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              />
              <span className="text-gray-400">x</span>
              <input
                type="number"
                placeholder="Weight"
                inputMode="decimal"
                step="0.1"
                value={set.weight}
                onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
                className="w-full p-2 rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              />
              <span className="text-gray-500 dark:text-gray-400">kg</span>
              <button type="button" onClick={() => removeSet(exIndex, setIndex)} className="text-red-500 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addSet(exIndex)} className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
            <PlusCircle size={16} className="mr-1"/> Add Set
          </button>
        </div>
      ))}
      
      <button type="button" onClick={addExercise} className="w-full flex justify-center items-center py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
        <PlusCircle size={20} className="mr-2"/> Add Exercise
      </button>

      <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
        Save Workout
      </button>
    </form>
  );
};