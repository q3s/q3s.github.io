const { navigator } = window


if ('serviceWorker' in navigator) {
  (async () => {
    const { serviceWorker } = navigator

    await serviceWorker.register('/offline.js', { scope: '/' })

    console.log('serviceWorker succeeded: v={{ build_number }}')
  })().catch(console.error)
}
