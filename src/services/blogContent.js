// Blog content helpers.
//
// The public Blog Detail page renders the stored `content` as HTML. Old
// hardcoded posts used a structured "block" array, so we convert those to
// HTML at seed time. Admin-authored content is produced by the rich text
// editor as HTML and normalized here (headings get ids + article classes so
// the existing public CSS and the table-of-contents keep working).

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function headingId(text, index) {
  return `heading-${index + 1}` + (text ? "-" + text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 48) : "");
}

// Legacy block array -> HTML matching the existing article CSS classes.
export function blocksToHtml(blocks) {
  if (!Array.isArray(blocks)) return "";
  let out = "";
  let headingIndex = 0;
  blocks.forEach((block) => {
    if (!block || typeof block !== "object") return;
    switch (block.type) {
      case "p":
        out += `<p>${inlineText(block.text)}</p>`;
        break;
      case "blockquote":
      case "quote":
        out += `<blockquote class="article-quote"><p>${inlineText(block.text)}</p>${block.cite ? `<cite>— ${escapeHtml(block.cite)}</cite>` : ""}</blockquote>`;
        break;
      case "h2":
        headingIndex += 1;
        out += `<h2 class="article-h2" id="${headingId(block.text, headingIndex)}">${inlineText(block.text)}</h2>`;
        break;
      case "h3":
        headingIndex += 1;
        out += `<h3 class="article-h3" id="${headingId(block.text, headingIndex)}">${inlineText(block.text)}</h3>`;
        break;
      case "ul":
        out += `<ul class="article-list">${(block.items || []).map((i) => `<li>${inlineText(i)}</li>`).join("")}</ul>`;
        break;
      case "ol":
        out += `<ol class="article-list ordered">${(block.items || []).map((i) => `<li>${inlineText(i)}</li>`).join("")}</ol>`;
        break;
      case "image":
        out += `<figure class="article-figure"><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || "")}" loading="lazy" />${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}</figure>`;
        break;
      case "table":
        out += `<div class="table-wrap"><table class="article-table"><thead><tr>${(block.headers || []).map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${(block.rows || []).map((row) => `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
        break;
      case "code":
        out += `<pre class="article-code"><code>${escapeHtml(block.code || "")}</code></pre>`;
        break;
      case "highlight":
        out += `<div class="article-highlight">${block.title ? `<strong class="ah-title">${escapeHtml(block.title)}</strong>` : ""}<p>${inlineText(block.text)}</p></div>`;
        break;
      default:
        break;
    }
  });
  return out;
}

function inlineText(text) {
  return String(text || "").split("\n").map((line) => escapeHtml(line)).join("<br/>");
}

/**
 * Normalize editor HTML for storage/display:
 *  - ensure every h2/h3 has a unique id (for the public table of contents)
 *  - apply the public article CSS classes (article-h2/h3, article-list, etc.)
 *  - keep text-align inline styles (rendered by article CSS)
 */
export function normalizeContentHtml(html) {
  if (typeof DOMParser === "undefined") return html || "";
  const doc = new DOMParser().parseFromString(html || "", "text/html");
  const body = doc.body;
  let headingIndex = 0;
  const walkHeadings = (el) => {
    const kids = Array.from(el.children);
    kids.forEach((child) => {
      if (["H1", "H2", "H3"].includes(child.tagName)) {
        headingIndex += 1;
        if (!child.id) child.id = headingId(child.textContent || "", headingIndex);
        child.className = child.tagName === "H2" ? "article-h2" : child.tagName === "H3" ? "article-h3" : "article-h1";
      } else if (child.tagName === "UL") {
        child.className = "article-list";
      } else if (child.tagName === "OL") {
        child.className = "article-list ordered";
      } else if (child.tagName === "BLOCKQUOTE") {
        child.className = "article-quote";
      } else if (child.tagName === "PRE") {
        child.className = "article-code";
      } else if (child.tagName === "FIGURE") {
        child.className = "article-figure";
      } else if (child.tagName === "IMG") {
        child.setAttribute("loading", "lazy");
      } else if (child.children && child.children.length) {
        walkHeadings(child);
      }
    });
  };
  walkHeadings(body);
  return body.innerHTML;
}

export function estimateReadingTime(contentText, wordsPerMinute = 220) {
  const text = String(contentText || "")
    .replace(/<[^>]*>/g, " ")
    .trim();
  if (!text) return 0;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}