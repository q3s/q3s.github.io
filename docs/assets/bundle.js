---
---
{% capture build_number %}{{ site.github.build_revision }}{{ site.time | date: '%Y%m%d%H%M%S' }}{% endcapture %}
import { oom, pako, QRCode, ZXing, Dexie } from './external.js?v={{ build_number }}';
import { MDCDrawer, MDCTopAppBar, MDCRipple } from './mdc.js?v={{ build_number }}';

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

const q3sDrawer = MDCDrawer.attachTo(document.querySelector('.q3s-navigation-drawer'));

class Q3SNavigationRouter extends HTMLElement {
  static tagName = 'q3s-navigation-router'
  all = new Set()
  include = {}
  exclude = {}
  connectedCallback() {
    this.querySelectorAll('q3s-navigation-container').forEach(item => {
      let include = item.getAttribute('include');
      let exclude = item.getAttribute('exclude');
      include = include ? include.split(',') : false;
      exclude = exclude ? exclude.split(',') : false;
      if (include) {
        include.forEach(pageName => {
          if (!this.include[pageName]) {
            this.include[pageName] = new Set();
          }
          this.include[pageName].add(item);
        });
      } else {
        this.all.add(item);
        if (exclude) {
          exclude.forEach(pageName => {
            if (!this.exclude[pageName]) {
              this.exclude[pageName] = new Set();
            }
            this.exclude[pageName].add(item);
          });
        }
      }
    });
  }
}
oom.define(Q3SNavigationRouter);

class Q3SNavigationContainer extends HTMLElement {
  static tagName = 'q3s-navigation-container'
  set activated(value) {
    if (value) {
      this.classList.add('q3s-navigation-container--activated');
    } else {
      this.classList.remove('q3s-navigation-container--activated');
    }
  }
  get activated() {
    return this.classList.contains('q3s-navigation-container--activated')
  }
}
oom.define(Q3SNavigationContainer);

const q3sTopAppBar = MDCTopAppBar.attachTo(document.querySelector('.q3s-top-app-bar'));
q3sTopAppBar.setScrollTarget(document.querySelector('.q3s-main-content'));
q3sTopAppBar.listen('MDCTopAppBar:nav', () => {
  q3sDrawer.open = !q3sDrawer.open;
});

MDCRipple.attachTo(document.querySelector('.q3s-code-scanner__button'));

console.log('oom:', oom);
console.log('pako:', pako);
console.log('QRCode:', QRCode);
console.log('ZXing:', ZXing);
console.log('Dexie:', Dexie);
