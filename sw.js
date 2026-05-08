// ============================================================
// sw.js — Service Worker for PWA offline support
// ============================================================

const CACHE_NAME = 'rubancore-v1';
const ASSETS = [
  './',
  './index.html',
  './js/app.js',
  './js/state.js',
  './js/api.js',
  './js/ui.js',
  './data/menu.json',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap',
];

// ─── INSTALL ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => console.warn('[SW] Cache failed:', err));
    })
  );
  self.skipWaiting();
});

// ─── ACTIVATE ────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ─── FETCH (Cache-First for assets, Network-First for API) ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and external APIs
  if (event.request.method !== 'GET') return;
  if (url.hostname.includes('script.google.com')) return;
  if (url.hostname.includes('unsplash.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
