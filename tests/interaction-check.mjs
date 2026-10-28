import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { artworks, moderatorWishes, wishes } from '../content.js';

// DOM state tests; these do not replace browser rendering checks.
class Element {
  constructor(name) { this.name = name; this.listeners = {}; this.style = {}; this.children = []; this.hidden = false; this.isConnected = true; this.inert = false; this.classes = new Set(); this.classList = { add: value => this.classes.add(value), remove: value => this.classes.delete(value) }; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  append(element) { this.children.push(element); element.parent = this; }
  before(element) { element.parent = this.parent; this.placeholder = element; }
  replaceWith(element) { element.parent = this.parent; }
  focus() { document.activeElement = this; }
  showModal() { this.open = true; }
  close() { this.open = false; this.listeners.close?.(); }
  getBoundingClientRect() { return this.name === 'experience' && this.parent?.name === 'shell' ? { left: 400, top: 40, width: 600, height: 600 } : { left: 800, top: 100, width: 500, height: 600 }; }
  animate() { return { cancel() {}, finished: Promise.resolve() }; }
}
const elements = Object.fromEntries(['experience', 'shell', 'dismiss', 'header', 'intro', 'footer', 'phone-display', 'cover-display', 'app', 'viewer', 'model', 'close', 'status-time', 'cover-clock', 'home-clock', 'birthday-age', 'birthday-countdown', 'tutorial', 'tutorial-open', 'tutorial-close', 'tutorial-done'].map(name => [name, new Element(name)]));
const document = { body: new Element('body'), activeElement: null, listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; }, createElement: name => new Element(name), getElementById: id => elements[id], querySelector: selector => ({ '.experience': elements.experience, '#focus-shell': elements.shell, '#focus-dismiss': elements.dismiss, header: elements.header, '.intro': elements.intro, footer: elements.footer, '#app': elements.app, '#viewer': elements.viewer, '#model': elements.model, '#close': elements.close, '#status-time': elements['status-time'], '#cover-clock': elements['cover-clock'], '#home-clock': elements['home-clock'], '#birthday-age': elements['birthday-age'], '#birthday-countdown': elements['birthday-countdown'], '#tutorial': elements.tutorial, '#tutorial-open': elements['tutorial-open'], '#tutorial-close': elements['tutorial-close'], '#tutorial-done': elements['tutorial-done'] })[selector] };
const localValues = new Map();
const localStorage = { getItem: key => localValues.get(key) ?? null, setItem: (key, value) => localValues.set(key, value) };
elements.experience.parent = new Element('main');
document.activeElement = elements.model;
const context = vm.createContext({ document, window: {}, localStorage, matchMedia: () => ({ matches: true }), artworks, moderatorWishes, wishes, setTimeout() {}, setInterval() {}, console });
const appSource = (await readFile(new URL('../app.js', import.meta.url), 'utf8'))
  .replace('import { artworks, moderatorWishes, wishes } from "./content.js";', '');
vm.runInContext(appSource, context);
assert(elements.tutorial.open, 'The tutorial opens on a first visit');
elements['tutorial-close'].listeners.click();
assert(!elements.tutorial.open, 'The tutorial can be dismissed');
assert.equal(localStorage.getItem('birthday-tutorial-seen'), 'true');
elements['tutorial-open'].listeners.click();
assert(elements.tutorial.open, 'The help button reopens the tutorial');
elements['tutorial-done'].listeners.click();
assert(!elements.tutorial.open, 'The start button closes the tutorial');
elements.tutorial.open = false;
function click(dataset) { document.listeners.click({ target: { closest: () => ({ dataset }) } }); }
assert(wishes.length >= 40, 'The general community section has 40+ messages');
assert(moderatorWishes.length >= 1, 'Known moderator messages have a separate section');
assert(!wishes.some(({ from }) => from.includes('Thạch Dzừa')));
assert.notEqual(elements['status-time'].textContent, '--:--', 'The phone clock uses current time');
assert.match(elements['birthday-countdown'].textContent, /^(Còn|Hôm nay)/);
assert(elements['birthday-age'].textContent, 'Birthday age is shown');
assert(!wishes.some(({ text }) => /Ohio|donate|gaybar|stress/i.test(text)));
click({ app: 'home' });
assert.match(elements.app.innerHTML, /class="home-screen"/);
assert.match(elements.app.innerHTML, /data-app="after-credit"/);
click({ app: 'after-credit' });
assert.match(elements.app.innerHTML, /class="after-credit"/);
assert.match(elements.app.innerHTML, /AFTER CREDIT · 01/);
assert.match(elements.app.innerHTML, /<h2>[^<]+<\/h2>/);
click({ app: 'wishes' });
assert.match(elements.app.innerHTML, /Chúc anh Hiếu sinh nhật thật vui vẻ/);
assert.match(elements.app.innerHTML, /naxto/);
assert.match(elements.app.innerHTML, new RegExp(`${wishes.length} lời nhắn từ cộng đồng`));
assert.match(elements.app.innerHTML, /class="wish-view"/);
assert.match(elements.app.innerHTML, /class="letter wish-letter" tabindex="0"/);
assert.match(elements.app.innerHTML, /Cuộn trong khung để đọc hết/);
click({ step: '1' });
assert.match(elements.app.innerHTML, /Juryy/);
click({ step: '1' });
assert.match(elements.app.innerHTML, /Traan Tue Laam/);
click({ step: '-1' });
assert.match(elements.app.innerHTML, /Juryy/);
click({ app: 'mod-wishes' });
assert.match(elements.app.innerHTML, /Lời chúc modders/);
assert.match(elements.app.innerHTML, new RegExp(moderatorWishes[0].from));
assert.match(elements.app.innerHTML, new RegExp(`${moderatorWishes.length} lời nhắn từ các modders`));
assert.match(elements.app.innerHTML, /data-mod-step/);
click({ modStep: '1' });
assert.match(elements.app.innerHTML, new RegExp(moderatorWishes[1 % moderatorWishes.length].from));
elements.app.listeners.pointerdown({ clientX: 200 });
elements.app.listeners.pointerup({ clientX: 80 });
assert.match(elements.app.innerHTML, new RegExp(moderatorWishes[2 % moderatorWishes.length].from));
click({ app: 'art' });
assert.match(elements.app.innerHTML, /assets\/fan-art\/rain\.jpg/);
assert.match(elements.app.innerHTML, /Rain/);
click({ art: '1' });
assert.match(elements.app.innerHTML, /assets\/fan-art\/hoa-vu\.jpg/);
elements.app.listeners.pointerdown({ clientX: 200 });
elements.app.listeners.pointerup({ clientX: 80 });
assert.match(elements.app.innerHTML, /assets\/fan-art\/seungmin-lino\.jpg/);
assert.equal(artworks.length, 10, 'The gallery includes all supplied community art and video');
click({ art: '7' });
assert.match(elements.app.innerHTML, /<video/);
assert.match(elements.app.innerHTML, /hoang-lam\.mp4/);

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
console.log(`${wishes.length} community wishes, separate moderator wishes, 10 artworks, swipe, and focus interactions verified.`);
