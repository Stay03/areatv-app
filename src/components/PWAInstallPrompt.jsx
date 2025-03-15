import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Don't show the prompt if already installed
    if (isAppInstalled) {
      return;
    }

    // Check if iOS
    const checkIfIOS = () => {
      const userAgent = window.navigator.userAgent;
      const iOS = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i);
      const webkit = !!userAgent.match(/WebKit/i);
      const iOSSafari = iOS && webkit && !userAgent.match(/CriOS/i);
      return iOSSafari;
    };

    if (checkIfIOS()) {
      setIsIOS(true);
      // Maybe check if the user has previously dismissed the install prompt via localStorage
      const hasPromptBeenDismissed = localStorage.getItem('pwaInstallPromptDismissed');
      if (!hasPromptBeenDismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000); // Show iOS instructions after 5 seconds
      }
    }

    // Listen for beforeinstallprompt event (for non-iOS browsers)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Check if the prompt has been previously dismissed
      const hasPromptBeenDismissed = localStorage.getItem('pwaInstallPromptDismissed');
      if (!hasPromptBeenDismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000); // Show after 5 seconds of browsing
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt, clear it
    setDeferredPrompt(null);
    
    // Hide the install button/dialog regardless of outcome
    setShowPrompt(false);
    
    // Optionally track outcome for analytics
    console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Remember that the user dismissed the prompt
    localStorage.setItem('pwaInstallPromptDismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 shadow-lg z-50 rounded-t-lg border-t border-primary"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <img src="/logo192.png" alt="areaTV Logo" className="w-10 h-10 mr-3" />
              <h3 className="text-lg font-bold text-white">Install areaTV</h3>
            </div>
            <button 
              onClick={dismissPrompt}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isIOS ? (
            <div className="mb-4 text-gray-300">
              <p>To install areaTV on your iOS device:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Tap the Share button</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top-right corner</li>
              </ol>
            </div>
          ) : (
            <p className="mb-4 text-gray-300">
              Install areaTV on your device for a better experience with offline capabilities!
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button 
              onClick={dismissPrompt}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Not now
            </button>
            
            {!isIOS && (
              <button 
                onClick={handleInstallClick}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Install
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;