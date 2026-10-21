// Inline SVG cover placeholder — avoids external requests to via.placeholder.com
// (often unreachable) and keeps the layout stable when a cover fails to load.
export const NO_COVER_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <rect width="400" height="600" fill="#FFF6E9"/>
      <rect x="12" y="12" width="376" height="576" fill="none" stroke="#F4C95D" stroke-width="2" rx="6"/>
      <text x="200" y="290" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="26" fill="#B07D2B" font-weight="600">No Cover</text>
      <text x="200" y="335" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="18" fill="#C9A66B">Yellowish Publication</text>
    </svg>`
  );

export const NO_PHOTO_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#FFF6E9"/>
      <circle cx="150" cy="118" r="46" fill="#F4C95D" opacity="0.55"/>
      <path d="M60 250c18-44 52-66 90-66s72 22 90 66" fill="#F4C95D" opacity="0.55"/>
      <text x="150" y="286" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="16" fill="#B07D2B">No Photo</text>
    </svg>`
  );

export const NO_ARTICLE_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <rect width="1200" height="675" fill="#FFF6E9"/>
      <rect x="24" y="24" width="1152" height="627" fill="none" stroke="#F4C95D" stroke-width="3" rx="10"/>
      <text x="600" y="330" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="42" fill="#B07D2B" font-weight="600">Article Image</text>
      <text x="600" y="390" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="26" fill="#C9A66B">Yellowish Publication</text>
    </svg>`
  );
