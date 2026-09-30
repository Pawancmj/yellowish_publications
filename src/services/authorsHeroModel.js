// Authors page hero document model + Firestore helpers.
// The Authors page hero right-side portrait collage is driven by a single
// document:
//   users/{FIXED_USER_ID}/hero/authorsHero
//
// It deliberately lives inside the EXISTING `hero` collection (as a second,
// separate document — the Home hero keeps using users/…/hero/hero untouched)
// because the deployed Firestore security rules already allow public reads
// and admin writes for every document in that collection. Storing it in a new
// collection would require a rules change, which this feature does not need.
//
// The document stores the floating portraits as an ordered array:
//   {
//     images: [
//       "/seed-blog/author1.png",
//       "https://example.com/author.jpg",
//       "data:image/jpeg;base64,…",
//       ""
//     ],
//     updatedAt: ...
//   }
//
// Entries are plain image URL strings — the same URL approach used for book
// covers, author photos and Trusted Authors — or base64 data URLs produced by
// the existing fileToDataUrl() helper. Empty entries are dropped on save and
// the order maps 1:1 onto the four floating positions (spot-1 … spot-4) of
// the Authors hero stage. When nothing is saved, the Authors page keeps
// showing its bundled default portraits.

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const FIXED_USER_ID = "shared-app-user";
export const AUTHORS_HERO_COLLECTION = `users/${FIXED_USER_ID}/hero`;
export const AUTHORS_HERO_DOC_ID = "authorsHero";

// The Authors hero stage has four fixed floating positions (spot-1 … spot-4).
export const AUTHORS_HERO_MAX_IMAGES = 4;

// Defaults shown in the Admin Panel before anything is saved. These are the
// stable /public copies of the bundled author portraits (identical files), so
// a saved configuration never depends on build-hashed asset URLs.
export const DEFAULT_AUTHORS_HERO_IMAGES = [
  "/seed-blog/author1.png",
  "/seed-blog/author2.png",
  "/seed-blog/author3.png",
  "/seed-blog/author4.png",
];

export const authorsHeroDocRef = () =>
  doc(db, AUTHORS_HERO_COLLECTION, AUTHORS_HERO_DOC_ID);

// Coerce a value into the canonical ordered list of non-empty image URLs.
function normalizeImages(rawImages) {
  const source = Array.isArray(rawImages) ? rawImages : [];
  return source
    .filter((entry) => typeof entry === "string" && entry.trim() !== "")
    .map((entry) => entry.trim())
    .slice(0, AUTHORS_HERO_MAX_IMAGES);
}

// Normalize a Firestore document snapshot into the shape used by components.
export function normalizeAuthorsHero(raw) {
  if (!raw) return null;
  const data = raw.data ? raw.data() : raw;
  return {
    images: normalizeImages(data.images),
    updatedAt: data.updatedAt || null,
  };
}

// Persist the Authors hero portraits (create or update). data.images is an
// array of image URL strings / base64 data URLs.
export async function updateAuthorsHero(data) {
  const images = normalizeImages(data.images);
  await setDoc(
    authorsHeroDocRef(),
    {
      images,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}
