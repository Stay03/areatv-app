// src/components/Header.jsx
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import logo from '../assets/appLogo.png'

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 p-6 z-50 ${isHomePage  ? 'bg-gradient-to-b from-black/90 to-transparent backdrop-blur-[1px]' : 'bg-gradient-to-b from-black/90 to-transparent backdrop-blur-[1px]'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {!isHomePage && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 text-white mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0 }}
          >
            <Link to="/">
              <img 
                src={logo} 
                alt="areaTV" 
                className="h-8 md:h-10"
              />
            </Link>
          </motion.div>
        </div>
        
        {/* Use the same SearchBar component on both pages */}
        <div className="hidden md:block">
          <SearchBar isExpanded={false} setIsExpanded={() => navigate('/search')} />
        </div>
        
        {/* Mobile search icon */}
        <div className="block md:hidden">
          <motion.button
            className="p-2 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/search')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;