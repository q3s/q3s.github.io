import { oom } from '@notml/core'
import './main-content-controller.scss'
import '../components/code-scanner.js'
import '../components/editor-controller.js'

const { location } = window
const templates = {
  '#scanner': () => oom('q3s-code-scanner'),
  '#add': () => oom('q3s-editor-controller')
}


oom.define('q3s-main-content-controller', class MainContentController extends HTMLElement {

  constructor() {
    super()
    this.page = null
    this._navigate = () => {
      this.navigate(location.hash)
    }
  }

  connectedCallback() {
    this.navigate(location.hash)
    window.addEventListener('hashchange', this._navigate, false)
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this._navigate, false)
  }

  navigate(page) {
    page = page || '#'
    if (this.page !== page) {
      let template

      if (page in templates) {
        template = templates[page]()
      } else {
        template = oom.span(`"${page}" - Страница пока пуста`)
      }

      this.innerHTML = ''
      this.append(template.dom)
    }
    this.page = page
  }

})
