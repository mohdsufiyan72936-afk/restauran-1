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
];

// ─── INSTALL ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Skipped:', url, err.message))
        )
      )
    )
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

// ─── FETCH ───────────────────────────────────────────────
self.addEventListener('fetch', event => {
  // Ignore non-http requests (chrome-extension://, blob:, data: etc.)
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip external URLs that shouldn't be cached
  if (url.hostname.includes('script.google.com')) return;
  if (url.hostname.includes('unsplash.com')) return;
  if (url.hostname.includes('cdn.tailwindcss.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback for HTML navigation
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});