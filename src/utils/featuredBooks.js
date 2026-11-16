// Pure helpers for the admin-controlled homepage featured-book selection.
// Kept free of Firebase imports so they can be unit-tested in isolation.

// Coerce a value into the canonical ordered list of unique book IDs.
// Non-string/empty entries are dropped and duplicates keep their first
// position, so a malformed document can never produce duplicate covers.
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

// Resolve configured IDs against the already-loaded books array.
// - preserves the admin-defined order
// - drops IDs that no longer exist (deleted books)
// - never duplicates a book
// - returns [] when nothing is configured (no "show everything" fallback)
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
