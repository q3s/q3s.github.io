import './emulateDOM.js'
import { Test } from '@nodutilus/test'
import { Tx64url } from './lib/x64url.js'
import { Tdataurl } from './lib/dataurl.js'


/** Общий тестовый класс */
class TestQ3S extends Test {

  static x64url = Tx64url

  static dataurl = Tdataurl

}


Test.runOnCI(new TestQ3S())
