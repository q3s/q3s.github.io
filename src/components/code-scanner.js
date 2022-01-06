import { oom } from '@notml/core'
import { ZXing } from '@zxing/library'
import { MDCRipple } from '@material/ripple'
import './code-scanner.scss'

const { screen, document, navigator } = window

oom.define('q3s-code-scanner', class Q3SCodeScanner extends HTMLElement {

  _codeReader = new ZXing.BrowserQRCodeReader()
  _canvas = document.createElement('canvas')
  _context = this._canvas.getContext('2d')

  _videoConstraints = {
    video: {
      facingMode: 'environment',
      width: { min: 0 },
      height: { min: 0 },
      advanced: [
        // Базовые размеры
        // { height: { min: 3120 } },
        // { height: { min: 2880 } },
        // { height: { min: 2640 } },
        // { height: { min: 2400 } },
        // { height: { min: 2160 } },
        // { height: { min: 1920 } },
        // { height: { min: 1680 } },
        // { height: { min: 1440 } },
        // { height: { min: 1200 } },
        // { height: { min: 960 } },
        // { height: { min: 720 } },
        // { height: { min: 480 } }
      ]
    }
  }

  // x, y, w, h
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
    this._prepareConstraints()
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

  _prepareConstraints() {
    const { advanced } = this._videoConstraints.video
    const { height } = screen

    // advanced.push({ height: { min: height * 2 } })
    advanced.push({ height: { min: height * 1.5 } })
    advanced.push({ height: { min: height } })
    advanced.push({ height: { min: height / 1.5 } })
    advanced.push({ height: { min: height / 2 } })
    advanced.push({ height: { min: 0 } })
  }

  resizeEven() {
    if (!this._resizeTimeout) {
      this._resizeTimeout = setTimeout(() => {
        this._resizeTimeout = null
        this.alignmentVideo()
      }, this._decodeInterval)
    }
  }

  startVideo() {
    this._getVideoDevice()
      .then(() => this._startVideo())
      .catch(error => this.videoCameraError(error))
  }

  async _getVideoDevice() {
    const stream = await navigator.mediaDevices.getUserMedia(this._videoConstraints)
    const [videoTrack] = stream.getVideoTracks()

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
        self.decodeFromCanvasFrame()
      })(this))
    } else {
      this.stopVideo()
    }
  }

  alignmentVideo() {
    if (this._videoTrack) {
      const { clientWidth: cwvc, clientHeight: chvc } = this._videoContainerElm
      const { width: rw, height: rh } = this._videoTrack.getSettings()
      // Соотношение сторон видеопотока и экрана
      const diffW = rw / cwvc
      const diffH = rh / chvc

      // Растянуть видео по наименьшей стороне, запомнить изменение масштаба
      if (diffW < diffH) {
        this._videoElm.style.width = '100%'
        this._videoElm.style.height = ''
        this._currentScale = diffW
      } else {
        this._videoElm.style.width = ''
        this._videoElm.style.height = '100%'
        this._currentScale = diffH
      }

      const { clientWidth: cwv, clientHeight: chv } = this._videoElm
      let diffWidth = (cwv - cwvc) / 2 ^ 0
      let diffHeight = (chv - chvc) / 2 ^ 0

      // Центрировать видео на экране, запомнить смешение
      if (diffWidth > 0) {
        this._videoElm.style.marginLeft = `-${diffWidth}px`
      } else {
        diffWidth = 0
        this._videoElm.style.marginLeft = ''
      }
      if (diffHeight > 0) {
        this._videoElm.style.marginTop = `-${diffHeight}px`
      } else {
        diffHeight = 0
        this._videoElm.style.marginTop = ''
      }

      const captureWidth = this._captureAreaElm.clientWidth * this._currentScale ^ 0
      const captureHeight = this._captureAreaElm.clientHeight * this._currentScale ^ 0

      // Сохраняем соотношения захватываемой и видимой на экране области
      this._sourceCapture = [
        (this._constraintBGElm.clientWidth + diffWidth) * this._currentScale ^ 0,
        (this._constraintBGElm.clientHeight + diffHeight) * this._currentScale ^ 0,
        captureWidth,
        captureHeight
      ]
      this._destinationCapture = [0, 0, captureWidth, captureHeight]

      // Проставляем размер холста в соответствии с видимой областью
      this._canvas.width = captureWidth
      this._canvas.height = captureHeight

      this.testResultElm.innerHTML = `CONTAINER=${cwvc}X${chvc}\n` +
        `SCREEN=${window.screen.width}X${window.screen.height}\n` +
        `CAM=${rw}X${rh}\nVIDOE=${cwv}X${chv}\n` +
        `S=${JSON.stringify(this._sourceCapture)}\n` +
        `D=${JSON.stringify(this._destinationCapture)}`
    }
  }

  decodeFromCanvasFrame() {
    if (this._decodeTimeout) {
      clearTimeout(this._decodeTimeout)
    }

    this._decodeTimeout = setTimeout(() => {
      window.requestAnimationFrame(() => {
        this._decodeFromCanvasFrame()
      })
    }, this._decodeInterval)
  }

  _decodeFromCanvasFrame() {
    if (this._videoTrack) {
      this._context.drawImage(this._videoElm,
        ...this._sourceCapture,
        ...this._destinationCapture
      )
      // this._captureAreaElm.style.backgroundImage =
      //   `url('${this._canvas.toDataURL('image/png')}')`
      try {
        const luminanceSource = new ZXing.HTMLCanvasElementLuminanceSource(this._canvas)
        const hybridBinarizer = new ZXing.HybridBinarizer(luminanceSource)
        const result = this._codeReader.decodeBitmap(hybridBinarizer)

        this.testResultElm.innerHTML = result
        this.decodeFromCanvasFrame()
      } catch (error) {
        const ifNotFound = error instanceof ZXing.NotFoundException
        const isChecksumOrFormatError = error instanceof ZXing.ChecksumException ||
          error instanceof ZXing.FormatException

        if (ifNotFound || isChecksumOrFormatError) {
          this.decodeFromCanvasFrame()
        } else {
          this.videoCameraError(error)
        }
      }
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
