import { oom } from '@notml/core'
import './code-scanner.scss'


oom.define('q3s-code-scanner', class Q3SCodeScanner extends HTMLElement {

  template = () => oom.div({ class: 'mdc-card q3s-code-scanner__card' }, oom
    .video({ class: 'q3s-code-scanner__video' }))

})
