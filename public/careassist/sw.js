// Service Worker per CareAssist Pro: 100% Funzionamento Offline Domiciliare
const CACHE_NAME = 'careassist-pro-v24';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './qrcode_data_uri.js',
  './careassist_icon.jpg',
  './manifest.json',
  './DIARIO_GLICEMICO_ROSA.html',
  './GRIGLIA_SETTIMANALE_ROSA.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Avviso pre-caching asset:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Strategia: Network First per dati freschi, con fallback immediato su Cache se non c'è internet/Wi-Fi
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Ignora chiamate API server (gestite da app.js con local storage offline fallback)
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
