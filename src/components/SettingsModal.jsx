import React from 'react';
import { X, Settings } from 'lucide-react';
import { BackupManager } from './BackupManager';

export const SettingsModal = ({ isOpen, onClose, workouts, onImportWorkouts }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <Settings className="mr-2" size={24} />
            Settings
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          <BackupManager 
            workouts={workouts} 
            onImportWorkouts={onImportWorkouts}
          />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">App Information</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Version:</strong> 1.1.0</p>
              <p><strong>Total Workouts:</strong> {workouts.length}</p>
              <p><strong>Data Storage:</strong> Local browser storage</p>
              <p><strong>Auto Backup:</strong> Every 7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};