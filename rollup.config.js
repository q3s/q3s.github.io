import resolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import command from 'rollup-plugin-command'
import cleanup from 'rollup-plugin-cleanup'
import postcss from 'rollup-plugin-postcss'
import { readFile, writeFile } from 'fs/promises'

const buildNumberFrontMatter = `---
---
{% capture build_number %}{{ site.github.build_revision }}{{ site.time | date: '%Y%m%d%H%M%S' }}{% endcapture %}
`

export default [{
  input: 'src/bundle.js',
  output: { file: 'docs/assets/bundle.js', format: 'esm' },
  external: ['__external__', '__mdc__'],
  plugins: [
    cleanup({ comments: 'none' }),
    postcss({ extract: true, use: [['sass', { includePaths: ['./node_modules'] }]] }),
    alias({
      entries: [
        { find: '../external.js', replacement: '__external__' },
        { find: '@notml/core', replacement: '__external__' },
        { find: '@zxing/library', replacement: '__external__' },
        { find: '@material/top-app-bar', replacement: '__mdc__' },
        { find: '@material/drawer', replacement: '__mdc__' },
        { find: '@material/ripple', replacement: '__mdc__' },
        { find: '@material/select', replacement: '__mdc__' },
        { find: '@material/textfield', replacement: '__mdc__' }
      ]
    }),
    replace({
      __external__: './external.js?v={{ build_number }}',
      __mdc__: './mdc.js?v={{ build_number }}'
    }),
    command(async () => {
      const bundleFileJS = (await readFile('docs/assets/bundle.js', 'utf-8'))
      const bundleFileCSS = (await readFile('docs/assets/bundle.css', 'utf-8'))

      writeFile('docs/assets/bundle.js', buildNumberFrontMatter + bundleFileJS)
      writeFile('docs/assets/bundle.css', buildNumberFrontMatter + bundleFileCSS)
    })
  ]
}, {
  input: 'src/offline.js',
  output: { file: 'docs/offline.js', format: 'esm' },
  plugins: [
    cleanup({ comments: 'none' }),
    command(async () => {
      const bundleFile = (await readFile('docs/offline.js', 'utf-8'))

      writeFile('docs/offline.js', buildNumberFrontMatter + bundleFile)
    })
  ]
}, {
  input: 'src/check-and-redirect.js',
  output: { file: 'docs/assets/check-and-redirect.js' },
  plugins: [
    cleanup({ comments: 'none' }),
    resolve({ browser: true, preferBuiltins: false })
  ]
}]
