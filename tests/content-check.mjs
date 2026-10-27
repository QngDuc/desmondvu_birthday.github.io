import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { artworks, wishes } from "../content.js";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
assert(wishes.length >= 40, "Include at least 40 community wishes");
assert(
  wishes.every((wish) => wish.from.trim() && wish.text.trim()),
  "Every wish must have an author and message",
);
assert(artworks.length >= 8, "Include community artwork");
assert.match(html, /name="description"/, "Include an SEO description");
assert.match(html, /property="og:image"/, "Include an Open Graph preview image");
assert.match(html, /rel="icon"/, "Include a favicon");
assert.match(html, /id="model">Về model/, "Label the model credit button clearly");
assert.match(html, /id="model-progress"/, "Show model download progress");
assert.match(html, /Phi thương mại/, "Disclose the model's non-commercial license");

const paths = new Set();
let imageBytes = 0;
for (const artwork of artworks) {
  assert(!paths.has(artwork.src), `Duplicate artwork path: ${artwork.src}`);
  paths.add(artwork.src);
  const contents = await readFile(new URL(`../${artwork.src}`, import.meta.url));
  assert(contents.length > 0, `Empty artwork file: ${artwork.src}`);

  if (artwork.type === "video") {
    assert.equal(
      contents.toString("ascii", 4, 8),
      "ftyp",
      `Invalid MP4 file: ${artwork.src}`,
    );
    continue;
  }

  imageBytes += contents.length;
  if (artwork.src.endsWith(".gif"))
    assert.match(contents.toString("ascii", 0, 6), /^GIF8[79]a$/);
  else
    assert(
      contents[0] === 0xff && contents[1] === 0xd8,
      `Invalid JPEG file: ${artwork.src}`,
    );
}

assert(
  imageBytes < 1_000_000,
  `Optimized gallery images should stay below 1 MB (got ${imageBytes})`,
);
console.log(
  `${wishes.length} wishes, ${artworks.length} existing media files, and ${imageBytes} image bytes verified.`,
);
