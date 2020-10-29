(function checkCompatible() {
  var $notml = window.$notml = window.$notml || {};
  $notml.compatible = function compatible() {
    var customElements =
      typeof window.customElements === 'object' &&
      typeof window.customElements.define === 'function' &&
      typeof window.HTMLElement === 'function';
    var success = true;
    var messages = [];
    if (!customElements) {
      success = false;
      messages.push('customElements не поддерживаются');
    }
    try {
      var testFunction1 = new Function(
        'class TestClass {' +
        '  get(){};' +
        '  set(){};' +
        '  test(){};' +
        '  b(){};' +
        '}' +
        'const a = new TestClass()'
      );
      testFunction1();
    } catch (error) {
      success = false;
      messages.push('JS классы не поддерживается');
      messages.push(error.message + '\n' + error.stack);
    }
    try {
      var testFunction2 = new Function(
        'class TestClass {' +
        '  static get(){};' +
        '  static set(){};' +
        '  static test(){};' +
        '  get(){};' +
        '  set(){};' +
        '  test(){};' +
        '  b(){};' +
        '}' +
        'const a = new TestClass()'
      );
      testFunction2();
    } catch (error) {
      success = false;
      messages.push('Статические методы в JS классах не поддерживается');
      messages.push(error.message + '\n' + error.stack);
    }
    try {
      var testFunction3 = new Function(
        'class TestClass {' +
        '  test(){};' +
        '  a = 1;' +
        '  b(){};' +
        '}' +
        'const a = new TestClass()'
      );
      testFunction3();
    } catch (error) {
      success = false;
      messages.push('Свойства в JS классах не поддерживается');
      messages.push(error.message + '\n' + error.stack);
    }
    return { success, messages: messages.join('\n\n') }
  };
})();

(() => {
  var location = window.location;
  var compatible = window.$notml.compatible();
  if (!compatible.success && location.pathname !== '/not-supported/') {
    location.href = '/not-supported/';
  } else if (compatible.success && location.pathname === '/not-supported/') {
    location.href = '/';
  } else if (!compatible.success && location.pathname === '/not-supported/') {
    document.querySelector('#errorMessages').innerHTML = compatible.messages;
    document.querySelector('#moreMessages').onclick = () => {
      document.querySelector('#moreMessages').style.display = 'none';
      document.querySelector('#errorMessages').style.display = 'inline';
    };
  }
  if (location.protocol !== 'https:' &&
    location.hostname !== 'localhost' &&
    Number.isNaN(Number(location.hostname.split('.').join('')))) {
    location.protocol = 'https:';
  }
})();
