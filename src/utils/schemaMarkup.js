// src/utils/schemaMarkup.js

/**
 * Generate movie schema markup for SEO
 * @param {Object} movie - Movie object with details
 * @returns {Object} - Schema.org JSON-LD object
 */
export const generateMovieSchema = (movie) => {
    // Basic validation to ensure we have required fields
    if (!movie || !movie.title) {
      return null;
    }
  
    return {
      "@context": "https://schema.org",
      "@type": "Movie",
      "name": movie.title,
      "url": `https://areatv.online/movie/${movie.id}`,
      "image": movie.poster,
      "description": movie.description,
      "datePublished": movie.year,
      "duration": movie.runtime,
      "contentRating": movie.contentRating || "Not Rated",
      "genre": movie.genre,
      "director": movie.director.map(name => ({
        "@type": "Person",
        "name": name
      })),
      "actor": movie.cast.map(name => ({
        "@type": "Person",
        "name": name
      })),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": movie.imdb_rating,
        "bestRating": "10",
        "worstRating": "1",
        "ratingCount": movie.imdb_votes || 100
      },
      "potentialAction": {
        "@type": "WatchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `https://areatv.online/movie/${movie.id}`
        }
      }
    };
  };
  
  /**
   * Add schema markup to head
   * @param {Object} schemaObj - Schema.org object
   */
  export const addSchemaToHead = (schemaObj) => {
    if (!schemaObj) return;
    
    // Remove any existing schema
    const existingSchema = document.querySelector('script[data-schema="movie"]');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    // Add new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaObj);
    script.setAttribute('data-schema', 'movie');
    document.head.appendChild(script);
  };