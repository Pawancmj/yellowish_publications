// Add / Edit Blog form.
// Routes: /admin/blogs/new and /admin/blogs/:id/edit
// Reads `id` from the URL — if present it loads the blog for editing.

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { slugify } from "../../utils/slugify";
import {
  buildBlogPayload,
  formatReadingTime,
} from "../../services/blogModel";
import { estimateReadingTime } from "../../services/blogContent";
import { FaArrowLeft, FaSave, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaMagic, FaSpinner } from "react-icons/fa";

import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";
import BlogImageUpload from "../../components/BlogImageUpload/BlogImageUpload";
import "./BlogForm.css";

const DEFAULT_CATEGORIES = [
  "Publishing",
  "Writing Tips",
  "Author Stories",
  "Marketing",
  "Book Reviews",
  "Interviews",
  "News",
];

function toDateInputValue(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyForm() {
  return {
    title: "",
    slug: "",
    excerpt: "",
    featuredImage: "",
    author: "",
    category: "",
    tags: "",
    status: "draft",
    publishDate: toDateInputValue(new Date()),
    readingTime: 0,
    featured: false,
    allowComments: true,
    content: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  };
}

function fromBlog(blog) {
  return {
    title: blog.title || "",
    slug: blog.slug || "",
    excerpt: blog.excerpt || "",
    featuredImage: blog.featuredImage || "",
    author: blog.author || "",
    category: blog.category || "",
    tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
    status: blog.status === "published" ? "published" : "draft",
    publishDate: toDateInputValue(blog.publishedAt),
    readingTime: Number(blog.readingTime) || 0,
    featured: Boolean(blog.featured),
    allowComments: blog.allowComments !== false,
    content: blog.content || "",
    seoTitle: blog.seoTitle || "",
    seoDescription: blog.seoDescription || "",
    seoKeywords: blog.seoKeywords || "",
  };
}

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { blogs, blogsLoading, createBlogDoc, updateBlogDoc } = useData();

  const [form, setForm] = useState(emptyForm);
  const [initialized, setInitialized] = useState(!isEdit);
  const [slugTouched, setSlugTouched] = useState(false);
  const [readingTouched, setReadingTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadError, setLoadError] = useState("");

  const existing = useMemo(
    () => (isEdit ? blogs.find((b) => b.id === id) || null : null),
    [blogs, id, isEdit]
  );
  const initializedRef = useRef(false);

  // Load the blog data into the form exactly once (live updates never
  // overwrite the admin's in-progress edits).
  useEffect(() => {
    if (isEdit && existing && !initializedRef.current) {
      initializedRef.current = true;
      setForm(fromBlog(existing));
      setInitialized(true);
    }
  }, [isEdit, existing]);

  // Blog could not be found — show a not-found state
  useEffect(() => {
    if (isEdit && !blogsLoading && !existing && blogs.length > 0) {
      setLoadError("Blog not found. It may have been deleted.");
    }
  }, [isEdit, blogsLoading, existing, blogs.length]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleTitleChange = (value) => {
    setField("title", value);
    if (!slugTouched) {
      setField("slug", slugify(value));
    }
  };

  const handleContentChange = (html) => {
    setField("content", html);
    if (!readingTouched) {
      setField("readingTime", estimateReadingTime(html));
    }
    if (errors.content) setErrors((e) => ({ ...e, content: "" }));
  };

  const validate = (requireAll) => {
    const e = {};
    if (!form.title.trim()) e.title = "Blog title is required.";
    if (!form.slug.trim()) e.slug = "Slug is required.";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) {
      e.slug = "Slug can only contain lowercase letters, numbers and hyphens.";
    } else if (
      blogs.some((b) => b.slug === form.slug.trim() && String(b.id) !== String(id))
    ) {
      e.slug = "This slug already exists. Please use a different one.";
    }

    if (requireAll) {
      if (!form.excerpt.trim()) e.excerpt = "Short description / excerpt is required.";
      if (!form.featuredImage) e.featuredImage = "A featured image is required.";
      if (!form.author.trim()) e.author = "Author is required.";
      if (!form.category.trim()) e.category = "Category is required.";
      const textOnly = form.content.replace(/<[^>]*>/g, "").trim();
      if (!textOnly) e.content = "Blog content is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (action) => {
    setLoadError("");
    const requireAll = action === "publish" || action === "update";
    if (!validate(requireAll)) {
      setToast({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }
    if (action === "publish" && form.status !== "published") {
      setField("status", "published");
    }

    setSaving(true);
    try {
      const payload = buildBlogPayload({
        ...form,
        status: action === "publish" ? "published" : form.status,
        readingTime: Number(form.readingTime) || estimateReadingTime(form.content),
        publishedAt:
          form.status === "published" || action === "publish"
            ? form.publishDate
              ? new Date(`${form.publishDate}T12:00:00`)
              : new Date()
            : null,
      });

      if (isEdit) {
        const { error } = await updateBlogDoc(id, payload);
        if (error) throw error;
        setToast({ type: "success", message: "Blog updated successfully." });
      } else {
        const { error } = await createBlogDoc(payload);
        if (error) throw error;
        setToast({ type: "success", message: "Blog created successfully." });
      }

      setTimeout(() => navigate("/admin/blogs"), 900);
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: `Failed to save blog: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    blogs.forEach((b) => b.category && set.add(b.category));
    return Array.from(set);
  }, [blogs]);

  const authorOptions = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => b.author && set.add(b.author));
    return Array.from(set);
  }, [blogs]);

  const autoSlug = () => {
    setField("slug", slugify(form.title));
    setSlugTouched(false);
    setErrors((e) => ({ ...e, slug: "" }));
  };

  if (isEdit && !initialized) {
    return (
      <div className="bf-page">
        <div className="bf-loading"><FaSpinner className="bf-spin" /> Loading blog...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bf-page">
        <div className="bf-notfound">
          <h1>Blog Not Found</h1>
          <p>{loadError}</p>
          <Link to="/admin/blogs" className="bf-back-btn">
            <FaArrowLeft /> Back to Blog Management
          </Link>
        </div>
      </div>
    );
  }

  const fieldClass = (name) => (errors[name] ? "bf-input error" : "bf-input");

  return (
    <div className="bf-page">
      {toast && (
        <div className={`bf-toast ${toast.type === "error" ? "error" : "success"}`}>
          {toast.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="bf-header">
        <Link to="/admin/blogs" className="bf-back">
          <FaArrowLeft /> Blogs
        </Link>
        <h1>{isEdit ? "Edit Blog" : "Add New Blog"}</h1>
        <p>
          {isEdit
            ? "Update the blog details below."
            : "Fill in the details to create a new blog post."}
        </p>
      </div>

      <div className="bf-grid">
        {/* ------------------- LEFT: main fields ------------------- */}
        <div className="bf-main">
          <section className="bf-card">
            <h2>Basic Information</h2>

            <div className="bf-field">
              <label>Blog Title *</label>
              <input
                type="text"
                className={fieldClass("title")}
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="How Yellowish Publication Helps New Authors"
              />
              {errors.title && <span className="bf-error">{errors.title}</span>}
            </div>

            <div className="bf-field">
              <label>Slug *</label>
              <div className="bf-slug-row">
                <input
                  type="text"
                  className={fieldClass("slug")}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setField("slug", e.target.value);
                    if (errors.slug) setErrors((er) => ({ ...er, slug: "" }));
                  }}
                  placeholder="how-yellowish-publication-helps-new-authors"
                />
                <button type="button" className="bf-ghost" onClick={autoSlug} title="Generate slug from title">
                  <FaMagic />
                </button>
              </div>
              {errors.slug ? (
                <span className="bf-error">{errors.slug}</span>
              ) : (
                <small className="bf-hint">Auto-generated from the title. Make it unique.</small>
              )}
            </div>

            <div className="bf-field">
              <label>Short Description / Excerpt *</label>
              <textarea
                className={fieldClass("excerpt")}
                rows="3"
                value={form.excerpt}
                onChange={(e) => {
                  setField("excerpt", e.target.value);
                  if (errors.excerpt) setErrors((er) => ({ ...er, excerpt: "" }));
                }}
                placeholder="A short summary shown on the blog cards..."
              />
              {errors.excerpt && <span className="bf-error">{errors.excerpt}</span>}
            </div>

            <div className="bf-field">
              <label>Featured Image *</label>
              <BlogImageUpload
                value={form.featuredImage}
                onChange={(url) => {
                  setField("featuredImage", url);
                  if (errors.featuredImage) setErrors((er) => ({ ...er, featuredImage: "" }));
                }}
              />
              {errors.featuredImage && <span className="bf-error">{errors.featuredImage}</span>}
            </div>

            <div className="bf-row">
              <div className="bf-field">
                <label>Author *</label>
                <input
                  type="text"
                  list="bf-authors"
                  className={fieldClass("author")}
                  value={form.author}
                  onChange={(e) => {
                    setField("author", e.target.value);
                    if (errors.author) setErrors((er) => ({ ...er, author: "" }));
                  }}
                  placeholder="Author name"
                />
                <datalist id="bf-authors">
                  {authorOptions.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
                {errors.author && <span className="bf-error">{errors.author}</span>}
              </div>

              <div className="bf-field">
                <label>Category *</label>
                <input
                  type="text"
                  list="bf-categories"
                  className={fieldClass("category")}
                  value={form.category}
                  onChange={(e) => {
                    setField("category", e.target.value);
                    if (errors.category) setErrors((er) => ({ ...er, category: "" }));
                  }}
                  placeholder="e.g. Publishing"
                />
                <datalist id="bf-categories">
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.category && <span className="bf-error">{errors.category}</span>}
              </div>
            </div>

            <div className="bf-row">
              <div className="bf-field">
                <label>Tags</label>
                <input
                  type="text"
                  className="bf-input"
                  value={form.tags}
                  onChange={(e) => setField("tags", e.target.value)}
                  placeholder="writing, publishing, tips (comma separated)"
                />
              </div>

              <div className="bf-field">
                <label>Publish Date</label>
                <input
                  type="date"
                  className="bf-input"
                  value={form.publishDate}
                  onChange={(e) => setField("publishDate", e.target.value)}
                />
              </div>
            </div>

            <div className="bf-row">
              <div className="bf-field">
                <label>Status</label>
                <div className="bf-status-select">
                  <button
                    type="button"
                    className={`bf-status-opt ${form.status === "draft" ? "active draft" : ""}`}
                    onClick={() => setField("status", "draft")}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    className={`bf-status-opt ${form.status === "published" ? "active published" : ""}`}
                    onClick={() => setField("status", "published")}
                  >
                    Published
                  </button>
                </div>
              </div>

              <div className="bf-field">
                <label>
                  Reading Time <span className="bf-opt">(optional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="bf-input"
                  value={form.readingTime || ""}
                  placeholder="Auto"
                  onChange={(e) => {
                    setReadingTouched(true);
                    setField("readingTime", e.target.value);
                  }}
                />
                <small className="bf-hint">Auto-estimated from content; shows as "{formatReadingTime(4)}".</small>
              </div>
            </div>

            <div className="bf-toggles">
              <label className="bf-toggle">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                />
                <span className="bf-toggle-track" />
                <span>Featured Blog</span>
              </label>
              <label className="bf-toggle">
                <input
                  type="checkbox"
                  checked={form.allowComments}
                  onChange={(e) => setField("allowComments", e.target.checked)}
                />
                <span className="bf-toggle-track" />
                <span>Allow Comments</span>
              </label>
            </div>
          </section>

          <section className="bf-card">
            <h2>Content</h2>
            <div className="bf-field">
              <label>Blog Content *</label>
              <RichTextEditor value={form.content} onChange={handleContentChange} />
              {errors.content && <span className="bf-error">{errors.content}</span>}
            </div>
          </section>

          <section className="bf-card">
            <h2>SEO</h2>
            <div className="bf-field">
              <label>SEO Title</label>
              <input
                type="text"
                className="bf-input"
                value={form.seoTitle}
                onChange={(e) => setField("seoTitle", e.target.value)}
                placeholder={form.title || "Defaults to blog title"}
              />
            </div>
            <div className="bf-field">
              <label>SEO Description</label>
              <textarea
                className="bf-input"
                rows="3"
                value={form.seoDescription}
                onChange={(e) => setField("seoDescription", e.target.value)}
                placeholder={form.excerpt || "Defaults to blog excerpt"}
              />
            </div>
            <div className="bf-field">
              <label>SEO Keywords</label>
              <input
                type="text"
                className="bf-input"
                value={form.seoKeywords}
                onChange={(e) => setField("seoKeywords", e.target.value)}
                placeholder="writing, publishing, yellow publication"
              />
            </div>
          </section>
        </div>

        {/* ------------------- RIGHT: save panel ------------------- */}
        <aside className="bf-side">
          <div className="bf-card bf-publish">
            <h2>Publish</h2>
            <p className="bf-side-note">
              Drafts stay hidden from the public blog. Only published blogs
              appear on <code>/blog</code>.
            </p>
            <button
              type="button"
              className="bf-btn publish"
              disabled={saving}
              onClick={() => save(isEdit ? "update" : "publish")}
            >
              {saving ? <FaSpinner className="bf-spin" /> : <FaPaperPlane />}
              {isEdit ? "Update & Publish" : "Publish Blog"}
            </button>
            <button
              type="button"
              className="bf-btn draft"
              disabled={saving}
              onClick={() => save("draft")}
            >
              <FaSave />
              Save as Draft
            </button>
            <div className="bf-side-hints">
              <p>
                <strong>Required:</strong> Title, Slug, Excerpt, Image, Author,
                Category &amp; Content.
              </p>
              <p>Publishing is blocked until required fields are valid.</p>
            </div>
          </div>

          <div className="bf-card bf-preview">
            <h2>Live Preview</h2>
            <div className="bf-preview-card">
              {form.featuredImage && (
                <img
                  src={form.featuredImage}
                  alt=""
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <span className="bf-prev-cat">{form.category || "Category"}</span>
              <h3>{form.title || "Your blog title"}</h3>
              <p>{form.excerpt || "Your short description will appear here."}</p>
              <div className="bf-prev-meta">
                <span>{form.author || "Author"}</span>
                <span>{form.publishDate || "Date"}</span>
                <span>{formatReadingTime(form.readingTime) || "Reading time"}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}