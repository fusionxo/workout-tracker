import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { parseISO, format } from 'date-fns';
import { calculateWorkoutVolume } from '../../utils/calculations';

export const VolumeChart = ({ workouts }) => {
  const data = workouts.map(workout => ({
    date: format(parseISO(workout.date), 'MMM d'),
    volume: calculateWorkoutVolume(workout),
  })).reverse(); // Show oldest first

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Total Volume (kg)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
          <XAxis dataKey="date" stroke={document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#64748b'} fontSize={12} />
          <YAxis stroke={document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#64748b'} fontSize={12} />
          <Tooltip
            contentStyle={{ 
                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgb(31 41 55)' : 'white',
                borderColor: 'rgba(128, 128, 128, 0.3)'
            }}
          />
          <Legend />
          <Bar dataKey="volume" fill="#3b82f6" name="Workout Volume" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};