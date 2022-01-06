import { Test, assert } from '@nodutilus/test'
import {
  testURLChars,
  decodeURISearch,
  deflate,
  inflate,
  parseURL
} from '../../lib/dataurl.js'


/**
 * Проверка с допустимыми символами URL
 */
export class Tdataurl extends Test {

  /** Проверяет что строка содержит только разрешенные для URL символы */
  ['testURLChars']() {
    assert.equal(testURLChars('Привет'), false)
    assert.equal(testURLChars('QabgJt61Qo.2'), true)
    assert.equal(testURLChars('____'), true)
    assert.equal(testURLChars('0gYg.ff'), true)
    assert.equal(testURLChars('0gYg.1'), true)
    assert.equal(testURLChars('q3s.github.io/test/api'), true)
    assert.equal(testURLChars("http://qrcoder.ru/#a=?/:-_.,;@+!~*'()"), true)
    assert.equal(testURLChars('http://qrcoder.ru/#a=$'), false)

    const x64alphabet = '0123456789' +
      'abcdefghijklmnopqrstuvwxyz' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      '-_.'

    assert.equal(testURLChars(x64alphabet), true)
  }

  /** Проверка преобразования параметров поиска в url */
  ['decodeURISearch']() {
    const { URL, URLSearchParams } = window
    const url1 = new URL('http://q3s.github.io/')
    const url2 = new URL('http://q3s.github.io/')

    url1.hash = new URLSearchParams('a=q3s.github.io/api/')
    url2.hash = new URLSearchParams('a=q3s.github.io/апи:?/-_.,;@+$!~*\'()')

    const url1Result = decodeURISearch(url1.href)
    const url2Result = decodeURISearch(url2.href)
    const eURI = encodeURI(decodeURIComponent(url2Result))

    assert.equal(url1Result, 'http://q3s.github.io/#a=q3s.github.io/api/')
    assert.equal(url2Result, 'http://q3s.github.io/#a=q3s.github.io/%D0%B0%D0%BF%D0%B8%3A%3F/-_.%2C%3B%40+%24%21%7E*%27%28%29')
    assert.equal(eURI, 'http://q3s.github.io/#a=q3s.github.io/%D0%B0%D0%BF%D0%B8:?/-_.,;@+$!~*\'()')
  }

  ['deflate/inflate']() {
    let a = deflate(JSON.stringify({ a: true }))
    let b = JSON.parse(inflate(a))

    assert.deepEqual(b, { a: true })

    a = deflate(JSON.stringify({ a: 'q3s.github.io/api/' }))
    b = JSON.parse(inflate(a))

    assert.deepEqual(b, { a: 'q3s.github.io/api/' })
  }

  ['parseURL']() {
    const { URL } = window
    const url1 = new URL('http://q3s.github.io/#' + new URLSearchParams('a=q3s.github.io/api/'))
    const d1 = parseURL(url1.href)
    const url2 = new URL(`http://q3s.github.io/#${deflate(JSON.stringify({ a: 'q3s.github.io/api/' }))}`)
    const d2 = parseURL(url2.href)

    assert.deepEqual(d1, { a: 'q3s.github.io/api/' })
    assert.equal(url2.href, 'http://q3s.github.io/#GRpalb9iazgKRALfbcAEjtbbPdtfbczklWE5')
    assert.deepEqual(d2, { a: 'q3s.github.io/api/' })
  }

}
