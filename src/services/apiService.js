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