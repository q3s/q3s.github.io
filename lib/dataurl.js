import { allx64Chars } from './x64url.js'

const urlSpecialChars = "#=?/:,;@+!~*'()"
const urlValidCharsSet = allx64Chars.replace('-', '\\-') + urlSpecialChars
const urlValidCharsRE = new RegExp(`^[${urlValidCharsSet}]+$`)


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


export {
  testURLChars,
  decodeURISearch
}
