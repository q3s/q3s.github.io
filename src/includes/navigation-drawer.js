import { MDCDrawer } from '@material/drawer'
import './navigation-drawer.scss'

const { location } = window
const q3sDrawer = MDCDrawer.attachTo(document.querySelector('.q3s-navigation-drawer'))


function updateItemActivated() {
  const itemActivated = document.querySelector('.mdc-list-item--activated')

  if (itemActivated) {
    itemActivated.classList.remove('mdc-list-item--activated')
  }

  if ((/#\w*/).test(location.hash)) {
    const newItemActivated = document.querySelector(`.mdc-list-item[href="${location.hash}"]`)

    if (newItemActivated) {
      newItemActivated.classList.add('mdc-list-item--activated')
    }
  }
}


window.addEventListener('hashchange', updateItemActivated, false)
updateItemActivated()


export {
  q3sDrawer
}
