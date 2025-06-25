import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { parseISO, format } from 'date-fns';
import { calculateAverageIntensity } from '../../utils/calculations';

export const IntensityChart = ({ workouts }) => {
  const data = workouts.map(workout => ({
    date: format(parseISO(workout.date), 'MMM d'),
    intensity: parseFloat(calculateAverageIntensity(workout).toFixed(2)),
  })).reverse(); // Show oldest first

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Average Intensity (kg)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
          <XAxis dataKey="date" stroke={document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#64748b'} fontSize={12}/>
          <YAxis stroke={document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#64748b'} fontSize={12} />
          <Tooltip 
             contentStyle={{ 
                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgb(31 41 55)' : 'white',
                borderColor: 'rgba(128, 128, 128, 0.3)'
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="intensity" stroke="#10b981" name="Avg. Intensity" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};