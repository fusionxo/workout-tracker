import React from 'react';
import { GraphDashboard } from '../components/GraphDashboard';

export const Graphs = ({ workouts }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Dashboard</h1>
      <GraphDashboard workouts={workouts} />
    </div>
  );
};