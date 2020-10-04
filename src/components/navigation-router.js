import { oom } from '@notml/core'
import './navigation-router.scss'

class Q3SNavigationRouter extends HTMLElement {

  static tagName = 'q3s-navigation-router'

  all = new Set()
  include = {}
  exclude = {}

  connectedCallback() {
    this.querySelectorAll('q3s-navigation-container').forEach(item => {
      let include = item.getAttribute('include')
      let exclude = item.getAttribute('exclude')

      include = include ? include.split(',') : false
      exclude = exclude ? exclude.split(',') : false

      if (include) {
        include.forEach(pageName => {
          if (!this.include[pageName]) {
            this.include[pageName] = new Set()
          }
          this.include[pageName].add(item)
        })
      } else {
        this.all.add(item)
        if (exclude) {
          exclude.forEach(pageName => {
            if (!this.exclude[pageName]) {
              this.exclude[pageName] = new Set()
            }
            this.exclude[pageName].add(item)
          })
        }
      }
    })
  }

}

oom.define(Q3SNavigationRouter)


export {
  Q3SNavigationRouter
}
