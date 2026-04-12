// src/pages/Admindashboard/Admin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { FaEdit, FaTrash, FaPlus, FaBook, FaUser } from "react-icons/fa";
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
                            src={book.cover || "/placeholder-book.jpg"}
                            alt={book.title}
                            className="table-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder-book.jpg";
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
                            src={author.photo || "/placeholder.jpg"}
                            alt={author.name}
                            className="table-photo"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
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

export default Admin;
