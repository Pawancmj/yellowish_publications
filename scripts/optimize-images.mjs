// Automatic image optimization — runs before every production build via the
// npm `prebuild` hook (`npm run build` -> prebuild -> vite build), and can be
// run manually with `npm run optimize-images`.
//
// Coverage:
//   src/assets/**\/*.{png,jpg,jpeg}  -> sibling .webp (originals kept as masters)
//   public/seed-blog/*               -> in-place re-encode (stable /seed-blog/ URLs)
//   public/seed-testimonials/*       -> in-place re-encode (stable URLs)
//   other public/** raster images    -> reported for manual attention only
//
// Incrementality: scripts/.image-opt-manifest.json records each source file's
// content hash + the settings used. Unchanged files are skipped. In-place
// seed PNGs are additionally skipped when they are already indexed-color PNGs
// within the size cap (prevents double quantization even without a manifest).
//
// Failure policy: any unreadable/corrupt source or encode error fails the
// build (exit 1) with a per-file message. Non-fatal warnings are printed for
// images that need manual attention.
//
// NOT covered here (by design):
//   - Admin uploads: compressed client-side by src/services/imageToDataUrl.js
//     (max 900px, JPEG q0.72, base64 into Firestore) — untouched.
//   - Externally hosted images (https:// URLs pasted in Admin) and Firestore
//     data URLs: served from third parties / stored inline; they cannot be
//     optimized by this build step. Recommended workflow: upload files through
//     the Admin panel (auto-compressed) or host pre-resized, WebP-friendly
//     images on a CDN.

import { createHash } from "crypto";
import { readdir, readFile, writeFile, rename, unlink } from "fs/promises";
import { existsSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch (err) {
  console.error(
    "[optimize-images] FAILED: the 'sharp' package is not available.\n" +
      "  Builds require devDependencies — run `npm install` without --omit=dev.\n" +
      `  (${err.message})`
  );
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_ASSETS = path.join(ROOT, "src", "assets");
const PUBLIC_DIR = path.join(ROOT, "public");
const MANIFEST_PATH = path.join(__dirname, ".image-opt-manifest.json");

// Bump when encode settings change so previously processed files re-run.
const SETTINGS_VERSION = 1;
const RASTER_SRC = new Set([".png", ".jpg", ".jpeg"]);
// Verified-unreferenced legacy source files (no import/URL references anywhere
// in src/): do not generate WebP siblings for these. Remove an entry if the
// image ever gets referenced — it will then be optimized on the next build.
const LEGACY_UNREFERENCED = new Set(
  ["a.png", "author-1.png", "author-2.png", "author-3.png", "author-4.png",
   "author-5.png", "author-6.png", "author-7.png", "author-8.png"].map(
    (f) => `src/assets/${f}`
  )
);
const SEED_DIRS = {
  "seed-blog": { width: 1200, pngQuality: 85, jpegQuality: 78 },
  "seed-testimonials": { width: 320, pngQuality: 90, jpegQuality: 80 },
};

const fmtKB = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
const sha1 = (buf) => createHash("sha1").update(buf).digest("hex");

// ---------------------------------------------------------------------------
// Profiles for src/assets -> WebP. Unknown new images use DEFAULT so any
// future PNG/JPEG dropped into src/assets is optimized automatically.
// ---------------------------------------------------------------------------
function webpProfileFor(fileName) {
  const base = fileName.replace(/\.(png|jpe?g)$/i, "");
  if (/^logo$/i.test(base)) {
    return { key: "logo", webp: { quality: 90, alphaQuality: 100, effort: 4 } };
  }
  if (/^book\d+$/i.test(base)) {
    return { key: "book-640-q72", webp: { width: 640, quality: 72, effort: 4 } };
  }
  if (/^author\d+$/i.test(base)) {
    return { key: "author-640-q74", webp: { width: 640, quality: 74, effort: 4 } };
  }
  if (/^(about|story)$/i.test(base)) {
    return { key: "banner-1400-q74", webp: { width: 1400, quality: 74, effort: 4 } };
  }
  if (/^hero$/i.test(base)) {
    return { key: "banner-1600-q74", webp: { width: 1600, quality: 74, effort: 4 } };
  }
  return { key: "default-1280-q75", webp: { width: 1280, quality: 75, effort: 4 } };
}

// ---------------------------------------------------------------------------
// Manifest helpers
// ---------------------------------------------------------------------------
async function loadManifest() {
  try {
    const raw = await readFile(MANIFEST_PATH, "utf8");
    const data = JSON.parse(raw);
    return data && typeof data === "object" && data.files ? data : { files: {} };
  } catch {
    return { files: {} };
  }
}

async function saveManifest(manifest) {
  manifest.settingsVersion = SETTINGS_VERSION;
  manifest.updatedAt = new Date().toISOString();
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

function manifestKey(rel) {
  return rel.replaceAll("\\", "/");
}

// ---------------------------------------------------------------------------
// Walkers
// ---------------------------------------------------------------------------
async function walkRasters(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkRasters(p, out);
    else if (RASTER_SRC.has(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------------------
// src/assets -> sibling WebP (originals are never modified)
// ---------------------------------------------------------------------------
async function optimizeSrcAssets(manifest, stats, errors) {
  const files = await walkRasters(SRC_ASSETS);
  if (!files.length) return;

  console.log(`[optimize-images] src/assets: ${files.length} raster source(s)`);
  for (const file of files) {
    const rel = manifestKey(path.relative(ROOT, file));
    if (LEGACY_UNREFERENCED.has(rel)) {
      stats.skipped++;
      continue;
    }
    try {
      const srcBuf = await readFile(file);
      const srcHash = sha1(srcBuf);
      const profile = webpProfileFor(path.basename(file));
      const settingsKey = `${SETTINGS_VERSION}:${profile.key}`;
      const webpPath = file.replace(/\.(png|jpe?g)$/i, ".webp");

      const entry = manifest.files[rel];
      if (
        entry &&
        entry.srcHash === srcHash &&
        entry.settingsKey === settingsKey &&
        existsSync(webpPath)
      ) {
        stats.skipped++;
        continue;
      }

      const before = statSync(file).size;
      const pipeline = sharp(file);
      if (profile.webp.width) {
        pipeline.resize({ width: profile.webp.width, withoutEnlargement: true });
      }
      const tmp = path.join(path.dirname(file), `.${path.basename(webpPath)}.tmp`);
      await pipeline.webp(profile.webp).toFile(tmp);
      await unlink(webpPath).catch(() => {});
      await rename(tmp, webpPath);
      const after = statSync(webpPath).size;

      const meta = await sharp(webpPath).metadata();
      manifest.files[rel] = { srcHash, settingsKey, output: manifestKey(path.relative(ROOT, webpPath)) };
      stats.processed++;
      stats.savedBytes += Math.max(0, before - after);
      console.log(
        `  ${rel} ${fmtKB(before)} -> ${path.basename(webpPath)} ${fmtKB(after)}` +
          (meta.hasAlpha ? " (alpha preserved)" : "")
      );
    } catch (err) {
      errors.push(`${rel}: ${err.message}`);
      console.error(`  ERROR ${rel}: ${err.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// public/seed-* -> in-place re-encode (URLs/filenames stay identical)
// ---------------------------------------------------------------------------
async function optimizeSeedDir(manifest, dirName, cfg, stats, errors) {
  const dir = path.join(PUBLIC_DIR, dirName);
  if (!existsSync(dir)) return;
  const files = (await readdir(dir)).filter((f) =>
    RASTER_SRC.has(path.extname(f).toLowerCase())
  );
  if (!files.length) return;

  console.log(`[optimize-images] public/${dirName}: ${files.length} file(s)`);
  for (const name of files) {
    const file = path.join(dir, name);
    const rel = manifestKey(path.relative(ROOT, file));
    const ext = path.extname(name).toLowerCase();
    try {
      const srcBuf = await readFile(file);
      const srcHash = sha1(srcBuf);
      const settingsKey = `${SETTINGS_VERSION}:seed-${dirName}-${ext.slice(1)}-${cfg.width}-p${cfg.pngQuality}-j${cfg.jpegQuality}`;

      const entry = manifest.files[rel];
      if (entry && entry.srcHash === srcHash && entry.settingsKey === settingsKey) {
        stats.skipped++;
        continue;
      }

      // Content-based guard: an already-indexed PNG within the size cap has
      // almost certainly been through this pipeline (e.g. fresh clone without
      // a committed manifest) — re-quantizing would degrade it further.
      if (ext === ".png") {
        const meta = await sharp(file).metadata();
        if (meta.isPalette && meta.width <= cfg.width) {
          manifest.files[rel] = { srcHash, settingsKey, output: rel };
          stats.skipped++;
          continue;
        }
      }

      const before = statSync(file).size;
      const tmp = path.join(dir, `.${name}.tmp`);
      const pipeline = sharp(file).resize({ width: cfg.width, withoutEnlargement: true });
      if (ext === ".png") {
        await pipeline
          .png({ palette: true, quality: cfg.pngQuality, compressionLevel: 9, effort: 10, dither: 1 })
          .toFile(tmp);
      } else {
        await pipeline.jpeg({ quality: cfg.jpegQuality, mozjpeg: true }).toFile(tmp);
      }
      await unlink(file);
      await rename(tmp, file);
      const after = statSync(file).size;

      manifest.files[rel] = { srcHash, settingsKey, output: rel };
      stats.processed++;
      stats.savedBytes += Math.max(0, before - after);
      console.log(`  ${rel} ${fmtKB(before)} -> ${fmtKB(after)}`);
    } catch (err) {
      errors.push(`${rel}: ${err.message}`);
      console.error(`  ERROR ${rel}: ${err.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Other public/ raster images: report only (do not rename/re-encode silently)
// ---------------------------------------------------------------------------
async function reportOtherPublicImages(stats) {
  if (!existsSync(PUBLIC_DIR)) return [];
  const notes = [];
  for (const entry of await readdir(PUBLIC_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || SEED_DIRS[entry.name]) continue;
    const files = await walkRasters(path.join(PUBLIC_DIR, entry.name));
    for (const f of files) {
      const kb = statSync(f).size / 1024;
      const rel = manifestKey(path.relative(ROOT, f));
      notes.push(rel);
      console.warn(`  WARN needs manual attention (public/${entry.name}): ${rel} ${fmtKB(statSync(f).size)}`);
    }
  }
  // Raster files directly in public/ root (not in a known seed dir)
  for (const f of await walkRasters(PUBLIC_DIR)) {
    if (path.dirname(f) !== PUBLIC_DIR) continue;
    const rel = manifestKey(path.relative(ROOT, f));
    notes.push(rel);
    console.warn(`  WARN needs manual attention (public root): ${rel} ${fmtKB(statSync(f).size)}`);
  }
  stats.reported += notes.length;
  return notes;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const manifest = await loadManifest();
  if (manifest.settingsVersion !== SETTINGS_VERSION) {
    // Settings changed: keep hashes but force reprocessing via key mismatch.
    manifest.settingsVersion = SETTINGS_VERSION;
  }

  const stats = { processed: 0, skipped: 0, reported: 0, savedBytes: 0 };
  const errors = [];

  console.log("[optimize-images] starting (incremental, manifest-tracked)...");

  await optimizeSrcAssets(manifest, stats, errors);
  for (const [dirName, cfg] of Object.entries(SEED_DIRS)) {
    await optimizeSeedDir(manifest, dirName, cfg, stats, errors);
  }
  await reportOtherPublicImages(stats);

  await saveManifest(manifest);

  console.log(
    `[optimize-images] done: ${stats.processed} processed, ${stats.skipped} up-to-date, ` +
      `${stats.reported} flagged for manual review, ~${fmtKB(stats.savedBytes)} saved this run` +
      (errors.length ? `, ${errors.length} ERROR(S)` : "")
  );

  if (errors.length) {
    console.error("[optimize-images] FAILED — fix the images above and rebuild:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[optimize-images] fatal:", err);
  process.exit(1);
});
