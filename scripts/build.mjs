import { cp, copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");

await mkdir(output, { recursive: true });
for (const file of [
  "index.html",
  "style.css",
  "app.js",
  "content.js",
  "focus.js",
  "phone-model.js",
  "phone-scene.js",
  "favicon.svg",
]) {
  await copyFile(join(root, file), join(output, file));
}
for (const directory of ["assets", "vendor"]) {
  await cp(join(root, directory), join(output, directory), {
    recursive: true,
    force: true,
  });
}

console.log(`Static site built in ${output}`);
