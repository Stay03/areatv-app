/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

const CACHE_NAME = 'areatv-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/logo192.png',
  '/logo512.png',
  '/fonts/fonts.css',
  '/fonts/inter-var.woff2',
];

// Install the service worker and cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first strategy for API requests, cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.url.includes('apimagic.xyz')) {
    return;
  }

  // HTML navigation requests should always go to the network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For static assets, use cache-first strategy
  if (
    event.request.destination === 'style' ||
    event.request.destination === 'script' ||
    event.request.destination === 'font' ||
    event.request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Clone the response as it can only be consumed once
            const responseToCache = fetchResponse.clone();
            
            caches.open(CACHE_NAME).then((cache) => {
              // Only cache successful responses
              if (fetchResponse.status === 200) {
                cache.put(event.request, responseToCache);
              }
            });
            
            return fetchResponse;
          });
      })
    );
    return;
  }

  // For all other requests, try the network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache API responses
        if (
          !event.request.url.includes('apimagic.xyz') &&
          response.status === 200
        ) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});