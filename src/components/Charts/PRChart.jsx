import React from 'react';
import { getPersonalRecords } from '../../utils/calculations';
import { format, parseISO } from 'date-fns';
import { Trophy } from 'lucide-react';

export const PRChart = ({ workouts }) => {
  const prs = getPersonalRecords(workouts);
  const prArray = Object.entries(prs)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.maxWeight - a.maxWeight);

  if (prArray.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
        <Trophy className="text-yellow-500 mr-2" /> Personal Records (Max Weight)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Exercise</th>
                    <th scope="col" className="px-6 py-3">Max Weight</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                </tr>
            </thead>
            <tbody>
                {prArray.slice(0, 10).map((pr, index) => ( // Show top 10 PRs
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
                            {pr.name}
                        </th>
                        <td className="px-6 py-4">
                            {pr.maxWeight} kg
                        </td>
                        <td className="px-6 py-4">
                            {format(parseISO(pr.date), 'MMM d, yyyy')}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};