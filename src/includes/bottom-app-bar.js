import { MDCRipple } from '@material/ripple'
import './bottom-app-bar.scss'

const buttons = [...document.querySelectorAll('.q3s-code-scanner__button')]

buttons.map(item => MDCRipple.attachTo(item))

window.addEventListener('q3s-code-scanner:startVideo', () => {
  buttons.map(item => item.classList.add('q3s-secondary-bg-opacity'))
}, false)

window.addEventListener('q3s-code-scanner:stopVideo', () => {
  buttons.map(item => item.classList.remove('q3s-secondary-bg-opacity'))
}, false)
