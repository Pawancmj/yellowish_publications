import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShareAlt,
  FaWhatsapp,
  FaBookOpen,
} from "react-icons/fa";

import "./BookCard.css";
import { NO_COVER_PLACEHOLDER } from "../../utils/coverPlaceholder";

const WHATSAPP_NUMBER = "919876543210";

const buildWhatsAppLink = (book) => {
  const title = book.title || "This book";
  const author = book.author || book.authorsName || "Unknown";
  const price = `₹${book.price || 0}`;
  const url = `${window.location.origin}/book/${book.id}`;
  const message = [
    "Hello,",
    "I am interested in purchasing this book.",
    "",
    "Book:",
    title,
    "",
    "Author:",
    author,
    "",
    "Price:",
    price,
    "",
    "Link:",
    url,
    "",
    "Please share the purchase details.",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export default function BookCard({
  book,
  index = 0,
  badge,
  cover,
  handleNavClick,
  shareBook,
}) {
  const customBadge =
    typeof book.customBadge === "string"
      ? book.customBadge.trim()
      : "";

  return (
    <motion.article
      className="book-card"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
    >
      <div className="book-cover-wrap">
        <Link
          to={`/book/${book.id}`}
          onClick={(e) => handleNavClick(e, `/book/${book.id}`)}
          className="book-cover-link"
        >
          <img
            src={cover}
            alt={book.title}
            className="book-cover"
            width={400}
            height={600}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (e.currentTarget.dataset.fallback) return;
              e.currentTarget.dataset.fallback = "1";
              e.currentTarget.src = NO_COVER_PLACEHOLDER;
            }}
          />
        </Link>
        {badge || customBadge ? (
          <div className="card-badge-stack">
            {badge ? (
              <span className="card-badge">{badge}</span>
            ) : null}
            {customBadge ? (
              <span className="card-badge">{customBadge}</span>
            ) : null}
          </div>
        ) : null}

        {/* Hover overlay — details fade in inside the cover image */}
        <div className="card-overlay">
          <div className="card-overlay-inner">
            <p className="card-desc">
              {book.description
                ? book.description.split(".").slice(0, 2).join(".") + "."
                : "A wonderful addition to your reading collection."}
            </p>
            <div className="overlay-actions">
              <button
                className="card-share"
                title="Share Book"
                aria-label="Share book"
                onClick={(e) => shareBook(e, book)}
              >
                <FaShareAlt />
              </button>
              <div className="hover-buttons">
                <Link
                  to={`/book/${book.id}`}
                  className="details-btn"
                  onClick={(e) => handleNavClick(e, `/book/${book.id}`)}
                >
                  View Details
                </Link>
                <a
                  href={buildWhatsAppLink(book)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                  title="Contact on WhatsApp"
                  aria-label="Contact on WhatsApp"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Default compact info */}
      <div className="card-info">
        <span className="genre-badge">
          <FaBookOpen /> {book.genre || "Uncategorized"}
        </span>
        <Link
          to={`/book/${book.id}`}
          className="card-title"
          onClick={(e) => handleNavClick(e, `/book/${book.id}`)}
        >
          {book.title}
        </Link>
        <p className="card-author">
          By {book.author || book.authorsName || "Unknown"}
        </p>
        <span className="card-price">₹{book.price || 0}</span>
      </div>
    </motion.article>
  );
}
