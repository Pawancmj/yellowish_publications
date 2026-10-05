// Featured image input for the blog form.
// Thin wrapper around the shared ImageUpload control used across the whole
// Admin Panel:
//   1. Direct upload — the file is downscaled + compressed and stored as a
//      base64 data URL right in the Firestore document (no Firebase Storage,
//      no paid plan needed).
//   2. URL paste — same pattern as book covers / author photos (e.g.
//      /seed-blog/…, Imgur, your own server).
// The BlogForm already renders its own field label, so no label is shown here.

import ImageUpload from "../ImageUpload/ImageUpload";

export default function BlogImageUpload({ value, onChange }) {
  return (
    <ImageUpload
      label=""
      value={value}
      onChange={onChange}
      help="Upload a JPG, JPEG, PNG or WEBP image or paste an image URL."
    />
  );
}
