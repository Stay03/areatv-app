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