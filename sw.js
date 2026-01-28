const CACHE_NAME = 'gunpla-studio-v3.3'; // <--- CHANGE THIS EVERY TIME YOU UPDATE
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Install & Cache Assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the new version to take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching new assets');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate & Clear Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Take control of all open tabs/windows immediately
      await clients.claim();
      
      // Get all existing cache keys
      const cacheNames = await caches.keys();
      
      // Delete any cache that isn't the current CACHE_NAME
      await Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })()
  );
});

// 3. Fetch (Network-first or Cache-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached version if found, otherwise hit the network
      return response || fetch(event.request);
    })
  );
});
