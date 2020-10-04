import { oom } from '@notml/core'
import './navigation-container.scss'


class Q3SNavigationContainer extends HTMLElement {

  static tagName = 'q3s-navigation-container'

  set activated(value) {
    if (value) {
      this.classList.add('q3s-navigation-container--activated')
    } else {
      this.classList.remove('q3s-navigation-container--activated')
    }
  }

  get activated() {
    return this.classList.contains('q3s-navigation-container--activated')
  }

}

oom.define(Q3SNavigationContainer)


export {
  Q3SNavigationContainer
}
