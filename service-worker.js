// service-worker.js
const CACHE_NAME = 'fuel-calculator-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css', 
  './script.js',
  './favicons/favicon-16x16.png',
  './icons/chevron-left.svg',
  './icons/chevron-right.svg',
  './icons/coins-solid-full.svg',
  './icons/fa--road.svg',
  './icons/tachometer-alt-solid.svg'
];

// Устанавливаем Service Worker и кешируем файлы
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехватываем запросы и отдаем из кеша
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Возвращаем кешированную версию или делаем сетевой запрос
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Обновляем кеш при изменении Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});