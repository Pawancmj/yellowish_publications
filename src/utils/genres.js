// Pure genre helpers shared by the Admin dashboard, DataContext and the Home
// page. Kept free of Firebase imports so the filtering logic stays easy to
// reason about and test.
//
// Books keep their existing `genre` string. Genre configuration stores an
// optional list of `aliases`, which are the previous names of a genre. That
// lets an admin rename a genre without rewriting every book document (and
// without breaking static seed books such as b1): filtering still matches the
// book's existing genre value through the alias list.

export const ALL_BOOKS_LABEL = "All Books";
export const GENRE_NAME_MAX_LENGTH = 60;

export function normalizeGenreName(value) {
  if (typeof value !== "string") return "";

  return value.replace(/\s+/g, " ").trim();
}

export function genreKey(value) {
  return normalizeGenreName(value).toLowerCase();
}

function toTimestampString(value) {
  if (!value) return null;

  if (typeof value === "string") return value;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value.toISOString();
  }

  if (typeof value.toDate === "function") {
    try {
      return value.toDate().toISOString();
    } catch {
      return null;
    }
  }

  return null;
}

export function makeGenreId(name, existingIds = new Set()) {
  const base =
    genreKey(name)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "genre";

  let id = base;
  let suffix = 2;

  while (existingIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  return id;
}

export function normalizeGenre(raw, existingIds = new Set()) {
  const source =
    typeof raw === "string" ? { name: raw } : raw || {};

  const name = normalizeGenreName(source.name);

  if (!name) return null;

  const rawId =
    typeof source.id === "string" ? source.id.trim() : "";

  let id = rawId || makeGenreId(name, existingIds);

  if (existingIds.has(id)) {
    id = makeGenreId(id, existingIds);
  }

  const nameKey = genreKey(name);
  const seenAliases = new Set([nameKey]);
  const aliases = [];

  (Array.isArray(source.aliases) ? source.aliases : []).forEach(
    (alias) => {
      const cleanAlias = normalizeGenreName(alias);
      const aliasKey = genreKey(cleanAlias);

      if (!cleanAlias || seenAliases.has(aliasKey)) return;

      seenAliases.add(aliasKey);
      aliases.push(cleanAlias);
    }
  );

  return {
    id,
    name,
    isActive: source.isActive !== false,
    aliases,
    createdAt: toTimestampString(source.createdAt),
    updatedAt: toTimestampString(source.updatedAt),
  };
}

// Normalize an arbitrary Firestore list into the shape the UI expects.
// Duplicate names (case/whitespace insensitive) and duplicate IDs are dropped.
export function normalizeGenres(rawGenres) {
  const list = Array.isArray(rawGenres) ? rawGenres : [];
  const result = [];
  const seenNames = new Set();
  const seenIds = new Set();

  list.forEach((raw) => {
    const genre = normalizeGenre(raw, seenIds);

    if (!genre) return;

    const nameKey = genreKey(genre.name);

    if (seenNames.has(nameKey)) return;

    seenNames.add(nameKey);
    seenIds.add(genre.id);
    result.push(genre);
  });

  return result;
}

// Used until an admin has saved a genre configuration document. Genres are
// derived from the books that already exist, so the homepage keeps working
// during the upgrade and no genre is hardcoded here.
export function deriveGenresFromBooks(books) {
  const list = Array.isArray(books) ? books : [];
  const result = [];
  const seenNames = new Set();
  const seenIds = new Set();

  list.forEach((book) => {
    const name = normalizeGenreName(book?.genre);
    const nameKey = genreKey(name);

    if (
      !name ||
      nameKey === genreKey(ALL_BOOKS_LABEL) ||
      seenNames.has(nameKey)
    ) {
      return;
    }

    const id = makeGenreId(name, seenIds);

    seenNames.add(nameKey);
    seenIds.add(id);

    result.push({
      id,
      name,
      isActive: true,
      aliases: [],
      createdAt: null,
      updatedAt: null,
    });
  });

  return result.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getActiveGenres(genres) {
  return (Array.isArray(genres) ? genres : []).filter(
    (genre) => genre && genre.isActive !== false
  );
}

export function validateGenreName(
  name,
  genres,
  excludeId = null
) {
  const cleanName = normalizeGenreName(name);

  if (!cleanName) {
    return "Please enter a genre name.";
  }

  if (cleanName.length > GENRE_NAME_MAX_LENGTH) {
    return `Genre name must be ${GENRE_NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (
    genreKey(cleanName) === genreKey(ALL_BOOKS_LABEL)
  ) {
    return `“${ALL_BOOKS_LABEL}” is reserved for the homepage filter.`;
  }

  const targetKey = genreKey(cleanName);
  const genresList = Array.isArray(genres) ? genres : [];

  const nameDuplicate = genresList.find(
    (genre) =>
      String(genre?.id) !== String(excludeId) &&
      genreKey(genre?.name) === targetKey
  );

  if (nameDuplicate) {
    return `A genre named “${nameDuplicate.name}” already exists.`;
  }

  const aliasDuplicate = genresList.find(
    (genre) =>
      String(genre?.id) !== String(excludeId) &&
      (Array.isArray(genre?.aliases)
        ? genre.aliases
        : []
      ).some((alias) => genreKey(alias) === targetKey)
  );

  if (aliasDuplicate) {
    return `“${cleanName}” is kept as a previous name of “${aliasDuplicate.name}” so its books stay linked. Choose another name.`;
  }

  return null;
}

// Rename a genre while remembering its previous name. Existing books that
// still carry the old genre string keep matching this genre.
export function withRenamedGenre(genre, nextName) {
  if (!genre) return genre;

  const name = normalizeGenreName(nextName);
  const oldName = normalizeGenreName(genre.name);
  const nameKey = genreKey(name);
  const aliases = [];

  (Array.isArray(genre.aliases) ? genre.aliases : []).forEach(
    (alias) => {
      const cleanAlias = normalizeGenreName(alias);

      if (!cleanAlias || genreKey(cleanAlias) === nameKey) {
        return;
      }

      aliases.push(cleanAlias);
    }
  );

  if (
    oldName &&
    genreKey(oldName) !== nameKey &&
    !aliases.some(
      (alias) => genreKey(alias) === genreKey(oldName)
    )
  ) {
    aliases.push(oldName);
  }

  return {
    ...genre,
    name,
    aliases,
    updatedAt: new Date().toISOString(),
  };
}

export function genreMatchesBook(genre, book) {
  const bookGenreKey = genreKey(book?.genre);

  if (!bookGenreKey || !genre) return false;

  const candidates = [
    genre.name,
    ...(Array.isArray(genre.aliases) ? genre.aliases : []),
  ];

  return candidates.some(
    (candidate) => genreKey(candidate) === bookGenreKey
  );
}

export function filterBooksByGenre(books, genre) {
  const list = Array.isArray(books) ? books : [];

  if (!genre) return list;

  return list.filter((book) =>
    genreMatchesBook(genre, book)
  );
}

// Stable comparison for the admin "unsaved changes" indicator. Timestamps are
// intentionally ignored; only user-editable fields take part.
export function genreSignature(genres) {
  return JSON.stringify(
    normalizeGenres(genres).map((genre) => ({
      id: genre.id,
      name: normalizeGenreName(genre.name),
      isActive: genre.isActive !== false,
      aliases: genre.aliases.map(normalizeGenreName),
    }))
  );
}
