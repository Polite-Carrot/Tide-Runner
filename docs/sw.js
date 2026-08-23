/* Bump on every deploy to invalidate the previous cache. */
const CACHE = 'tiderunner-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './polite-carrot-logo.svg',
  './polite-carrot-name.svg',
  './apple-touch-icon.png?v=2',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if(res && res.ok && new URL(req.url).origin === location.origin){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
