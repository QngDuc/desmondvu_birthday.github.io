# Project context for Claude

## What this project is

This is a small, static Vietnamese birthday microsite for Desmond Vũ. It presents a
Samsung Galaxy Z Flip 7 as an interactive 3D gift: visitors can open and fold the
phone, browse birthday wishes and fan art, trigger a celebration, and move the
phone into a focused full-screen view.

The site uses plain HTML, CSS, and browser JavaScript modules. There is no
framework, bundler, or runtime application server. Keep changes small and follow
the existing browser-native approach unless the task specifically calls for
another architecture.

## Source map

- `index.html` — Vietnamese page structure, phone screen markup, controls, model
  attribution dialog, and script entry points.
- `style.css` — responsive visual design, phone-screen apps, model layout,
  reduced-motion rules, and focused-view styling.
- `app.js` — screen app content and interactions: home, wishes, fan-art gallery,
  celebration/confetti, swipe navigation, Vietnam-time clock/countdown, and the
  attribution dialog.
- `content.js` — general community wishes, a separately credited moderator
  wishes list, and community media entries; author credits and media paths live
  together here.
- `focus.js` — moves the phone experience into a modal-like focused layout,
  traps Tab navigation, handles Escape, and restores focus and page inertness.
- `phone-scene.js` — Three.js scene and CSS3D screen setup; model loading,
  fold/open animation, rotation, resize, and model-load fallback.
- `phone-model.js` — assembles the articulated phone from the GLB and defines
  screen dimensions/placement. It relies on specific GLB node associations.
- `assets/galaxy-z-flip-7.glb` — runtime 3D phone model loaded by
  `phone-scene.js`.
- `samsung-galaxy-z-flip-7/` — source model and its textures.
- `fanart/` — supplied fan-art images, GIF, and video.
- `assets/fan-art/` — resized/compressed media used by the public gallery.
- `vendor/` — locally vendored Three.js 0.170.0 modules, GLTF loader, CSS3D
  renderer, environment helper, and Three.js license.
- `favicon.svg` — site favicon.
- `scripts/build.mjs` — copies the complete static site to `dist/` for the
  hosting configuration.
- `tests/content-check.mjs` — validates wish/media counts, media file
  signatures, paths, and optimized image payload size.
- `tests/model-check.mjs` — parses the GLB and checks articulated geometry,
  screen proportions, and fold/reopen behavior. Image decoding is stubbed.
- `tests/interaction-check.mjs` — lightweight DOM-mock tests for app navigation,
  swipe behavior, focused-view open/close/focus restoration, and tutorial
  first-visit/reopen behavior.
- `lời chúc.txt` — collected birthday messages; this is source content, not
  currently rendered by the site.
- `README.md` — project overview, local run/check/build instructions, and
  attribution/licensing notes.
- `.openai/hosting.json` and `dist/` — static-hosting configuration and build
  output directory.
- `site.tar.gz` — project archive; treat the working tree as authoritative.

## Run and validate

Run a local HTTP server from the repository root (do not open `index.html` as a
`file://` URL; ES modules and model loading need HTTP):

```sh
python -m http.server 8080
```

Open `http://localhost:8080`.

Build the static hosting output:

```sh
npm run build
```

Run the project's checks:

```sh
npm run check
```

Checks include JavaScript syntax, media/content validation, and Node tests for
model geometry and interactions. They do not exercise actual browser rendering,
WebGL, touch behavior, or deployed hosting.

## Important implementation details

- The 3D model is rendered with local Three.js/WebGL. The interactive phone
  screens are HTML elements rendered onto the same scene using
  `CSS3DRenderer`; preserve their alignment and relative transforms when
  changing model or screen dimensions.
- `phone-model.js` finds model nodes by GLTF parser association IDs (`37`, `25`,
  and `36`). Replacing or re-exporting the GLB can invalidate these IDs. Update
  the assembly and screen measurements together, then run `npm run check`.
- The top half is attached to a hinge; the bottom remains stationary. The cover
  display is attached to the top half and must remain upright when folded.
- Model load reports byte/percentage progress. Mobile and Data Saver settings
  cap WebGL pixel ratio to limit rendering cost.
- On model-load failure, `phone-scene.js` exposes the app screen as a flat
  fallback. Preserve useful app access in this path.
- `prefers-reduced-motion` affects fold/focus animation. Keep motion changes
  accessible and test the reduced-motion behavior where practical.
- Wishes, artwork credits, alt text, and paths are data-driven in `content.js`.
  Keep media files and their paths in sync; `tests/content-check.mjs` checks
  actual files and their signatures.
- The clock and birthday countdown use the `Asia/Ho_Chi_Minh` time zone. The
  birth year is currently 1999 and the date is October 28; update together if
  confirmed details change.
- The usage tutorial is a native dialog. It opens automatically until dismissed
  once in local storage and remains available from the floating `?` button.
- Fonts are requested from Google Fonts in `style.css`; Three.js and the model
  loader are local and are not loaded from a CDN.

## Deployment and validation notes

- The live GitHub Pages URL is `https://qngduc.github.io/desmondvu_birthday.github.io/`
  and serves the repository root. `.openai/hosting.json` uses `dist/`; run
  `npm run build` before deploying through that host.
- `dist/` is generated output. Edit root sources, then rebuild; do not hand-edit
  `dist/` because the next build overwrites it.
- Community content and creator credits in `content.js` are intended for the
  public page. Sensitive/personal asides and copyrighted lyrics from the
  collection were omitted; do not reintroduce them casually.
- Tests use Node mocks for interactions and validate media bytes, but do not
  replace a real browser check. For visual, CSS3D, WebGL, mobile, or image-load
  changes, validate in a browser when possible.

## Content, assets, and licensing

- The page and most UI copy are Vietnamese with some English decorative text.
  Preserve the intended names and tone when editing copy.
- The Galaxy Z Flip 7 model is attributed in the page to zhe_kan and is stated
  in `README.md` to be under CC BY-NC-SA 4.0. Preserve attribution and license
  notices for the model and its adaptations.
- Three.js 0.170.0 is vendored under its MIT license; retain
  `vendor/THREE-LICENSE.txt`.
- `fanart/` and `lời chúc.txt` contain user-submitted/identifiable creative
  content. Avoid unnecessary renaming, redistribution, or exposing their full
  contents in generated documentation.
- Avoid editing vendored library code unless the requested fix specifically
  requires it.
