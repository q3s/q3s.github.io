import { oom } from '@notml/core'
import { ZXing } from '@zxing/library'
import { MDCRipple } from '@material/ripple'
import './code-scanner.scss'


oom.define('q3s-code-scanner', class Q3SCodeScanner extends HTMLElement {

  _videoConstraints = { video: { facingMode: 'environment' } }

  _codeReader = new ZXing.BrowserMultiFormatReader()

  template = () => oom.div({ class: 'mdc-card q3s-code-scanner__card q3s-code-scanner__card--video' }, oom
    .video({ class: 'q3s-code-scanner__video' }, elm => { this._videoElm = elm }), elm => { this._card = elm })

  connectedCallback() {
    try {
      this._codeReader.decodeFromConstraints(this._videoConstraints, this._videoElm,
        (result, error) => {
          if (result) {
            alert(result)
            this._codeReader.reset()
          } if (error) {
            if (!(error instanceof ZXing.NotFoundException)) {
              this.decodeVideoError(error)
            }
          }
        }
      ).catch(error => this.decodeVideoError(error))
    } catch (error) {
      this.decodeVideoError(error)
    }
  }

  disconnectedCallback() {
    this._codeReader.reset()
    if (this._moreErrBtn) {
      delete this._moreErrBtn.onclick
    }
  }

  decodeVideoError(error) {
    const message = error + '\n' + (error.stack || '')
    const content = oom()
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

    this._card.innerHTML = ''
    this._card.classList.remove('q3s-code-scanner__card--video')
    this._card.append(content.dom)

    MDCRipple.attachTo(this._moreErrBtn)
    this._moreErrBtn.onclick = () => {
      this._errorElm.classList.toggle('q3s-code-scanner__hide')
    }

    this._codeReader.reset()
  }

})
