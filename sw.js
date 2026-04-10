const CACHE_NAME = 'boki1-v1';
const ASSETS = [
  '/souma_app/',
  '/souma_app/index.html',
  '/souma_app/jett.jpg',
  '/souma_app/icon-192.png',
  '/souma_app/icon-512.png',
  '/souma_app/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() {
        return caches.match('/souma_app/index.html');
      });
    })
  );
});
