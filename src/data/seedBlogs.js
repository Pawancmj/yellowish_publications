// Seed blogs — converts the (previously hardcoded) blog posts into
// Firestore-ready documents on first run. After seeding, the database is the
// single source of truth; no React component imports these posts.
//
// Images are served from /seed-blog/ (copies of the original assets placed in
// public/) so stored URLs are stable in dev and production.

import { blogPosts } from "./blogPosts";
import { blocksToHtml } from "../services/blogContent";

import AboutImg from "../assets/About.png";
import StoryImg from "../assets/Story.png";
import heroImg from "../assets/hero.png";
import book1 from "../assets/book1.png";
import book2 from "../assets/book2.png";
import book4 from "../assets/book4.png";
import book5 from "../assets/book5.png";
import book6 from "../assets/book6.png";
import book9 from "../assets/book9.png";
import book16 from "../assets/book16.png";
import author1 from "../assets/author1.png";
import author2 from "../assets/author2.png";
import author3 from "../assets/author3.png";
import author4 from "../assets/author4.png";
import author5 from "../assets/author5.png";

const PUBLIC_URL = (name) => `/seed-blog/${name}`;

const assetMap = {
  [AboutImg]: PUBLIC_URL("about.png"),
  [StoryImg]: PUBLIC_URL("story.png"),
  [heroImg]: PUBLIC_URL("hero.png"),
  [book1]: PUBLIC_URL("book1.png"),
  [book2]: PUBLIC_URL("book2.png"),
  [book4]: PUBLIC_URL("book4.png"),
  [book5]: PUBLIC_URL("book5.png"),
  [book6]: PUBLIC_URL("book6.png"),
  [book9]: PUBLIC_URL("book9.png"),
  [book16]: PUBLIC_URL("book16.png"),
  [author1]: PUBLIC_URL("author1.png"),
  [author2]: PUBLIC_URL("author2.png"),
  [author3]: PUBLIC_URL("author3.png"),
  [author4]: PUBLIC_URL("author4.png"),
  [author5]: PUBLIC_URL("author5.png"),
};

function toPublicUrl(asset) {
  return (
    assetMap[asset] ||
    (typeof asset === "string" ? asset : PUBLIC_URL("about.png"))
  );
}

function parseDate(dateString) {
  const d = new Date(`${dateString}, 2026 12:00:00`);
  return isNaN(d.getTime()) ? new Date() : d;
}

function readingMinutes(post) {
  const match = String(post.readingTime || "").match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

export function buildSeedBlogs() {
  return blogPosts.map((post) => {
    const publishedAt = parseDate(post.date);
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: blocksToHtml(post.content),
      featuredImage: toPublicUrl(post.image),
      author: post.author,
      authorRole: post.role || "",
      authorBio: post.authorBio || "",
      authorBooks: post.authorBooks || "",
      authorSocial: post.authorSocial || { twitter: "#", linkedin: "#", facebook: "#" },
      avatar: toPublicUrl(post.avatar),
      category: post.category,
      tags: [],
      status: "published",
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
      seoTitle: post.title,
      seoDescription: post.excerpt,
      seoKeywords: "",
      readingTime: readingMinutes(post),
      featured: Boolean(post.featured),
      allowComments: true,
      views: 0,
    };
  });
}