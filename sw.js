var isGithubPages = location.hostname === "coalescentdivide.github.io";
var GHPATH = isGithubPages ? '/rto-helper' : '';
var APP_PREFIX = 'RTOCALC';
var VERSION = 'version_008';
var CACHE_NAME = APP_PREFIX + VERSION;

// Update URLS to use GHPATH dynamically
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/css/styles.css`,
  `${GHPATH}/images/icon.png`,
  `${GHPATH}/js/app.js`
];

// Install Event: Cache files and force immediate activation
self.addEventListener('install', function (e) {
  console.log('Installing service worker...');
  
  // Force this service worker to immediately take control
  self.skipWaiting();

  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Caching files:', URLS);
      return cache.addAll(URLS);
    })
  );
});

// Activate Event: Remove old caches and take control of clients
self.addEventListener('activate', function (e) {
  console.log('Activating service worker...');
  
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  // Immediately take control of all open pages
  self.clients.claim();
});

// Fetch Event: Serve files from cache, then fallback to network
self.addEventListener('fetch', function (e) {
  console.log('Fetching request:', e.request.url);
  
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
