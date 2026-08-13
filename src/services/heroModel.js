// Hero document model + Firestore helpers.
// The Home Page hero right-side visual is driven by a single document:
//   users/{FIXED_USER_ID}/hero/hero
// The same user-scoped path pattern as books/authors/leads/blogs.
//
// The document stores the four hero visual slots as an array:
//   {
//     images: [
//       { id: "hero-1", imageUrl: "...", bookId: "..." },
//       { id: "hero-2", imageUrl: "...", bookId: "..." },
//       { id: "hero-3", imageUrl: "...", bookId: "..." },
//       { id: "hero-4", imageUrl: "...", bookId: "..." }
//     ],
//     updatedAt: ...
//   }
//
// `bookId` is an optional reference into the existing books collection.
// When set, the Home hero cover for that slot becomes clickable and
// navigates to that book's detail page (/book/:id).

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const FIXED_USER_ID = "shared-app-user";
export const HERO_COLLECTION = `users/${FIXED_USER_ID}/hero`;
export const HERO_DOC_ID = "hero";

// Slot ids map 1:1 to the four floating visuals in the Home hero stage.
export const HERO_SLOT_IDS = ["hero-1", "hero-2", "hero-3", "hero-4"];

export const heroDocRef = () => doc(db, HERO_COLLECTION, HERO_DOC_ID);

// Coerce a value into the canonical 4-entry images array.
// Missing entries become empty slots ({ id, imageUrl: "", bookId: "" }).
function normalizeImages(rawImages) {
  const source = Array.isArray(rawImages) ? rawImages : [];
  return HERO_SLOT_IDS.map((id, index) => {
    const entry = source[index];
    return {
      id,
      imageUrl:
        entry && entry.imageUrl && typeof entry.imageUrl === "string"
          ? entry.imageUrl
          : "",
      bookId:
        entry && entry.bookId && typeof entry.bookId === "string"
          ? entry.bookId
          : "",
    };
  });
}

// Normalize a Firestore document snapshot into the shape used by components.
// Backward compatible: a legacy doc that only has a single `imageUrl` field
// yields empty slots, so the Home Hero falls back to the default collage.
export function normalizeHero(raw) {
  if (!raw) return null;
  const data = raw.data ? raw.data() : raw;
  return {
    images: normalizeImages(data.images),
    updatedAt: data.updatedAt || null,
  };
}

// Persist hero content (create or update). data.images is an array of
// { id, imageUrl, bookId } entries where imageUrl is a base64 data URL
// produced by the existing fileToDataUrl() helper, or a pasteable URL.
export async function updateHero(data) {
  const images = normalizeImages(data.images);
  await setDoc(
    heroDocRef(),
    {
      images,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}