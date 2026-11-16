// Homepage settings document model + Firestore helpers.
// The Home page hero book showcase is driven by a single configuration
// document:
//   users/{FIXED_USER_ID}/hero/homepageSettings
//
// The document deliberately lives inside the EXISTING `hero` collection —
// the same collection already used by hero/hero and hero/authorsHero — because
// the deployed Firestore rules allow public reads and authenticated admin
// writes for that collection. The repository's catch-all rule would also cover
// users/…/settings/homepage, but the deployed rules currently deny reads on
// the settings collection, so storing it there would break the public hero.
//
// Only book IDs are stored here; the book records themselves stay untouched in
// users/{FIXED_USER_ID}/books.
//
// Document shape:
//   {
//     featuredBookIds: ["bookId1", "bookId2", "bookId3"],
//     updatedAt: <timestamp>
//   }
//
// The array order is the display order on the homepage. Missing/deleted
// book IDs are ignored when resolving the list instead of breaking the hero.

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  normalizeFeaturedBookIds,
  resolveFeaturedBooks,
} from "../utils/featuredBooks";

export {
  normalizeFeaturedBookIds,
  resolveFeaturedBooks,
};

export const FIXED_USER_ID = "shared-app-user";
export const HOMEPAGE_SETTINGS_COLLECTION = `users/${FIXED_USER_ID}/hero`;
export const HOMEPAGE_SETTINGS_DOC_ID = "homepageSettings";

export const homepageSettingsDocRef = () =>
  doc(
    db,
    HOMEPAGE_SETTINGS_COLLECTION,
    HOMEPAGE_SETTINGS_DOC_ID
  );

// Normalize a Firestore document snapshot into the shape used by components.
export function normalizeHomepageSettings(raw) {
  if (!raw) return null;

  const data = raw.data ? raw.data() : raw;

  return {
    featuredBookIds: normalizeFeaturedBookIds(
      data.featuredBookIds
    ),
    updatedAt: data.updatedAt || null,
  };
}

// Persist the homepage featured-book selection (create or update).
export async function updateHomepageSettings(data = {}) {
  await setDoc(
    homepageSettingsDocRef(),
    {
      featuredBookIds: normalizeFeaturedBookIds(
        data.featuredBookIds
      ),
      updatedAt: new Date(),
    },
    { merge: true }
  );
}
