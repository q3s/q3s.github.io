import '@notml/core/check-compatible'

(() => {
  /* eslint-disable no-var, prefer-destructuring */
  var location = window.location
  var compatible = window.$notml.compatible()

  if (!compatible.success && location.pathname !== '/not-supported/') {
    location.href = '/not-supported/'
  } else if (compatible.success && location.pathname === '/not-supported/') {
    location.href = '/'
  } else if (!compatible.success && location.pathname === '/not-supported/') {
    document.querySelector('#errorMessages').innerHTML = compatible.messages
    document.querySelector('#moreMessages').onclick = () => {
      document.querySelector('#moreMessages').style.display = 'none'
      document.querySelector('#errorMessages').style.display = 'inline'
    }
  }

  // Перенаправление с http на https
  if (location.protocol !== 'https:' &&
    location.hostname !== 'localhost' &&
    Number.isNaN(Number(location.hostname.split('.').join('')))) {
    location.protocol = 'https:'
  }
})()
