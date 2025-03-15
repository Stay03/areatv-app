// apiService.js
import axios from 'axios';
import authService from './authService';
import cacheService from './cacheService';

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
  // Get trending movies with caching
  getTrendingMovies: async (limit = 20, forceRefresh = false) => {
    const cacheKey = `trending-movies-${limit}`;
    
    // Return cached data if available and not forced refresh
    if (!forceRefresh && cacheService.has(cacheKey)) {
      return cacheService.get(cacheKey);
    }
    
    try {
      const response = await api.get(`/api/v1/movies/trending?limit=${limit}`);
      return cacheService.set(cacheKey, response.data.data);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },
  
  // Get movie details with caching
  getMovieDetails: async (movieId, forceRefresh = false) => {
    const cacheKey = `movie-${movieId}`;
    
    // Return cached data if available and not forced refresh
    if (!forceRefresh && cacheService.has(cacheKey)) {
      return cacheService.get(cacheKey);
    }
    
    try {
      const response = await api.get(`/api/v1/movies/${movieId}`);
      return cacheService.set(cacheKey, response.data.data);
    } catch (error) {
      console.error(`Error fetching movie ${movieId}:`, error);
      throw error;
    }
  },
  
  // For demonstration, get featured movies with caching
  getFeaturedMovies: async (limit = 20, forceRefresh = false) => {
    const cacheKey = `featured-movies-${limit}`;
    
    // Return cached data if available and not forced refresh
    if (!forceRefresh && cacheService.has(cacheKey)) {
      return cacheService.get(cacheKey);
    }
    
    try {
      const response = await api.get(`/api/v1/movies/featured?limit=${limit}`);
      return cacheService.set(cacheKey, response.data.data);
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      throw error;
    }
  },

  // Search movies with caching
  searchMovies: async (query, limit = 20, forceRefresh = false) => {
    const cacheKey = `search-movies-${query}-${limit}`;
    
    // Return cached data if available and not forced refresh
    if (!forceRefresh && cacheService.has(cacheKey)) {
      return cacheService.get(cacheKey);
    }
    
    try {
      const response = await api.get(`/api/v1/movies/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      return cacheService.set(cacheKey, response.data);
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },
  
  // Prefetch a movie detail (to be used for background loading)
  prefetchMovie: async (movieId) => {
    try {
      // Don't await this, let it happen in background
      apiService.getMovieDetails(movieId, false);
    } catch (error) {
      // Silently fail, it's just preloading
      console.log('Background prefetch failed:', error);
    }
  }
};

export default apiService;