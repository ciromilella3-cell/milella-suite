// Service Worker per CareAssist Pro: 100% Funzionamento Offline Domiciliare
const CACHE_NAME = 'careassist-pro-v87';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './turni.html',
  './style.css',
  './style.css?v=87',
  './app.js?v=87',
  './app.js',
  './turnario_admin.js',
  './turnario_admin.js?v=2',
  './TURNARIO_SETTIMANALE_A4.html',
  './qrcode_data_uri.js',
  './suite_nav.js',
  './suite_security_gate.js',
  './auth_token.js',
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

// Strategia: Network First (no-cache) con fallback immediato su Cache offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Ignora chiamate API server (gestite da app.js con local storage offline fallback)
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request, { ignoreSearch: true });
      })
  );
});
