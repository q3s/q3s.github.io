const { navigator, location } = window


if ('serviceWorker' in navigator) {
  (async () => {
    const { serviceWorker } = navigator

    await serviceWorker.register('/offline.js', { scope: '/' })

    serviceWorker.addEventListener('message', event => {
      if (event.data === 'force-refresh') {
        location.reload()
      }
    })

    console.log('serviceWorker succeeded: v={{ build_number }}')
  })().catch(console.error)
}
