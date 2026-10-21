// Verify every /seed-blog/... and /seed-testimonials/... reference in src
// resolves to a real file in dist/ (Vite copies public/ verbatim).
import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import path from "path";

const refs = new Set();
function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(e.name)) {
      const c = readFileSync(p, "utf8");
      for (const m of c.matchAll(/["'`](\/seed-(?:blog|testimonials)\/[^"'`\s)]+)["'`]/g)) {
        refs.add(m[1]);
      }
    }
  }
}
walk("src");

let missing = 0;
for (const r of refs) {
  const f = path.join("dist", r);
  if (!existsSync(f)) {
    console.log("MISSING:", r);
    missing++;
  }
}
console.log(`public URL refs checked: ${refs.size}, missing: ${missing}`);

const logo = readdirSync("dist/assets").find((f) => f.startsWith("logo"));
console.log("logo in dist:", logo, logo ? `${(statSync(path.join("dist/assets", logo)).size / 1024).toFixed(1)} KB` : "");

// Confirm no src import still points at a missing asset (build would fail, but double-check).
let importMissing = 0;
function walkImports(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkImports(p);
    else if (/\.(js|jsx)$/.test(e.name)) {
      const c = readFileSync(p, "utf8");
      for (const m of c.matchAll(/from\s+["'](\.\.?\/[^"']+\.(?:png|webp|jpe?g|svg|avif|gif))["']/g)) {
        const resolved = path.resolve(path.dirname(p), m[1]);
        if (!existsSync(resolved)) {
          console.log("BROKEN IMPORT:", p, "->", m[1]);
          importMissing++;
        }
      }
    }
  }
}
walkImports("src");
console.log(`local asset imports checked, broken: ${importMissing}`);
