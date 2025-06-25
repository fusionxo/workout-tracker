import React, { useState, useEffect } from 'react';
import { Home } from './Pages/Home';
import { Graphs } from './Pages/Graphs';
import { History } from './Pages/History';
import { ThemeToggle } from './components/ThemeToggle';
import { PWAInstaller } from './components/PWAInstaller';
import { SettingsModal } from './components/SettingsModal';
import { Dumbbell, BarChart2, History as HistoryIcon, Settings } from 'lucide-react';
import { initTheme, toggleTheme as themeSwitcher } from './utils/theme';
import { getWorkouts, saveWorkouts } from './utils/storage';
import { scheduleAutoBackup } from './utils/backup';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [workouts, setWorkouts] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    initTheme();
    setTheme(localStorage.getItem('theme'));
    
    // Load workouts and check for auto backup
    const loadedWorkouts = getWorkouts();
    setWorkouts(loadedWorkouts);
    
    // Check if auto backup is needed
    if (scheduleAutoBackup(loadedWorkouts)) {
      // Could show a notification that backup was performed
      console.log('Auto backup performed');
    }
  }, []);
  
  const handleThemeToggle = () => {
    themeSwitcher();
    setTheme(localStorage.getItem('theme'));
  };

  const handleImportWorkouts = (importedWorkouts) => {
    setWorkouts(importedWorkouts);
    saveWorkouts(importedWorkouts);
  };

  const renderContent = () => {
    const props = { workouts, onWorkoutsChange: setWorkouts };
    
    switch (activeTab) {
      case 'graphs':
        return <Graphs {...props} />;
      case 'history':
        return <History {...props} />;
      case 'home':
      default:
        return <Home {...props} />;
    }
  };

  const NavLink = ({ tab, icon: Icon, children }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center w-full py-2 rounded-lg transition-colors duration-200 ${
        activeTab === tab 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <Icon size={24} />
      <span className="text-xs mt-1">{children}</span>
    </button>
  );

  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
           <div className="flex items-center space-x-2">
            <Dumbbell className="text-blue-600" size={28}/>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Workout Tracker</h1>
           </div>
           <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings size={20} />
            </button>
            <ThemeToggle isDarkMode={theme === 'dark'} onToggle={handleThemeToggle} />
           </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 pb-24">
        {renderContent()}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto flex justify-around p-2">
          <NavLink tab="home" icon={Dumbbell}>Log</NavLink>
          <NavLink tab="graphs" icon={BarChart2}>Graphs</NavLink>
          <NavLink tab="history" icon={HistoryIcon}>History</NavLink>
        </div>
      </nav>

      <PWAInstaller />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        workouts={workouts}
        onImportWorkouts={handleImportWorkouts}
      />
    </div>
  );
}