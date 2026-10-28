import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

class Element {
  constructor() {
    this.listeners = {};
    this.dataset = {};
    this.hidden = false;
    this.textContent = "";
    this.src = "";
    this.playCount = 0;
  }
  addEventListener(name, callback) {
    this.listeners[name] = callback;
  }
  async click() {
    await this.listeners.click?.();
  }
  load() {
    this.loadCount = (this.loadCount ?? 0) + 1;
  }
  async play() {
    this.playCount++;
  }
  pause() {
    this.paused = true;
  }
  removeAttribute(name) {
    if (name === "src") this.src = "";
  }
}

async function createOpening() {
  const ids = [
    "opening",
    "opening-video",
    "play-intro",
    "skip-intro",
    "opening-actions",
    "gift-reveal",
    "gift-open",
    "opening-status",
    "birthday-site",
    "site-status",
  ];
  const elements = Object.fromEntries(ids.map((id) => [id, new Element()]));
  elements["opening-video"].dataset.src = "intro.mp4";
  const selectors = Object.fromEntries(
    ids.map((id) => [`#${id}`, elements[id]]),
  );
  const document = { querySelector: (selector) => selectors[selector] };
  const imports = [];
  const source = (await readFile(new URL("../startup.js", import.meta.url), "utf8"))
    .replaceAll('import("./app.js")', 'moduleLoader("app.js")')
    .replaceAll('import("./focus.js")', 'moduleLoader("focus.js")')
    .replaceAll('import("./phone-scene.js")', 'moduleLoader("phone-scene.js")');
  const context = vm.createContext({
    document,
    console,
    moduleLoader: async (name) => imports.push(name),
  });
  vm.runInContext(source, context);
  return { elements, imports };
}

const { elements, imports } = await createOpening();
const video = elements["opening-video"];
assert.equal(video.src, "", "The intro video is not fetched at initial page load");
assert.equal(video.loadCount, undefined);
await elements["play-intro"].click();
assert.equal(video.src, "intro.mp4");
assert.equal(video.playCount, 1);
video.listeners.ended();
assert.equal(elements["gift-reveal"].hidden, false);
assert.equal(video.src, "", "The video source is released after playback");
assert.equal(elements["opening-actions"].hidden, true);
await elements["gift-open"].click();
assert.equal(elements.opening.hidden, true);
assert.equal(elements["birthday-site"].hidden, false);
assert.deepEqual(imports, ["app.js", "focus.js", "phone-scene.js"]);
assert.equal(elements["site-status"].textContent, "");
await elements["gift-open"].click();
assert.equal(imports.length, 3, "The website starts only once");

const skipped = await createOpening();
await skipped.elements["skip-intro"].click();
assert.equal(skipped.elements["opening-video"].src, "");
assert.equal(skipped.elements["gift-reveal"].hidden, false);
await skipped.elements["gift-open"].click();
assert.deepEqual(skipped.imports, ["app.js", "focus.js", "phone-scene.js"]);

console.log("Intro video, gift reveal, skip, and deferred website startup verified.");
