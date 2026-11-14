const SALUTE_CACHE = 'salute-store-v27';
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(SALUTE_CACHE).then((cache) => cache.addAll([
      './index.html',
      './style.css',
      './script.js'
    ])),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== SALUTE_CACHE) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
