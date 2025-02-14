/* eslint-disable no-restricted-globals */
const CACHE_NAME = "notatnik-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/main.*.js",
  "/static/css/main.*.css",
  "/favicon.ico",
  "/icon.png",
];

// Instalacja Service Workera i zapisanie plików w cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Obsługa żądań sieciowych – Cache First z Network Fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((fetchedResponse) => {
          if (!fetchedResponse || fetchedResponse.status !== 200) {
            return fetchedResponse;
          }
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchedResponse.clone());
            return fetchedResponse;
          });
        })
        .catch(() => {
          if (event.request.url.endsWith(".html")) {
            return caches.match("/index.html");
          }
        });
    })
  );
});

// Usuwanie starego cache podczas aktywacji nowej wersji Service Workera
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Obsługa powiadomień Push
self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : { title: "Powiadomienie", body: "Masz nowe powiadomienie!" };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png",
      badge: "/icon.png",
    })
  );
});
