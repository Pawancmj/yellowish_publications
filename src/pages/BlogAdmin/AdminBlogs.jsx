// Admin Blog Management — list, search, filter, sort, paginate, CRUD.
// Route: /admin/blogs

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaFeatherAlt,
  FaTable,
} from "react-icons/fa";
import { formatBlogDate, formatViews } from "../../services/blogModel";
import "./AdminBlogs.css";

const PAGE_SIZE = 8;

function Toast({ message, type }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div className={`ab-toast ${isError ? "error" : "success"}`}>
      {isError ? <FaExclamationCircle /> : <FaCheckCircle />}
      <span>{message}</span>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="ab-skeleton-list">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="ab-skeleton-row" key={i}>
          <span className="sk-thumb" />
          <span className="sk-line" />
          <span className="sk-line short" />
          <span className="sk-line tiny" />
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`ab-status ${status === "published" ? "published" : "draft"}`}>{status}</span>;
}

export default function AdminBlogs() {
  const { blogs, blogsLoading, deleteBlogDoc, updateBlogDoc } = useData();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAuthor, setFilterAuthor] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterCategory, filterAuthor, sortOrder]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const categories = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))).sort(),
    [blogs]
  );
  const authors = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.author).filter(Boolean))).sort(),
    [blogs]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = blogs.filter((b) => {
      if (filterStatus !== "all" && b.status !== filterStatus) return false;
      if (filterCategory !== "all" && b.category !== filterCategory) return false;
      if (filterAuthor !== "all" && b.author !== filterAuthor) return false;
      if (q && !(`${b.title} ${b.excerpt} ${b.author} ${b.category}`.toLowerCase().includes(q))) return false;
      return true;
    });
    const key = (b) => (b.publishedAt ? new Date(b.publishedAt).getTime() : b.createdAt ? new Date(b.createdAt).getTime() : 0);
    list = [...list].sort((a, b) => (sortOrder === "oldest" ? key(a) - key(b) : key(b) - key(a)));
    return list;
  }, [blogs, search, filterStatus, filterCategory, filterAuthor, sortOrder]);

  const totalPublished = useMemo(() => blogs.filter((b) => b.status === "published").length, [blogs]);
  const totalDrafts = useMemo(() => blogs.filter((b) => b.status === "draft").length, [blogs]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const showToast = (message, type = "success") => setToast({ message, type });

  const confirmDelete = (blog) => {
    setDeletingBlog(blog);
  };

  const handleDelete = async () => {
    if (!deletingBlog) return;
    setDeleteLoading(true);
    const { error } = await deleteBlogDoc(deletingBlog.id);
    setDeleteLoading(false);
    if (error) {
      showToast("Failed to delete blog.", "error");
    } else {
      showToast("Blog deleted successfully.");
    }
    setDeletingBlog(null);
  };

  const toggleStatus = async (blog, e) => {
    e.stopPropagation();
    const next = blog.status === "published" ? "draft" : "published";
    const label = next === "published" ? "Blog published successfully." : "Blog moved to draft.";
    const { error } = await updateBlogDoc(blog.id, { status: next });
    if (error) showToast("Failed to publish blog.", "error");
    else showToast(label);
  };

  return (
    <div className="admin-blogs-page">
      <Toast message={toast?.message} type={toast?.type} />

      <div className="ab-header">
        <div>
          <h1>Blog Management</h1>
          <p>Create, edit, publish and manage every article on the site.</p>
        </div>
        <Link to="/admin/blogs/new" className="ab-add-btn">
          <FaPlus /> Add New Blog
        </Link>
      </div>

      <div className="ab-stats">
        <div className="ab-stat">
          <FaFeatherAlt />
          <div>
            <h3>{blogs.length}</h3>
            <p>Total Blogs</p>
          </div>
        </div>
        <div className="ab-stat">
          <FaEye />
          <div>
            <h3>{totalPublished}</h3>
            <p>Published</p>
          </div>
        </div>
        <div className="ab-stat">
          <FaEyeSlash />
          <div>
            <h3>{totalDrafts}</h3>
            <p>Drafts</p>
          </div>
        </div>
      </div>

      <div className="ab-filters">
        <div className="ab-search">
          <FaSearch className="ab-search-ico" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} aria-label="Filter by category">
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)} aria-label="Filter by author">
          <option value="all">All Authors</option>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} aria-label="Sort order">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {blogsLoading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <div className="ab-empty">
          <FaTable className="ab-empty-icon" />
          <h3>{blogs.length === 0 ? "No blogs yet" : "No blogs found"}</h3>
          <p>
            {blogs.length === 0
              ? "Start by creating your first blog post."
              : "Try adjusting your search or filters."}
          </p>
          {blogs.length === 0 && (
            <Link to="/admin/blogs/new" className="ab-add-btn">
              <FaPlus /> Create your first blog
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="ab-table-wrap">
            <div className="ab-table">
              <div className="ab-thead">
                <span className="col-thumb">Image</span>
                <span className="col-title">Title</span>
                <span className="col-author">Author</span>
                <span className="col-cat">Category</span>
                <span className="col-date">Published</span>
                <span className="col-status">Status</span>
                <span className="col-views">Views</span>
                <span className="col-actions">Actions</span>
              </div>
              {pageItems.map((blog) => (
                <div className="ab-trow" key={blog.id}>
                  <span className="col-thumb">
                    <img
                      src={blog.featuredImage}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/120x80.png?text=No+Image";
                      }}
                    />
                  </span>
                  <span className="col-title">
                    <strong>{blog.title}</strong>
                    <small className="ab-mobilename">{blog.excerpt || "No excerpt"}</small>
                  </span>
                  <span className="col-author" data-label="Author">
                    {blog.author || "-"}
                  </span>
                  <span className="col-cat" data-label="Category">
                    {blog.category || "-"}
                  </span>
                  <span className="col-date" data-label="Published">
                    {formatBlogDate(blog.publishedAt) || "-"}
                  </span>
                  <span className="col-status" data-label="Status">
                    <StatusBadge status={blog.status} />
                  </span>
                  <span className="col-views" data-label="Views">
                    {formatViews(blog.views)}
                  </span>
                  <span className="col-actions">
                    <Link
                      to={`/admin/blogs/${blog.id}/edit`}
                      className="ab-act edit"
                      title="Edit blog"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      type="button"
                      className={`ab-act ${blog.status === "published" ? "unpublish" : "publish"}`}
                      onClick={(e) => toggleStatus(blog, e)}
                      title={blog.status === "published" ? "Move to draft" : "Publish"}
                    >
                      {blog.status === "published" ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="ab-act view"
                      title="View blog"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaExternalLinkAlt />
                    </Link>
                    <button
                      type="button"
                      className="ab-act delete"
                      onClick={() => confirmDelete(blog)}
                      title="Delete blog"
                    >
                      <FaTrash />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="ab-pagination">
              <button
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {deletingBlog && (
        <div className="ab-modal-overlay">
          <div className="ab-modal">
            <div className="ab-modal-icon">
              <FaTrash />
            </div>
            <h3>Delete this blog?</h3>
            <p>Are you sure you want to delete this blog?</p>
            <strong>{deletingBlog.title}</strong>
            <p className="ab-modal-note">
              This will permanently remove it from the admin panel and the
              public blog — this cannot be undone.
            </p>
            <div className="ab-modal-actions">
              <button
                type="button"
                className="ab-btn-cancel"
                onClick={() => setDeletingBlog(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ab-btn-delete"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}