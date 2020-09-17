self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open('{{ build_number }}').then((cache) => {
      return cache.addAll([
        './',
        './offline.js',
        './q3s.webmanifest?v={{ build_number }}',
        './assets/bundle.css?v={{ build_number }}',
        './assets/bundle.js?v={{ build_number }}',
        './assets/check-and-redirect.js?v={{ build_number }}',
        './assets/external.js?v={{ build_number }}',
        './assets/png/favicon32.png?v={{ build_number }}',
        './assets/png/favicon64.png?v={{ build_number }}',
        './assets/png/favicon128.png?v={{ build_number }}',
        './assets/png/favicon256.png?v={{ build_number }}'
      ])
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map(key => {
        if (key !== '{{ build_number }}') {
          return caches.delete(key)
        }
      }))
    })
  )
})

self.addEventListener('fetch', (event) => {
  if (new URL(event.request.url).pathname === '/') {
    fetch(`./version.json?t=${new Date().toJSON()}`)
      .then(data => data.json())
      .then(({ buildNumber }) => {
        if (buildNumber !== '{{ build_number }}') {
          return self.registration.update()
        }
      }).catch(error => console.error(error, error.stack))
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open('{{ build_number }}').then((cache) => {
          cache.put(event.request, response.clone())

          return response
        })
      })
    })
  )
})
