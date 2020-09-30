import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'


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
    postcss({ extract: true, minimize: true, use: [['sass', { includePaths: ['./node_modules'] }]] }),
    commonjs({ include: 'node_modules/**' }),
    cleanup({ comments: 'none' }),
    terser()
  ]
}]
