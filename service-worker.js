/* ============================================================ */
/* PETCARE v3.0 — SERVICE WORKER                                 */
/* Offline caching + asset management                            */
/* ============================================================ */

const CACHE_NAME = 'petcare-v3-cache-v2';
const RUNTIME_CACHE = 'petcare-v3-runtime-v2';

/* ============================================================ */
/* 1. FILES TO CACHE ON INSTALL                                  */
/* ============================================================ */
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',

  /* CSS */
  './css/palette.css',
  './css/main.css',
  './css/pages.css',
  './css/profile.css',
  './css/profile-view.css',
  './css/skeleton.css',
  './css/dark.css',

  /* JS - Core */
  './js/app.js',
  './js/data.js',
  './js/ui/skeleton.js',
  './js/drawer.js',

  /* JS - Features */
  './js/home.js',
  './js/shop.js',
  './js/checkout.js',
  './js/tracking.js',
  './js/notification.js',
  './js/appointments.js',
  './js/care.js',

  /* JS - Social & Profile */
  './js/foster.js',
  './js/profile-view.js',
  './js/memory.js',
  './js/search.js',
  './js/profile.js',

    /* JS - PWA */
  './js/pwa.js',

  /* JS - Onboarding */
  './js/onboarding.js',

  /* JS - Demo Mode */
  './js/demo-data.js',
  './js/demo.js',

  /* CSS - Additional */
  './css/onboarding.css',
  './css/demo.css',

  /* Icons */
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',

  /* Illustrations */
  './assets/illustrations/hero-dog-cat.png'
];

/* ============================================================ */
/* 2. INSTALL EVENT — PRECACHE                                    */
/* ============================================================ */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell');
        // Cache files individually — ignore failures
        return Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('[SW] Failed to cache:', url, err);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Install complete');
        return self.skipWaiting();
      })
  );
});

/* ============================================================ */
/* 3. ACTIVATE EVENT — CLEANUP OLD CACHES                        */
/* ============================================================ */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activate complete');
        return self.clients.claim();
      })
  );
});

/* ============================================================ */
/* 4. FETCH EVENT — CACHE STRATEGIES                             */
/* ============================================================ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (CDN, fonts, etc.)
  if (url.origin !== location.origin) {
    // Network first for external resources
    event.respondWith(networkFirst(request));
    return;
  }

  // Skip chrome-extension:// and other schemes
  if (!url.protocol.startsWith('http')) return;

  // HTML pages — network first (fresh content)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  // CSS, JS, images — cache first (fast load)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else — stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request));
});

/* ============================================================ */
/* 5. STRATEGY: CACHE FIRST                                      */
/* For assets that don't change often                            */
/* ============================================================ */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Cache-first failed:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

/* ============================================================ */
/* 6. STRATEGY: NETWORK FIRST                                    */
/* For HTML pages — fresh content but fallback to cache          */
/* ============================================================ */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback to offline page
    if (request.mode === 'navigate') {
      const offline = await caches.match('./offline.html');
      if (offline) return offline;
    }

    return new Response('Offline', { status: 503 });
  }
}

/* ============================================================ */
/* 7. STRATEGY: STALE-WHILE-REVALIDATE                           */
/* Serve cache immediately, update in background                 */
/* ============================================================ */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, response.clone());
        });
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
}

/* ============================================================ */
/* 8. MESSAGE HANDLER — SKIP WAITING                             */
/* ============================================================ */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded');
