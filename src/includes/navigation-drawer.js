import { MDCDrawer } from '@material/drawer'
import './navigation-drawer.scss'

const { location } = window
const q3sDrawer = MDCDrawer.attachTo(document.querySelector('.q3s-navigation-drawer'))
const q3sMainContent = document.querySelector('.q3s-main-content')


function updateItemActivated() {
  const itemActivated = document.querySelector('.mdc-list-item--activated')

  if (itemActivated) {
    itemActivated.classList.remove('mdc-list-item--activated')
  }

  if ((/#\w*/).test(location.hash || '#')) {
    const newItemActivated = document.querySelector(`.mdc-list-item[href="${location.hash || '#'}"]`)

    if (newItemActivated) {
      newItemActivated.classList.add('mdc-list-item--activated')
    }
  }
}


window.addEventListener('hashchange', updateItemActivated, false)

window.addEventListener('MDCDrawer:opened', () => {
  updateItemActivated()
})

window.addEventListener('MDCDrawer:closed', () => {
  const firstInpt = q3sMainContent.querySelector('input, button')

  if (firstInpt) {
    firstInpt.focus()
  }
})


export {
  q3sDrawer
}
