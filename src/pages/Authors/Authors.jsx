import { useState, useEffect } from "react";  // eslint-disable-line no-unused-vars
import { useNavigate, useLocation } from "react-router-dom";
import { FaFeatherAlt } from "react-icons/fa";
import { useData } from "../../contexts/DataContext";
import "./Authors.css";

export default function Authors() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authors, loading, getAuthorPhoto, addLead } = useData();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [popup, setPopup] = useState({ show: false, success: false, msg: "" });

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup({ ...popup, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      await addLead({ ...formData, type: 'author_request', status: 'new' });
      setPopup({
        show: true,
        success: true,
        msg: "✅ Thank you! Your request has been submitted. We'll contact you soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error(error);
      setPopup({
        show: true,
        success: false,
        msg: "❌ Oops! Something went wrong. Please try again.",
      });
    }
  };

  // Smooth scroll function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle internal navigation
  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) {
      scrollToTop();
    } else {
      navigate(path);
      setTimeout(scrollToTop, 300);
    }
  };

  // Show loading only while DataContext is still loading
  if (loading) {
    return (
      <div className="authors-container">
        <div className="authors-hero">
          <h1>Loading authors...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="authors-container">
      {/* Hero Section */}
      <div className="authors-hero">
        <h1>Meet Our Authors</h1>
        <p>
          Discover the storytellers and dreamers who partnered with{" "}
          <span>Yellowish Publication</span> to bring their books to life.
        </p>
      </div>

      {/* Featured Authors */}
      <div className="featured-authors">
        <h2>
          <FaFeatherAlt /> Featured Authors ({authors.length > 0 ? authors.slice(0, 2).length : 0})
        </h2>
        <div className="authors-grid featured-grid">
          {authors.slice(0, 2).map((author) => (
            <div key={author.id} className="author-card">
              <div className="author-img">
                <img
                  src={getAuthorPhoto(author)}
                  alt={author.name}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150x150.png?text=No+Photo"; }}
                />
              </div>
              <h3>{author.name}</h3>
              <p className="genre">{author.genre || "Various"}</p>
              <div className="card-button-container">
                <a
                  href={`/author/${author.id}`}
                  className="view-btn"
                  onClick={(e) => handleNavClick(e, `/author/${author.id}`)}
                >
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Authors */}
      <div className="all-authors">
        <h2>All Authors ({authors.length})</h2>
        <div className="authors-grid">
          {authors.map((author) => (
            <div key={author.id} className="author-card">
              <div className="author-img">
                <img
                  src={getAuthorPhoto(author)}
                  alt={author.name}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150x150.png?text=No+Photo"; }}
                />
              </div>
              <h3>{author.name}</h3>
              <p className="book-title">{Array.isArray(author.books) ? (author.books[0] || "No books yet") : (author.books || "No books yet")}</p>
              <div className="card-button-container">
                <a
                  href={`/author/${author.id}`}
                  className="view-btn"
                  onClick={(e) => handleNavClick(e, `/author/${author.id}`)}
                >
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA with Form */}
      <div className="authors-cta">
        <h2>Want to see your name here?</h2>
        <p>
          Join Yellowish Publication and let us help you share your story with
          the world.
        </p>

        <form className="cta-form" onSubmit={sendEmail}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Tell us about your book..."
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="cta-btn">
            Publish With Us
          </button>
        </form>

        {popup.show && (
          <div
            className={`popup-message ${popup.success ? "success" : "error"}`}
          >
            {popup.msg}
          </div>
        )}
      </div>
    </div>
  );
}
