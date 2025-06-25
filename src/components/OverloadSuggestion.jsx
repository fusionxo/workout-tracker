import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export const OverloadSuggestion = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md" role="alert">
        <div className="flex">
          <div className="py-1"><TrendingUp className="h-5 w-5 text-green-500 mr-3"/></div>
          <div>
            <p className="font-bold">All Good!</p>
            <p className="text-sm">Keep up the great work. Log a new workout to see suggestions for progressive overload.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 rounded-md space-y-2" role="alert">
       <div className="flex items-center">
         <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
         <p className="font-bold">Progressive Overload Suggestions</p>
      </div>
      {suggestions.map((suggestion, index) => (
        <div key={index} className="text-sm">
            <p><span className="font-semibold">{suggestion.exercise}:</span> {suggestion.message}</p>
        </div>
      ))}
    </div>
  );
};