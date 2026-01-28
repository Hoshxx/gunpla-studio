/* === sw.js (Version 3.3) === */
const CACHE_NAME = 'gunpla-studio-v4.7; // <--- Increment this string to force update
const ASSETS_TO_CACHE = [
    './',                 // The root index
    './index.html',       // The main file
    './manifest.json',    // The manifest
    // Add any images/icons here if you want them offline
];

// 1. INSTALL: Force the new SW to wake up immediately
self.addEventListener('install', (event) => {
    // This tells the browser: "Don't wait! Install this version NOW."
    self.skipWaiting(); 
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching assets for ' + CACHE_NAME);
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. ACTIVATE: Delete old caches and take control of the app
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW] Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => {
            // This tells the SW: "Take control of all open clients instantly."
            return self.clients.claim(); 
        })
    );
});

// 3. FETCH: Network First, Fallback to Cache (Safest for development)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If network works, return response AND cache it for later
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // If network fails, try the cache
                return caches.match(event.request);
            })
    );
});
