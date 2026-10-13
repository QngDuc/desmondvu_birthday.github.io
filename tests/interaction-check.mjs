import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// DOM state tests; these do not replace browser rendering checks.
class Element {
  constructor(name) { this.name = name; this.listeners = {}; this.style = {}; this.children = []; this.hidden = false; this.isConnected = true; this.inert = false; this.classes = new Set(); this.classList = { add: value => this.classes.add(value), remove: value => this.classes.delete(value) }; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  append(element) { this.children.push(element); element.parent = this; }
  before(element) { element.parent = this.parent; this.placeholder = element; }
  replaceWith(element) { element.parent = this.parent; }
  focus() { document.activeElement = this; }
  getBoundingClientRect() { return this.name === 'experience' && this.parent?.name === 'shell' ? { left: 400, top: 40, width: 600, height: 600 } : { left: 800, top: 100, width: 500, height: 600 }; }
  animate() { return { cancel() {}, finished: Promise.resolve() }; }
}
const elements = Object.fromEntries(['experience', 'shell', 'dismiss', 'header', 'intro', 'footer', 'phone-display', 'cover-display', 'app', 'viewer', 'model', 'close'].map(name => [name, new Element(name)]));
const document = { body: new Element('body'), activeElement: null, listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; }, createElement: name => new Element(name), getElementById: id => elements[id], querySelector: selector => ({ '.experience': elements.experience, '#focus-shell': elements.shell, '#focus-dismiss': elements.dismiss, header: elements.header, '.intro': elements.intro, footer: elements.footer, '#app': elements.app, '#viewer': elements.viewer, '#model': elements.model, '#close': elements.close })[selector] };
elements.experience.parent = new Element('main');
document.activeElement = elements.model;
const context = vm.createContext({ document, window: {}, matchMedia: () => ({ matches: true }), Image: class {}, setTimeout() {}, console });
vm.runInContext(await readFile(new URL('../app.js', import.meta.url), 'utf8'), context);
function click(dataset) { document.listeners.click({ target: { closest: () => ({ dataset }) } }); }
click({ app: 'wishes' });
assert.match(elements.app.innerHTML, /Sinh nhật vui vẻ, Desmond/);
click({ step: '1' });
assert.match(elements.app.innerHTML, /Mọi điều dịu dàng/);
click({ step: '1' });
assert.match(elements.app.innerHTML, /Sinh nhật vui vẻ, Desmond/);
click({ app: 'art' });
assert.match(elements.app.innerHTML, /fan-art-birthday.png/);
click({ art: '1' });
assert.match(elements.app.innerHTML, /fan-art-starlight.png/);
elements.app.listeners.pointerdown({ clientX: 200 });
elements.app.listeners.pointerup({ clientX: 80 });
assert.match(elements.app.innerHTML, /fan-art-birthday.png/);

vm.runInContext(await readFile(new URL('../focus.js', import.meta.url), 'utf8'), context);
context.window.enterPhoneFocus();
assert.equal(elements.experience.parent, elements.shell);
assert(document.body.classes.has('phone-focused'));
assert(elements.intro.inert && elements.header.inert && elements.footer.inert);
assert.equal(document.activeElement, elements.dismiss);
context.window.enterPhoneFocus();
assert.equal(elements.shell.children.length, 1, 'Repeated clicks do not duplicate the phone');
elements.shell.listeners.keydown({ key: 'Escape', preventDefault() {} });
await new Promise(resolve => setImmediate(resolve));
assert(!document.body.classes.has('phone-focused'));
assert(!elements.intro.inert && !elements.header.inert && !elements.footer.inert);
assert(elements.shell.hidden);
assert.equal(document.activeElement, elements.model);
assert.notEqual(elements.experience.parent, elements.shell);
context.window.enterPhoneFocus();
assert.equal(elements.experience.parent, elements.shell, 'Can reopen after dismissing');
await elements.dismiss.listeners.click();
console.log('Two wishes, two image assets, swipe, focus, repeated click, Escape, and reopen verified.');
