const CACHE = 'nexoplay-v17-assets';
const SHELL = [
  './', './index.html', './favicon.svg', './manifest.webmanifest',
  './css/legacy.css','./css/nexoplay-v2.css','./css/nexoplay-v3-fixes.css','./css/nexoplay-v4-fixes.css',
  './css/nexoplay-v5-fixes.css','./css/nexoplay-v6-fixes.css','./css/nexoplay-v7-fixes.css','./css/nexoplay-v8-fixes.css','./css/nexoplay-v12-fixes.css','./css/nexoplay-v15-nexo.css','./css/nexoplay-v13-nexo-notifications.css',
  './js/legacy-runtime.js','./js/nexoplay-v2.js','./js/nexoplay-v5.js','./js/nexoplay-v6.js','./js/nexoplay-v7.js','./js/nexoplay-v8.js','./js/nexoplay-v13.js','./js/nexoplay-v15.js','./js/nexo-config.js',
  './pages/peliculas.html','./pages/deportes.html','./pages/ofertas.html','./pages/rangos.html','./pages/referidos.html','./pages/soporte.html','./pages/wallet.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: red primero; caché como respaldo.
  if (req.mode === 'navigate' || (req.destination === 'document')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // CSS/JS/imagenes: nunca devolver index.html como respuesta de respaldo.
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }))
  );
});

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  const title = data.title || 'NexoPlay 🔔';
  const options = {
    body: data.body || 'Tienes una nueva actualización.',
    icon: './favicon.svg',
    badge: './favicon.svg',
    tag: data.tag || 'nexoplay',
    renotify: true,
    data: { url: data.url || './index.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification?.data?.url || './index.html';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
    const existing = list.find(c => c.url.includes(new URL(url, self.location.origin).pathname));
    if (existing) return existing.focus();
    return clients.openWindow(url);
  }));
});
