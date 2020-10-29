import { oom } from '@notml/core'
import './navigation-router.scss'

const { location } = window


oom.define('q3s-navigation-router', class Q3SNavigationRouter extends HTMLElement {

  all = new Set()
  include = {}
  exclude = {}

  constructor() {
    super()
    this._navigate = () => {
      this.navigate(location.hash)
    }
  }

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
    this.navigate(location.hash)
    window.addEventListener('hashchange', this._navigate, false)
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this._navigate, false)
  }

  navigate(page) {
    const activated = new Set()
    const lastActivated = this.querySelectorAll('q3s-navigation-container[activated]')

    page = page || '#'
    if (this.include[page]) {
      this.include[page].forEach(item => {
        item.setAttribute('activated', true)
        activated.add(item)
      })
    }

    const exclude = this.exclude[page]

    this.all.forEach(item => {
      if (exclude && exclude.has(item)) {
        item.removeAttribute('activated')
      } else {
        item.setAttribute('activated', true)
        activated.add(item)
      }
    })

    lastActivated.forEach(item => {
      if (!activated.has(item)) {
        item.removeAttribute('activated')
      }
    })
  }

})
