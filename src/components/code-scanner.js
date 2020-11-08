import { oom } from '@notml/core'
import { ZXing } from '@zxing/library'
import { MDCRipple } from '@material/ripple'
import './code-scanner.scss'

const { navigator } = window

oom.define('q3s-code-scanner', class Q3SCodeScanner extends HTMLElement {

  _videoConstraints = { video: { facingMode: 'environment' } }

  _codeReader = new ZXing.BrowserMultiFormatReader()

  _resizeTimeout = null
  _decodeTimeout = 1000
  _decodeInterval = null
  _offsetTop = 0
  _offsetLeft = 0
  _constraintTop = 0
  _constraintLeft = 0
  _constraintHeight = 0
  _constraintWidth = 0

  template = () => oom
    .div({ class: 'q3s-code-scanner__video-container' },
      oom
        .video({ class: 'q3s-code-scanner__video' },
          elm => { this._videoElm = elm }
        ),
      elm => { this._videoContainerElm = elm }
    )
    .div({ class: 'q3s-code-scanner__capture-area-container' }, oom
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' },
        elm => { this._constraintBGElm = elm })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area' },
        elm => { this._captureAreaElm = elm })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' }))

  constructor() {
    super()
    this._onResize = () => this.resizeEven()
  }

  connectedCallback() {
    this.startVideo()
    window.addEventListener('resize', this._onResize, false)
    // try {
    //   this._codeReader.decodeFromConstraints(this._videoConstraints, this._videoElm,
    //     (result, error) => {
    //       if (result) {
    //         alert(result)
    //         this._codeReader.reset()
    //       } if (error) {
    //         if (!(error instanceof ZXing.NotFoundException)) {
    //           this.decodeVideoError(error)
    //         }
    //       }
    //     }
    //   ).catch(error => this.decodeVideoError(error))
    // } catch (error) {
    //   this.decodeVideoError(error)
    // }
  }

  disconnectedCallback() {
    this.stopVideo()
    window.removeEventListener('resize', this._onResize)
    this._codeReader.reset()
    if (this._moreErrBtn) {
      delete this._moreErrBtn.onclick
    }
  }

  resizeEven() {
    if (!this._resizeTimeout) {
      this._resizeTimeout = setTimeout(() => {
        this._resizeTimeout = null
        this.alignmentVideo()
      }, 100)
    }
  }

  startVideo() {
    try {
      navigator.mediaDevices.getUserMedia(this._videoConstraints)
        .then(stream => {
          [this._videoTrack] = stream.getTracks()
          if (this.isConnected) {
            this._videoElm.srcObject = stream
            this._videoElm.play()
            this._videoElm.addEventListener('canplay', (self => function _handler(e) {
              e.currentTarget.removeEventListener('canplay', _handler)
              self.alignmentVideo()
              window.dispatchEvent(new Event('q3s-code-scanner:startVideo'))
              if (self._decodeInterval) {
                clearInterval(self._decodeInterval)
              }
              self._decodeInterval = setInterval(() => self.decodeFromVideo(), self._decodeTimeout)
            })(this))
          } else {
            this.stopVideo()
          }
        })
        .catch(error => this.videoCameraError(error))
    } catch (error) {
      this.videoCameraError(error)
    }
  }

  alignmentVideo() {
    const { clientHeight: chvc, clientWidth: cwvc } = this._videoContainerElm
    const { clientHeight: chv, clientWidth: cwv } = this._videoElm
    const diffHeight = (chv - chvc) / 2 ^ 0
    const diffWidth = (cwv - cwvc) / 2 ^ 0

    if (diffHeight > 0) {
      this._offsetTop = diffHeight
      this._videoElm.style.marginTop = `-${diffHeight}px`
    } else {
      this._offsetTop = 0
      this._videoElm.style.marginTop = ''
    }
    if (diffWidth > 0) {
      this._offsetLeft = diffWidth
      this._videoElm.style.marginLeft = `-${diffWidth}px`
    } else {
      this._offsetLeft = 0
      this._videoElm.style.marginLeft = ''
    }

    this._constraintTop = this._constraintBGElm.clientHeight
    this._constraintLeft = this._constraintBGElm.clientWidth
    this._constraintHeight = this._captureAreaElm.clientHeight
    this._constraintWidth = this._captureAreaElm.clientWidth
  }

  decodeFromVideo() {
    if (this._videoTrack && this._videoElm) {
      debugger
    }
  }

  stopVideo() {
    if (this._decodeInterval) {
      clearInterval(this._decodeInterval)
    }
    if (this._videoTrack) {
      this._videoTrack.stop()
      this._videoTrack = null
      this._videoElm.srcObject = null
    }
    this._codeReader.reset()
    window.dispatchEvent(new Event('q3s-code-scanner:stopVideo'))
  }

  videoCameraError(error) {
    const message = error + '\n' + (error.stack || '')
    const content = oom('div', { class: 'mdc-card' })
      .div({ class: 'q3s-code-scanner__card-content' }, oom
        .p('Не удалось получить доступ к камере.')
        .p('Вы можете загрузить изображение из галереи.')
        .p('Либо воспользоваться стандартным сканером кодов на вашем устройстве.')
        .p({ class: 'q3s-code-scanner__hide' }, oom
          .span({ class: 'q3s-code-scanner__error' }, message), elm => { this._errorElm = elm }))
      .div({ class: 'mdc-card__actions' }, oom
        .button({ class: 'mdc-button mdc-card__action mdc-card__action--button' }, oom
          .div({ class: 'mdc-button__ripple' })
          .span({ class: 'mdc-button__label' }, 'Подробнее...')), elm => { this._moreErrBtn = elm })

    this.stopVideo()

    this.innerHTML = ''
    this.append(content.dom)

    MDCRipple.attachTo(this._moreErrBtn)
    this._moreErrBtn.onclick = () => {
      this._errorElm.classList.toggle('q3s-code-scanner__hide')
    }

    this._codeReader.reset()
  }

})
