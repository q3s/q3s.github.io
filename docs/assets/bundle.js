---
---
{% capture build_number %}{{ site.github.build_revision }}{{ site.time | date: '%Y%m%d%H%M%S' }}{% endcapture %}
import { MDCTopAppBar, MDCDrawer, MDCRipple } from './mdc.js?v={{ build_number }}';
import { oom, pako, QRCode, ZXing, Dexie } from './external.js?v={{ build_number }}';

const { navigator, location } = window;
if ('serviceWorker' in navigator) {
  (async () => {
    const { serviceWorker } = navigator;
    await serviceWorker.register('/offline.js', { scope: '/' });
    serviceWorker.addEventListener('message', event => {
      if (event.data === 'force-refresh') {
        location.reload();
      }
    });
    console.log('serviceWorker succeeded: v={{ build_number }}');
  })().catch(console.error);
}

const topAppBar = new MDCTopAppBar(document.querySelector('.drawer-top-app-bar'));
const topAppBarBottom = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar__top-to-down'));
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const fabRipple = new MDCRipple(document.querySelector('.mdc-fab'));
topAppBar.setScrollTarget(document.querySelector('.main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});
console.log('oom:', oom);
console.log('pako:', pako);
console.log('QRCode:', QRCode);
console.log('ZXing:', ZXing);
console.log('Dexie:', Dexie);
console.log(topAppBar);
console.log(topAppBarBottom);
console.log(drawer);
console.log(fabRipple);
