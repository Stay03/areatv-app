import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiService';
import SearchBar from '../components/SearchBar';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Only search if there's a query
    if (query) {
      // Don't show loading indicator if it's the initial component mount
      if (!isInitialLoad) {
        setLoading(true);
      }
      setError(null);
      
      apiService.searchMovies(query)
        .then((response) => {
          setSearchResults(response.data);
          setLoading(false);
          setIsInitialLoad(false);
        })
        .catch((err) => {
          console.error('Search error:', err);
          setError('Failed to search. Please try again.');
          setLoading(false);
          setIsInitialLoad(false);
        });
    } else {
      // Clear results if no query
      setSearchResults([]);
      setIsInitialLoad(false);
    }
  }, [query]);

  // Prefetch movie details when hovering over a result
  const handleMovieHover = (movieId) => {
    apiService.prefetchMovie(movieId);
  };

  return (
    <motion.div 
      className="min-h-screen py-20 px-6 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <button 
        className="absolute top-4 left-4 z-20 p-2 text-white"
        onClick={() => navigate(-1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      {/* Search header */}
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Search</h1>
        
        {/* Expanded search bar */}
        <div className="mb-10">
          <SearchBar isExpanded={true} autoFocus={!query} />
        </div>
        
        {/* Search results */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-red-500 text-center my-10"
              >
                {error}
              </motion.div>
            ) : searchResults.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-medium mb-4">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found for "{query}"
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {searchResults.map((movie) => (
                    <motion.div
                      key={movie.id}
                      className="relative rounded-lg overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        transition: { duration: 0.2 } 
                      }}
                      onMouseEnter={() => handleMovieHover(movie.id)}
                    >
                      <Link to={`/movie/${movie.id}`}>
                        <div className="aspect-[2/3] bg-gray-800">
                          {movie.poster ? (
                            <img 
                              src={movie.poster} 
                              alt={movie.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                          <h3 className="text-sm font-medium text-white">{movie.title}</h3>
                          {movie.year && (
                            <p className="text-xs text-gray-300">{movie.year}</p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : query ? (
              <motion.div 
                key="no-results"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center my-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-gray-400">Try different keywords or check for typos</p>
              </motion.div>
            ) : (
              <motion.div 
                key="start-search"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center my-16"
              >
                <h3 className="text-xl text-gray-500 font-medium mb-2">Start typing to search</h3>
                
                {/* areaTV Benefits */}
                <div className="mt-12">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-3xl mx-auto">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Free</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="mb-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">HD Content</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="mb-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No Buffering</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="mb-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No Ads</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="mb-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No Bullshit</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage;