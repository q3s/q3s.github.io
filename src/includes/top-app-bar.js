import { MDCTopAppBar } from '@material/top-app-bar'
import { q3sDrawer } from './navigation-drawer.js'

const { document, location, history } = window
const q3sTopAppBarElm = document.querySelector('.q3s-top-app-bar')
const q3sTopAppBar = MDCTopAppBar.attachTo(q3sTopAppBarElm)
const basicTitle = location.hostname === 'q3s.github.io' ? 'QR Share' : 'QR Share (DEV)'


document.title = basicTitle

q3sTopAppBar.setScrollTarget(document.querySelector('.q3s-main-content'))
q3sTopAppBar.listen('MDCTopAppBar:nav', () => {
  q3sDrawer.open = !q3sDrawer.open
})

window.addEventListener('hashchange', () => {
  q3sDrawer.open = false
}, false)

window.addEventListener('touch:swype:left_to_right', () => {
  q3sDrawer.open = true
}, false)

window.addEventListener('touch:swype:right_to_left', e => {
  if (q3sDrawer.open) {
    q3sDrawer.open = false
  } else {
    if ((location.hash || '#') !== '#') {
      if (history.length > 1 && location.hash === '#scanner') {
        history.back()
      } else {
        window.location = '/#'
      }
    }
  }
}, false)

window.addEventListener('touch:swype:bottom_to_up', () => {
  if (location.hash !== '#scanner') {
    window.location = '/#scanner'
  }
}, false)

window.addEventListener('q3s-code-scanner:startVideo', () => {
  q3sTopAppBarElm.classList.add('q3s-primary-bg-opacity')
}, false)

window.addEventListener('q3s-code-scanner:stopVideo', () => {
  q3sTopAppBarElm.classList.remove('q3s-primary-bg-opacity')
}, false)
