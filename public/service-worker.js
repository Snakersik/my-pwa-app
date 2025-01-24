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

// Instalacja service workera i zapisanie plików w cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Obsługa żądań sieciowych
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Jeśli zasób znajduje się w cache, zwróć go
        return cachedResponse;
      }

      // Jeśli zasobu nie ma w cache, spróbuj pobrać go z sieci
      return fetch(event.request)
        .then((fetchedResponse) => {
          // Jeśli odpowiedź jest poprawna, zapisz ją w cache
          if (!fetchedResponse || fetchedResponse.status !== 200) {
            return fetchedResponse;
          }
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchedResponse.clone());
            return fetchedResponse;
          });
        })
        .catch(() => {
          // Jeśli nie ma połączenia z siecią, obsłuż pliki offline
          if (event.request.url.endsWith(".html")) {
            return caches.match("/index.html"); // Wróć do pliku index.html
          }
        });
    })
  );
});

// Aktywacja service workera i czyszczenie starego cache
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
