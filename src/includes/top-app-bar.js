import { MDCTopAppBar } from '@material/top-app-bar'
import { q3sDrawer } from './navigation-drawer.js'
import '../components/navigation-router.js'

const q3sTopAppBar = MDCTopAppBar.attachTo(document.querySelector('.q3s-top-app-bar'))


q3sTopAppBar.setScrollTarget(document.querySelector('.q3s-main-content'))
q3sTopAppBar.listen('MDCTopAppBar:nav', () => {
  q3sDrawer.open = !q3sDrawer.open
})
