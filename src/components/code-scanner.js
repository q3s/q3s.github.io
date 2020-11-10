import { oom } from '@notml/core'
import { ZXing } from '@zxing/library'
import { MDCRipple } from '@material/ripple'
import './code-scanner.scss'

const { document, navigator } = window

oom.define('q3s-code-scanner', class Q3SCodeScanner extends HTMLElement {

  _codeReader = new ZXing.BrowserMultiFormatReader()
  _canvas = document.createElement('canvas')
  _context = this._canvas.getContext('2d')
  _img = document.createElement('img')

  _clientWidth = 0
  _clientHeight = 0
  _videoMinSize = 0
  _videoConstraints = {
    video: {
      facingMode: 'environment',
      width: { min: this._videoMinSize },
      height: { min: this._videoMinSize },
      advanced: [
        { width: { min: 4096 }, height: { min: 2160 } },
        { width: { min: 3840 }, height: { min: 2160 } },
        { width: { min: 3200 }, height: { min: 2400 } },
        { width: { min: 1920 }, height: { min: 1080 } },
        { width: { min: 1280 }, height: { min: 720 } },
        { width: { min: 1024 }, height: { min: 768 } },
        { width: { min: 720 }, height: { min: 480 } },
        { width: { min: 640 }, height: { min: 480 } }
      ]
    }
  }

  _resizeTimeout = null
  _decodeTimeout = null
  _decodeInterval = 300
  _diffHeight = 0
  _diffWidth = 0
  _constraintTop = 0
  _constraintLeft = 0
  _offsetTop = 0
  _offsetLeft = 0
  _constraintHeight = 0
  _constraintWidth = 0

  template = () => oom
    .div({ class: 'q3s-code-scanner__video-container' },
      oom
        .video({ class: 'q3s-code-scanner__video', autoplay: 'true', muted: 'true', playsinline: 'true' },
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
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg testResultElm' },
        elm => { this.testResultElm = elm })
      .div({ class: 'q3s-code-scanner__capture-area-constraint-bg' }))

  constructor() {
    super()
    this._onResize = () => this.resizeEven()
  }

  connectedCallback() {
    this._resize()
    this.startVideo()
    window.addEventListener('resize', this._onResize, false)
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
        // this._resize()
        this.alignmentVideo()
      }, 100)
    }
  }

  _resize() {
    if (this._videoContainerElm) {
      this._clientWidth = this._videoContainerElm.clientWidth
      this._clientHeight = this._videoContainerElm.clientHeight
      this._videoMinSize = Math.max(this._clientWidth, this._clientHeight)
      if (this._videoConstraints.video.width.min !== this._videoMinSize) {
        this._videoConstraints.video.width.min = 1920
        this._videoConstraints.video.height.min = 1080
        //   this._videoMinSize
        if (this._videoTrack) {
          this._videoTrack.applyConstraints(this._videoConstraints.video)
            .then(() => this.alignmentVideo())
            .catch(error => this.videoCameraError(error))
        }
      } else {
        this.alignmentVideo()
      }
    }
  }

  startVideo() {
    this._getVideoDevice()
      .then(() => this._startVideo())
      .catch(error => this.videoCameraError(error))
  }

  async _getVideoDevice() {
    const stream = await navigator.mediaDevices.getUserMedia(this._videoConstraints)
    const [videoTrack] = stream.getTracks()

    this._stream = stream
    this._videoTrack = videoTrack
  }

  _startVideo() {
    if (this.isConnected) {
      this._videoElm.srcObject = this._stream
      this._videoElm.play()
      this._videoElm.addEventListener('canplay', (self => function _handler(e) {
        e.currentTarget.removeEventListener('canplay', _handler)
        self.alignmentVideo()
        window.dispatchEvent(new Event('q3s-code-scanner:startVideo'))
        self.decodeFromVideo()
      })(this))
    } else {
      this.stopVideo()
    }
  }

  alignmentVideo() {
    if (this._videoTrack) {
      const { clientHeight: chvc, clientWidth: cwvc } = this._videoContainerElm
      const { clientHeight: chv, clientWidth: cwv } = this._videoElm
      const { height: rh, width: rw } = this._videoTrack.getSettings()
      const diffHeight = (chv - chvc) / 2 ^ 0
      const diffWidth = (cwv - cwvc) / 2 ^ 0
      const ratioHeight = rh / chv
      const ratioWidth = rw / cwv

      if (diffHeight > 0) {
        this._diffHeight = diffHeight
        this._videoElm.style.marginTop = `-${diffHeight}px`
      } else {
        this._diffHeight = 0
        this._videoElm.style.marginTop = ''
      }
      if (diffWidth > 0) {
        this._diffWidth = diffWidth
        this._videoElm.style.marginLeft = `-${diffWidth}px`
      } else {
        this._diffWidth = 0
        this._videoElm.style.marginLeft = ''
      }

      this._constraintTop = this._constraintBGElm.clientHeight
      this._constraintLeft = this._constraintBGElm.clientWidth

      this._constraintHeight = this._captureAreaElm.clientHeight * ratioHeight ^ 0
      this._constraintWidth = this._captureAreaElm.clientWidth * ratioWidth ^ 0
      this._offsetTop = (this._diffHeight + this._constraintTop) * ratioHeight ^ 0
      this._offsetLeft = (this._diffWidth + this._constraintLeft) * ratioWidth ^ 0

      this._canvas.height = this._constraintHeight
      this._canvas.width = this._constraintWidth

      this.testResultElm.innerHTML = `SCREEN=${this._clientWidth}X${this._clientHeight}\n` +
        `CAM=${rw}X${rh}\nVIDOE=${cwv}X${chv}\n` +
        `OFFSET=${this._offsetTop}X${this._offsetLeft}`
    }
  }

  decodeFromVideo() {
    if (this._decodeTimeout) {
      clearTimeout(this._decodeTimeout)
    }
    this._decodeTimeout = setTimeout(() => this._decodeFromVideo(), this._decodeInterval)
  }

  _decodeFromVideo() {
    if (this._videoTrack && this._videoElm) {
      this._context.drawImage(this._videoElm,
        this._offsetLeft,
        this._offsetTop,
        this._constraintWidth,
        this._constraintHeight,
        0, 0,
        this._constraintWidth,
        this._constraintHeight
      )
      this._img.src = this._canvas.toDataURL('image/png')
      this._codeReader.decodeFromImage(this._img)
        .then(result => {
          this.testResultElm.innerHTML = result
          this.decodeFromVideo()
        })
        .catch(error => {
          if (error instanceof ZXing.NotFoundException) {
            this.decodeFromVideo()
          } else {
            this.videoCameraError(error)
          }
        }).then(() => {
          this._codeReader.reset()
        })
    } else {
      this.stopVideo()
    }
  }

  stopVideo() {
    if (this._decodeTimeout) {
      clearTimeout(this._decodeTimeout)
    }
    if (this._videoTrack) {
      this._videoTrack.stop()
      this._videoTrack = null
    }
    if (this._videoElm) {
      this._videoElm.srcObject = null
      this._videoElm.style.marginTop = ''
      this._videoElm.style.marginLeft = ''
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
    window.removeEventListener('resize', this._onResize)

    this._videoContainerElm = null
    this._videoElm = null
    this.innerHTML = ''
    this.append(content.dom)

    MDCRipple.attachTo(this._moreErrBtn)
    this._moreErrBtn.onclick = () => {
      this._errorElm.classList.toggle('q3s-code-scanner__hide')
    }

    this._codeReader.reset()
  }

})
