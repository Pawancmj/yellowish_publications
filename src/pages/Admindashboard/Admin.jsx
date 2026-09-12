// src/pages/Admindashboard/Admin.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBook,
  FaUser,
  FaEnvelope,
  FaPen,
  FaHome,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaInstagram,
  FaImages,
} from "react-icons/fa";

import "./Admin.css";

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const {
    books,
    authors,
    addBook,
    updateBook,
    deleteBook,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    getBookCover,
    getAuthorPhoto,
    leads,
    deleteLead,
    blogs,
    hero,
    heroLoading,
    updateHero,

    // Trusted Authors
    trustedAuthorPosts,
    addTrustedAuthorPost,
    updateTrustedAuthorPost,
    deleteTrustedAuthorPost,
  } = useData();

  const [activeTab, setActiveTab] = useState("books");

  const [showBookForm, setShowBookForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showTrustedAuthorForm, setShowTrustedAuthorForm] = useState(false);

  const [editingBook, setEditingBook] = useState(null);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editingTrustedAuthor, setEditingTrustedAuthor] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (!currentUser) {
    return <div>Redirecting to login...</div>;
  }

  // =========================
  // BOOK HANDLERS
  // =========================

  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook(id);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  // =========================
  // AUTHOR HANDLERS
  // =========================

  const handleDeleteAuthor = (id) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      deleteAuthor(id);
    }
  };

  const handleEditAuthor = (author) => {
    setEditingAuthor(author);
    setShowAuthorForm(true);
  };

  // =========================
  // TRUSTED AUTHOR HANDLERS
  // =========================

  const handleEditTrustedAuthor = (post) => {
    setEditingTrustedAuthor(post);
    setShowTrustedAuthorForm(true);
  };

  const handleDeleteTrustedAuthor = async (post) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this Trusted Author post?"
      )
    ) {
      return;
    }

    try {
      await deleteTrustedAuthorPost(post);
    } catch (error) {
      console.error("Failed to delete Trusted Author:", error);
      alert(error?.message || "Failed to delete Trusted Author post.");
    }
  };

  const openNewTrustedAuthorForm = () => {
    setEditingTrustedAuthor(null);
    setShowTrustedAuthorForm(true);
  };

  return (
    <div className="admin-dashboard">
      {/* ================= HEADER ================= */}

      <div className="admin-header">
        <h1>Admin Dashboard</h1>

        <div className="admin-user-info">
          <span>Welcome, {currentUser.email}</span>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* ================= STATS ================= */}

        <div className="admin-stats">
          <div className="stat-card">
            <FaBook />

            <div>
              <h3>{books.length}</h3>
              <p>Total Books</p>
            </div>
          </div>

          <div className="stat-card">
            <FaUser />

            <div>
              <h3>{authors.length}</h3>
              <p>Total Authors</p>
            </div>
          </div>

          <div className="stat-card">
            <FaEnvelope />

            <div>
              <h3>{leads ? leads.length : 0}</h3>
              <p>Total Leads</p>
            </div>
          </div>

          <div className="stat-card">
            <FaPen />

            <div>
              <h3>{blogs ? blogs.length : 0}</h3>
              <p>Total Blogs</p>
            </div>
          </div>

          <div className="stat-card">
            <FaInstagram />

            <div>
              <h3>{trustedAuthorPosts?.length || 0}</h3>
              <p>Trusted Authors</p>
            </div>
          </div>
        </div>

        {/* ================= TABS ================= */}

        <div className="admin-tabs">
          <button
            className={activeTab === "books" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("books")}
          >
            <FaBook /> Manage Books
          </button>

          <button
            className={activeTab === "authors" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("authors")}
          >
            <FaUser /> Manage Authors
          </button>

          <button
            className={activeTab === "leads" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("leads")}
          >
            <FaEnvelope /> Manage Leads
          </button>

          <button
            className={activeTab === "blogs" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("blogs")}
          >
            <FaPen /> Manage Blogs
          </button>

          <button
            className={
              activeTab === "trustedAuthors" ? "tab-active" : "tab"
            }
            onClick={() => setActiveTab("trustedAuthors")}
          >
            <FaInstagram /> Trusted Authors
          </button>

          <button
            className={activeTab === "hero" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("hero")}
          >
            <FaHome /> Manage Hero
          </button>
        </div>

        {/* =========================================================
            BOOKS
        ========================================================= */}

        {activeTab === "books" && (
          <div className="books-management">
            <div className="section-header">
              <h2>Books Management</h2>

              <button
                className="add-btn"
                onClick={() => {
                  setEditingBook(null);
                  setShowBookForm(true);
                }}
              >
                <FaPlus /> Add New Book
              </button>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Price</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {books.length > 0 ? (
                    books.map((book) => (
                      <tr key={book.id}>
                        <td>
                          <img
                            src={getBookCover(book)}
                            alt={book.title}
                            className="table-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150x200.png?text=No+Cover";
                            }}
                          />
                        </td>

                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>₹{book.price}</td>
                        <td>{book.year}</td>

                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditBook(book)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No books available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            AUTHORS
        ========================================================= */}

        {activeTab === "authors" && (
          <div className="authors-management">
            <div className="section-header">
              <h2>Authors Management</h2>

              <button
                className="add-btn"
                onClick={() => {
                  setEditingAuthor(null);
                  setShowAuthorForm(true);
                }}
              >
                <FaPlus /> Add New Author
              </button>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Genre</th>
                    <th>Books</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {authors.length > 0 ? (
                    authors.map((author) => (
                      <tr key={author.id}>
                        <td>
                          <img
                            src={getAuthorPhoto(author)}
                            alt={author.name}
                            className="table-photo"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150x150.png?text=No+Photo";
                            }}
                          />
                        </td>

                        <td>{author.name}</td>
                        <td>{author.genre}</td>
                        <td>{author.books}</td>

                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditAuthor(author)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteAuthor(author.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No authors available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            BLOGS
        ========================================================= */}

        {activeTab === "blogs" && (
          <div className="blogs-management">
            <div className="section-header">
              <h2>Blogs Management</h2>

              <button
                className="add-btn"
                onClick={() => navigate("/admin/blogs/new")}
              >
                <FaPlus /> Add New Blog
              </button>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {blogs && blogs.length > 0 ? (
                    blogs.slice(0, 10).map((blog) => (
                      <tr key={blog.id}>
                        <td>{blog.title}</td>
                        <td>{blog.author || "-"}</td>
                        <td>{blog.category || "-"}</td>
                        <td>{blog.status}</td>

                        <td>
                          <button
                            className="edit-btn"
                            onClick={() =>
                              navigate(`/admin/blogs/${blog.id}/edit`)
                            }
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No blogs available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="section-header"
              style={{ marginTop: "1.5rem" }}
            >
              <button
                className="add-btn"
                onClick={() => navigate("/admin/blogs")}
              >
                <FaPen /> Open Full Blog Management
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            LEADS
        ========================================================= */}

        {activeTab === "leads" && (
          <div className="leads-management">
            <div className="section-header">
              <h2>Leads & Contacts</h2>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leads && leads.length > 0 ? (
                    leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          {lead.createdAt?.toDate
                            ? lead.createdAt
                                .toDate()
                                .toLocaleDateString()
                            : new Date(
                                lead.createdAt
                              ).toLocaleDateString()}
                        </td>

                        <td>
                          {lead.type === "newsletter" && (
                            <span className="badge badge-info">
                              Newsletter
                            </span>
                          )}

                          {lead.type === "contact" && (
                            <span className="badge badge-primary">
                              Contact
                            </span>
                          )}

                          {lead.type === "author_request" && (
                            <span className="badge badge-success">
                              Author Reqs
                            </span>
                          )}
                        </td>

                        <td>{lead.name || "-"}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone || "-"}</td>

                        <td style={{ maxWidth: "200px" }}>
                          {lead.message || "-"}
                        </td>

                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this lead?"
                                )
                              ) {
                                deleteLead(lead.id);
                              }
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No leads available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TRUSTED AUTHORS
        ========================================================= */}

        {activeTab === "trustedAuthors" && (
          <div className="trusted-authors-management">
            <div className="section-header">
              <div>
                <h2>Trusted Authors</h2>

                <p>
                  Upload Instagram screenshots/posts that will appear in
                  the Trusted Authors section on the Home page.
                </p>
              </div>

              <button
                className="add-btn"
                onClick={openNewTrustedAuthorForm}
              >
                <FaPlus /> Add Trusted Author
              </button>
            </div>

            <div className="trusted-admin-grid">
              {trustedAuthorPosts &&
              trustedAuthorPosts.length > 0 ? (
                trustedAuthorPosts.map((post) => (
                  <div
                    className="trusted-admin-card"
                    key={post.id}
                  >
                    {/* IMAGE */}

                    <div className="trusted-admin-image-wrapper">
                      <img
                        src={post.imageUrl}
                        alt={
                          post.username
                            ? post.username
                            : "Trusted author"
                        }
                        className="trusted-admin-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/500x600.png?text=Image+Unavailable";
                        }}
                      />
                    </div>

                    {/* INFO */}

                    <div className="trusted-admin-info">
                      <div className="trusted-admin-user">
                        <strong>
                          {post.username || "No username"}
                        </strong>

                        {post.isActive !== false ? (
                          <span className="trusted-status active">
                            Active
                          </span>
                        ) : (
                          <span className="trusted-status hidden">
                            Hidden
                          </span>
                        )}
                      </div>

                      {post.likes && (
                        <span className="trusted-likes">
                          ❤️ {post.likes} likes
                        </span>
                      )}

                      {post.caption && (
                        <p className="trusted-caption">
                          {post.caption}
                        </p>
                      )}
                    </div>

                    {/* ACTIONS */}

                    <div className="trusted-admin-actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditTrustedAuthor(post)
                        }
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteTrustedAuthor(post)
                        }
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="trusted-empty-state">
                  <FaImages />

                  <h3>No Trusted Author posts yet</h3>

                  <p>
                    Upload your first Instagram screenshot to
                    display it on the Home page.
                  </p>

                  <button
                    className="add-btn"
                    onClick={openNewTrustedAuthorForm}
                  >
                    <FaPlus /> Add Trusted Author
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            HERO
        ========================================================= */}

        {activeTab === "hero" && (
          <div className="hero-management">
            <div className="section-header">
              <h2>Hero Section Management</h2>
            </div>

            <div className="hero-manager-card">
              <p className="hero-manager-hint">
                Choose a book for each of the four floating
                positions on the right side of the Home page hero.
                The selected book&apos;s cover and its detail-page
                link are used automatically — no uploads or IDs
                required. Save to publish.
              </p>

              <HeroManager
                hero={hero}
                heroLoading={heroLoading}
                books={books}
                getBookCover={getBookCover}
                onSave={async (images) => {
                  const result = await updateHero({ images });
                  return result;
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          BOOK FORM MODAL
      ========================================================= */}

      {showBookForm && (
        <BookForm
          book={editingBook}
          onSave={(bookData) => {
            if (editingBook) {
              updateBook(editingBook.id, bookData);
            } else {
              addBook(bookData);
            }

            setShowBookForm(false);
            setEditingBook(null);
          }}
          onCancel={() => {
            setShowBookForm(false);
            setEditingBook(null);
          }}
        />
      )}

      {/* =========================================================
          AUTHOR FORM MODAL
      ========================================================= */}

      {showAuthorForm && (
        <AuthorForm
          author={editingAuthor}
          onSave={(authorData) => {
            if (editingAuthor) {
              updateAuthor(editingAuthor.id, authorData);
            } else {
              addAuthor(authorData);
            }

            setShowAuthorForm(false);
            setEditingAuthor(null);
          }}
          onCancel={() => {
            setShowAuthorForm(false);
            setEditingAuthor(null);
          }}
        />
      )}

      {/* =========================================================
          TRUSTED AUTHOR FORM MODAL
      ========================================================= */}

      {showTrustedAuthorForm && (
        <TrustedAuthorForm
          post={editingTrustedAuthor}
          onSave={async (data) => {
            try {
              if (editingTrustedAuthor) {
                await updateTrustedAuthorPost(
                  editingTrustedAuthor.id,
                  data
                );
              } else {
                await addTrustedAuthorPost(data);
              }

              setShowTrustedAuthorForm(false);
              setEditingTrustedAuthor(null);
            } catch (error) {
              console.error(
                "Failed to save Trusted Author:",
                error
              );

              throw error;
            }
          }}
          onCancel={() => {
            setShowTrustedAuthorForm(false);
            setEditingTrustedAuthor(null);
          }}
        />
      )}
    </div>
  );
};

/* ================================================================
   TRUSTED AUTHOR FORM
================================================================ */

const TrustedAuthorForm = ({ post, onSave, onCancel }) => {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(
    post?.imageUrl || ""
  );

  const [formData, setFormData] = useState({
    username: post?.username || "",
    likes: post?.likes || "",
    caption: post?.caption || "",
    instagramUrl: post?.instagramUrl || "",
    isActive: post?.isActive !== false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setError("");
    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post && !file) {
      setError("Please select an Instagram screenshot.");
      return;
    }

    if (formData.instagramUrl.trim()) {
      try {
        new URL(formData.instagramUrl.trim());
      } catch {
        setError(
          "Please enter a valid Instagram URL, for example https://instagram.com/username"
        );
        return;
      }
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        file,
        username: formData.username,
        likes: formData.likes,
        caption: formData.caption,
        instagramUrl: formData.instagramUrl,
        isActive: formData.isActive,
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.message || "Failed to save Trusted Author post."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content trusted-author-modal">
        <h2>
          {post
            ? "Edit Trusted Author"
            : "Add Trusted Author"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* IMAGE */}

          <div className="form-group">
            <label>
              Instagram Screenshot{" "}
              {!post && "*"}
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
            />

            <small className="help-text">
              Upload the Instagram screenshot exactly as you
              want it to appear on the Home page. Maximum size:
              10 MB.
            </small>
          </div>

          {/* PREVIEW */}

          {preview && (
            <div className="trusted-upload-preview">
              <img
                src={preview}
                alt="Trusted Author preview"
              />
            </div>
          )}

          {/* USERNAME + LIKES */}

          <div className="form-row">
            <div className="form-group">
              <label>Username</label>

              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  handleInputChange(
                    "username",
                    e.target.value
                  )
                }
                placeholder="@username"
              />
            </div>

            <div className="form-group">
              <label>Likes</label>

              <input
                type="text"
                value={formData.likes}
                onChange={(e) =>
                  handleInputChange(
                    "likes",
                    e.target.value
                  )
                }
                placeholder="12.6k"
              />
            </div>
          </div>

          {/* INSTAGRAM URL */}

          <div className="form-group">
            <label>Instagram URL</label>

            <input
              type="url"
              value={formData.instagramUrl}
              onChange={(e) =>
                handleInputChange(
                  "instagramUrl",
                  e.target.value
                )
              }
              placeholder="https://instagram.com/username"
            />
          </div>

          {/* CAPTION */}

          <div className="form-group">
            <label>Caption</label>

            <textarea
              value={formData.caption}
              onChange={(e) =>
                handleInputChange(
                  "caption",
                  e.target.value
                )
              }
              rows="4"
              placeholder="Optional caption"
            />
          </div>

          {/* ACTIVE */}

          <label className="trusted-active-checkbox">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                handleInputChange(
                  "isActive",
                  e.target.checked
                )
              }
            />

            <span>
              Show this post on Home page
            </span>
          </label>

          {/* ERROR */}

          {error && (
            <div className="error-text trusted-form-error">
              <FaExclamationCircle /> {error}
            </div>
          )}

          {/* BUTTONS */}

          <div className="form-buttons">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <FaSpinner className="trusted-spinner" />
                  Uploading...
                </>
              ) : post ? (
                "Update"
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ================================================================
   BOOK FORM
================================================================ */

const BookForm = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    subtitle: book?.subtitle || "",
    author: book?.author || "",
    genre: book?.genre || "Fiction",
    price: book?.price || "",
    year: book?.year || new Date().getFullYear(),
    cover: book?.cover || "",
    description: book?.description || "",
  });

  const [errors, setErrors] = useState({});

  const isValidURL = (url) => {
    if (!url || url.trim() === "") return true;

    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w\.-]*)*\/?(\?[a-zA-Z0-9_-]+=[\w%-]+(&[a-zA-Z0-9_-]+=[\w%-]+)*)?$/i;

    if (urlPattern.test(url)) return true;

    try {
      new URL(url);
      return true;
    } catch {
      try {
        new URL("https://" + url);
        return true;
      } catch {
        return false;
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }

    if (
      !formData.price ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }

    const currentYear = new Date().getFullYear();

    if (
      !formData.year ||
      parseInt(formData.year) < 1000 ||
      parseInt(formData.year) > currentYear + 10
    ) {
      newErrors.year = `Year must be between 1000 and ${
        currentYear + 10
      }`;
    }

    if (
      formData.cover &&
      !isValidURL(formData.cover)
    ) {
      newErrors.cover =
        "Please enter a valid URL.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...formData,
        price: parseFloat(formData.price),
        year: parseInt(formData.year),
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {book ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  handleInputChange(
                    "title",
                    e.target.value
                  )
                }
                className={
                  errors.title ? "input-error" : ""
                }
                required
              />

              {errors.title && (
                <span className="error-text">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Subtitle</label>

              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  handleInputChange(
                    "subtitle",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Author *</label>

              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  handleInputChange(
                    "author",
                    e.target.value
                  )
                }
                className={
                  errors.author ? "input-error" : ""
                }
                required
              />

              {errors.author && (
                <span className="error-text">
                  {errors.author}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Genre *</label>

              <select
                value={formData.genre}
                onChange={(e) =>
                  handleInputChange(
                    "genre",
                    e.target.value
                  )
                }
                required
              >
                <option value="Fiction">Fiction</option>
                <option value="Poetry">Poetry</option>
                <option value="History">History</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Academic">Academic</option>
                <option value="Psychology">Psychology</option>
                <option value="Science">Science</option>
                <option value="Management">Management</option>
                <option value="Dharma">Dharma</option>
                <option value="Nature">Nature</option>
                <option value="Business">Business</option>
                <option value="Astronomy">Astronomy</option>
                <option value="Mathematics">
                  Mathematics
                </option>
                <option value="Law">Law</option>
                <option value="Spiritual Growth">
                  Spiritual Growth
                </option>
                <option value="Epic Fantasy">
                  Epic Fantasy
                </option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange(
                    "price",
                    e.target.value
                  )
                }
                className={
                  errors.price ? "input-error" : ""
                }
                required
              />

              {errors.price && (
                <span className="error-text">
                  {errors.price}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Year *</label>

              <input
                type="number"
                min="1000"
                max={new Date().getFullYear() + 10}
                value={formData.year}
                onChange={(e) =>
                  handleInputChange(
                    "year",
                    e.target.value
                  )
                }
                className={
                  errors.year ? "input-error" : ""
                }
                required
              />

              {errors.year && (
                <span className="error-text">
                  {errors.year}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Cover Image URL</label>

            <input
              type="text"
              value={formData.cover}
              onChange={(e) =>
                handleInputChange(
                  "cover",
                  e.target.value
                )
              }
              placeholder="https://example.com/image.jpg"
              className={
                errors.cover ? "input-error" : ""
              }
            />

            {errors.cover && (
              <span className="error-text">
                {errors.cover}
              </span>
            )}

            <small className="help-text">
              Supported formats: image URL
            </small>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={formData.description}
              onChange={(e) =>
                handleInputChange(
                  "description",
                  e.target.value
                )
              }
              rows="4"
              placeholder="Enter book description..."
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              {book ? "Update" : "Add"} Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ================================================================
   AUTHOR FORM
================================================================ */

const AuthorForm = ({ author, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: author?.name || "",
    genre: author?.genre || "Fiction",
    photo: author?.photo || "",
    bio: author?.bio || "",
    books: author?.books || [],
  });

  const [errors, setErrors] = useState({});

  const isValidURL = (url) => {
    if (!url || url.trim() === "") return true;

    try {
      new URL(url);
      return true;
    } catch {
      try {
        new URL("https://" + url);
        return true;
      } catch {
        return false;
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      formData.photo &&
      !isValidURL(formData.photo)
    ) {
      newErrors.photo =
        "Please enter a valid URL for the photo";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {author ? "Edit Author" : "Add New Author"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                handleInputChange(
                  "name",
                  e.target.value
                )
              }
              className={
                errors.name ? "input-error" : ""
              }
              required
            />

            {errors.name && (
              <span className="error-text">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Genre *</label>

            <select
              value={formData.genre}
              onChange={(e) =>
                handleInputChange(
                  "genre",
                  e.target.value
                )
              }
              required
            >
              <option value="Fiction">
                Fiction Writer
              </option>

              <option value="Poetry">Poet</option>

              <option value="History">
                Historian
              </option>

              <option value="Self-Help">
                Self-Help Author
              </option>

              <option value="Academic">
                Academic Writer
              </option>

              <option value="Psychology">
                Psychology
              </option>

              <option value="Science">
                Science Writer
              </option>

              <option value="Management">
                Management
              </option>

              <option value="Dharma">
                Dharma / Spirituality
              </option>

              <option value="Law">Law</option>

              <option value="Mathematics">
                Mathematics
              </option>

              <option value="Fantasy">
                Fantasy Writer
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Photo URL</label>

            <input
              type="text"
              value={formData.photo}
              onChange={(e) =>
                handleInputChange(
                  "photo",
                  e.target.value
                )
              }
              placeholder="https://example.com/photo.jpg"
              className={
                errors.photo ? "input-error" : ""
              }
            />

            {errors.photo && (
              <span className="error-text">
                {errors.photo}
              </span>
            )}

            <small className="help-text">
              Enter a URL for the author's photo
            </small>
          </div>

          <div className="form-group">
            <label>Biography</label>

            <textarea
              value={formData.bio}
              onChange={(e) =>
                handleInputChange(
                  "bio",
                  e.target.value
                )
              }
              rows="4"
              placeholder="Tell us about the author..."
            />
          </div>

          <div className="form-group">
            <label>Books</label>

            <textarea
              value={formData.books}
              onChange={(e) =>
                handleInputChange(
                  "books",
                  e.target.value
                )
              }
              rows="4"
              placeholder="Enter the books..."
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              {author ? "Update" : "Add"} Author
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ================================================================
   HERO MANAGER
================================================================ */

const HERO_SLOTS = [
  {
    id: "hero-1",
    label: "Hero Book 1",
    position: "Left / upper area",
  },
  {
    id: "hero-2",
    label: "Hero Book 2",
    position: "Upper / right area",
  },
  {
    id: "hero-3",
    label: "Hero Book 3",
    position: "Lower / center area",
  },
  {
    id: "hero-4",
    label: "Hero Book 4",
    position: "Right / lower area",
  },
];

const HeroManager = ({
  hero,
  heroLoading,
  books = [],
  getBookCover,
  onSave,
}) => {
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!heroLoading) {
      const heroImages = Array.isArray(hero?.images)
        ? hero.images
        : [];

      setSlots(
        HERO_SLOTS.map((slot) => {
          const existing = heroImages.find(
            (img) => img.id === slot.id
          );

          return {
            id: slot.id,
            bookId: existing?.bookId || "",
          };
        })
      );
    }
  }, [hero, heroLoading]);

  const updateSlotBook = (id, bookId) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, bookId }
          : s
      )
    );
  };

  const clearSlot = (id) => {
    updateSlotBook(id, "");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setSavedMsg("");
    setError("");

    try {
      const result = await onSave(slots);

      if (result?.error) {
        setError(
          result.error.message ||
            "Failed to save the hero books."
        );
      } else {
        setSavedMsg(
          "Hero books saved successfully."
        );
      }
    } catch (err) {
      setError(
        err?.message ||
          "Failed to save the hero books."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Clear all four hero book selections and restore the default covers?"
      )
    ) {
      return;
    }

    if (saving) return;

    setSaving(true);
    setSavedMsg("");
    setError("");

    try {
      const result = await onSave(
        HERO_SLOTS.map((slot) => ({
          id: slot.id,
          bookId: "",
        }))
      );

      if (result?.error) {
        setError(
          result.error.message ||
            "Failed to clear the hero books."
        );
      } else {
        setSavedMsg(
          "Hero books cleared. Default covers restored."
        );
      }
    } catch (err) {
      setError(
        err?.message ||
          "Failed to clear the hero books."
      );
    } finally {
      setSaving(false);
    }
  };

  if (heroLoading) {
    return (
      <div className="hero-manager-loading">
        <FaSpinner className="hero-manager-spin" />
        Loading hero settings…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="hero-manager-form"
    >
      <div className="hero-slots">
        {HERO_SLOTS.map((slot) => {
          const current = slots.find(
            (s) => s.id === slot.id
          );

          const bookId = current?.bookId || "";

          const selectedBook =
            books.find(
              (b) =>
                String(b.id) ===
                String(bookId)
            ) || null;

          const heroSlot = (
            hero?.images || []
          ).find(
            (img) => img.id === slot.id
          );

          const legacyImage =
            !bookId && heroSlot?.imageUrl
              ? heroSlot.imageUrl
              : "";

          return (
            <div
              className="hero-slot"
              key={slot.id}
            >
              <div className="hero-slot-header">
                <h3>{slot.label}</h3>

                <span>{slot.position}</span>
              </div>

              <label className="hero-slot-book">
                <span>Select Book</span>

                <select
                  value={bookId}
                  onChange={(e) =>
                    updateSlotBook(
                      slot.id,
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select a book…
                  </option>

                  {books.map((b) => (
                    <option
                      key={b.id}
                      value={b.id}
                    >
                      {b.title || b.id}
                    </option>
                  ))}
                </select>
              </label>

              {legacyImage && (
                <p className="hero-slot-legacy">
                  Legacy image present — select a
                  book to make this slot clickable.
                </p>
              )}

              {selectedBook ? (
                <div className="hero-slot-preview">
                  <img
                    src={getBookCover(selectedBook)}
                    alt={selectedBook.title}
                    loading="lazy"
                  />

                  <div className="hero-slot-preview-meta">
                    <strong>
                      {selectedBook.title}
                    </strong>

                    <span>
                      By{" "}
                      {selectedBook.author ||
                        selectedBook.authorsName ||
                        "Unknown"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="hero-slot-clear"
                    onClick={() =>
                      clearSlot(slot.id)
                    }
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <p className="hero-slot-empty">
                  No book selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="hero-manager-msg error">
          <FaExclamationCircle /> {error}
        </div>
      )}

      {savedMsg && (
        <div className="hero-manager-msg success">
          <FaCheckCircle /> {savedMsg}
        </div>
      )}

      <div className="hero-manager-actions">
        <button
          type="submit"
          className="save-btn"
          disabled={saving}
        >
          {saving ? (
            <>
              <FaSpinner className="hero-manager-spin" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={handleDelete}
          disabled={saving}
        >
          <FaTrash /> Clear All
        </button>
      </div>
    </form>
  );
};

export default Admin;