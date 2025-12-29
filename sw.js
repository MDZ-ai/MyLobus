const CACHE_NAME = 'mylobus-os-v102-prod';

// Files that ALWAYS exist in both Dev and Prod
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // We utilize 'addAll' but wrap it to not fail completely if one file is missing
        return cache.addAll(CORE_ASSETS).catch(err => console.warn('SW Pre-cache warning:', err));
      })
  );
  self.skipWaiting();
});

// Activate Event: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network First, then Cache (Stale-while-revalidate strategy equivalent)
self.addEventListener('fetch', (event) => {
  // Skip non-GET or non-http requests (like extensions)
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If network works, return it and cache it for later
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
            // We cache everything the user visits successfully
            cache.put(event.request, responseToCache);
        });
        
        return networkResponse;
      })
      .catch(() => {
        // If network fails (offline), try to return from cache
        return caches.match(event.request);
      })
  );
});