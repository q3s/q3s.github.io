---
---
{% capture build_number %}{{ site.github.build_revision }}{{ site.time | date: '%Y%m%d%H%M%S' }}{% endcapture %}
import { oom, ZXing, pako, QRCode, Dexie } from './external.js?v={{ build_number }}';
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
oom.define('q3s-navigation-router', class Q3SNavigationRouter extends HTMLElement {
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

const { screen, document: document$1 } = window;
const swypeStep = (screen.width > screen.height ? screen.height : screen.width) / 15;
const hypotenuseStep = swypeStep / 3;
let touchStartX = 0;
let touchStartY = 0;
let touchEnd = false;
document$1.body.addEventListener('touchstart', function touchstart(e) {
  touchStartX = e.targetTouches[0].clientX;
  touchStartY = e.targetTouches[0].clientY;
}, false);
document$1.body.addEventListener('touchmove', function touchmove(e) {
  if (!touchEnd) {
    const absX = Math.abs(touchStartX - e.targetTouches[0].clientX);
    const absY = Math.abs(touchStartY - e.targetTouches[0].clientY);
    if (absX > hypotenuseStep && absY > hypotenuseStep) {
      touchStartX = e.targetTouches[0].clientX;
      touchStartY = e.targetTouches[0].clientY;
    } else {
      if (e.targetTouches[0].clientX - touchStartX > swypeStep) {
        window.dispatchEvent(new Event('touch:swype:left_to_right'));
        touchEnd = true;
      } else if (touchStartX - e.targetTouches[0].clientX > swypeStep) {
        window.dispatchEvent(new Event('touch:swype:right_to_left'));
        touchEnd = true;
      } else if (touchStartY - e.targetTouches[0].clientY > swypeStep) {
        window.dispatchEvent(new Event('touch:swype:bottom_to_up'));
        touchEnd = true;
      }
    }
  }
}, false);
document$1.body.addEventListener('touchend', function touchend(e) {
  touchStartX = 0;
  touchStartY = 0;
  touchEnd = false;
}, false);

const { location: location$2 } = window;
const q3sDrawer = MDCDrawer.attachTo(document.querySelector('.q3s-navigation-drawer'));
const q3sMainContent = document.querySelector('.q3s-main-content');
function updateItemActivated() {
  const itemActivated = document.querySelector('.mdc-list-item--activated');
  if (itemActivated) {
    itemActivated.classList.remove('mdc-list-item--activated');
  }
  if ((/#\w*/).test(location$2.hash || '#')) {
    const newItemActivated = document.querySelector(`.mdc-list-item[href="${location$2.hash || '#'}"]`);
    if (newItemActivated) {
      newItemActivated.classList.add('mdc-list-item--activated');
    }
  }
}
window.addEventListener('hashchange', updateItemActivated, false);
window.addEventListener('MDCDrawer:opened', () => {
  updateItemActivated();
});
window.addEventListener('MDCDrawer:closed', () => {
  const firstInpt = q3sMainContent.querySelector('input, button');
  if (firstInpt) {
    firstInpt.focus();
  }
});

const { document: document$2, location: location$3, history } = window;
const q3sTopAppBarElm = document$2.querySelector('.q3s-top-app-bar');
const q3sTopAppBar = MDCTopAppBar.attachTo(q3sTopAppBarElm);
const basicTitle = location$3.hostname === 'q3s.github.io' ? 'QR Share' : 'QR Share (DEV)';
document$2.title = basicTitle;
q3sTopAppBar.setScrollTarget(document$2.querySelector('.q3s-main-content'));
q3sTopAppBar.listen('MDCTopAppBar:nav', () => {
  q3sDrawer.open = !q3sDrawer.open;
});
window.addEventListener('hashchange', () => {
  q3sDrawer.open = false;
}, false);
window.addEventListener('touch:swype:left_to_right', () => {
  q3sDrawer.open = true;
}, false);
window.addEventListener('touch:swype:right_to_left', e => {
  if (q3sDrawer.open) {
    q3sDrawer.open = false;
  } else {
    if ((location$3.hash || '#') !== '#') {
      if (history.length > 1 && location$3.hash === '#scanner') {
        history.back();
      } else {
        window.location = '/#';
      }
    }
  }
}, false);
window.addEventListener('touch:swype:bottom_to_up', () => {
  if (location$3.hash !== '#scanner') {
    window.location = '/#scanner';
  }
}, false);
window.addEventListener('q3s-code-scanner:startVideo', () => {
  q3sTopAppBarElm.classList.add('q3s-primary-bg-opacity');
}, false);
window.addEventListener('q3s-code-scanner:stopVideo', () => {
  q3sTopAppBarElm.classList.remove('q3s-primary-bg-opacity');
}, false);

const buttons = [...document.querySelectorAll('.q3s-code-scanner__button')];
buttons.map(item => MDCRipple.attachTo(item));
window.addEventListener('q3s-code-scanner:startVideo', () => {
  buttons.map(item => item.classList.add('q3s-secondary-bg-opacity'));
}, false);
window.addEventListener('q3s-code-scanner:stopVideo', () => {
  buttons.map(item => item.classList.remove('q3s-secondary-bg-opacity'));
}, false);

const { screen: screen$1, document: document$3, navigator: navigator$1 } = window;
oom.define('q3s-code-scanner', class Q3SCodeScanner extends HTMLElement {
  _codeReader = new ZXing.BrowserQRCodeReader()
  _canvas = document$3.createElement('canvas')
  _context = this._canvas.getContext('2d')
  _videoConstraints = {
    video: {
      facingMode: 'environment',
      width: { min: 0 },
      height: { min: 0 },
      advanced: [
      ]
    }
  }
  _sourceCapture = [0, 0, 0, 0]
  _destinationCapture = [0, 0, 0, 0]
  _currentScale = 1
  _resizeTimeout = null
  _decodeTimeout = null
  _decodeInterval = 100
  template = () => oom
    .div({ class: 'q3s-code-scanner__video-container' },
      oom
        .video({ class: 'q3s-code-scanner__video', autoplay: 'true', muted: 'true', playsinline: 'true' },
          elm => { this._videoElm = elm; }
        ),
      elm => { this._videoContainerElm = elm; }
    )
    .div({ class: 'q3s-code-scanner__capture-area-container' }, oom
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' },
        elm => { this._constraintBGElm = elm; })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area' },
        elm => { this._captureAreaElm = elm; })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg testResultElm' },
        elm => { this.testResultElm = elm; })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' }))
  constructor() {
    super();
    this._onResize = () => this.resizeEven();
  }
  connectedCallback() {
    this._prepareConstraints();
    this.startVideo();
    window.addEventListener('resize', this._onResize, false);
  }
  disconnectedCallback() {
    this.stopVideo();
    window.removeEventListener('resize', this._onResize);
    this._codeReader.reset();
    if (this._moreErrBtn) {
      delete this._moreErrBtn.onclick;
    }
  }
  _prepareConstraints() {
    const { advanced } = this._videoConstraints.video;
    const { height } = screen$1;
    advanced.push({ height: { min: height * 1.5 } });
    advanced.push({ height: { min: height } });
    advanced.push({ height: { min: height / 1.5 } });
    advanced.push({ height: { min: height / 2 } });
    advanced.push({ height: { min: 0 } });
  }
  resizeEven() {
    if (!this._resizeTimeout) {
      this._resizeTimeout = setTimeout(() => {
        this._resizeTimeout = null;
        this.alignmentVideo();
      }, this._decodeInterval);
    }
  }
  startVideo() {
    this._getVideoDevice()
      .then(() => this._startVideo())
      .catch(error => this.videoCameraError(error));
  }
  async _getVideoDevice() {
    const stream = await navigator$1.mediaDevices.getUserMedia(this._videoConstraints);
    const [videoTrack] = stream.getVideoTracks();
    this._stream = stream;
    this._videoTrack = videoTrack;
  }
  _startVideo() {
    if (this.isConnected) {
      this._videoElm.srcObject = this._stream;
      this._videoElm.play();
      this._videoElm.addEventListener('canplay', (self => function _handler(e) {
        e.currentTarget.removeEventListener('canplay', _handler);
        self.alignmentVideo();
        window.dispatchEvent(new Event('q3s-code-scanner:startVideo'));
        self.decodeFromCanvasFrame();
      })(this));
    } else {
      this.stopVideo();
    }
  }
  alignmentVideo() {
    if (this._videoTrack) {
      const { clientWidth: cwvc, clientHeight: chvc } = this._videoContainerElm;
      const { width: rw, height: rh } = this._videoTrack.getSettings();
      const diffW = rw / cwvc;
      const diffH = rh / chvc;
      if (diffW < diffH) {
        this._videoElm.style.width = '100%';
        this._videoElm.style.height = '';
        this._currentScale = diffW;
      } else {
        this._videoElm.style.width = '';
        this._videoElm.style.height = '100%';
        this._currentScale = diffH;
      }
      const { clientWidth: cwv, clientHeight: chv } = this._videoElm;
      let diffWidth = (cwv - cwvc) / 2 ^ 0;
      let diffHeight = (chv - chvc) / 2 ^ 0;
      if (diffWidth > 0) {
        this._videoElm.style.marginLeft = `-${diffWidth}px`;
      } else {
        diffWidth = 0;
        this._videoElm.style.marginLeft = '';
      }
      if (diffHeight > 0) {
        this._videoElm.style.marginTop = `-${diffHeight}px`;
      } else {
        diffHeight = 0;
        this._videoElm.style.marginTop = '';
      }
      const captureWidth = this._captureAreaElm.clientWidth * this._currentScale ^ 0;
      const captureHeight = this._captureAreaElm.clientHeight * this._currentScale ^ 0;
      this._sourceCapture = [
        (this._constraintBGElm.clientWidth + diffWidth) * this._currentScale ^ 0,
        (this._constraintBGElm.clientHeight + diffHeight) * this._currentScale ^ 0,
        captureWidth,
        captureHeight
      ];
      this._destinationCapture = [0, 0, captureWidth, captureHeight];
      this._canvas.width = captureWidth;
      this._canvas.height = captureHeight;
      this.testResultElm.innerHTML = `CONTAINER=${cwvc}X${chvc}\n` +
        `SCREEN=${window.screen.width}X${window.screen.height}\n` +
        `CAM=${rw}X${rh}\nVIDOE=${cwv}X${chv}\n` +
        `S=${JSON.stringify(this._sourceCapture)}\n` +
        `D=${JSON.stringify(this._destinationCapture)}`;
    }
  }
  decodeFromCanvasFrame() {
    if (this._decodeTimeout) {
      clearTimeout(this._decodeTimeout);
    }
    this._decodeTimeout = setTimeout(() => {
      window.requestAnimationFrame(() => {
        this._decodeFromCanvasFrame();
      });
    }, this._decodeInterval);
  }
  _decodeFromCanvasFrame() {
    if (this._videoTrack) {
      this._context.drawImage(this._videoElm,
        ...this._sourceCapture,
        ...this._destinationCapture
      );
      try {
        const luminanceSource = new ZXing.HTMLCanvasElementLuminanceSource(this._canvas);
        const hybridBinarizer = new ZXing.HybridBinarizer(luminanceSource);
        const result = this._codeReader.decodeBitmap(hybridBinarizer);
        this.testResultElm.innerHTML = result;
        this.decodeFromCanvasFrame();
      } catch (error) {
        const ifNotFound = error instanceof ZXing.NotFoundException;
        const isChecksumOrFormatError = error instanceof ZXing.ChecksumException ||
          error instanceof ZXing.FormatException;
        if (ifNotFound || isChecksumOrFormatError) {
          this.decodeFromCanvasFrame();
        } else {
          this.videoCameraError(error);
        }
      }
    } else {
      this.stopVideo();
    }
  }
  stopVideo() {
    if (this._decodeTimeout) {
      clearTimeout(this._decodeTimeout);
    }
    if (this._videoTrack) {
      this._videoTrack.stop();
      this._videoTrack = null;
    }
    if (this._videoElm) {
      this._videoElm.srcObject = null;
      this._videoElm.style.marginTop = '';
      this._videoElm.style.marginLeft = '';
    }
    this._codeReader.reset();
    window.dispatchEvent(new Event('q3s-code-scanner:stopVideo'));
  }
  videoCameraError(error) {
    const message = error + '\n' + (error.stack || '');
    const content = oom('div', { class: 'mdc-card' })
      .div({ class: 'q3s-code-scanner__card-content' }, oom
        .p('Не удалось получить доступ к камере.')
        .p('Вы можете загрузить изображение из галереи.')
        .p('Либо воспользоваться стандартным сканером кодов на вашем устройстве.')
        .p({ class: 'q3s-code-scanner__hide' }, oom
          .span({ class: 'q3s-code-scanner__error' }, message), elm => { this._errorElm = elm; }))
      .div({ class: 'mdc-card__actions' }, oom
        .button({ class: 'mdc-button mdc-card__action mdc-card__action--button' }, oom
          .div({ class: 'mdc-button__ripple' })
          .span({ class: 'mdc-button__label' }, 'Подробнее...')), elm => { this._moreErrBtn = elm; });
    this.stopVideo();
    window.removeEventListener('resize', this._onResize);
    this._videoContainerElm = null;
    this._videoElm = null;
    this.innerHTML = '';
    this.append(content.dom);
    MDCRipple.attachTo(this._moreErrBtn);
    this._moreErrBtn.onclick = () => {
      this._errorElm.classList.toggle('q3s-code-scanner__hide');
    };
    this._codeReader.reset();
  }
});

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

const typeSelectItems = [...DataTypes.entries()].reduce((container, [key, type]) => container
  .li({
    'class': 'mdc-list-item',
    'data-value': key
  }, oom
    .span({ class: 'mdc-list-item__ripple' })
    .span(type.title, { class: 'mdc-list-item__text' })), oom());
oom.define('q3s-editor-controller', class Q3SEditorController extends HTMLElement {
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
        .append(typeSelectItems.clone())
      )), select => { this._typeSelect = select; })
  connectedCallback() {
    const select = new MDCSelect(this._typeSelect);
    console.log(select, this._typeSelect);
  }
});

const { location: location$4 } = window;
const templates = {
  '#scanner': () => oom('q3s-code-scanner'),
  '#add': () => oom('q3s-editor-controller')
};
oom.define('q3s-main-content-controller', class MainContentController extends HTMLElement {
  constructor() {
    super();
    this.page = null;
    this._navigate = () => {
      this.navigate(location$4.hash);
    };
  }
  connectedCallback() {
    this.navigate(location$4.hash);
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
