const CACHE_NAME = 'area-calc-pwa-v7';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest?v=20260330-scrollfix2',
  './icon-192.png?v=20260330-scrollfix2',
  './icon-512.png?v=20260330-scrollfix2',
  './icon-maskable-192.png?v=20260330-scrollfix2',
  './icon-maskable-512.png?v=20260330-scrollfix2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  const isNavigation =
    request.mode === 'navigate' ||
    request.destination === 'document';

  if (isNavigation) {
    event.respondWith((async () => {
      try {
        const freshResponse = await fetch(request, { cache: 'no-store' });

        const cache = await caches.open(CACHE_NAME);
        await cache.put('./index.html', freshResponse.clone());

        return freshResponse;
      } catch (error) {
        const cachedIndex = await caches.match('./index.html');
        if (cachedIndex) return cachedIndex;

        const cachedRequest = await caches.match(request);
        if (cachedRequest) return cachedRequest;

        throw error;
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    const networkFetch = fetch(request, { cache: 'no-store' })
      .then((response) => {
        if (response && response.status === 200) {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      })
      .catch(() => null);

    if (cached) {
      event.waitUntil(networkFetch);
      return cached;
    }

    const fresh = await networkFetch;
    if (fresh) return fresh;

    const fallback = await caches.match('./index.html');
    if (fallback) return fallback;

    return new Response('Offline', {
      status: 503,
      statusText: 'Offline'
    });
  })());
});
