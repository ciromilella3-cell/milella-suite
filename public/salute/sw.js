self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open('salute-store-v18').then((cache) => cache.addAll([
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
        if (key !== 'salute-store-v18') {
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
