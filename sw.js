const CACHE_NAME = 'cruiser-pro-v1.2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css',
  'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js',
  'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css',
  'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+Sinhala:wght@300;400;600&family=Rajdhani:wght@400;500;600&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response; }
        return fetch(event.request).catch(() => {
            console.log("Offline: Cannot fetch " + event.request.url);
        });
      })
  );
});
