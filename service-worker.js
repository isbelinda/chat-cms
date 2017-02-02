var cacheName = 'chat-cms-0.0.4';
var filesToCache = [
    '/',
    '/index.html',
    '/scripts/config.js',
    '/scripts/script.js',
    '/views/chat.html',
    '/views/chatRooms.html',
    '/views/login.html'
];

self.addEventListener('install', function (event) {
    console.log('Service worker install');
    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            return cache.addAll(filesToCache);
        })
    )
});

self.addEventListener('activate', function (event) {
    console.log('Service worker activate');
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    )

    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let notificationTitle = 'New message';
    const notificationOptions = {
        body: `You have new message.`,
        icon: 'contents/images/icons/icon.png',
        badge: 'contents/images/icons/icon.png'
    };

    if(event.data) {
        notificationTitle = 'Received Payload';
        notificationOptions.body = event.data.text();
    }

    const notificationPromise = self.registration.showNotification(notificationTitle, notificationOptions);
    event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/')
    );
});

self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);
});