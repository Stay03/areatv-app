// src/components/PrefetchLink.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

const PrefetchLink = ({ to, children, movieId, className, ...props }) => {
  const handleMouseEnter = () => {
    // Only prefetch movie details
    if (movieId) {
      apiService.prefetchMovie(movieId);
    }
  };

  return (
    <Link 
      to={to} 
      className={className} 
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PrefetchLink;