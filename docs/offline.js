---
---
{% capture build_number %}{{ site.github.build_revision }}{{ site.time | date: '%Y%m%d%H%M%S' }}{% endcapture %}
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('{{ build_number }}').then((cache) => {
      return cache.addAll([
        './',
        './offline.js',
        './q3s.webmanifest?v={{ build_number }}',
        './assets/external.js?v={{ build_number }}',
        './assets/mdc.css?v={{ build_number }}',
        './assets/mdc.js?v={{ build_number }}',
        './assets/bundle.css?v={{ build_number }}',
        './assets/bundle.js?v={{ build_number }}',
        './assets/check-and-redirect.js?v={{ build_number }}',
        './assets/svg/favicon.svg?v={{ build_number }}'
      ])
    })
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async keyList => {
      let isUpdate = false;
      await Promise.all(keyList.map(key => {
        if (key !== '{{ build_number }}') {
          isUpdate = true;
          return caches.delete(key)
        }
        return true
      }));
      if (isUpdate) {
        await self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage('force-refresh');
          });
        });
      }
    })
  );
});
self.addEventListener('fetch', (event) => {
  if (new URL(event.request.url).pathname === '/') {
    fetch(`./version.json?t=${new Date().toJSON()}`)
      .then(data => data.json())
      .then(({ buildNumber }) => {
        if (buildNumber !== '{{ build_number }}') {
          return self.registration.update()
        }
      }).catch(error => console.error(error, error.stack));
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open('{{ build_number }}').then((cache) => {
          cache.put(event.request, response.clone());
          return response
        })
      })
    })
  );
});
