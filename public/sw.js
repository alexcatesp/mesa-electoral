// Service worker: deja la guía disponible sin cobertura.
// Páginas: primero la red (para recibir correcciones) y, si falla, la copia guardada.
// Recursos con huella en el nombre (/assets/): primero la copia guardada.
const CACHE = 'mesa-electoral-v1';
const BASE = new URL('./', self.location).pathname;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([BASE, BASE + 'icono.svg', BASE + 'manifest.webmanifest'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  const guardar = (res) => {
    if (res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); }
    return res;
  };
  if (url.pathname.startsWith(BASE + 'assets/')) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then(guardar)));
  } else {
    e.respondWith(fetch(e.request).then(guardar).catch(() => caches.match(e.request).then((r) => r || caches.match(BASE))));
  }
});
