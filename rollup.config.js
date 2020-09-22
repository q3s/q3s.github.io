import resolve from '@rollup/plugin-node-resolve'
import command from 'rollup-plugin-command'
import commonjs from '@rollup/plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import css from 'rollup-plugin-css-only'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import { readFile, writeFile } from 'fs/promises'

const buildNumberFrontMatter = `---
---
{% capture build_number %}{{ site.github.build_revision }}{{ site.time | date: '%Y%m%d%H%M%S' }}{% endcapture %}
`

export default [{
  input: 'src/external.js',
  output: { file: 'docs/assets/external.js', format: 'esm', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    commonjs({ include: 'node_modules/**' }),
    cleanup({ comments: 'none' }),
    terser()
  ]
}, {
  input: 'src/mdc.js',
  output: { file: 'docs/assets/mdc.js', format: 'esm', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    postcss({ extract: true, modules: true, minimize: true, use: [['sass', { includePaths: ['./node_modules'] }]] }),
    commonjs({ include: 'node_modules/**' }),
    cleanup({ comments: 'none' }),
    terser()
  ]
}, {
  input: 'src/bundle.js',
  output: { file: 'docs/assets/bundle.js', format: 'esm' },
  external: ['./external.js'],
  plugins: [
    cleanup({ comments: 'none' }),
    css({ output: 'docs/assets/bundle.css' }),
    command(async () => {
      const bundleFile = (await readFile('docs/assets/bundle.js', 'utf-8'))
        .replace(/(from '.*)'/ig, '$1?v={{ build_number }}\'')

      writeFile('docs/assets/bundle.js', buildNumberFrontMatter + bundleFile)
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
