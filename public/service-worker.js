/* eslint-disable no-restricted-globals */
const CACHE_NAME = "notatnik-cache-v2";

async function getFilesToCache() {
  const manifestResponse = await fetch("/asset-manifest.json");
  const manifest = await manifestResponse.json();

  return [
    "/index.html",
    "/favicon.ico",
    "/icon.png",
    "/logo192.png",
    "/logo512.png",
    "/manifest.json",
    "/robots.txt",
    manifest.files["main.css"],
    manifest.files["main.js"],
  ];
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return getFilesToCache().then((urlsToCache) => {
        return Promise.all(
          urlsToCache.map((url) => {
            return fetch(url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch: ${url}`);
                }
                return cache.put(url, response);
              })
              .catch((error) => {
                console.error(`Błąd przy dodawaniu do cache: ${url}`, error);
              });
          })
        );
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  const { action, title, options } = event.data;

  if (action === "showNotification") {
    self.registration.showNotification(title, options);
  }
});

self.addEventListener("push", function (event) {
  const options = {
    body: event.data ? event.data.text() : "Nowa notatka",
    icon: "/icon.png",
    badge: "/badge.png",
  };

  event.waitUntil(
    self.registration.showNotification("Notatka dodana!", options)
  );
});
