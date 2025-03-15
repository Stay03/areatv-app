// authService.js
import axios from 'axios';

const BASE_URL = 'http://apimagic.xyz/areatvApi';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Create base axios instance for auth requests
const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Create authentication service
const authService = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  // Save token to localStorage
  saveToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  // Save user data to localStorage
  saveUser: (userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  },
  
  // Get user data from localStorage
  getUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  
  // Clear auth data from localStorage
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  // Request guest token
  requestGuestToken: async () => {
    try {
      const response = await authAxios.post('/api/v1/guest');
      
      const { access_token, token_type, user } = response.data;
      
      // Save the token and user data
      authService.saveToken(`${token_type} ${access_token}`);
      authService.saveUser(user);
      
      return `${token_type} ${access_token}`;
    } catch (error) {
      console.error('Error getting guest token:', error);
      throw error;
    }
  },
  
  // Validate token
  validateToken: async (token) => {
    try {
      const response = await authAxios.get('/api/v1/user', {
        headers: {
          'Authorization': token
        }
      });
      
      // Update user data with latest from server
      authService.saveUser(response.data.data);
      
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      // Clear invalid token
      authService.clearAuth();
      return false;
    }
  },
  
  // Check and ensure valid token exists
  ensureAuth: async () => {
    const token = authService.getToken();
    
    if (!token) {
      // No token exists, request a new one
      return await authService.requestGuestToken();
    }
    
    // Token exists, validate it
    const isValid = await authService.validateToken(token);
    
    if (!isValid) {
      // Token was invalid, request a new one
      return await authService.requestGuestToken();
    }
    
    return token;
  }
};

export default authService;