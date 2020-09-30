import jsdom from 'jsdom'

const { JSDOM } = jsdom
const { window } = new JSDOM('', { url: 'https://q3s.github.io/' })


global.window = window
