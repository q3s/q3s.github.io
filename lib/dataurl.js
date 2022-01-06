import { pako } from '../src/external.js'
import {
  allx64Chars,
  encodeURLx64,
  decodeURLx64
} from './x64url.js'

const urlSpecialChars = "#=?/:,;@+!~*'()"
const urlValidCharsSet = allx64Chars.replace('-', '\\-') + urlSpecialChars
const urlValidCharsRE = new RegExp(`^[${urlValidCharsSet}]+$`)
const { location, URL, URLSearchParams } = window


/**
 * Проверяет что строка содержит только разрешенные для URL символы
 *
 * @param {string} text
 * @returns {boolean}
 */
function testURLChars(text) {
  const result = urlValidCharsRE.test(String(text))

  return result
}


/**
 * Декодирует спецсимволы внутри параметров поиска в url,
 *  которые корректно воспринимаются при получении данных из URLSearchParams
 *
 * @param {string} url
 * @returns {string}
 */
function decodeURISearch(url) {
  const result = url.replace(/%2F/g, '/')

  return result
}


/**
 * Сжатие текста с данными для использования в URL,
 *  использует только разрешенный для URL символы.
 *
 * @param {string} text
 * @returns {string}
 */
function deflate(text) {
  const rawData = pako.deflateRaw(text)
  const result = encodeURLx64(rawData)

  return result
}


/**
 * Распаковка сжатого текста с данными из URL.
 * Обратный метод для deflate.
 *
 * @param {string} text
 * @returns {string}
 */
function inflate(text) {
  const rawData = decodeURLx64(text)
  const result = pako.inflateRaw(rawData, { to: 'string' })

  return result
}


/**
 * Анализирует переданный URL и получает из него параметры,
 *  для генерации объекта данных одной из поддерживаемых моделей.
 *
 * @param {string} plainURL
 */
function parseURL(plainURL) {
  const url = new URL(plainURL, location.origin)
  const hash = url.hash.replace(/^#/, '')
  const searchParams = new URLSearchParams(hash)
  const plainObject = {}
  let decoded = null

  for (const [key, value] of searchParams.entries()) {
    if (key && !value) {
      Object.assign(plainObject, JSON.parse(inflate(key)))
    } else if (key && value) {
      plainObject[key] = value
    }
  }

  return plainObject
}


export {
  testURLChars,
  decodeURISearch,
  deflate,
  inflate,
  parseURL
}
