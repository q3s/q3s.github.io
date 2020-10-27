---
---
{% capture build_number %}{{ site.github.build_revision }}{{ site.time | date: '%Y%m%d%H%M%S' }}{% endcapture %}
import { oom, pako, QRCode, ZXing, Dexie } from './external.js?v={{ build_number }}';
import { MDCDrawer, MDCTopAppBar, MDCRipple, MDCSelect } from './mdc.js?v={{ build_number }}';

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

const { location: location$1 } = window;
oom.define(class Q3SNavigationRouter extends HTMLElement {
  static tagName = 'q3s-navigation-router'
  all = new Set()
  include = {}
  exclude = {}
  constructor() {
    super();
    this._navigate = () => {
      this.navigate(location$1.hash);
    };
  }
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
    this.navigate(location$1.hash);
    window.addEventListener('hashchange', this._navigate, false);
  }
  disconnectedCallback() {
    window.removeEventListener('hashchange', this._navigate, false);
  }
  navigate(page) {
    const activated = new Set();
    const lastActivated = this.querySelectorAll('q3s-navigation-container[activated]');
    page = page || '#';
    if (this.include[page]) {
      this.include[page].forEach(item => {
        item.setAttribute('activated', true);
        activated.add(item);
      });
    }
    const exclude = this.exclude[page];
    this.all.forEach(item => {
      if (exclude && exclude.has(item)) {
        item.removeAttribute('activated');
      } else {
        item.setAttribute('activated', true);
        activated.add(item);
      }
    });
    lastActivated.forEach(item => {
      if (!activated.has(item)) {
        item.removeAttribute('activated');
      }
    });
  }
});

const { location: location$2 } = window;
const q3sDrawer = MDCDrawer.attachTo(document.querySelector('.q3s-navigation-drawer'));
const q3sMainContent = document.querySelector('.q3s-main-content');
function updateItemActivated() {
  const itemActivated = document.querySelector('.mdc-list-item--activated');
  if (itemActivated) {
    itemActivated.classList.remove('mdc-list-item--activated');
  }
  if ((/#\w*/).test(location$2.hash)) {
    const newItemActivated = document.querySelector(`.mdc-list-item[href="${location$2.hash}"]`);
    if (newItemActivated) {
      newItemActivated.classList.add('mdc-list-item--activated');
    }
  }
}
window.addEventListener('hashchange', updateItemActivated, false);
updateItemActivated();
window.addEventListener('MDCDrawer:closed', () => {
  const firstInpt = q3sMainContent.querySelector('input, button');
  if (firstInpt) {
    firstInpt.focus();
  }
});

const q3sTopAppBar = MDCTopAppBar.attachTo(document.querySelector('.q3s-top-app-bar'));
q3sTopAppBar.setScrollTarget(document.querySelector('.q3s-main-content'));
q3sTopAppBar.listen('MDCTopAppBar:nav', () => {
  q3sDrawer.open = !q3sDrawer.open;
});
window.addEventListener('hashchange', () => { q3sDrawer.open = false; }, false);

MDCRipple.attachTo(document.querySelector('.q3s-code-scanner__button'));

class SimpleTextModel {
}
class MarkdownModel extends SimpleTextModel {
}
class URLModel {
}
class JSONModel {
}
class RemoteJSONModel extends URLModel {
}
const DataTypes = new Map([
  ['st', {
    name: 'SimpleText',
    title: 'Простой текст',
    model: SimpleTextModel
  }],
  ['md', {
    name: 'Markdown',
    title: 'Форматированный текст (Markdown)',
    model: MarkdownModel
  }],
  ['url', {
    name: 'URL',
    title: 'Ссылка',
    model: URLModel
  }],
  ['json', {
    name: 'JSON',
    title: 'Простой объект данных (JSON)',
    model: JSONModel
  }],
  ['rjson', {
    name: 'RemoteJSON',
    title: 'Данные с внешнего источника (JSON)',
    model: RemoteJSONModel
  }]
]);

oom.define(class Q3SEditorController extends HTMLElement {
  static tagName = 'q3s-editor-controller'
  static typeSelectItems = [...DataTypes.entries()].reduce((container, [key, type]) => container
    .li({
      'class': 'mdc-list-item',
      'data-value': key
    }, oom
      .span({ class: 'mdc-list-item__ripple' })
      .span(type.title, { class: 'mdc-list-item__text' })), oom())
  template = () => oom.div({ class: 'mdc-select mdc-select--filled' }, oom
    .div({ class: 'mdc-select__anchor' }, oom
      .span({ class: 'mdc-select__ripple' })
      .span({ class: 'mdc-select__selected-text' })
      .span({ class: 'mdc-select__dropdown-icon' }, elm => {
        elm.innerHTML = oom('svg', { class: 'mdc-select__dropdown-icon-graphic', viewbox: '7 10 10 5' }, oom
          .polygon({
            'class': 'mdc-select__dropdown-icon-inactive',
            'stroke': 'none',
            'fill-rule': 'evenodd',
            'points': '7 10 12 15 17 10'
          })
          .polygon({
            'class': 'mdc-select__dropdown-icon-active',
            'stroke': 'none',
            'fill-rule': 'evenodd',
            'points': '7 15 12 10 17 15'
          })).dom.outerHTML;
      })
      .span('Тип данных', { class: 'mdc-floating-label' })
      .span({ class: 'mdc-line-ripple' }))
    .div({ class: 'mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth' }, oom
      .ul({ class: 'mdc-list' }, oom
        .append(Q3SEditorController.typeSelectItems.clone())
      )), select => { this._typeSelect = select; })
  connectedCallback() {
    const select = new MDCSelect(this._typeSelect);
    console.log(this._typeSelect);
  }
});

const { location: location$3 } = window;
const templates = {
  '#add': () => oom('q3s-editor-controller')
};
oom.define(class MainContentController extends HTMLElement {
  static tagName = 'q3s-main-content-controller'
  template = oom.div('test')
  constructor() {
    super();
    this.page = null;
    this._navigate = () => {
      this.navigate(location$3.hash);
    };
  }
  connectedCallback() {
    this.navigate(location$3.hash);
    window.addEventListener('hashchange', this._navigate, false);
  }
  disconnectedCallback() {
    window.removeEventListener('hashchange', this._navigate, false);
  }
  navigate(page) {
    page = page || '#';
    if (this.page !== page) {
      let template;
      if (page in templates) {
        template = templates[page]();
      } else {
        template = oom.span(`"${page}" - Страница пока пуста`);
      }
      this.innerHTML = '';
      this.append(template.dom);
    }
    this.page = page;
  }
});

console.log('oom:', oom);
console.log('pako:', pako);
console.log('QRCode:', QRCode);
console.log('ZXing:', ZXing);
console.log('Dexie:', Dexie);
