// Audit helper: print dimensions + size for every raster image in src/ and public/
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const ROOT = path.resolve(".");
const DIRS = ["src/assets", "public"];
const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);

async function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

const fmtKB = (b) => (b / 1024).toFixed(0);
const rows = [];
for (const dir of DIRS) {
  const files = await walk(path.join(ROOT, dir));
  for (const f of files) {
    const s = await stat(f);
    let dims = "?";
    let hasAlpha = "?";
    try {
      const meta = await sharp(f).metadata();
      dims = `${meta.width}x${meta.height}`;
      hasAlpha = meta.hasAlpha ? "alpha" : "opaque";
    } catch (e) {
      dims = "ERR";
    }
    rows.push({
      file: path.relative(ROOT, f).replaceAll("\\", "/"),
      dims,
      alpha: hasAlpha,
      kb: fmtKB(s.size),
    });
  }
}
rows.sort((a, b) => a.file.localeCompare(b.file));
console.log("FILE\tDIMENSIONS\tALPHA\tKB");
for (const r of rows) console.log(`${r.file}\t${r.dims}\t${r.alpha}\t${r.kb}`);
