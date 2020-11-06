import { oom } from '@notml/core'
import { ZXing } from '@zxing/library'
import './code-scanner.scss'


oom.define('q3s-code-scanner', class Q3SCodeScanner extends HTMLElement {

  _videoConstraints = { video: { facingMode: 'environment' } }

  _codeReader = new ZXing.BrowserMultiFormatReader()

  template = () => oom.div({ class: 'mdc-card q3s-code-scanner__card' }, oom
    .video({ class: 'q3s-code-scanner__video' }, elm => { this._videoElm = elm }))

  connectedCallback() {
    this._codeReader.decodeFromConstraints(this._videoConstraints, this._video,
      (result, error) => {
        if (result) {
          alert(result)
          this._codeReader.reset()
        } if (error) {
          if (!(error instanceof ZXing.NotFoundException)) {
            alert(error + '\n\n' + (error.stack || ''))
            this._codeReader.reset()
          }
        }
      }
    ).catch(error => {
      alert(error + '\n' + (error.stack || ''))
      this._codeReader.reset()
    })
  }

  disconnectedCallback() {
    this._codeReader.reset()
  }

})
