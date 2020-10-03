import { oom } from '@notml/core'
import './navigation-container.scss'

class Q3SNavigationContainer extends HTMLElement {

  static tagName = 'q3s-navigation-container'

  exclude = null
  include = null

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

  constructor() {
    super()

    const exclude = this.getAttribute('exclude')
    const include = this.getAttribute('include')

    this.exclude = exclude ? exclude.split(',') : []
    this.include = include ? include.split(',') : []
  }

  excludeChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.exclude = newValue ? newValue.split(',') : []
    }
  }

  includeChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.include = newValue ? newValue.split(',') : []
    }
  }

}

oom.define(Q3SNavigationContainer)


export {
  Q3SNavigationContainer
}
