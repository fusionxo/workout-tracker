export const isPWAInstallable = () => {
  return 'serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches === false;
};

export const getPWAInstallPrompt = () => {
  return window.deferredPrompt;
};

export const installPWA = async () => {
  const deferredPrompt = getPWAInstallPrompt();
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    window.deferredPrompt = null;
    return outcome === 'accepted';
  }
  return false;
};

export const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
};