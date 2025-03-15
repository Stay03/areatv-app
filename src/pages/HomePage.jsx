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