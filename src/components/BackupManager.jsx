import React, { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { exportWorkoutsToFile, importWorkoutsFromFile } from '../utils/backup';

export const BackupManager = ({ workouts, onImportWorkouts }) => {
  const [importStatus, setImportStatus] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    if (workouts.length === 0) {
      setImportStatus('No workouts to export');
      setTimeout(() => setImportStatus(''), 3000);
      return;
    }
    exportWorkoutsToFile(workouts);
    setImportStatus('Backup exported successfully!');
    setTimeout(() => setImportStatus(''), 3000);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('');

    try {
      const importedWorkouts = await importWorkoutsFromFile(file);
      
      // Merge with existing workouts, avoiding duplicates
      const existingIds = new Set(workouts.map(w => w.id));
      const newWorkouts = importedWorkouts.filter(w => !existingIds.has(w.id));
      
      if (newWorkouts.length > 0) {
        onImportWorkouts([...workouts, ...newWorkouts]);
        setImportStatus(`Successfully imported ${newWorkouts.length} new workouts!`);
      } else {
        setImportStatus('No new workouts found in backup file');
      }
    } catch (error) {
      setImportStatus(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
      event.target.value = ''; // Reset file input
      setTimeout(() => setImportStatus(''), 5000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Backup & Restore</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleExport}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={18} className="mr-2" />
          Export Backup
        </button>
        
        <label className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
          <Upload size={18} className="mr-2" />
          {isImporting ? 'Importing...' : 'Import Backup'}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="hidden"
          />
        </label>
      </div>

      {importStatus && (
        <div className={`flex items-center p-3 rounded-lg ${
          importStatus.includes('failed') || importStatus.includes('No workouts') || importStatus.includes('No new workouts')
            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
        }`}>
          {importStatus.includes('failed') ? 
            <AlertCircle size={18} className="mr-2" /> : 
            <CheckCircle size={18} className="mr-2" />
          }
          <span className="text-sm">{importStatus}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>• Export creates a JSON backup file of all your workouts</p>
        <p>• Import merges workouts from a backup file (duplicates are ignored)</p>
        <p>• Auto-backup occurs every 7 days when you have workouts logged</p>
      </div>
    </div>
  );
};