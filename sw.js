const CACHE_NAME = 'cruiser-pro-v7';

// Install වෙද්දී එකපාරම Active වෙන්න
self.addEventListener('install', event => {
  self.skipWaiting();
});

// පරණ Cache ෆයිල් තියෙනවා නම් මකා දාලා අලුත් එකට ඉඩ දීම
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Dynamic Caching (ඉන්ටර්නෙට් තියෙද්දී සේව් කරගෙන, නැතිවෙලාවට පාවිච්චි කිරීම)
self.addEventListener('fetch', event => {
  // කාලගුණ දත්ත (Weather API) සහ අනවශ්‍ය දේවල් සේව් කරන්නේ නැහැ
  if (event.request.url.includes('api.open-meteo.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // ඉන්ටර්නෙට් තියෙනවා නම්, අලුත් දත්ත අරන් Cache එකට දානවා
        if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // ඉන්ටර්නෙට් නැත්නම් (Offline නම්) සේව් වෙලා තියෙන දත්ත පෙන්වනවා
        return caches.match(event.request);
      })
  );
});
