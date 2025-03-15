// src/services/cacheService.js
const cacheService = {
    cache: new Map(),
    
    // Set data in cache with optional TTL (time to live in ms)
    set: (key, data, ttl = 300000) => { // Default 5 minutes TTL
      cacheService.cache.set(key, {
        data,
        expiry: ttl ? Date.now() + ttl : null
      });
      return data;
    },
    
    // Get data from cache if available and not expired
    get: (key) => {
      const cached = cacheService.cache.get(key);
      
      if (!cached) return null;
      
      // Check if expired
      if (cached.expiry && Date.now() > cached.expiry) {
        cacheService.cache.delete(key);
        return null;
      }
      
      return cached.data;
    },
    
    // Check if key exists in cache and is valid
    has: (key) => {
      const cached = cacheService.cache.get(key);
      if (!cached) return false;
      
      // Check if expired
      if (cached.expiry && Date.now() > cached.expiry) {
        cacheService.cache.delete(key);
        return false;
      }
      
      return true;
    },
    
    // Remove item from cache
    remove: (key) => {
      cacheService.cache.delete(key);
    },
    
    // Clear entire cache
    clear: () => {
      cacheService.cache.clear();
    }
  };
  
  export default cacheService;