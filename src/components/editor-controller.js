import { MDCSelect } from '@material/select'
import { oom } from '@notml/core'
import { DataTypes } from '../../lib/datamodel.js'
import './editor-controller.scss'

const typeSelectItems = [...DataTypes.entries()].reduce((container, [key, type]) => container
  .li({
    'class': 'mdc-list-item',
    'data-value': key
  }, oom
    .span({ class: 'mdc-list-item__ripple' })
    .span(type.title, { class: 'mdc-list-item__text' })), oom())


oom.define('q3s-editor-controller', class Q3SEditorController extends HTMLElement {

  template = () => oom.div({ class: 'mdc-select mdc-select--filled' }, oom
    .div({ class: 'mdc-select__anchor' }, oom
      .span({ class: 'mdc-select__ripple' })
      .span({ class: 'mdc-select__selected-text' })
      .span({ class: 'mdc-select__dropdown-icon' }, elm => {
        elm.innerHTML = oom('svg', { class: 'mdc-select__dropdown-icon-graphic', viewbox: '7 10 10 5' }, oom
          .polygon({
            'class': 'mdc-select__dropdown-icon-inactive',
            'stroke': 'none',
            'fill-rule': 'evenodd',
            'points': '7 10 12 15 17 10'
          })
          .polygon({
            'class': 'mdc-select__dropdown-icon-active',
            'stroke': 'none',
            'fill-rule': 'evenodd',
            'points': '7 15 12 10 17 15'
          })).dom.outerHTML
      })
      .span('Тип данных', { class: 'mdc-floating-label' })
      .span({ class: 'mdc-line-ripple' }))
    .div({ class: 'mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth' }, oom
      .ul({ class: 'mdc-list' }, oom
        .append(typeSelectItems.clone())
      )), select => { this._typeSelect = select })

  connectedCallback() {
    const select = new MDCSelect(this._typeSelect)

    console.log(select, this._typeSelect)
  }

})
