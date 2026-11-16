import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

import "./BookCard.css";
import { NO_COVER_PLACEHOLDER } from "../../utils/coverPlaceholder";

export default function BookCard({
  book,
  index = 0,
  badge,
  cover,
  handleNavClick,
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
