// Pure helpers for the homepage hero book showcase.
//
// The single source of truth is the book document itself:
//   showInHomepageHero: true|false
//   heroDisplayOrder:   positive integer
//
// The legacy `users/shared-app-user/hero/hero` document is read only as a
// one-time migration source. `resolveFeaturedBooks` is therefore limited to
// legacy IDs; it must never be used as a second, independent selection system
// after a book has been given an explicit showInHomepageHero field.

// Coerce a value into the canonical ordered list of unique book IDs.
// Non-string/empty entries are dropped and duplicates keep their first
// position, so a malformed selection can never produce duplicate covers.
export function normalizeFeaturedBookIds(rawIds) {
  const source = Array.isArray(rawIds) ? rawIds : [];
  const seen = new Set();
  const ids = [];

  source.forEach((rawId) => {
    if (
      typeof rawId !== "string" &&
      typeof rawId !== "number"
    ) {
      return;
    }

    const id = String(rawId).trim();

    if (!id || seen.has(id)) return;

    seen.add(id);
    ids.push(id);
  });

  return ids;
}

// True once at least one book has an explicit hero visibility value. This is
// what switches the homepage off the legacy fallback and onto book fields.
export function hasHeroSelectionFields(books) {
  return (Array.isArray(books) ? books : []).some(
    (book) =>
      book &&
      typeof book === "object" &&
      Object.prototype.hasOwnProperty.call(
        book,
        "showInHomepageHero"
      )
  );
}

// Normalize the admin's simple order field. Missing/invalid values sort last
// so a malformed document can never break the configured sequence.
export function normalizeHeroDisplayOrder(
  rawOrder,
  fallback = Number.MAX_SAFE_INTEGER
) {
  const numeric =
    typeof rawOrder === "number"
      ? rawOrder
      : Number(rawOrder);

  if (!Number.isFinite(numeric)) return fallback;

  const rounded = Math.round(numeric);

  return rounded > 0 ? rounded : fallback;
}

// Resolve explicitly selected books in stable admin-defined order.
// Deleted/missing books are ignored and duplicate IDs keep their first slot.
export function resolveHeroBooksFromFields(books) {
  const seenIds = new Set();

  return (Array.isArray(books) ? books : [])
    .filter((book) => {
      if (
        !book ||
        book.showInHomepageHero !== true ||
        book.id === undefined ||
        book.id === null
      ) {
        return false;
      }

      const id = String(book.id);

      if (seenIds.has(id)) return false;

      seenIds.add(id);

      return true;
    })
    .sort((a, b) => {
      const orderDifference =
        normalizeHeroDisplayOrder(a.heroDisplayOrder) -
        normalizeHeroDisplayOrder(b.heroDisplayOrder);

      if (orderDifference !== 0) return orderDifference;

      const titleDifference = String(
        a.title || ""
      ).localeCompare(String(b.title || ""));

      if (titleDifference !== 0) return titleDifference;

      return String(a.id).localeCompare(String(b.id));
    });
}

// Resolve legacy IDs against the already-loaded books array.
// This is used only while no book has an explicit hero selection field.
export function resolveFeaturedBooks(
  books,
  featuredBookIds
) {
  const ids = normalizeFeaturedBookIds(featuredBookIds);

  if (
    ids.length === 0 ||
    !Array.isArray(books) ||
    books.length === 0
  ) {
    return [];
  }

  const booksById = new Map();

  books.forEach((book) => {
    if (
      !book ||
      book.id === undefined ||
      book.id === null
    ) {
      return;
    }

    booksById.set(String(book.id), book);
  });

  return ids
    .map((id) => booksById.get(id))
    .filter(Boolean);
}

// Public homepage resolver:
// - once book fields exist, only those books are shown, in their order
// - before migration, legacy selections are honored so nothing is discarded
// - an empty/new catalog never falls back to "show all books"
export function resolveHomepageHeroBooks(
  books,
  legacyBookIds
) {
  const list = Array.isArray(books) ? books : [];

  if (hasHeroSelectionFields(list)) {
    return resolveHeroBooksFromFields(list);
  }

  return resolveFeaturedBooks(list, legacyBookIds);
}
