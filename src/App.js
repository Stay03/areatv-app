import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import SearchPage from './pages/SearchPage';
import authService from './services/authService';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Create a wrapper component for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Initialize authentication when app loads
    const initAuth = async () => {
      try {
        await authService.ensureAuth();
        setAuthInitialized(true);
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        // Still set to true to allow app to load
        setAuthInitialized(true);
      }
    };
    
    initAuth();
    
    // Handle online/offline status
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);
  
  const handleLoadingComplete = () => {
    // Only complete loading if both preloader is done and auth is initialized
    if (authInitialized) {
      setIsLoading(false);
    }
  };
  
  // When auth is initialized, check if preloader is already done
  useEffect(() => {
    if (authInitialized && !isLoading) {
      setIsLoading(false);
    }
  }, [authInitialized, isLoading]);
  
  return (
    <div className="min-h-screen bg-background text-white">
      <Preloader onLoadingComplete={handleLoadingComplete} />
      
      {!isLoading && (
        <Router>
          <AnimatedRoutes />
          <PWAInstallPrompt />
          
          {/* Offline notification banner */}
          {!isOnline && (
            <div className="fixed top-0 left-0 right-0 bg-yellow-600 text-white text-center py-2 px-4 z-50">
              You are currently offline. Some features may be limited.
            </div>
          )}
        </Router>
      )}
    </div>
  );
}

export default App;