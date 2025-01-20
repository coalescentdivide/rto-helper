// Version your cache
const CACHE_NAME = "rto-helper-v1.0.1"; // Increment this when making updates

const urlsToCache = [
  "/rto-helper/",                // Root
  "/rto-helper/index.html",      // Main HTML file
  "/rto-helper/css/styles.css",  // Styles
  "/rto-helper/js/app.js",       // JavaScript
  "/rto-helper/images/icon.png"  // Icon
];

// Install event - Cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache:", CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - Clear old cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - Load from cache or network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Return cached file
      }
      return fetch(event.request); // Otherwise, fetch from network
    })
  );
});
