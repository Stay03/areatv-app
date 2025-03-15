# Codebase Documentation

{
  "Extraction Date": "2025-03-15 06:07:12",
  "Include Paths": [
    "src/pages/HomePage.jsx",
    "src/services/apiService.js",
    "src/components/SearchBar.jsx",
    "src/pages/SearchPage.jsx",
    "src/App.js",
    "src/pages/MoviePage.jsx"
  ]
}

### src/pages/HomePage.jsx
```
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiService';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
// Movie Card Component
const MovieCard = ({ movie }) => {
  return (
    <motion.div 
      className="relative flex-shrink-0 w-40 mr-3 rounded-md overflow-hidden cursor-pointer"
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      <Link to={`/movie/${movie.id}`}>
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
        </div>
      </Link>
    </motion.div>
  );
};

// Movie Row Component with Navigation Arrows
// Movie Row Component with Navigation Arrows that fade in/out on hover
const MovieRow = ({ title, movies }) => {
    const scrollRef = React.useRef(null);
    const [showLeftArrow, setShowLeftArrow] = React.useState(false);
    const [showRightArrow, setShowRightArrow] = React.useState(true);
    const [isHovering, setIsHovering] = React.useState(false);
  
    // Handle scroll to check if arrows should be shown
    const handleScroll = () => {
      const container = scrollRef.current;
      if (!container) return;
      
      // Show left arrow if scrolled to the right
      setShowLeftArrow(container.scrollLeft > 0);
      
      // Hide right arrow if reached the end
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };
  
    // Scroll functions for the arrow buttons
    const scrollLeft = () => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };
  
    const scrollRight = () => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };
    
    // Mouse enter/leave handlers for the entire row
    const handleMouseEnter = () => {
      setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
  
    // Add scroll event listener on mount
    React.useEffect(() => {
      const container = scrollRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
        // Check initially if we need the right arrow
        setShowRightArrow(container.scrollWidth > container.clientWidth);
        
        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
      }
    }, []);
  
    return (
      <div 
        className="mb-12 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <h2 className="text-xl font-bold mb-4 text-white px-6">{title}</h2>
        
        <div className="relative">
          {/* Navigation Arrows - Always rendered but with opacity controlled by hover state */}
          <button 
            onClick={scrollLeft}
            className={`hidden md:flex items-center justify-center absolute left-0 top-0 bottom-0 z-10 bg-red-600/50 hover:bg-red-600/70 text-white p-2 h-full transition-opacity duration-300 ${isHovering && showLeftArrow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={scrollRight}
            className={`hidden md:flex items-center justify-center absolute right-0 top-0 bottom-0 z-10 bg-red-600/50 hover:bg-red-600/70 text-white p-2 h-full transition-opacity duration-300 ${isHovering && showRightArrow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Scrollable container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide px-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    );
  };


  
// Featured Movie Hero Component
const FeaturedHero = ({ movie }) => {
  return (
    <motion.div 
      className="relative w-full h-[80vh] mb-8"
      key={movie.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={movie.background} 
          alt="" 
          className="w-full h-full object-cover object-top"
        />
        
        {/* Gradient Overlays for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>
      
      {/* Content positioned on the left */}
      <div className="relative h-full max-w-3xl flex flex-col justify-center px-6 md:px-16 z-10">
        {/* Movie Logo or Title */}
        {movie.logo ? (
          <motion.img 
            src={movie.logo} 
            alt={movie.title} 
            className="w-64 md:w-80 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        ) : (
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {movie.title}
          </motion.h1>
        )}
        
        {/* Movie Metadata */}
        <motion.div 
          className="flex items-center mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-primary font-medium mr-4">{movie.imdb_rating} IMDb</span>
          <span className="mr-4 text-gray-300">{movie.year}</span>
          <span className="text-gray-300">{movie.runtime}</span>
        </motion.div>
        
        {/* Movie Description */}
        <motion.p 
          className="text-gray-300 max-w-xl mb-6 line-clamp-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {movie.description}
        </motion.p>
        
        {/* Genre Tags */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {movie.genre.slice(0, 3).map(genre => (
            <span key={genre} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
              {genre}
            </span>
          ))}
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex space-x-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link to={`/movie/${movie.id}`}>
            <motion.button 
              className="px-8 py-3 bg-primary text-white rounded-md font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Now
            </motion.button>
          </Link>
          
          <motion.button 
            className="px-6 py-3 bg-gray-800/80 text-white rounded-md font-medium flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            My List
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// HomePage Component
const HomePage = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to get a random movie from the featured movies
  const getRandomFeaturedMovie = (movies) => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
  };
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch trending movies
        const trendingData = await apiService.getTrendingMovies(20);
        
        // Set featured movies to first 5 trending movies
        const featured = await apiService.getFeaturedMovies(20);
        setFeaturedMovies(featured);
        
        // Set initial featured movie randomly
        setFeaturedMovie(getRandomFeaturedMovie(featured));
        
        // Set trending movies
        setTrendingMovies(trendingData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  // Set up the 10-second interval to change the featured movie
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    
    const intervalId = setInterval(() => {
      // Get a random movie that's different from the current one
      let newMovie;
      do {
        newMovie = getRandomFeaturedMovie(featuredMovies);
      } while (featuredMovies.length > 1 && newMovie.id === featuredMovie?.id);
      
      setFeaturedMovie(newMovie);
    }, 10000); // 10 seconds
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [featuredMovies, featuredMovie]);
  
  // Simulate data for featured section while API is incomplete
  const simulatedFeaturedMovies = featuredMovies;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="min-h-screen pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Logo */}
<header className="fixed top-0 left-0 right-0 p-6 z-50 bg-gradient-to-b from-background/80 to-transparent">
  <div className="flex items-center justify-between">
    <motion.img 
      src="https://streamlab-demo.gentechtreedesign.co.in/streamlab-v4/wp-content/uploads/sites/4/2025/02/logo.png" 
      alt="StreamLab" 
      className="h-8 md:h-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
    
    {/* Add the search bar */}
    <div className="hidden md:block">
      <SearchBar />
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
      
      {/* Featured Hero Movie with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {featuredMovie && (
          <FeaturedHero key={featuredMovie.id} movie={featuredMovie} />
        )}
      </AnimatePresence>
      
      {/* Content Sections */}
      <div className="mt-8">
        <MovieRow title="Featured For You" movies={simulatedFeaturedMovies} />
        <MovieRow title="Trending Now" movies={trendingMovies} />
        {trendingMovies.length > 0 && (
          <MovieRow title="New Releases" movies={[...trendingMovies].reverse().slice(0, 8)} />
        )}
      </div>
    </motion.div>
  );
};

export default HomePage;
```

### src/services/apiService.js
```
// apiService.js
import axios from 'axios';
import authService from './authService';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000' || 'http://apimagic.xyz/areatvApi',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle authentication
api.interceptors.request.use(
  async (config) => {
    // Get the token (will generate a new one if needed)
    const token = await authService.ensureAuth();
    
    // Add token to request headers
    if (token) {
      config.headers.Authorization = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Get trending movies
  getTrendingMovies: async (limit = 20) => {
    try {
      const response = await api.get(`/api/v1/movies/trending?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },
  
  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await api.get(`/api/v1/movies/${movieId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching movie ${movieId}:`, error);
      throw error;
    }
  },
  
  // For demonstration, get featured movies
  getFeaturedMovies: async (limit = 20) => {
    try {
      const response = await api.get(`/api/v1/movies/featured?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      throw error;
    }
  },

  // Add this method to your apiService object
searchMovies: async (query, limit = 20) => {
  try {
    const response = await api.get(`/api/v1/movies/search?query=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}
};

export default apiService;
```

### src/components/SearchBar.jsx
```
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
```

### src/pages/SearchPage.jsx
```
// src/pages/SearchPage.jsx
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

  useEffect(() => {
    // Only search if there's a query
    if (query) {
      setLoading(true);
      setError(null);
      
      apiService.searchMovies(query)
        .then((response) => {
          setSearchResults(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Search error:', err);
          setError('Failed to search. Please try again.');
          setLoading(false);
        });
    } else {
      // Clear results if no query
      setSearchResults([]);
    }
  }, [query]);

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
          {loading ? (
            <div className="flex justify-center my-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center my-10">{error}</div>
          ) : searchResults.length > 0 ? (
            <>
              <h2 className="text-xl font-medium mb-4">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found for "{query}"
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                <AnimatePresence>
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
                </AnimatePresence>
              </div>
            </>
          ) : query ? (
            <div className="text-center my-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-gray-400">Try different keywords or check for typos</p>
            </div>
          ) : (
            <div className="text-center my-16">
              <h3 className="text-xl font-medium mb-2">Start typing to search</h3>
              <p className="text-gray-400">Search for movies by title, actors, directors, or genres</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage;
```

### src/App.js
```
// Modify src/App.js to include the new SearchPage route

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import SearchPage from './pages/SearchPage';  // Import the new component
import authService from './services/authService';

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
        </Router>
      )}
    </div>
  );
}

export default App;
```

### src/pages/MoviePage.jsx
```
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../services/apiService';
import SearchBar from '../components/SearchBar';

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const videoPlayerRef = useRef(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieData = await apiService.getMovieDetails(id);
        setMovie(movieData);
        
        // Set initial selected quality if video sources are available
        if (movieData.video_sources && Object.keys(movieData.video_sources).length > 0) {
          // Default to highest available quality
          const qualities = Object.keys(movieData.video_sources);
          setSelectedQuality(qualities[qualities.length - 1]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Handle full screen video
  const openFullscreenVideo = () => {
    if (!selectedQuality || !movie.video_sources[selectedQuality]) return;
    
    setShowVideoPlayer(true);
    
    // Request fullscreen after a small delay to ensure the element is in the DOM
    setTimeout(() => {
      if (videoPlayerRef.current) {
        if (videoPlayerRef.current.requestFullscreen) {
          videoPlayerRef.current.requestFullscreen();
        } else if (videoPlayerRef.current.webkitRequestFullscreen) {
          videoPlayerRef.current.webkitRequestFullscreen();
        } else if (videoPlayerRef.current.msRequestFullscreen) {
          videoPlayerRef.current.msRequestFullscreen();
        }
      }
    }, 100);
  };

  // Handle video quality selection
  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
  };

  // Format file size to GB or MB
  const formatFileSize = (sizeInMB) => {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(2)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <button 
          className="px-6 py-3 bg-primary text-white rounded-md"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = movie.trailer ? getYoutubeId(movie.trailer) : null;
  
  // Check if video sources are available
  const hasVideoSources = movie.video_sources && Object.keys(movie.video_sources).length > 0;

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button */}
<div className="absolute top-4 left-0 right-0 z-20 p-2 text-white flex items-center justify-between px-4">
  <button 
    onClick={() => navigate('/')}
    className="p-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  </button>
  
  <SearchBar isExpanded={false} setIsExpanded={() => navigate('/search')} />
</div>

      {/* Movie backdrop */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <img 
          src={movie.background} 
          alt={movie.title} 
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        {/* Watch Now button */}
        {hasVideoSources && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.button
              className="p-6 bg-green-600 rounded-full flex items-center justify-center relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openFullscreenVideo}
            >
              {/* Pulsating animation rings */}
              <span className="absolute w-full h-full rounded-full bg-green-600/50 animate-ping"></span>
              <span className="absolute w-full h-full rounded-full bg-green-600/30 animate-pulse"></span>
              
              {/* Play icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        )}
      </div>

      {/* Movie details */}
      <div className="px-4 md:px-8 py-6 relative z-10 -mt-20">
        <div className="flex flex-col md:flex-row">
          {/* Movie poster */}
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          {/* Movie info */}
          <div className="md:w-2/3 lg:w-3/4 md:pl-8 mt-6 md:mt-0">
            {movie.logo ? (
              <img 
                src={movie.logo} 
                alt={movie.title} 
                className="w-64 mb-4"
              />
            ) : (
              <h1 className="text-4xl font-bold mb-4 text-white">{movie.title}</h1>
            )}
            
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <span className="text-primary font-medium mr-2">{movie.imdb_rating} IMDb</span>
              <span className="mr-2">{movie.year}</span>
              <span>{movie.runtime}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map(genre => (
                <span key={genre} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
            
            <p className="text-gray-300 mb-6">{movie.description}</p>
            
            {/* Video quality selector */}
            {hasVideoSources && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Available Qualities</h3>
                <div className="inline-flex rounded-md shadow-sm p-1 bg-gray-800/50 backdrop-blur-sm">
                  {Object.entries(movie.video_sources).map(([quality, sourceData], index, array) => (
                    <button
                      key={quality}
                      onClick={() => handleQualityChange(quality)}
                      className={`relative px-6 py-3 transition-all ${
                        index === 0 ? 'rounded-l-md' : ''
                      } ${
                        index === array.length - 1 ? 'rounded-r-md' : ''
                      } ${
                        selectedQuality === quality 
                          ? 'bg-primary text-white font-medium shadow-md z-10' 
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${selectedQuality === quality ? 'text-[1.3rem]' : 'text-sm'}`}>{quality}</span>
                        <span className="text-xs opacity-80">  {formatFileSize(sourceData.fileSize)}</span>
                      </div>
                      {selectedQuality === quality && (
                        <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary-light"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Trailer button */}
            {/* {movie.trailer && (
              <div className="mb-6">
                <motion.button
                  className="px-6 py-3 border-2 border-primary bg-transparent rounded-md flex items-center justify-center"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(var(--color-primary), 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTrailer(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium">Watch Trailer</span>
                </motion.button>
              </div>
            )} */}
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Director</h3>
              <div className="flex flex-wrap gap-2">
                {movie.director.map(director => (
                  <span key={director} className="text-gray-300">{director}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map(actor => (
                  <span key={actor} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm mr-2 mb-2">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer modal */}
      {showTrailer && youtubeId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-6xl p-4">
            <button 
              className="absolute -top-10 right-0 p-2 text-white"
              onClick={() => setShowTrailer(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Video player */}
      {showVideoPlayer && selectedQuality && movie.video_sources[selectedQuality] && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button 
            className="absolute top-4 right-4 p-2 text-white z-10"
            onClick={() => {
              document.exitFullscreen().catch(() => {});
              setShowVideoPlayer(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <video
            ref={videoPlayerRef}
            className="w-full h-full"
            controls
            autoPlay
            src={movie.video_sources[selectedQuality].url}
            onEnded={() => setShowVideoPlayer(false)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </motion.div>
  );
};

export default MoviePage;
```

