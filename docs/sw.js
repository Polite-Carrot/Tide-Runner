/* Bump on every deploy to invalidate the previous cache. */
const CACHE = 'tiderunner-v29';
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
  /* Cross-origin requests (GA4's gtag.js and the collect beacons it sends) are
     left to the browser untouched. Without this, an offline fetch of one of
     them fell through to the final .catch() below, which resolves to
     index.html — a document handed back as the body of a failed script
     request. Harmless in practice (analytics never surfaces to the player),
     but wrong, and easy to avoid by not intercepting what isn't this app's. */
  if(new URL(req.url).origin !== location.origin) return;

  /* The page itself goes to the network first, falling back to the cache when
     offline. Cache-first served a stale index.html on every launch: the old
     worker answered before the new one had even been noticed, so a deploy only
     appeared on the launch after next, if at all — iOS is slow to check for a
     new worker in a home-screen app. Everything else stays cache-first, since
     the icons and logos only change when CACHE does. */
  if(req.mode === 'navigate' || (req.destination === 'document')){
    event.respondWith(
      fetch(req).then(res => {
        if(res && res.ok && new URL(req.url).origin === location.origin){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

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
