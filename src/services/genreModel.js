// Central genre configuration + Firestore helpers.
//
// Storage:
//   users/shared-app-user/hero/genres
//   {
//     items: [
//       {
//         id: "fiction",
//         name: "Fiction",
//         isActive: true,
//         aliases: ["Old Fiction Name"],
//         createdAt: "2026-…",
//         updatedAt: "2026-…"
//       }
//     ],
//     updatedAt: <timestamp>
//   }
//
// The document lives in the existing `hero` collection instead of a new
// top-level collection: the deployed rules already allow public reads and
// authenticated admin writes there (they also store homepageSettings). This
// keeps the homepage filters publicly readable without exposing genre writes.
// It does not change the hero document itself.
//
// Books are never rewritten. A genre keeps `aliases` so renamed genres still
// resolve books whose `genre` string still uses the old name.

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { normalizeGenres } from "../utils/genres";

export {
  ALL_BOOKS_LABEL,
  GENRE_NAME_MAX_LENGTH,
  deriveGenresFromBooks,
  filterBooksByGenre,
  genreKey,
  genreMatchesBook,
  genreSignature,
  getActiveGenres,
  makeGenreId,
  normalizeGenre,
  normalizeGenreName,
  normalizeGenres,
  validateGenreName,
  withRenamedGenre,
} from "../utils/genres";

export const FIXED_USER_ID = "shared-app-user";
export const GENRES_COLLECTION_PATH = `users/${FIXED_USER_ID}/hero`;
export const GENRES_DOC_ID = "genres";

export const genresDocRef = () =>
  doc(db, GENRES_COLLECTION_PATH, GENRES_DOC_ID);

export function normalizeGenresSnapshot(snapshot) {
  if (!snapshot || !snapshot.exists()) return [];

  const data = snapshot.data ? snapshot.data() : snapshot;

  return normalizeGenres(data?.items);
}

// Persist the complete genre list. The admin manager edits a local draft and
// saves it in one write, matching the Featured Books workflow.
export async function saveGenresConfig(genres) {
  const normalized = normalizeGenres(genres);
  const now = new Date().toISOString();

  const items = normalized.map((genre) => ({
    id: genre.id,
    name: genre.name,
    isActive: genre.isActive !== false,
    aliases: genre.aliases,
    createdAt: genre.createdAt || now,
    updatedAt: now,
  }));

  await setDoc(
    genresDocRef(),
    {
      items,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return items;
}
