// Slug helpers — URL-safe, English + devanagari safe.
export function slugify(text) {
  return String(text || "")
    .toString()
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}