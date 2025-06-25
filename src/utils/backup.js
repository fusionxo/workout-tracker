export const exportWorkoutsToFile = (workouts) => {
  const dataStr = JSON.stringify(workouts, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `workout-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const importWorkoutsFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workouts = JSON.parse(e.target.result);
        // Validate the data structure
        if (Array.isArray(workouts) && workouts.every(w => w.id && w.date && w.exercises)) {
          resolve(workouts);
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const scheduleAutoBackup = (workouts) => {
  // Auto backup every 7 days
  const lastBackup = localStorage.getItem('lastAutoBackup');
  const now = new Date().getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  
  if (!lastBackup || now - parseInt(lastBackup) > sevenDays) {
    if (workouts.length > 0) {
      exportWorkoutsToFile(workouts);
      localStorage.setItem('lastAutoBackup', now.toString());
      return true; // Backup was performed
    }
  }
  return false; // No backup needed
};
