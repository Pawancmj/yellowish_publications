// Blog document model + Firestore helpers.
// Documents live in: users/{FIXED_USER_ID}/blogs — the same user-scoped
// path the rest of the app already uses for books/authors/leads.

import { collection, addDoc, doc, updateDoc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export const FIXED_USER_ID = "shared-app-user";
export const BLOG_COLLECTION = `users/${FIXED_USER_ID}/blogs`;

export const blogCollectionRef = () => collection(db, BLOG_COLLECTION);

export const blogDocRef = (id) => doc(db, BLOG_COLLECTION, id);

export const blogListQuery = () => query(blogCollectionRef(), orderBy("createdAt", "desc"));

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  return new Date(value);
}

// Normalize a Firestore document snapshot into the shape used by components.
export function normalizeBlog(raw) {
  if (!raw) return null;
  const data = raw.data ? raw.data() : raw;
  return {
    id: raw.id,
    ...data,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    publishedAt: toDate(data.publishedAt),
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}

// Clean payload shape saved to Firestore (single source of truth).
export function buildBlogPayload(formData) {
  return {
    title: formData.title.trim(),
    slug: formData.slug.trim(),
    excerpt: (formData.excerpt || "").trim(),
    content: formData.content || "",
    featuredImage: formData.featuredImage || "",
    author: (formData.author || "").trim(),
    category: (formData.category || "").trim(),
    tags: Array.isArray(formData.tags) ? formData.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    status: formData.status === "published" ? "published" : "draft",
    publishedAt: formData.publishedAt || null,
    seoTitle: (formData.seoTitle || "").trim(),
    seoDescription: (formData.seoDescription || "").trim(),
    seoKeywords: (formData.seoKeywords || "").trim(),
    readingTime: Number(formData.readingTime) || 0,
    featured: Boolean(formData.featured),
    allowComments: formData.allowComments !== false,
    views: Number(formData.views) || 0,
  };
}

export async function createBlog(payload) {
  return addDoc(blogCollectionRef(), {
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateBlog(id, payload) {
  await updateDoc(blogDocRef(id), {
    ...payload,
    updatedAt: new Date(),
  });
}

export async function deleteBlog(id) {
  await deleteDoc(blogDocRef(id));
}

export function formatBlogDate(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatReadingTime(minutes) {
  const n = Number(minutes) || 0;
  return n > 0 ? `${n} min read` : "";
}

export function formatViews(count) {
  const n = Number(count) || 0;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}