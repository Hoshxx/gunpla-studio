const CACHE_NAME = 'gunpla-studio-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://img.icons8.com/color/512/paint-bucket.png'
];

// Install the Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercept requests to serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the waiting service worker to become active
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Immediately take control of all open tabs
});
