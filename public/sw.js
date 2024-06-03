const CACHE_NAME = 'reverse-perspective-v1';
const urlsToCache = [
  './',
  './index.html',
  './script/app.js',
  './styles/destyle.min.css',
  './styles/app.css',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
