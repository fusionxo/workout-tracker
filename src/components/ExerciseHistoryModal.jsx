import React from 'react';
import { getExerciseHistory } from '../utils/calculations';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar } from 'recharts';
import { X } from 'lucide-react';

export const ExerciseHistoryModal = ({ exerciseName, workouts, onClose }) => {
  const history = getExerciseHistory(workouts, exerciseName);

  if (!history || history.length < 1) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-11/12 max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold capitalize text-gray-800 dark:text-gray-200">{exerciseName}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400">Not enough data to show progress. Perform this exercise at least once to see its history.</p>
            </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold capitalize text-gray-800 dark:text-gray-200">Progress: {exerciseName}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                <X size={24} />
            </button>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                <XAxis dataKey="date" stroke={document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#64748b'} fontSize={12} />
                <YAxis yAxisId="left" label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft' }} stroke={document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#64748b'} fontSize={12} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Max Weight (kg)', angle: -90, position: 'insideRight' }} stroke={document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#64748b'} fontSize={12} />
                <Tooltip
                    contentStyle={{ 
                        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgb(31 41 55)' : 'white',
                        borderColor: 'rgba(128, 128, 128, 0.3)'
                    }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Total Volume" />
                <Line yAxisId="right" type="monotone" dataKey="maxWeight" stroke="#10b981" name="Max Weight" strokeWidth={2} activeDot={{ r: 8 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};