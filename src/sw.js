// Service worker: deja la guía disponible sin cobertura.
// Esta plantilla la completa vite.config.ts al compilar (versión y lista de archivos).
// - Al instalarse guarda toda la aplicación, para que funcione sin conexión desde la primera visita.
// - Páginas: primero la red (para recibir correcciones) y, si falla, la copia guardada.
// - Recursos con huella en el nombre (/assets/): primero la copia guardada.
const CACHE = 'mesa-electoral-__VERSION__';
const ARCHIVOS = "__ARCHIVOS__";
const BASE = new URL('./', self.location).pathname;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll([BASE, ...ARCHIVOS.map((a) => BASE + a)]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('mesa-electoral-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  const guardar = (res) => {
    if (res.ok) {
      const copia = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copia));
    }
    return res;
  };
  if (url.pathname.startsWith(BASE + 'assets/')) {
    e.respondWith(caches.match(e.request, { ignoreVary: true }).then((r) => r || fetch(e.request).then(guardar)));
  } else {
    // ignoreSearch: «?ahora=…» u otros parámetros no impiden encontrar la página guardada
    e.respondWith(
      fetch(e.request)
        .then(guardar)
        .catch(() => caches.match(e.request, { ignoreSearch: true, ignoreVary: true }).then((r) => r || caches.match(BASE)))
    );
  }
});
