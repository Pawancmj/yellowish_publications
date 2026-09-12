import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../contexts/DataContext";
import {
  FaSearch,
  FaBookOpen,
  FaArrowRight,
  FaPen,
} from "react-icons/fa";

import BookCard from "../../components/BookCard/BookCard";

import book1 from "../../assets/book1.png";
import book5 from "../../assets/book5.png";
import book9 from "../../assets/book9.png";
import book13 from "../../assets/book13.png";

import "./Books.css";

// Curated-collection hero: one large focal cover front-left with a
// staircase of supporting covers rising to the right. Fixed-pixel
// positions on a scaled stage keep the spacing intentional.
const FLOATING_BOOKS = [
  { src: book13, className: "fl-1", rotation: -2 },
  { src: book5, className: "fl-2", rotation: -4 },
  { src: book9, className: "fl-3", rotation: 3 },
  { src: book1, className: "fl-4", rotation: 5 },
];

const BADGES = ["Editor's Choice", "Best Seller", "New Release"];

const RATINGS = [4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4];

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const staggerWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export default function Books() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [toast, setToast] = useState("");

  const { books, getBookCover } = useData();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // Unique genres derived from live data (keeps filter logic exact-match)
  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.genre).filter(Boolean));
    return ["All Books", ...Array.from(set)];
  }, [books]);

  const resetFilters = () => {
    setSearch("");
    setGenre("");
    setSortBy("");
  };

  // Full list: supports Featured + grid + badge assignment
  const sortedBase = useMemo(() => {
    const list = [...books];
    list.sort((a, b) => {
      if (sortBy === "newest")
        return (b.updatedAt || b.year || 0) - (a.updatedAt || a.year || 0);
      if (sortBy === "priceLow") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceHigh") return (b.price || 0) - (a.price || 0);
      return 0;
    });
    return list;
  }, [books, sortBy]);

  const featured = sortedBase.slice(0, 4);

  // Filtered grid preserves the exact original filter logic
  const filteredBooks = books
    .filter((book) =>
      (book.title?.toLowerCase() +
        (book.author || book.authorsName || "").toLowerCase() +
        (book.genre || "").toLowerCase()
      ).includes(search.toLowerCase())
    )
    .filter((book) => (genre ? (book.genre || "") === genre : true))
    .sort((a, b) => {
      if (sortBy === "newest")
        return (b.updatedAt || b.year || 0) - (a.updatedAt || a.year || 0);
      if (sortBy === "priceLow") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceHigh") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) scrollToTop();
    else {
      navigate(path);
      setTimeout(scrollToTop, 300);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navbarHeight = 78;
    const offset = 24;
    const top =
      el.getBoundingClientRect().top + window.pageYOffset - navbarHeight - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const shareBook = async (e, book) => {
    e.preventDefault();
    const url = `${window.location.origin}/book/${book.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title || "Book",
          text: `${book.title || "This book"} by ${
            book.author || book.authorsName || "Unknown"
          }`,
          url,
        });
      } catch (err) {
        // User dismissed the share sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast("Book link copied.");
    } catch (err) {
      // Clipboard unavailable
    }
  };

  const renderCard = (book, i, baseIndex) => {
    const badge = BADGES[baseIndex % BADGES.length];
    const rating = RATINGS[baseIndex % RATINGS.length] || 4.5;
    const coverUrl = getBookCover(book);

    return (
      <BookCard
        key={book.id}
        book={book}
        index={i}
        rating={rating}
        badge={badge}
        cover={coverUrl}
        handleNavClick={handleNavClick}
        shareBook={shareBook}
      />
    );
  };

  return (
    <div className="store-page">
      {/* ================= HERO ================= */}
<section className="store-hero" aria-label="Our collection">

  {/* Decorative background */}
  <div className="hero-bg" aria-hidden="true">
    <div className="hero-circle hero-circle-top" />
    <div className="hero-circle hero-circle-bottom" />

    <div className="hero-dots hero-dots-top" />
    <div className="hero-dots hero-dots-bottom" />

    <span className="hero-star hero-star-one">✦</span>
    <span className="hero-star hero-star-two">✦</span>
  </div>

  <div className="hero-inner">

    {/* ================= LEFT ================= */}
    <div className="hero-main-content">

      <motion.div
        variants={staggerWrap}
        initial="hidden"
        animate="visible"
      >

        <motion.div
          className="hero-kicker"
          variants={fadeUp}
          custom={0}
        >
          <span className="hero-kicker-line" />
          OUR STORE
        </motion.div>

        <motion.h1
          className="hero-title"
          variants={fadeUp}
          custom={1}
        >
          Books That
          <span className="hero-accent"> Inspire.</span>

          <br />

          Stories That
          <span className="hero-accent"> Stay.</span>
        </motion.h1>

        <motion.div
          className="hero-title-line"
          variants={fadeUp}
          custom={2}
        />

      </motion.div>

    </div>


    {/* ================= RIGHT ================= */}
    <motion.div
      className="hero-side-content"
      variants={staggerWrap}
      initial="hidden"
      animate="visible"
    >

       
      <motion.p
        className="hero-description"
        variants={fadeUp}
        custom={3}
      >
        Discover compelling books from emerging and established authors, thoughtfully published to bring powerful stories, fresh perspectives, and ideas that stay with you.

      </motion.p>

      <motion.div
        className="hero-actions"
        variants={fadeUp}
        custom={4}
      >

        <button
          className="btn-gold"
          onClick={() => scrollToSection("all-books")}
        >
          Explore Collection
          <FaArrowRight className="arrow-ico" />
        </button>

        <button
          className="btn-outline"
          onClick={() => scrollToSection("store-cta")}
        >
          <FaPen />
          Become an Author
        </button>

      </motion.div>

    </motion.div>

  </div>

</section>
      {/* ================= FEATURED BOOKS ================= */}
      <section className="featured-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">HAND PICKED</span>
            <h2>Featured Books</h2>
            <p>Our editors' favourite reads of the season.</p>
          </motion.div>

          <div className="featured-list">
            {featured.map((book, i) => {
              const baseIndex = books.findIndex((b) => b.id === book.id);
              const badge = BADGES[
                (baseIndex < 0 ? i : baseIndex) % BADGES.length
              ];
              const rating = RATINGS[
                (baseIndex < 0 ? i : baseIndex) % RATINGS.length
              ] || 4.5;
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  index={i}
                  rating={rating}
                  badge={badge}
                  cover={getBookCover(book)}
                  handleNavClick={handleNavClick}
                  shareBook={shareBook}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ALL BOOKS + SEARCH/FILTER ================= */}
      <section id="all-books" className="all-books-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">FULL LIBRARY</span>
            <h2>Browse Our Collection</h2>
            <p>Find your next favourite read.</p>
          </motion.div>

          {/* Sticky filter bar */}
          <div className="filter-bar-sticky">
            <div className="filter-bar">
              <div className="filter-search">
                <FaSearch className="search-ico" />
                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-select">
                <label htmlFor="book-genre">Genre</label>
                <select
                  id="book-genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {categories
                    .filter((c) => c !== "All Books")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
              <div className="filter-select">
                <label htmlFor="book-sort">Sort By</label>
                <select
                  id="book-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="reset-btn"
                onClick={resetFilters}
                aria-label="Reset filters"
              >
                <FaSearch className="reset-ico" /> Reset
              </button>
            </div>
          </div>

          {/* Grid */}
          {filteredBooks.length > 0 ? (
            <div className="books-grid">
              {filteredBooks.map((book, i) => {
                const baseIndex = books.findIndex((b) => b.id === book.id);
                return renderCard(book, i, baseIndex < 0 ? i : baseIndex);
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-illustration">
                <FaBookOpen className="empty-icon" />
                <div className="empty-book" />
              </div>
              <h3>No books found</h3>
              <p>
                We couldn't find any books matching your search. Try adjusting
                the filters.
              </p>
              <button className="btn-gold empty-reset" onClick={resetFilters}>
                <FaSearch className="reset-ico" /> Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

       

      
    </div>
  );
}