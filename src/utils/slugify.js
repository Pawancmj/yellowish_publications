// Slug helpers — URL-safe, English + devanagari safe.
const IS_DEVANAGARI = /[\u0900-\u097F]/;

export function slugify(text) {
  const value = String(text || "").normalize("NFKD").trim().toLowerCase();
  let cleaned = "";
  for (const ch of value) {
    if (/[a-z0-9\s-]/.test(ch) || IS_DEVANAGARI.test(ch)) cleaned += ch;
  }
  return cleaned.replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}