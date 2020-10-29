import { MDCTopAppBar } from '@material/top-app-bar'
import { q3sDrawer } from './navigation-drawer.js'

const { location, history } = window
const q3sTopAppBar = MDCTopAppBar.attachTo(document.querySelector('.q3s-top-app-bar'))


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
