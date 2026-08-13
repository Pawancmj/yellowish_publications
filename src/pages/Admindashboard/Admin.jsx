// src/pages/Admindashboard/Admin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { FaEdit, FaTrash, FaPlus, FaBook, FaUser, FaEnvelope, FaFeatherAlt, FaHome, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./Admin.css";
import BlogImageUpload from "../../components/BlogImageUpload/BlogImageUpload";

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
  } = useData();

  const [activeTab, setActiveTab] = useState("books");
  const [showBookForm, setShowBookForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editingAuthor, setEditingAuthor] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/adminform");
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

  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook(id);
    }
  };

  const handleDeleteAuthor = (id) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      deleteAuthor(id);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleEditAuthor = (author) => {
    setEditingAuthor(author);
    setShowAuthorForm(true);
  };

  return (
    <div className="admin-dashboard">
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
            <FaFeatherAlt />
            <div>
              <h3>{blogs ? blogs.length : 0}</h3>
              <p>Total Blogs</p>
            </div>
          </div>
        </div>

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
            <FaFeatherAlt /> Manage Blogs
          </button>
          <button
            className={activeTab === "hero" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("hero")}
          >
            <FaHome /> Manage Hero
          </button>
        </div>

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
                              e.target.src = "https://via.placeholder.com/150x200.png?text=No+Cover";
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
                    {/* <th>quote</th> */}
                
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
                              e.target.src = "https://via.placeholder.com/150x150.png?text=No+Photo";
                            }}
                          />
                        </td>
                        <td>{author.name}</td>
                        <td>{author.genre}</td>
                        <td>{author.books}</td>
                        {/* <td>{author.books?.length || 0}</td> */}
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
                            onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
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

            <div className="section-header" style={{ marginTop: "1.5rem" }}>
              <button
                className="add-btn"
                onClick={() => navigate("/admin/blogs")}
              >
                <FaFeatherAlt /> Open Full Blog Management
              </button>
            </div>
          </div>
        )}

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
                        <td>{lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : new Date(lead.createdAt).toLocaleDateString()}</td>
                        <td>
                          {lead.type === 'newsletter' && <span className="badge badge-info">Newsletter</span>}
                          {lead.type === 'contact' && <span className="badge badge-primary">Contact</span>}
                          {lead.type === 'author_request' && <span className="badge badge-success">Author Reqs</span>}
                        </td>
                        <td>{lead.name || "-"}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone || "-"}</td>
                        <td style={{ maxWidth: "200px" }}>{lead.message || "-"}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this lead?")) {
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

        {activeTab === "hero" && (
          <div className="hero-management">
            <div className="section-header">
              <h2>Hero Section Management</h2>
            </div>

            <div className="hero-manager-card">
              <p className="hero-manager-hint">
                Manage the four images of the floating composition on the right
                side of the Home page hero. Upload up to four images — any slot
                left empty keeps its default book cover. Once saved, the Home
                page updates automatically.
              </p>

              <HeroManager
                hero={hero}
                heroLoading={heroLoading}
                onSave={async (images) => {
                  const result = await updateHero({ images });
                  return result;
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Book Form Modal */}
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

      {/* Author Form Modal */}
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
    </div>
  );
};

// Book Form Component with Fixed URL Validation
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

  // Custom URL validation function
  const isValidURL = (url) => {
    if (!url || url.trim() === "") return true; // Empty URL is allowed

    // More flexible URL pattern
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?(\?[a-zA-Z0-9_-]+=[\w%-]+(&[a-zA-Z0-9_-]+=[\w%-]+)*)?$/i;

    // Try basic pattern first
    if (urlPattern.test(url)) return true;

    // Also accept if it starts with http/https and looks like a URL
    try {
      new URL(url);
      return true;
    } catch {
      // If URL constructor fails, check if adding protocol helps
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

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Author validation
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }

    // Price validation
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    // Year validation
    const currentYear = new Date().getFullYear();
    if (
      !formData.year ||
      parseInt(formData.year) < 1000 ||
      parseInt(formData.year) > currentYear + 10
    ) {
      newErrors.year = `Year must be between 1000 and ${currentYear + 10}`;
    }

    // Cover URL validation
    if (formData.cover && !isValidURL(formData.cover)) {
      newErrors.cover =
        "Please enter a valid URL (e.g., https://example.com/image.jpg)";
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
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{book ? "Edit Book" : "Add New Book"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "input-error" : ""}
                required
              />
              {errors.title && (
                <span className="error-text">{errors.title}</span>
              )}
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                className={errors.author ? "input-error" : ""}
                required
              />
              {errors.author && (
                <span className="error-text">{errors.author}</span>
              )}
            </div>
            <div className="form-group">
              <label>Genre *</label>
              <select
                value={formData.genre}
                onChange={(e) => handleInputChange("genre", e.target.value)}
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
                <option value="Mathematics">Mathematics</option>
                <option value="Law">Law</option>
                <option value="Spiritual Growth">Spiritual Growth</option>
                <option value="Epic Fantasy">Epic Fantasy</option>
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
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={errors.price ? "input-error" : ""}
                required
              />
              {errors.price && (
                <span className="error-text">{errors.price}</span>
              )}
            </div>
            <div className="form-group">
              <label>Year *</label>
              <input
                type="number"
                min="1000"
                max={new Date().getFullYear() + 10}
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                className={errors.year ? "input-error" : ""}
                required
              />
              {errors.year && <span className="error-text">{errors.year}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Cover Image URL</label>
            <input
              type="text"
              value={formData.cover}
              onChange={(e) => handleInputChange("cover", e.target.value)}
              placeholder="https://example.com/image.jpg or www.example.com/image.jpg"
              className={errors.cover ? "input-error" : ""}
            />
            {errors.cover && <span className="error-text">{errors.cover}</span>}
            <small className="help-text">
              Supported formats: https://example.com/image.jpg,
              www.example.com/image.jpg, or example.com/image.jpg
            </small>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="4"
              placeholder="Enter book description..."
            />
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {book ? "Update" : "Add"} Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Author Form Component
const AuthorForm = ({ author, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: author?.name || "",
    genre: author?.genre || "Fiction",
    photo: author?.photo || "",
    bio: author?.bio || "",
    books: author?.books || [],
    // quote: author?.quote || "",
  });

  const [errors, setErrors] = useState({});

  // Custom URL validation function for photo
  const isValidURL = (url) => {
    if (!url || url.trim() === "") return true;

    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?(\?[a-zA-Z0-9_-]+=[\w%-]+(&[a-zA-Z0-9_-]+=[\w%-]+)*)?$/i;

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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.photo && !isValidURL(formData.photo)) {
      newErrors.photo = "Please enter a valid URL for the photo";
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
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{author ? "Edit Author" : "Add New Author"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "input-error" : ""}
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Genre *</label>
            <select
              value={formData.genre}
              onChange={(e) => handleInputChange("genre", e.target.value)}
              required
            >
              <option value="Fiction">Fiction Writer</option>
              <option value="Poetry">Poet</option>
              <option value="History">Historian</option>
              <option value="Self-Help">Self-Help Author</option>
              <option value="Academic">Academic Writer</option>
              <option value="Psychology">Psychology</option>
              <option value="Science">Science Writer</option>
              <option value="Management">Management</option>
              <option value="Dharma">Dharma / Spirituality</option>
              <option value="Law">Law</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Fantasy">Fantasy Writer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Photo URL</label>
            <input
              type="text"
              value={formData.photo}
              onChange={(e) => handleInputChange("photo", e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className={errors.photo ? "input-error" : ""}
            />
            {errors.photo && <span className="error-text">{errors.photo}</span>}
            <small className="help-text">
              Enter a URL for the author's photo
            </small>
          </div>

          <div className="form-group">
            <label>Biography</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows="4"
              placeholder="Tell us about the author..."
            />
          </div>

          <div className="form-group">
            <label>Books</label>
            <textarea
              value={formData.books}
              onChange={(e) => handleInputChange("books", e.target.value)}
              rows="4"
              placeholder="enter the books..."
            />
          </div>

          



          <div className="form-buttons">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {author ? "Update" : "Add"} Author
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Hero Manager Component — manage the four floating hero visuals.
const HERO_SLOTS = [
  { id: "hero-1", label: "Hero Image 1", position: "Left / upper area" },
  { id: "hero-2", label: "Hero Image 2", position: "Upper / right area" },
  { id: "hero-3", label: "Hero Image 3", position: "Lower / center area" },
  { id: "hero-4", label: "Hero Image 4", position: "Right / lower area" },
];

const HeroManager = ({ hero, heroLoading, onSave }) => {
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  // Sync the four slots from Firestore hero data.
  useEffect(() => {
    if (!heroLoading) {
      const heroImages = Array.isArray(hero?.images) ? hero.images : [];
      setImages(
        HERO_SLOTS.map((slot) => {
          const existing = heroImages.find((img) => img.id === slot.id);
          return { id: slot.id, imageUrl: existing?.imageUrl || "" };
        })
      );
    }
  }, [hero, heroLoading]);

  const updateSlot = (id, imageUrl) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, imageUrl } : img))
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSavedMsg("");
    setError("");
    try {
      const result = await onSave(images);
      if (result?.error) {
        setError(result.error.message || "Failed to save the hero images.");
      } else {
        setSavedMsg("Hero images saved successfully.");
      }
    } catch (err) {
      setError(err?.message || "Failed to save the hero images.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Remove all four hero images and restore the default book covers?"
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
        HERO_SLOTS.map((slot) => ({ id: slot.id, imageUrl: "" }))
      );
      if (result?.error) {
        setError(result.error.message || "Failed to remove the hero images.");
      } else {
        setSavedMsg("Hero images removed. Default covers restored.");
      }
    } catch (err) {
      setError(err?.message || "Failed to remove the hero images.");
    } finally {
      setSaving(false);
    }
  };

  if (heroLoading) {
    return (
      <div className="hero-manager-loading">
        <FaSpinner className="hero-manager-spin" /> Loading hero settings…
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="hero-manager-form">
      <div className="hero-slots">
        {HERO_SLOTS.map((slot) => {
          const current = images.find((img) => img.id === slot.id);
          return (
            <div className="hero-slot" key={slot.id}>
              <div className="hero-slot-header">
                <h3>{slot.label}</h3>
                <span>{slot.position}</span>
              </div>
              <BlogImageUpload
                value={current?.imageUrl || ""}
                onChange={(value) => updateSlot(slot.id, value)}
                accept="image/jpg,image/jpeg,image/png,image/webp"
              />
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
        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? (
            <>
              <FaSpinner className="hero-manager-spin" /> Saving…
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
          <FaTrash /> Reset / Delete
        </button>
      </div>
    </form>
  );
};

export default Admin;
