import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFeatherAlt } from "react-icons/fa";
import { authors } from "../../data/author";
import emailjs from "@emailjs/browser";
import "./Authors.css";

export default function Authors() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "service_9vpwjdo",
        "template_1vzt7uv",
        formData,
        "KBwcTEiUFQhCaMWZB"
      )
      .then(
        () => {
          setPopup({
            show: true,
            success: true,
            msg: "✅ Thank you! Your request has been submitted. We'll contact you soon.",
          });
          setFormData({ name: "", email: "", message: "" });
        },
        () => {
          setPopup({
            show: true,
            success: false,
            msg: "❌ Oops! Something went wrong. Please try again.",
          });
        }
      );
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

  return (
    <div className="authors-container">
      {/* Hero Section */}
      <div className="authors-hero">
        <h1>Meet Our Authors</h1>
        <p>
          Discover the storytellers and dreamers who partnered with{" "}
          <span>YellowBook Publication</span> to bring their books to life.
        </p>
      </div>

      {/* Featured Authors */}
      <div className="featured-authors">
        <h2>
          <FaFeatherAlt /> Featured Authors
        </h2>
        <div className="authors-grid featured-grid">
          {authors.slice(0, 2).map((author) => (
            <div key={author.id} className="author-card">
              <div className="author-img">
                <img
                  src={author.photo || "/placeholder.jpg"}
                  alt={author.name}
                />
              </div>
              <h3>{author.name}</h3>
              <p className="genre">{author.genre}</p>
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
        <h2>All Authors</h2>
        <div className="authors-grid">
          {authors.map((author) => (
            <div key={author.id} className="author-card">
              <div className="author-img">
                <img
                  src={author.photo || "/placeholder.jpg"}
                  alt={author.name}
                />
              </div>
              <h3>{author.name}</h3>
              <p className="book-title">{author.books[0]}</p>
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
          Join YellowBook Publication and let us help you share your story with
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
