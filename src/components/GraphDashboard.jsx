import React from 'react';
import { VolumeChart } from './Charts/VolumeChart';
import { IntensityChart } from './Charts/IntensityChart';
import { PRChart } from './Charts/PRChart';

export const GraphDashboard = ({ workouts }) => {
    if(workouts.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Log some workouts to see your progress graphs.</p>
    }

    return (
        <div className="space-y-8">
            <VolumeChart workouts={workouts} />
            <IntensityChart workouts={workouts} />
            <PRChart workouts={workouts} />
        </div>
    );
};