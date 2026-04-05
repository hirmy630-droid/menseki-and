const VERSION = '20260405-iphone3';
const CACHE_NAME = `area-calc-pwa-${VERSION}`;
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './apple-touch-icon-180-20260405-iphone3.png'
];

const RUNTIME_CACHE = 'area-calc-runtime';
const TAILWIND_CDN = 'https://cdn.tailwindcss.com';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE)
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

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    cache.put('./index.html', response.clone()).catch(() => {});
    return response;
  } catch (error) {
    return (await cache.match('./index.html')) || Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName = RUNTIME_CACHE) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      cache.put(request, response.clone()).catch(() => {});
      return response;
    })
    .catch(() => null);

  return cached || (await fetchPromise) || Response.error();
}

async function cacheFirst(request, cacheName = CACHE_NAME) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  cache.put(request, response.clone()).catch(() => {});
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate';
  const isSameOrigin = url.origin === self.location.origin;
  const isTailwind = url.href.startsWith(TAILWIND_CDN);

  if (isNavigation) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (isTailwind) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  if (!isSameOrigin) return;

  const destination = event.request.destination;
  if (['script', 'style', 'image', 'font', 'manifest'].includes(destination)) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});
