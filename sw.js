const CACHE_PREFIX = 'area-calc-pwa-';
const CACHE_NAME = CACHE_PREFIX + '20261004-mobile-fix-01-' + encodeURIComponent(self.registration.scope);
const APP_SHELL = ['./index.html', './manifest.json'];
const OPTIONAL_ASSETS = ['./icon-180.png', './icon-192.png', './icon-512.png', 'https://cdn.tailwindcss.com/'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL.map(path => new Request(new URL(path, self.registration.scope), {cache: 'reload'})));
    await Promise.allSettled(OPTIONAL_ASSETS.map(async path => {
      const url = new URL(path, self.registration.scope);
      const request = new Request(url, {cache: 'reload', mode: url.origin === self.location.origin ? 'same-origin' : 'no-cors'});
      const response = await fetch(request);
      if (response.ok || response.type === 'opaque') await cache.put(url.href, response);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const scopeSuffix = '-' + encodeURIComponent(self.registration.scope);
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME && key.startsWith(CACHE_PREFIX) && key.endsWith(scopeSuffix)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const inScope = url.origin === self.location.origin && url.href.startsWith(self.registration.scope);
  const isStyle = url.origin === 'https://cdn.tailwindcss.com';
  if (!inScope && !isStyle) return;
  const indexURL = new URL('./index.html', self.registration.scope).href;
  const isAppNavigation = event.request.mode === 'navigate' && (url.pathname === new URL(indexURL).pathname || url.pathname === new URL(self.registration.scope).pathname);
  const key = isAppNavigation ? indexURL : event.request;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request, {cache: 'no-store'});
      if (response.ok || response.type === 'opaque') {
        await cache.put(key, response.clone()).catch(() => {});
        return response;
      }
      if (response.status >= 500) {
        const cached = await cache.match(key);
        if (cached) return cached;
      }
      return response;
    } catch (error) {
      const cached = await cache.match(key);
      if (cached) return cached;
      if (isAppNavigation) return new Response('オフライン用データがありません。通信できる状態で開き直してください。', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
      return Response.error();
    }
  })());
});
