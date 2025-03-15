// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchBar = ({ isExpanded = false, autoFocus = false }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  const handleFocus = () => {
    if (!isExpanded) {
      navigate('/search');
    }
  };
  
  return (
    <motion.form 
      className={`relative ${isExpanded ? 'w-full' : 'w-10 md:w-64'}`}
      initial={isExpanded ? { opacity: 1, width: '100%' } : { opacity: 0.9, width: '5.5rem' }}
      animate={isExpanded ? { opacity: 1, width: '100%' } : { opacity: 0.9, width: '20.5rem', transition: { duration: 0.2 } }}
      whileFocus={{ opacity: 1 }}
      onSubmit={handleSubmit}
    >
      <input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onFocus={handleFocus}
  placeholder={isExpanded ? "Search for movies, TV shows..." : ""}
  className={`
    bg-gray-900/80 text-white py-2 pl-10 pr-4 rounded-full w-full
    border-2 border-red-500 focus:outline-none  focus:bg-gray-800/90
    transition-all duration-600
  `}
  autoFocus={autoFocus}
/>

      <motion.div 
        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        whileHover={{ scale: 1.1 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </motion.div>
      {isExpanded && query && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setQuery('')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.form>
  );
};

export default SearchBar;