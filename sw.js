const CACHE_VERSION = 'touchfix-v3';
const STATIC_CACHE = `area-calc-${CACHE_VERSION}`;

const CORE_ASSETS = [
  './',
  './index.html?v=touchfix3',
  './manifest.json?v=touchfix3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== STATIC_CACHE)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Navigation requests: network first, then cached index fallback
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const network = await fetch(req, { cache: 'no-store' });
        const cache = await caches.open(STATIC_CACHE);
        cache.put('./index.html?v=touchfix3', network.clone());
        return network;
      } catch (err) {
        const cached = await caches.match('./index.html?v=touchfix3');
        return cached || Response.error();
      }
    })());
    return;
  }

  // Same-origin static files: stale-while-revalidate
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req, { ignoreSearch: false }) || await caches.match(url.pathname, { ignoreSearch: true });
      const fetchPromise = fetch(req).then(async (network) => {
        if (req.method === 'GET' && network && network.status === 200) {
          const cache = await caches.open(STATIC_CACHE);
          cache.put(req, network.clone());
        }
        return network;
      }).catch(() => cached);

      return cached || fetchPromise;
    })());
  }
});
