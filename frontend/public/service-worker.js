self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('app-cache-v1').then(cache => cache.addAll(['/'])));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open('app-cache-v1').then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => resp);
    })
  );
});
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queue') {
    // The page should listen to this message and flush the queue.
    event.waitUntil(self.clients.matchAll().then(clients => {
      for (const client of clients) client.postMessage({type:'SYNC_TRIGGER'});
    }));
  }
});
