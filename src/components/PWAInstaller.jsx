import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';
import { isPWAInstallable, installPWA, isStandalone } from '../utils/pwa';

export const PWAInstaller = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed as standalone app
    if (isStandalone()) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setCanInstall(true);
      
      // Show prompt after a delay, but only if user hasn't dismissed it recently
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setShowPrompt(false);
      window.deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const installed = await installPWA();
      if (installed) {
        setShowPrompt(false);
        setCanInstall(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!canInstall || !showPrompt || isStandalone()) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-4 z-40 animate-slideUp">
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1">
          <Smartphone size={24} className="mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Install Workout Tracker</h4>
            <p className="text-sm text-blue-100 mt-1">
              Add to your home screen for quick access and offline use!
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-2 p-1 hover:bg-blue-700 rounded-full flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="bg-white text-blue-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
        >
          {isInstalling ? 'Installing...' : 'Install'}
        </button>
        <button
          onClick={handleDismiss}
          className="text-blue-100 px-4 py-1 rounded-md text-sm hover:bg-blue-700"
        >
          Not now
        </button>
      </div>
    </div>
  );
};