// src/pages/Admindashboard/Admin.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import {
  AUTHORS_HERO_MAX_IMAGES,
  DEFAULT_AUTHORS_HERO_IMAGES,
} from "../../services/authorsHeroModel";
import { fileToDataUrl } from "../../services/imageToDataUrl";

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
  FaUpload,
} from "react-icons/fa";

import "./Admin.css";

/* ================================================================
   ADMIN DASHBOARD
================================================================ */

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

    // Authors page hero images
    authorsHero,
    authorsHeroLoading,
    updateAuthorsHero,

    // Trusted Authors
    trustedAuthorPosts,
    addTrustedAuthorPost,
    updateTrustedAuthorPost,
    deleteTrustedAuthorPost,
  } = useData();

  const [activeTab, setActiveTab] = useState("books");

  const [showBookForm, setShowBookForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showTrustedAuthorForm, setShowTrustedAuthorForm] =
    useState(false);

  const [editingBook, setEditingBook] = useState(null);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editingTrustedAuthor, setEditingTrustedAuthor] =
    useState(null);

  /* ================================================================
     AUTH
  ================================================================ */

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

  /* ================================================================
     BOOK HANDLERS
  ================================================================ */

  const handleDeleteBook = (id) => {
    if (
      window.confirm("Are you sure you want to delete this book?")
    ) {
      deleteBook(id);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  /* ================================================================
     AUTHOR HANDLERS
  ================================================================ */

  const handleDeleteAuthor = (id) => {
    if (
      window.confirm("Are you sure you want to delete this author?")
    ) {
      deleteAuthor(id);
    }
  };

  const handleEditAuthor = (author) => {
    setEditingAuthor(author);
    setShowAuthorForm(true);
  };

  /* ================================================================
     TRUSTED AUTHOR HANDLERS
  ================================================================ */

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
      console.error(
        "Failed to delete Trusted Author:",
        error
      );

      alert(
        error?.message ||
          "Failed to delete Trusted Author post."
      );
    }
  };

  const openNewTrustedAuthorForm = () => {
    setEditingTrustedAuthor(null);
    setShowTrustedAuthorForm(true);
  };

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <div className="admin-header">

        <h1>Admin Dashboard</h1>

        <div className="admin-user-info">

          <span>
            Welcome, {currentUser.email}
          </span>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
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
              <h3>
                {trustedAuthorPosts?.length || 0}
              </h3>

              <p>Trusted Authors</p>
            </div>
          </div>

        </div>

        {/* ================= TABS ================= */}

        <div className="admin-tabs">

          <button
            className={
              activeTab === "books"
                ? "tab-active"
                : "tab"
            }
            onClick={() => setActiveTab("books")}
          >
            <FaBook /> Manage Books
          </button>

          <button
            className={
              activeTab === "authors"
                ? "tab-active"
                : "tab"
            }
            onClick={() => setActiveTab("authors")}
          >
            <FaUser /> Manage Authors
          </button>

          <button
            className={
              activeTab === "leads"
                ? "tab-active"
                : "tab"
            }
            onClick={() => setActiveTab("leads")}
          >
            <FaEnvelope /> Manage Leads
          </button>

          <button
            className={
              activeTab === "blogs"
                ? "tab-active"
                : "tab"
            }
            onClick={() => setActiveTab("blogs")}
          >
            <FaPen /> Manage Blogs
          </button>

          <button
            className={
              activeTab === "trustedAuthors"
                ? "tab-active"
                : "tab"
            }
            onClick={() =>
              setActiveTab("trustedAuthors")
            }
          >
            <FaInstagram /> Trusted Authors
          </button>

          <button
            className={
              activeTab === "hero"
                ? "tab-active"
                : "tab"
            }
            onClick={() => setActiveTab("hero")}
          >
            <FaHome /> Manage Hero
          </button>

          <button
            className={
              activeTab === "authorsHero"
                ? "tab-active"
                : "tab"
            }
            onClick={() => setActiveTab("authorsHero")}
          >
            <FaImages /> Authors Hero Images
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
                            onClick={() =>
                              handleEditBook(book)
                            }
                            title="Edit book"
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteBook(book.id)
                            }
                            title="Delete book"
                          >
                            <FaTrash />
                          </button>

                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="no-data"
                      >
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

                        <td>
                          {Array.isArray(author.books)
                            ? author.books.join(", ")
                            : author.books || "-"}
                        </td>

                        <td>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEditAuthor(author)
                            }
                            title="Edit author"
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteAuthor(
                                author.id
                              )
                            }
                            title="Delete author"
                          >
                            <FaTrash />
                          </button>

                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="no-data"
                      >
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
                onClick={() =>
                  navigate("/admin/blogs/new")
                }
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

                        <td>
                          {blog.author || "-"}
                        </td>

                        <td>
                          {blog.category || "-"}
                        </td>

                        <td>{blog.status}</td>

                        <td>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              navigate(
                                `/admin/blogs/${blog.id}/edit`
                              )
                            }
                            title="Edit blog"
                          >
                            <FaEdit />
                          </button>

                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="no-data"
                      >
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
                onClick={() =>
                  navigate("/admin/blogs")
                }
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
                            : lead.createdAt
                            ? new Date(
                                lead.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>

                          {lead.type ===
                            "newsletter" && (
                            <span className="badge badge-info">
                              Newsletter
                            </span>
                          )}

                          {lead.type === "contact" && (
                            <span className="badge badge-primary">
                              Contact
                            </span>
                          )}

                          {lead.type ===
                            "author_request" && (
                            <span className="badge badge-success">
                              Author Reqs
                            </span>
                          )}

                        </td>

                        <td>
                          {lead.name || "-"}
                        </td>

                        <td>{lead.email}</td>

                        <td>
                          {lead.phone || "-"}
                        </td>

                        <td
                          style={{
                            maxWidth: "200px",
                          }}
                        >
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
                            title="Delete lead"
                          >
                            <FaTrash />
                          </button>

                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="no-data"
                      >
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
                  Paste a public image URL (e.g. an
                  Unsplash link or your own hosted
                  screenshot). It will appear
                  automatically in the Trusted Authors
                  section on the Home page.
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
                          post.username ||
                          "Trusted author"
                        }
                        className="trusted-admin-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/500x600.png?text=Image+Unavailable";
                        }}
                      />

                    </div>

                    {/* INFO */}

                    <div className="trusted-admin-info">

                      <div className="trusted-admin-user">

                        <strong>
                          {post.username ||
                            "No username"}
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

                      {post.instagramUrl && (
                        <a
                          href={post.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="trusted-instagram-link"
                        >
                          <FaInstagram /> View Instagram
                        </a>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="trusted-admin-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditTrustedAuthor(
                            post
                          )
                        }
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteTrustedAuthor(
                            post
                          )
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

                  <h3>
                    No Trusted Author posts yet
                  </h3>

                  <p>
                    Add your first testimonial image
                    URL to display it on the Home page.
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
                Choose a book for each of the four
                floating positions on the right side of
                the Home page hero. The selected book's
                cover and its detail-page link are used
                automatically — no uploads or IDs
                required. Save to publish.
              </p>

              <HeroManager
                hero={hero}
                heroLoading={heroLoading}
                books={books}
                getBookCover={getBookCover}
                onSave={async (images) => {
                  const result = await updateHero({
                    images,
                  });

                  return result;
                }}
              />

            </div>

          </div>
        )}

        {/* =========================================================
            AUTHORS HERO IMAGES
        ========================================================= */}

        {activeTab === "authorsHero" && (
          <div className="authors-hero-management">

            <div className="section-header">

              <div>

                <h2>Authors Page Hero Images</h2>

                <p>
                  Manage the portraits floating on the
                  right side of the Authors page hero
                  (/authors). Paste an image URL or upload
                  an image — saved straight to Firestore,
                  no Firebase Storage needed. Save to
                  publish.
                </p>

              </div>

            </div>

            <div className="hero-manager-card">

              <AuthorsHeroManager
                authorsHero={authorsHero}
                authorsHeroLoading={authorsHeroLoading}
                onSave={async (images) => {
                  const result = await updateAuthorsHero({
                    images,
                  });

                  return result;
                }}
              />

            </div>

          </div>
        )}

      </div>

      {/* =========================================================
          BOOK FORM
      ========================================================= */}

      {showBookForm && (
        <BookForm
          book={editingBook}

          onSave={(bookData) => {

            if (editingBook) {

              updateBook(
                editingBook.id,
                bookData
              );

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
          AUTHOR FORM
      ========================================================= */}

      {showAuthorForm && (
        <AuthorForm
          author={editingAuthor}

          onSave={(authorData) => {

            if (editingAuthor) {

              updateAuthor(
                editingAuthor.id,
                authorData
              );

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
          TRUSTED AUTHOR FORM
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
   IMPORTANT:
   Uses an image URL (matches DataContext's
   addTrustedAuthorPost / updateTrustedAuthorPost,
   which store imageUrl directly in Firestore —
   no Firebase Storage upload involved).
================================================================ */

const TrustedAuthorForm = ({
  post,
  onSave,
  onCancel,
}) => {

  const [formData, setFormData] = useState({
    imageUrl: post?.imageUrl || "",
    username: post?.username || "",
    likes: post?.likes || "",
    caption: post?.caption || "",
    instagramUrl: post?.instagramUrl || "",
    isActive: post?.isActive !== false,
  });

  const [imageLoadFailed, setImageLoadFailed] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ================================================================
     INPUT CHANGE
  ================================================================ */

  const handleInputChange = (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "imageUrl") {
      setImageLoadFailed(false);
    }

  };

  /* ================================================================
     URL VALIDATION
  ================================================================ */

  const isValidURL = (url) => {

    if (!url || !url.trim()) {
      return false;
    }

    try {

      const parsed = new URL(
        url.trim()
      );

      return (
        parsed.protocol === "http:" ||
        parsed.protocol === "https:"
      );

    } catch {

      return false;

    }
  };

  /* ================================================================
     SUBMIT
  ================================================================ */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (saving) return;

    setError("");

    const trimmedImageUrl =
      formData.imageUrl.trim();

    const trimmedUsername =
      formData.username.trim();

    const trimmedInstagramUrl =
      formData.instagramUrl.trim();

    /* ============================================================
       IMAGE URL VALIDATION
    ============================================================ */

    /*
     * New post:
     * imageUrl is compulsory.
     *
     * Edit post:
     * Existing imageUrl can remain if user
     * doesn't change it — but if the field is
     * cleared entirely, that's still invalid,
     * since Firestore requires a non-empty URL.
     */

    if (!trimmedImageUrl) {

      setError(
        "Please enter a public image URL."
      );

      return;
    }

    if (!isValidURL(trimmedImageUrl)) {

      setError(
        "Please enter a valid image URL."
      );

      return;
    }

    /* ============================================================
       USERNAME
    ============================================================ */

    if (!trimmedUsername) {

      setError(
        "Please enter the username."
      );

      return;
    }

    /* ============================================================
       INSTAGRAM URL
    ============================================================ */

    if (trimmedInstagramUrl) {

      if (
        !isValidURL(
          trimmedInstagramUrl
        )
      ) {

        setError(
          "Please enter a valid Instagram URL."
        );

        return;
      }
    }

    setSaving(true);

    try {

      /*
       * DataContext's addTrustedAuthorPost /
       * updateTrustedAuthorPost store imageUrl
       * directly in Firestore after validating it —
       * no file upload step.
       */

      await onSave({

        imageUrl: trimmedImageUrl,

        username: trimmedUsername,

        likes:
          formData.likes.trim(),

        caption:
          formData.caption.trim(),

        instagramUrl:
          trimmedInstagramUrl,

        isActive:
          formData.isActive,

      });

    } catch (err) {

      console.error(
        "Failed to save Trusted Author:",
        err
      );

      setError(
        err?.message ||
          "Failed to save Trusted Author post."
      );

    } finally {

      setSaving(false);

    }
  };

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <div className="modal-overlay">

      <div className="modal-content trusted-author-modal">

        <h2>
          {post
            ? "Edit Trusted Author"
            : "Add Trusted Author"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* ======================================================
              IMAGE URL
          ====================================================== */}

          <div className="form-group">

            <label>
              Image URL *
            </label>

            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) =>
                handleInputChange(
                  "imageUrl",
                  e.target.value
                )
              }
              placeholder="https://images.unsplash.com/..."
              disabled={saving}
              required
            />

            <small className="help-text">
              Paste a public image URL — e.g. an
              Unsplash link or a screenshot hosted
              elsewhere.
            </small>

          </div>

          {/* ======================================================
              IMAGE PREVIEW
          ====================================================== */}

          {formData.imageUrl.trim() &&
            !imageLoadFailed && (

            <div className="trusted-upload-preview">

              <img
                src={formData.imageUrl.trim()}
                alt="Trusted Author preview"
                onError={() => {
                  setImageLoadFailed(true);
                }}
                onLoad={() => {
                  setImageLoadFailed(false);
                }}
              />

            </div>

          )}

          {formData.imageUrl.trim() &&
            imageLoadFailed && (

            <p className="help-text">
              Couldn't load a preview for this URL —
              double check it's a direct, public
              image link.
            </p>

          )}

          {/* ======================================================
              USERNAME + LIKES
          ====================================================== */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Username *
              </label>

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
                disabled={saving}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Likes
              </label>

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
                disabled={saving}
              />

            </div>

          </div>

          {/* ======================================================
              INSTAGRAM URL
          ====================================================== */}

          <div className="form-group">

            <label>
              Instagram URL
            </label>

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
              disabled={saving}
            />

          </div>

          {/* ======================================================
              CAPTION
          ====================================================== */}

          <div className="form-group">

            <label>
              Caption
            </label>

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
              disabled={saving}
            />

          </div>

          {/* ======================================================
              ACTIVE
          ====================================================== */}

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
              disabled={saving}
            />

            <span>
              Show this post on Home page
            </span>

          </label>

          {/* ======================================================
              ERROR
          ====================================================== */}

          {error && (

            <div className="error-text trusted-form-error">

              <FaExclamationCircle />

              {" "}

              {error}

            </div>

          )}

          {/* ======================================================
              BUTTONS
          ====================================================== */}

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
                  Saving...
                </>

              ) : post ? (

                "Update"

              ) : (

                "Save"

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

const BookForm = ({
  book,
  onSave,
  onCancel,
}) => {

  const [formData, setFormData] = useState({

    title:
      book?.title || "",

    subtitle:
      book?.subtitle || "",

    author:
      book?.author || "",

    genre:
      book?.genre || "Fiction",

    price:
      book?.price || "",

    year:
      book?.year ||
      new Date().getFullYear(),

    cover:
      book?.cover || "",

    description:
      book?.description || "",

  });

  const [errors, setErrors] =
    useState({});

  const isValidURL = (url) => {

    if (!url || url.trim() === "") {
      return true;
    }

    try {

      new URL(url);

      return true;

    } catch {

      try {

        new URL(
          "https://" + url
        );

        return true;

      } catch {

        return false;

      }
    }
  };

  const validateForm = () => {

    const newErrors = {};

    if (!formData.title.trim()) {

      newErrors.title =
        "Title is required";

    }

    if (!formData.author.trim()) {

      newErrors.author =
        "Author is required";

    }

    if (
      !formData.price ||
      parseFloat(formData.price) <= 0
    ) {

      newErrors.price =
        "Valid price is required";

    }

    const currentYear =
      new Date().getFullYear();

    if (
      !formData.year ||
      parseInt(formData.year) < 1000 ||
      parseInt(formData.year) >
        currentYear + 10
    ) {

      newErrors.year =
        `Year must be between 1000 and ${
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

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (validateForm()) {

      onSave({

        ...formData,

        price:
          parseFloat(
            formData.price
          ),

        year:
          parseInt(
            formData.year
          ),

      });

    }
  };

  const handleInputChange = (
    field,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {

      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));

    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <h2>
          {book
            ? "Edit Book"
            : "Add New Book"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label>
                Title *
              </label>

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
                  errors.title
                    ? "input-error"
                    : ""
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

              <label>
                Subtitle
              </label>

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

              <label>
                Author *
              </label>

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
                  errors.author
                    ? "input-error"
                    : ""
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

              <label>
                Genre *
              </label>

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
                  Fiction
                </option>

                <option value="Poetry">
                  Poetry
                </option>

                <option value="History">
                  History
                </option>

                <option value="Self-Help">
                  Self-Help
                </option>

                <option value="Academic">
                  Academic
                </option>

                <option value="Psychology">
                  Psychology
                </option>

                <option value="Science">
                  Science
                </option>

                <option value="Management">
                  Management
                </option>

                <option value="Dharma">
                  Dharma
                </option>

                <option value="Nature">
                  Nature
                </option>

                <option value="Business">
                  Business
                </option>

                <option value="Astronomy">
                  Astronomy
                </option>

                <option value="Mathematics">
                  Mathematics
                </option>

                <option value="Law">
                  Law
                </option>

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

              <label>
                Price (₹) *
              </label>

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
                  errors.price
                    ? "input-error"
                    : ""
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

              <label>
                Year *
              </label>

              <input
                type="number"
                min="1000"
                max={
                  new Date().getFullYear() +
                  10
                }
                value={formData.year}
                onChange={(e) =>
                  handleInputChange(
                    "year",
                    e.target.value
                  )
                }
                className={
                  errors.year
                    ? "input-error"
                    : ""
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

            <label>
              Cover Image URL
            </label>

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
                errors.cover
                  ? "input-error"
                  : ""
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

            <label>
              Description
            </label>

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
              {book
                ? "Update"
                : "Add"}{" "}
              Book
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

const AuthorForm = ({
  author,
  onSave,
  onCancel,
}) => {

  const [formData, setFormData] =
    useState({

      name:
        author?.name || "",

      genre:
        author?.genre || "Fiction",

      photo:
        author?.photo || "",

      bio:
        author?.bio || "",

      books:
        author?.books || [],

    });

  const [errors, setErrors] =
    useState({});

  const isValidURL = (url) => {

    if (!url || url.trim() === "") {
      return true;
    }

    try {

      new URL(url);

      return true;

    } catch {

      try {

        new URL(
          "https://" + url
        );

        return true;

      } catch {

        return false;

      }
    }
  };

  const validateForm = () => {

    const newErrors = {};

    if (!formData.name.trim()) {

      newErrors.name =
        "Name is required";

    }

    if (
      formData.photo &&
      !isValidURL(formData.photo)
    ) {

      newErrors.photo =
        "Please enter a valid URL for the photo";

    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (validateForm()) {

      const normalizedBooks =
        typeof formData.books === "string"
          ? formData.books
              .split(",")
              .map((book) => book.trim())
              .filter(Boolean)
          : formData.books;

      onSave({

        ...formData,

        books:
          normalizedBooks,

      });

    }
  };

  const handleInputChange = (
    field,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {

      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));

    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <h2>
          {author
            ? "Edit Author"
            : "Add New Author"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Name *
            </label>

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
                errors.name
                  ? "input-error"
                  : ""
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

            <label>
              Genre *
            </label>

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

              <option value="Poetry">
                Poet
              </option>

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

              <option value="Law">
                Law
              </option>

              <option value="Mathematics">
                Mathematics
              </option>

              <option value="Fantasy">
                Fantasy Writer
              </option>

            </select>

          </div>

          <div className="form-group">

            <label>
              Photo URL
            </label>

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
                errors.photo
                  ? "input-error"
                  : ""
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

            <label>
              Biography
            </label>

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

            <label>
              Books
            </label>

            <textarea
              value={
                Array.isArray(formData.books)
                  ? formData.books.join(", ")
                  : formData.books
              }
              onChange={(e) =>
                handleInputChange(
                  "books",
                  e.target.value
                )
              }
              rows="4"
              placeholder="Enter the books separated by commas..."
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
              {author
                ? "Update"
                : "Add"}{" "}
              Author
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

  const [slots, setSlots] =
    useState([]);

  const [saving, setSaving] =
    useState(false);

  const [savedMsg, setSavedMsg] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!heroLoading) {

      const heroImages =
        Array.isArray(hero?.images)
          ? hero.images
          : [];

      setSlots(

        HERO_SLOTS.map((slot) => {

          const existing =
            heroImages.find(
              (img) =>
                img.id === slot.id
            );

          return {

            id: slot.id,

            bookId:
              existing?.bookId || "",

          };

        })

      );

    }

  }, [hero, heroLoading]);

  const updateSlotBook = (
    id,
    bookId
  ) => {

    setSlots((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              bookId,
            }
          : s
      )
    );

  };

  const clearSlot = (id) => {

    updateSlotBook(
      id,
      ""
    );

  };

  const handleSave = async (e) => {

    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setSavedMsg("");
    setError("");

    try {

      const result =
        await onSave(slots);

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

      const result =
        await onSave(

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

          const current =
            slots.find(
              (s) =>
                s.id === slot.id
            );

          const bookId =
            current?.bookId || "";

          const selectedBook =
            books.find(
              (b) =>
                String(b.id) ===
                String(bookId)
            ) || null;

          const heroSlot =
            (hero?.images || []).find(
              (img) =>
                img.id === slot.id
            );

          const legacyImage =
            !bookId &&
            heroSlot?.imageUrl
              ? heroSlot.imageUrl
              : "";

          return (

            <div
              className="hero-slot"
              key={slot.id}
            >

              <div className="hero-slot-header">

                <h3>
                  {slot.label}
                </h3>

                <span>
                  {slot.position}
                </span>

              </div>

              <label className="hero-slot-book">

                <span>
                  Select Book
                </span>

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

                  Legacy image present —
                  select a book to make
                  this slot clickable.

                </p>

              )}

              {selectedBook ? (

                <div className="hero-slot-preview">

                  <img
                    src={getBookCover(
                      selectedBook
                    )}
                    alt={
                      selectedBook.title
                    }
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
                      clearSlot(
                        slot.id
                      )
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

          <FaExclamationCircle />

          {" "}

          {error}

        </div>

      )}

      {savedMsg && (

        <div className="hero-manager-msg success">

          <FaCheckCircle />

          {" "}

          {savedMsg}

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

/* ================================================================
   AUTHORS PAGE HERO IMAGE MANAGER
=============================================================== */

const AuthorsHeroManager = ({
  authorsHero,
  authorsHeroLoading,
  onSave,
}) => {

  const [images, setImages] =
    useState([]);

  const [saving, setSaving] =
    useState(false);

  const [savedMsg, setSavedMsg] =
    useState("");

  const [error, setError] =
    useState("");

  const fileRef = useRef(null);

  useEffect(() => {

    if (!authorsHeroLoading) {

      const saved =
        Array.isArray(authorsHero?.images)
          ? authorsHero.images
          : [];

      const urls =
        saved.length > 0
          ? saved
          : DEFAULT_AUTHORS_HERO_IMAGES;

      setImages(
        urls.map((url) => ({
          url,
          broken: false,
        }))
      );

    }

  }, [authorsHero, authorsHeroLoading]);

  const updateImage = (index, url) => {

    setSavedMsg("");

    setImages((prev) =>
      prev.map((img, i) =>
        i === index
          ? {
              url,
              broken: false,
            }
          : img
      )
    );

  };

  const markBroken = (index) => {

    setImages((prev) =>
      prev.map((img, i) =>
        i === index
          ? {
              ...img,
              broken: true,
            }
          : img
      )
    );

  };

  const removeImage = (index) => {

    setSavedMsg("");

    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

  };

  const addImage = (url = "") => {

    setSavedMsg("");

    setImages((prev) =>
      prev.length >= AUTHORS_HERO_MAX_IMAGES
        ? prev
        : [
            ...prev,
            {
              url,
              broken: false,
            },
          ]
    );

  };

  const handleUpload = async (file) => {

    if (!file) return;

    const type =
      (file.type || "").toLowerCase();

    if (!type.startsWith("image/")) {
      setError(
        "Please select a valid image file (JPG, PNG or WebP)."
      );
      return;
    }

    setError("");
    setSavedMsg("");

    try {

      // Base64 data URL stored inline in Firestore — the same
      // approach as blog images, no Firebase Storage needed.
      const dataUrl = await fileToDataUrl(file, {
        maxDimension: 600,
      });

      addImage(dataUrl);

    } catch (err) {
      setError(
        err.message ||
          "Could not process this image."
      );
    } finally {
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }

  };

  const handleSave = async (e) => {

    e.preventDefault();

    if (saving) return;

    setSavedMsg("");
    setError("");

    // Every listed portrait must hold an image URL or an
    // uploaded data URL before it can be published.
    if (
      images.some(
        (img) =>
          !img.url || img.url.trim() === ""
      )
    ) {
      setError(
        "Each portrait needs an image URL or an uploaded image. Remove the empty slots first."
      );
      return;
    }

    setSaving(true);

    try {

      const result =
        await onSave(
          images
            .map((img) => img.url)
            .filter(
              (url) =>
                url &&
                url.trim() !== ""
            )
        );

      if (result?.error) {

        setError(
          result.error.message ||
            "Failed to save the authors hero images."
        );

      } else {

        setSavedMsg(
          "Authors hero images saved successfully."
        );

      }

    } catch (err) {
      setError(
        err?.message ||
          "Failed to save the authors hero images."
      );
    } finally {
      setSaving(false);
    }

  };

  if (authorsHeroLoading) {

    return (
      <div className="hero-manager-loading">
        <FaSpinner className="hero-manager-spin" />
        Loading authors hero images…
      </div>
    );

  }

  const atLimit =
    images.length >= AUTHORS_HERO_MAX_IMAGES;

  return (

    <form
      onSubmit={handleSave}
      className="hero-manager-form"
    >

      <p className="hero-manager-hint">
        Up to {AUTHORS_HERO_MAX_IMAGES} portraits, in
        order, for the floating positions on the right
        side of the Authors page hero (/authors). Paste
        an image URL or upload one, remove any portrait
        you do not want, then Save. If none are left the
        default portraits are used again.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) =>
          handleUpload(
            e.target.files && e.target.files[0]
          )
        }
      />

      <div className="hero-slots">

        {images.map((img, index) => {

          const isDataUrl =
            img.url.startsWith("data:");

          return (

            <div
              className="hero-slot"
              key={`authors-hero-${index}`}
            >

              <div className="hero-slot-header">

                <h3>
                  Portrait {index + 1}
                </h3>

                <span>
                  Position {index + 1} / {AUTHORS_HERO_MAX_IMAGES}
                </span>

              </div>

              <div className="ahero-preview">

                {img.url && !img.broken ? (
                  <img
                    src={img.url}
                    alt={`Portrait ${index + 1}`}
                    onError={() =>
                      markBroken(index)
                    }
                  />
                ) : (
                  <span>
                    {img.broken
                      ? "Image could not be loaded — check the link."
                      : "No image yet"}
                  </span>
                )}

              </div>

              <label className="ahero-url">

                <span>Image URL</span>

                <input
                  type="text"
                  value={
                    isDataUrl ? "" : img.url
                  }
                  placeholder={
                    isDataUrl
                      ? "Uploaded image — paste a URL to replace it"
                      : "https://example.com/author.jpg"
                  }
                  onChange={(e) =>
                    updateImage(
                      index,
                      e.target.value
                    )
                  }
                />

              </label>

              <div className="ahero-card-actions">

                <button
                  type="button"
                  className="hero-slot-clear"
                  onClick={() =>
                    removeImage(index)
                  }
                  disabled={saving}
                >
                  <FaTrash /> Remove
                </button>

              </div>

            </div>

          );

        })}

        {images.length === 0 && (

          <div className="ahero-empty">

            <FaImages />

            <span>
              No portraits configured — the default
              portraits stay in use until you add one.
            </span>

          </div>

        )}

      </div>

      {error && (

        <div className="hero-manager-msg error">
          <FaExclamationCircle />

          {" "}

          {error}
        </div>

      )}

      {savedMsg && (

        <div className="hero-manager-msg success">
          <FaCheckCircle />

          {" "}

          {savedMsg}
        </div>

      )}

      <div className="hero-manager-actions">

        <button
          type="button"
          className="add-btn"
          onClick={() =>
            fileRef.current &&
            fileRef.current.click()
          }
          disabled={saving || atLimit}
        >
          <FaUpload /> Upload Image
        </button>

        <button
          type="button"
          className="add-btn"
          onClick={() => addImage()}
          disabled={saving || atLimit}
        >
          <FaPlus /> Add Image
        </button>

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

      </div>

    </form>

  );
};

export default Admin;