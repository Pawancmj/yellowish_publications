// Lightweight client-side SEO helper (SPA). Sets the dynamic
// <title> and meta/OG tags for every page.

let priorMeta = [];

function upsertMeta(attr, key, content) {
  const escapedKey = (key || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let el = document.head.querySelector(`meta[${attr}="${escapedKey}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content || "");
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href || "");
}

function removePriorMeta() {
  priorMeta.forEach(([attr, key]) => {
    const el = document.querySelector(`meta[${attr}="${key}"]`);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });
  priorMeta = [];
}

export function updatePageMeta({
  title,
  description,
  image,
  canonical,
  type = "website",
  keywords,
}) {
  if (typeof document === "undefined") return;

  removePriorMeta();

  const siteTitle = "Yellowish Publication";
  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  document.title = finalTitle;

  const canonicalHref = canonical ? canonicalUrl(canonical) : canonicalUrl();

  priorMeta.push(...[
    ["name", "description"],
    ["name", "keywords"],
    ["property", "og:type"],
    ["property", "og:title"],
    ["property", "og:description"],
    ["property", "og:image"],
    ["property", "og:url"],
    ["name", "twitter:card"],
    ["name", "twitter:title"],
    ["name", "twitter:description"],
    ["name", "twitter:image"],
  ]);

  upsertMeta("name", "description", description || "");
  upsertMeta("name", "keywords", keywords || "");
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:title", finalTitle);
  upsertMeta("property", "og:description", description || "");
  upsertMeta("property", "og:image", image || "");
  upsertMeta("property", "og:url", canonicalHref);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", finalTitle);
  upsertMeta("name", "twitter:description", description || "");
  upsertMeta("name", "twitter:image", image || "");
  upsertLink("canonical", canonicalHref);
}

export function resetPageMeta() {
  if (typeof document === "undefined") return;
  document.title = "Yellowish Publication";
  removePriorMeta();
}

export function canonicalUrl(path = "") {
  if (typeof window === "undefined") return path;
  const base = window.location.origin;
  return base + (path || window.location.pathname);
}