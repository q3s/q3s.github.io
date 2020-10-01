import { MDCTopAppBar } from '@material/top-app-bar'
import { MDCDrawer } from '@material/drawer'
import { MDCRipple } from '@material/ripple'
import { oom, pako, QRCode, ZXing, Dexie } from '../external.js'

const topAppBar = new MDCTopAppBar(document.querySelector('.drawer-top-app-bar'))
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'))
const fabRipple = new MDCRipple(document.querySelector('.mdc-fab'))

topAppBar.setScrollTarget(document.querySelector('.main-content'))
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open
})

console.log('oom:', oom)
console.log('pako:', pako)
console.log('QRCode:', QRCode)
console.log('ZXing:', ZXing)
console.log('Dexie:', Dexie)

console.log(topAppBar)
console.log(drawer)
console.log(fabRipple)
