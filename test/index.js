import './emulateDOM.js'
import { Test } from '@nodutilus/test'
import { Tx64url } from './lib/x64url.js'


/** Общий тестовый класс */
class TestQ3S extends Test {

  static x64url = Tx64url

}


Test.runOnCI(new TestQ3S())
