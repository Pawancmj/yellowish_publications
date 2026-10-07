// Testimonials — seed data for the "Loved by Authors Worldwide" section.
//
// On first run these docs are written to Firestore
// (users/shared-app-user/testimonials); after that Firestore is the single
// source of truth and the Admin Panel ("Author Testimonials" tab) manages
// them. The same array doubles as the instant fallback shown while the
// Firestore listener connects.
//
// Images are served from /seed-testimonials/ (copies of the original assets
// placed in public/) so stored URLs stay stable in dev and production.

const PUBLIC_URL = (name) => `/seed-testimonials/${name}`;

export const seedTestimonials = [
  {
    id: "testimonial-1",
    name: "Rahul Deb",
    designation: "Published Author",
    message:
      "Yellowish Publication made my publishing journey smooth and exciting. Their team is simply the best!",
    image: PUBLIC_URL("author5.png"),
    order: 1,
  },
  {
    id: "testimonial-2",
    name: "Dr. Heena Sachdeva",
    designation: "Academic Author",
    message:
      "Thanks to Yellowish Publication, my book reached readers across the globe. Highly recommended!",
    image: PUBLIC_URL("author2.png"),
    order: 2,
  },
  {
    id: "testimonial-3",
    name: "Mukul Dagar",
    designation: "Author & Mentor",
    message:
      "From editing to cover design, every detail was handled with care. Truly a five-star publishing experience.",
    image: PUBLIC_URL("author3.png"),
    order: 3,
  },
  {
    id: "testimonial-4",
    name: "Sarfaraz Khader",
    designation: "Bestselling Author",
    message:
      "They treated my manuscript like their own. Patient, professional, and incredibly supportive throughout.",
    image: PUBLIC_URL("author4.png"),
    order: 4,
  },
];
