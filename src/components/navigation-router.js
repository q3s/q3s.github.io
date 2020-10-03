import { oom } from '@notml/core'
import './navigation-router.scss'

class Q3SNavigationRouter extends HTMLElement {

  static tagName = 'q3s-navigation-router'

  all = new Set()
  exclude = {}
  include = {}

  connectedCallback() {
    this.querySelectorAll('q3s-navigation-container').forEach(item => {
      if (item.include) {
        item.include.forEach(pageName => {
          if (!this.include[pageName]) {
            this.include[pageName] = new Set()
          }
          this.include[pageName].add(item)
        })
      } else {
        this.all.add(item)
        if (item.exclude) {
          item.exclude.forEach(pageName => {
            if (!this.exclude[pageName]) {
              this.exclude[pageName] = new Set()
            }
            this.exclude[pageName].add(item)
          })
        }
      }
    })
    console.log(this)
  }

}

oom.define(Q3SNavigationRouter)


export {
  Q3SNavigationRouter
}
