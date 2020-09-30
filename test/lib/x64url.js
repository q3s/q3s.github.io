import { Test, assert } from '@nodutilus/test'
import {
  intToX16Pos2, intToX16Pos3, intToX64, x64ToInt,
  intToX64Pos2, encodeURLx64, decodeURLx64
} from '../../lib/x64url.js'


/**
 * Проверка работы со сжатием URL
 */
export class Tx64url extends Test {

  /** Приведение к числу с основанием 16, максимум 2 знака, 0-255 */
  ['intToX16Pos2']() {
    assert.equal(intToX16Pos2(1), '01')
    assert.equal(intToX16Pos2(15), '0f')
    assert.equal(intToX16Pos2(16), '10')
    assert.equal(intToX16Pos2(255), 'ff')
  }

  /** Приведение к числу с основанием 16, максимум 3 знака, 0-4095 */
  ['intToX16Pos3']() {
    assert.equal(intToX16Pos3(1), '001')
    assert.equal(intToX16Pos3(15), '00f')
    assert.equal(intToX16Pos3(16), '010')
    assert.equal(intToX16Pos3(255), '0ff')
    assert.equal(intToX16Pos3(4095), 'fff')
  }

  /** Приведение к числу с основанием 64 */
  ['intToX64']() {
    assert.equal(intToX64(1), '1')
    assert.equal(intToX64(63), '_')
    assert.equal(intToX64(64), '10')
  }

  /** Восстановление числа с основанием 64 в 10 */
  ['x64ToInt']() {
    assert.equal(x64ToInt('1'), 1)
    assert.equal(x64ToInt('_'), 63)
    assert.equal(x64ToInt('10'), 64)
  }

  /** Приведение к числу с основанием 64, максимум 2 знака, 0-4095 */
  ['intToX64Pos2']() {
    assert.equal(intToX64Pos2(1), '01')
    assert.equal(intToX64Pos2(15), '0f')
    assert.equal(intToX64Pos2(16), '0g')
    assert.equal(intToX64Pos2(64), '10')
    assert.equal(intToX64Pos2(255), '3_')
    assert.equal(intToX64Pos2(4095), '__')
  }

  /** Проеобразуем 8-битный массив в строку */
  ['encodeURLx64']() {
    const encoder = new TextEncoder()

    assert.equal(encodeURLx64(encoder.encode('Тест')), 'QabgJt61Qo.2')
    assert.equal(encodeURLx64(encoder.encode('Тест1')), 'QabgJt61Qo8N')
    assert.equal(encodeURLx64(encoder.encode('Тест123')), 'QabgJt61Qo8Ncz.3')
    assert.equal(encodeURLx64(new Uint8Array([255, 255, 255])), '____')
    assert.equal(encodeURLx64(new Uint8Array([1, 15, 16, 255])), '0gYg.ff')
    assert.equal(encodeURLx64(new Uint8Array([1, 15, 16, 1])), '0gYg.1')
  }

  /** Проеобразуем строку в 8-битный массив */
  ['decodeURLx64']() {
    const decoder = new TextDecoder()

    assert.equal(decoder.decode(decodeURLx64('QabgJt61Qo.2')), 'Тест')
    assert.equal(decoder.decode(decodeURLx64('QabgJt61Qo8N')), 'Тест1')
    assert.equal(decoder.decode(decodeURLx64('QabgJt61Qo8Ncz.3')), 'Тест123')
    assert.deepEqual(decodeURLx64('____'), new Uint8Array([255, 255, 255]))
    assert.deepEqual(decodeURLx64('0gYg.ff'), new Uint8Array([1, 15, 16, 255]))
    assert.deepEqual(decodeURLx64('0gYg.1'), new Uint8Array([1, 15, 16, 1]))
  }

}
