import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/appLogo.png';

const Preloader = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time (replace with actual asset loading logic)
    const timer = setTimeout(() => {
      setLoading(false);
      onLoadingComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);
  
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
        >
          <motion.div 
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: {
                duration: 0.5
              }
            }}
            exit={{ 
              scale: 1.2, 
              opacity: 0,
              transition: {
                duration: 0.5
              }
            }}
          >
            {/* Logo animation */}
            <motion.div
              className="w-48 mb-2"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src={logo}
                alt="StreamFlix Logo" 
                className="w-full h-full"
              />
            </motion.div>
            
            {/* Loading animation */}
            <motion.div className="relative w-20 h-2 bg-gray-800 rounded-full overflow-hidden mt-3">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.p 
              className="mt-4 text-white text-md text-gray-400"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Loading amazing content... */}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;