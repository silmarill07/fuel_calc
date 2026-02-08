// service-worker.js
const CACHE_NAME = 'fuel-calculator-v2';
const BASE_PATH = '/fuel_calc';

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/style.css`, 
  `${BASE_PATH}/script.js`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/logo.png`,
  `${BASE_PATH}/icons/chevron-left.svg`,
  `${BASE_PATH}/icons/chevron-right.svg`,
  `${BASE_PATH}/icons/coins-solid-full.svg`,
  `${BASE_PATH}/icons/fa--road.svg`,
  `${BASE_PATH}/icons/gas-pump-solid-full.svg`,
  `${BASE_PATH}/icons/tachometer-alt-solid.svg`,
  `${BASE_PATH}/favicons/favicon-16.png`,
  `${BASE_PATH}/favicons/favicon-32.png`,
  `${BASE_PATH}/favicons/favicon-96.png`,
  `${BASE_PATH}/favicons/favicon-192.png`,
  `${BASE_PATH}/favicons/favicon-512.png`,
  `${BASE_PATH}/favicons/apple-touch-icon.png`,
  `${BASE_PATH}/favicons/favicon.ico`
];

// Устанавливаем Service Worker и кешируем файлы
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        // Принудительно активируем новый Service Worker
        return self.skipWaiting();
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
        
        // Клонируем запрос для кеширования
        return fetch(event.request).then(function(response) {
          // Проверяем валидность ответа
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Клонируем ответ для кеширования
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(function() {
        // Возвращаем офлайн страницу если есть
        return caches.match(`${BASE_PATH}/index.html`);
      })
  );
});

// Обновляем кеш при изменении Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(function() {
      // Принудительно берем контроль над всеми клиентами
      return self.clients.claim();
    })
  );
});
