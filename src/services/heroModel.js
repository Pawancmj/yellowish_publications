// Legacy Home Hero document model.
//
// The old Manage Hero tab saved four visual slots to:
//   users/{FIXED_USER_ID}/hero/hero
//
// That document is no longer the source of truth. It is read only so existing
// book selections can be migrated into the book documents as:
//   showInHomepageHero: true
//   heroDisplayOrder: 1..4
//
// The document itself is intentionally left untouched — no book records are
// duplicated and no author relationships are changed during migration.

import { doc } from "firebase/firestore";
import { db } from "../firebase";
import { normalizeFeaturedBookIds } from "../utils/featuredBooks";

export const FIXED_USER_ID = "shared-app-user";
export const LEGACY_HERO_COLLECTION = `users/${FIXED_USER_ID}/hero`;
export const LEGACY_HERO_DOC_ID = "hero";

export const legacyHeroDocRef = () =>
  doc(
    db,
    LEGACY_HERO_COLLECTION,
    LEGACY_HERO_DOC_ID
  );

// Extract the selected book IDs from either a Firestore snapshot or a plain
// document value. Slot order is preserved and invalid/duplicate IDs are
// dropped before the IDs are used for homepage fallback or migration.
export function getLegacyHeroBookIds(raw) {
  if (!raw) return [];

  const data =
    typeof raw.data === "function" ? raw.data() : raw;

  const images = Array.isArray(data?.images)
    ? data.images
    : [];

  return normalizeFeaturedBookIds(
    images.map((image) =>
      typeof image?.bookId === "string"
        ? image.bookId
        : ""
    )
  );
}
