import { MDCTopAppBar } from '@material/top-app-bar'
import { MDCDrawer } from '@material/drawer'
import { oom, pako, QRCode, ZXing, Dexie } from '../external.js'

const topAppBarElement = document.querySelector('.mdc-top-app-bar')
const topAppBar = new MDCTopAppBar(topAppBarElement)
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'))

topAppBar.setScrollTarget(document.getElementById('main-content'))
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
