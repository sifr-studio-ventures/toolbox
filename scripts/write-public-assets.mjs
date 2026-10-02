#!/usr/bin/env node
/**
 * Materialize public/*.png from brand-png/*.png.b64 (or .b64.part1+.part2).
 * Runs on prebuild / predev so Vite Static Assets stay in sync.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "brand-png");
const outDir = join(root, "public");
mkdirSync(outDir, { recursive: true });

function readB64(baseName) {
  const whole = join(srcDir, `${baseName}.b64`);
  if (existsSync(whole)) return readFileSync(whole, "utf8").trim();
  const p1 = join(srcDir, `${baseName}.b64.part1`);
  const p2 = join(srcDir, `${baseName}.b64.part2`);
  if (existsSync(p1) && existsSync(p2)) {
    return (readFileSync(p1, "utf8") + readFileSync(p2, "utf8")).trim();
  }
  throw new Error(`Missing brand-png/${baseName}.b64`);
}

const names = [
  "open-toolbox-mark.png",
  "favicon.png",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-48.png",
  "apple-touch-icon.png",
];

for (const name of names) {
  writeFileSync(join(outDir, name), Buffer.from(readB64(name), "base64"));
  console.log("wrote", name);
}
