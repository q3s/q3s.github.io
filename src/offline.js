self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('{{ build_number }}').then((cache) => {
      return cache.addAll([
        './',
        './assets/bundle.css?v={{ build_number }}',
        './assets/bundle.js?v={{ build_number }}',
        './assets/check-and-redirect.js?v={{ build_number }}',
        './assets/external.js?v={{ build_number }}',
        './offline.js?v={{ build_number }}',
        './assets/png/favicon64.png'
      ])
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== '{{ build_number }}') {
          return caches.delete(key)
        }
      }))
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (new URL(event.request.url).pathname) === '/'
      ? fetch(event.request).catch(() => {
        return caches.match(event.request)
      })
      : caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open('{{ build_number }}').then((cache) => {
            cache.put(event.request, response.clone())

            return response
          })
        })
      })
  )
})
