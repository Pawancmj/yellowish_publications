import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFeatherAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheck,
  FaSearch,
  FaBookOpen,
  FaAward,
  FaArrowRight,
  FaPenFancy,
  FaQuoteLeft,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { useData } from "../../contexts/DataContext";

import author1 from "../../assets/author1.png";
import author2 from "../../assets/author2.png";
import author3 from "../../assets/author3.png";
import author4 from "../../assets/author4.png";
import author5 from "../../assets/author5.png";

import "./Authors.css";

const HERO_PORTRAITS = [
  { src: author1, className: "spot-1" },
  { src: author2, className: "spot-2" },
  { src: author3, className: "spot-3" },
  { src: author4, className: "spot-4" },
];

const RATINGS = [4.9, 5, 4.7, 4.8, 4.5];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "alphabetical", label: "Alphabetical" },
];

const SOCIALS = [
  { icon: FaFacebookF, label: "Facebook" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaTwitter, label: "Twitter" },
  { icon: FaLinkedinIn, label: "LinkedIn" },
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

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <FaStar key={i} className="star filled" />;
        if (i === full && half)
          return <FaStarHalfAlt key={i} className="star filled" />;
        return <FaRegStar key={i} className="star" />;
      })}
    </span>
  );
}

function AuthorBio({ bio }) {
  const text = bio
    ? bio.split(".").slice(0, 2).join(".") + "."
    : "A talented author published with Yellowish Publication.";
  return <>{text}</>;
}

export default function Authors() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authors, loading, getAuthorPhoto, addLead } = useData();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bookTitle: "",
    genre: "",
    message: "",
  });
  const [popup, setPopup] = useState({ show: false, success: false, msg: "" });
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("All Genres");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(
        () => setPopup({ ...popup, show: false }),
        3500
      );
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      await addLead({ ...formData, type: "author_request", status: "new" });
      setPopup({
        show: true,
        success: true,
        msg: "Thank you! Your request has been submitted. We'll contact you soon.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        bookTitle: "",
        genre: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setPopup({
        show: true,
        success: false,
        msg: "Oops! Something went wrong. Please try again.",
      });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) scrollToTop();
    else {
      navigate(path);
      setTimeout(scrollToTop, 300);
    }
  };

  // Smooth scroll to an in-page section with an offset for the fixed navbar
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navbarHeight = 78;
    const offset = 24;
    const top = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const genres = useMemo(() => {
    const set = new Set(
      authors.map((a) =>
        a.genre ? a.genre.split("/")[0].trim() : "Various"
      )
    );
    return ["All Genres", ...Array.from(set)];
  }, [authors]);

  const filteredAuthors = useMemo(() => {
    let list = [...authors];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (a) =>
          (a.name || "").toLowerCase().includes(q) ||
          (a.genre || "").toLowerCase().includes(q)
      );
    }
    if (genreFilter !== "All Genres") {
      list = list.filter((a) => {
        const g = a.genre ? a.genre.split("/")[0].trim() : "Various";
        return g === genreFilter;
      });
    }
    const indexOf = (a) => authors.findIndex((x) => x.id === a.id);
    if (sortBy === "alphabetical") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "popular") {
      list.sort(
        (a, b) =>
          (RATINGS[indexOf(b)] || 0) - (RATINGS[indexOf(a)] || 0)
      );
    } else {
      list.sort((a, b) => indexOf(b) - indexOf(a));
    }
    return list;
  }, [authors, query, genreFilter, sortBy]);

  const featured = authors.slice(0, 2);

  if (loading) {
    return (
      <div className="authors-wrapper">
        <div className="authors-loader">
          <FaFeatherAlt className="loader-icon" />
          <p>Loading authors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="authors-page">
      {/* ================= HERO ================= */}
      <section className="authors-hero" aria-label="Our authors">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-blob-right">
            <span className="hero-glow" />
          </div>
          <div className="hero-wave-left" />
          <div className="hero-shape shape-a" />
          <div className="hero-shape shape-b" />
          <div className="hero-shape shape-c" />
        </div>

        <div className="hero-inner">
          <div className="hero-copy">
            <motion.div variants={staggerWrap} initial="hidden" animate="visible">
              <motion.span variants={fadeUp} className="hero-badge">
                <FaFeatherAlt /> Our Community
              </motion.span>
              <motion.h1 variants={fadeUp} custom={1}>
                Meet the Authors
                <br />
                Behind Our <span className="accent">Success</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2}>
                Discover talented writers who trusted Yellowish Publication to
                publish and distribute their books worldwide.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={3}
                className="hero-actions"
              >
                <button
                  className="btn-gold"
                  onClick={() => scrollToSection("all-authors")}
                >
                  Explore Authors <FaArrowRight className="arrow-ico" />
                </button>
                <a
                  href="#become-author"
                  className="btn-ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("become-author");
                  }}
                >
                  <FaPenFancy /> Become an Author
                </a>
              </motion.div>
            </motion.div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            {HERO_PORTRAITS.map((p) => (
              <div className={`portrait-w ${p.className}`} key={p.className}>
                <motion.img
                  src={p.src}
                  alt=""
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              </div>
            ))}
            <div className="hero-card-float">
              <FaAward className="card-float-ico" />
              <div>
                <strong>15,000+</strong>
                <span>Happy Authors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED AUTHORS ================= */}
      <section className="featured-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="gold-label">FEATURED TALENT</span>
            <h2>Featured Authors</h2>
            <p>Handpicked storytellers making waves across the globe.</p>
          </motion.div>

          <div className="featured-grid">
            {featured.map((author, i) => (
              <motion.article
                key={author.id}
                className="featured-card"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="f-portrait">
                  <img
                    src={getAuthorPhoto(author)}
                    alt={author.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = author5;
                    }}
                  />
                  <span className="verified-badge" title="Verified Author">
                    <FaCheck />
                  </span>
                </div>
                <div className="f-body">
                  <div className="f-topline">
                    <h3>{author.name}</h3>
                    <span className="genre-tag">
                      {author.genre
                        ? author.genre.split("/")[0].trim()
                        : "Various"}
                    </span>
                  </div>
                  <span className="books-label">
                    <FaBookOpen />{" "}
                    {author.books ? author.books.length : 0} Books Published
                  </span>
                  <p className="f-bio">
                    <AuthorBio bio={author.bio} />
                  </p>
                  <div className="f-social">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-label={s.label}
                      >
                        <s.icon />
                      </a>
                    ))}
                  </div>
                </div>
                <a
                  className="f-view"
                  href={`/author/${author.id}`}
                  onClick={(e) => handleNavClick(e, `/author/${author.id}`)}
                >
                  View Profile <FaArrowRight className="arrow-ico" />
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALL AUTHORS ================= */}
      <section id="all-authors" className="all-authors-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="gold-label">OUR COMMUNITY</span>
            <h2>All Authors</h2>
            <p>Every creator behind our published library.</p>
          </motion.div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-search">
              <FaSearch className="search-ico" />
              <input
                type="text"
                placeholder="Search authors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="filter-select">
              <label htmlFor="genre-filter">Genre</label>
              <select
                id="genre-filter"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-select">
              <label htmlFor="sort-by">Sort By</label>
              <select
                id="sort-by"
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
          </div>

          {filteredAuthors.length > 0 ? (
            <div className="authors-grid">
              {filteredAuthors.map((author, i) => {
                const idx = authors.findIndex((x) => x.id === author.id);
                const rating = RATINGS[idx] || 4.5;
                return (
                  <motion.article
                    key={author.id}
                    className="author-card"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                  >
                    <a
                      className="author-img"
                      href={`/author/${author.id}`}
                      onClick={(e) =>
                        handleNavClick(e, `/author/${author.id}`)
                      }
                    >
                      <img
                        src={getAuthorPhoto(author)}
                        alt={author.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = author5;
                        }}
                      />
                    </a>
                    <div className="card-body">
                      <div className="card-rating">
                        <Stars rating={rating} />
                        <span>{rating.toFixed(1)}</span>
                      </div>
                      <h3>{author.name}</h3>
                      <span className="genre-tag genre-multi">
                        {author.genre || "Various"}
                      </span>
                      <span className="books-label">
                        <FaBookOpen />{" "}
                        {author.books ? author.books.length : 0} Books Published
                      </span>
                      <p className="card-desc">
                        <AuthorBio bio={author.bio} />
                      </p>
                    </div>
                    <a
                      className="card-view"
                      href={`/author/${author.id}`}
                      onClick={(e) =>
                        handleNavClick(e, `/author/${author.id}`)
                      }
                    >
                      View Profile <FaArrowRight className="arrow-ico" />
                    </a>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <FaSearch className="no-results-ico" />
              <p>No authors found. Try a different search or genre.</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section id="become-author" className="cta-section">
        <div className="cta-decor" aria-hidden="true">
          <div className="cta-blob-left">
            <svg
              className="cta-svg"
              viewBox="0 0 420 420"
              preserveAspectRatio="xMidYMid slice"
            >
              <path d="M442.3 195.0 C 443.9 207.0 444.1 219.7 442.9 231.9 C 441.7 244.1 439.0 256.5 435.2 268.2 C 431.4 279.9 426.2 291.4 420.1 302.1 C 414.1 312.7 406.8 322.9 398.9 332.3 C 391.1 341.6 382.2 350.2 373.0 358.0 C 363.8 365.8 353.9 372.9 343.7 379.1 C 333.5 385.2 322.8 390.6 312.0 395.1 C 301.1 399.6 289.8 403.3 278.5 405.9 C 267.2 408.6 255.7 410.4 244.2 411.1 C 232.8 411.9 221.2 411.7 210.0 410.4 C 198.8 409.2 187.6 406.9 176.9 403.8 C 166.3 400.6 155.9 396.4 146.2 391.5 C 136.4 386.6 127.1 380.8 118.5 374.6 C 109.9 368.3 101.9 361.3 94.4 354.1 C 86.9 347.0 80.0 339.3 73.5 331.5 C 66.9 323.8 60.9 315.7 55.1 307.6 C 49.2 299.4 43.7 291.1 38.3 282.5 C 32.8 273.9 27.5 265.2 22.4 255.9 C 17.3 246.7 12.2 237.2 7.7 227.0 C 3.2 216.9 -1.3 206.2 -4.8 195.0 C -8.3 183.8 -11.5 171.8 -13.2 159.6 C -15.0 147.4 -16.0 134.5 -15.3 121.8 C -14.5 109.1 -12.6 95.9 -8.9 83.5 C -5.2 71.1 0.1 58.6 6.9 47.4 C 13.7 36.3 22.3 25.7 31.9 16.9 C 41.4 8.0 52.6 0.2 64.2 -5.7 C 75.7 -11.6 88.6 -16.0 101.1 -18.7 C 113.6 -21.5 126.9 -22.4 139.4 -22.3 C 151.9 -22.1 164.5 -20.2 176.3 -17.8 C 188.1 -15.4 199.4 -11.6 210.0 -7.7 C 220.6 -3.9 230.5 0.8 240.0 5.3 C 249.6 9.7 258.4 14.5 267.2 19.1 C 275.9 23.6 284.2 28.1 292.7 32.6 C 301.2 37.1 309.6 41.4 318.2 46.1 C 326.7 50.8 335.4 55.5 344.1 60.9 C 352.8 66.3 361.8 71.9 370.3 78.5 C 378.9 85.1 387.6 92.3 395.4 100.5 C 403.2 108.7 410.8 117.8 417.2 127.7 C 423.5 137.5 429.2 148.4 433.4 159.6 C 437.6 170.8 440.7 183.0 442.3 195.0 Z" />
              <path d="M430.4 195.0 C 431.9 206.4 432.1 218.4 431.0 230.0 C 429.8 241.6 427.3 253.3 423.7 264.4 C 420.1 275.5 415.1 286.4 409.3 296.6 C 403.6 306.7 396.7 316.4 389.2 325.2 C 381.8 334.1 373.4 342.3 364.7 349.7 C 356.0 357.1 346.5 363.8 336.9 369.6 C 327.2 375.5 317.0 380.6 306.7 384.9 C 296.4 389.1 285.7 392.6 275.0 395.1 C 264.3 397.6 253.3 399.3 242.5 400.1 C 231.6 400.8 220.6 400.6 210.0 399.4 C 199.4 398.2 188.7 396.1 178.6 393.1 C 168.5 390.1 158.7 386.1 149.4 381.4 C 140.2 376.8 131.4 371.3 123.2 365.4 C 115.0 359.4 107.4 352.8 100.3 346.0 C 93.2 339.2 86.7 331.9 80.5 324.5 C 74.3 317.2 68.6 309.5 63.0 301.8 C 57.5 294.0 52.2 286.2 47.1 278.0 C 41.9 269.9 36.9 261.6 32.0 252.8 C 27.2 244.1 22.4 235.0 18.1 225.4 C 13.8 215.8 9.5 205.7 6.2 195.0 C 2.9 184.3 -0.1 173.0 -1.8 161.5 C -3.4 149.9 -4.4 137.6 -3.7 125.6 C -3.0 113.5 -1.2 100.9 2.3 89.2 C 5.8 77.4 10.9 65.6 17.3 55.0 C 23.8 44.5 31.9 34.4 41.0 26.0 C 50.0 17.6 60.7 10.2 71.7 4.6 C 82.6 -1.0 94.8 -5.2 106.7 -7.8 C 118.6 -10.4 131.1 -11.3 143.0 -11.1 C 154.9 -11.0 166.9 -9.2 178.0 -6.9 C 189.2 -4.6 199.9 -1.0 210.0 2.7 C 220.1 6.3 229.5 10.8 238.5 15.0 C 247.5 19.2 255.9 23.8 264.2 28.1 C 272.6 32.4 280.4 36.7 288.5 40.9 C 296.6 45.2 304.5 49.3 312.6 53.8 C 320.7 58.2 329.0 62.6 337.3 67.7 C 345.5 72.9 354.0 78.2 362.1 84.5 C 370.2 90.8 378.5 97.6 385.9 105.4 C 393.3 113.2 400.5 121.8 406.5 131.1 C 412.5 140.5 418.0 150.8 421.9 161.4 C 425.9 172.1 428.9 183.6 430.4 195.0 Z" />
              <path d="M406.6 195.0 C 407.9 205.2 408.1 215.9 407.1 226.2 C 406.1 236.5 403.8 247.0 400.6 256.9 C 397.4 266.8 392.9 276.6 387.8 285.6 C 382.7 294.6 376.5 303.2 369.9 311.1 C 363.2 319.0 355.7 326.4 348.0 333.0 C 340.2 339.6 331.8 345.5 323.2 350.7 C 314.5 356.0 305.5 360.5 296.3 364.3 C 287.1 368.1 277.5 371.2 268.0 373.5 C 258.4 375.7 248.6 377.3 239.0 377.9 C 229.3 378.5 219.5 378.3 210.0 377.3 C 200.5 376.3 191.0 374.3 182.0 371.6 C 173.0 369.0 164.2 365.4 156.0 361.3 C 147.7 357.2 139.9 352.2 132.6 346.9 C 125.3 341.7 118.5 335.7 112.2 329.7 C 105.8 323.6 100.0 317.1 94.5 310.5 C 88.9 303.9 83.9 297.2 78.9 290.2 C 73.9 283.3 69.3 276.3 64.7 269.0 C 60.1 261.8 55.6 254.4 51.3 246.6 C 47.0 238.7 42.7 230.7 38.8 222.1 C 35.0 213.5 31.2 204.5 28.2 195.0 C 25.3 185.5 22.6 175.4 21.1 165.1 C 19.6 154.8 18.8 143.8 19.4 133.1 C 20.0 122.3 21.7 111.1 24.8 100.6 C 27.9 90.1 32.4 79.5 38.2 70.1 C 43.9 60.8 51.2 51.8 59.3 44.3 C 67.3 36.8 76.9 30.2 86.6 25.2 C 96.4 20.2 107.2 16.5 117.9 14.1 C 128.5 11.8 139.7 11.0 150.3 11.2 C 160.9 11.3 171.5 12.9 181.5 15.0 C 191.4 17.0 201.0 20.2 210.0 23.5 C 219.0 26.7 227.4 30.7 235.4 34.5 C 243.5 38.2 250.9 42.3 258.4 46.1 C 265.8 50.0 272.8 53.8 280.0 57.6 C 287.2 61.4 294.3 65.0 301.5 69.0 C 308.8 73.0 316.1 76.9 323.5 81.5 C 330.9 86.1 338.4 90.8 345.7 96.4 C 352.9 102.0 360.3 108.1 366.9 115.1 C 373.5 122.0 379.9 129.7 385.3 138.0 C 390.6 146.4 395.5 155.6 399.0 165.1 C 402.6 174.6 405.2 184.8 406.6 195.0 Z" />
              <path d="M382.7 195.0 C 383.9 204.0 384.1 213.4 383.2 222.4 C 382.3 231.5 380.3 240.7 377.5 249.4 C 374.7 258.1 370.7 266.7 366.2 274.6 C 361.7 282.6 356.3 290.1 350.5 297.1 C 344.6 304.0 338.1 310.4 331.2 316.2 C 324.4 322.0 317.0 327.3 309.4 331.9 C 301.9 336.5 293.9 340.5 285.8 343.8 C 277.7 347.1 269.4 349.9 261.0 351.8 C 252.6 353.8 243.9 355.2 235.5 355.7 C 227.0 356.3 218.3 356.1 210.0 355.2 C 201.7 354.3 193.3 352.6 185.4 350.2 C 177.5 347.9 169.8 344.7 162.5 341.1 C 155.3 337.5 148.4 333.1 142.0 328.5 C 135.6 323.9 129.6 318.7 124.0 313.3 C 118.4 308.0 113.4 302.3 108.5 296.5 C 103.6 290.7 99.2 284.8 94.8 278.7 C 90.4 272.6 86.3 266.5 82.3 260.1 C 78.2 253.7 74.3 247.2 70.5 240.3 C 66.7 233.4 62.9 226.4 59.6 218.8 C 56.2 211.3 52.9 203.4 50.3 195.0 C 47.7 186.6 45.3 177.8 44.0 168.7 C 42.7 159.6 42.0 150.0 42.5 140.6 C 43.0 131.1 44.5 121.3 47.2 112.1 C 50.0 102.9 53.9 93.5 59.0 85.3 C 64.0 77.0 70.4 69.1 77.5 62.5 C 84.6 55.9 93.0 50.2 101.6 45.8 C 110.2 41.4 119.7 38.1 129.0 36.1 C 138.3 34.0 148.2 33.3 157.5 33.4 C 166.8 33.6 176.2 35.0 184.9 36.8 C 193.7 38.6 202.1 41.4 210.0 44.3 C 217.9 47.1 225.3 50.6 232.3 53.9 C 239.4 57.2 246.0 60.8 252.5 64.2 C 259.0 67.6 265.2 70.9 271.5 74.2 C 277.8 77.6 284.1 80.8 290.4 84.3 C 296.8 87.8 303.3 91.2 309.7 95.3 C 316.2 99.3 322.9 103.5 329.2 108.4 C 335.6 113.3 342.0 118.7 347.8 124.8 C 353.6 130.9 359.3 137.6 364.0 145.0 C 368.7 152.3 373.0 160.3 376.1 168.7 C 379.2 177.0 381.6 186.0 382.7 195.0 Z" />
              <path d="M358.9 195.0 C 359.9 202.7 360.1 210.8 359.3 218.6 C 358.5 226.5 356.8 234.4 354.4 241.9 C 351.9 249.4 348.6 256.8 344.7 263.6 C 340.8 270.5 336.1 277.0 331.1 283.0 C 326.1 289.0 320.4 294.5 314.5 299.5 C 308.6 304.5 302.2 309.0 295.7 313.0 C 289.2 316.9 282.3 320.4 275.4 323.3 C 268.4 326.1 261.2 328.5 253.9 330.2 C 246.7 331.9 239.3 333.1 231.9 333.6 C 224.6 334.0 217.2 333.9 210.0 333.1 C 202.8 332.3 195.6 330.8 188.8 328.8 C 182.0 326.8 175.3 324.1 169.1 321.0 C 162.8 317.8 156.9 314.1 151.4 310.1 C 145.8 306.1 140.7 301.6 135.9 297.0 C 131.1 292.4 126.7 287.5 122.5 282.5 C 118.3 277.5 114.5 272.4 110.7 267.2 C 106.9 261.9 103.4 256.6 99.9 251.1 C 96.4 245.6 93.0 240.0 89.8 234.1 C 86.5 228.1 83.2 222.1 80.3 215.5 C 77.4 209.0 74.5 202.2 72.3 195.0 C 70.1 187.8 68.0 180.2 66.9 172.3 C 65.8 164.5 65.1 156.2 65.6 148.1 C 66.1 139.9 67.3 131.5 69.7 123.5 C 72.1 115.6 75.5 107.5 79.8 100.4 C 84.2 93.3 89.7 86.5 95.8 80.8 C 101.9 75.1 109.1 70.1 116.5 66.3 C 123.9 62.5 132.2 59.8 140.2 58.0 C 148.2 56.2 156.7 55.6 164.7 55.7 C 172.8 55.8 180.9 57.0 188.4 58.6 C 195.9 60.2 203.2 62.6 210.0 65.1 C 216.8 67.5 223.2 70.5 229.3 73.4 C 235.4 76.2 241.0 79.3 246.6 82.2 C 252.3 85.1 257.6 88.0 263.0 90.9 C 268.5 93.8 273.8 96.5 279.3 99.6 C 284.8 102.6 290.4 105.6 296.0 109.0 C 301.6 112.5 307.3 116.1 312.8 120.3 C 318.3 124.6 323.8 129.2 328.8 134.5 C 333.8 139.7 338.7 145.5 342.8 151.9 C 346.9 158.2 350.5 165.1 353.2 172.3 C 355.9 179.5 357.9 187.3 358.9 195.0 Z" />
              <path d="M335.1 195.0 C 335.9 201.5 336.0 208.3 335.4 214.9 C 334.8 221.4 333.3 228.1 331.3 234.4 C 329.2 240.7 326.4 246.9 323.1 252.6 C 319.9 258.4 316.0 263.9 311.7 268.9 C 307.5 273.9 302.7 278.6 297.8 282.8 C 292.8 287.0 287.5 290.8 282.0 294.1 C 276.5 297.4 270.8 300.3 264.9 302.8 C 259.1 305.2 253.0 307.1 246.9 308.6 C 240.8 310.0 234.6 311.0 228.4 311.4 C 222.3 311.8 216.0 311.7 210.0 311.0 C 204.0 310.3 197.9 309.1 192.2 307.4 C 186.5 305.7 180.9 303.4 175.6 300.8 C 170.4 298.2 165.4 295.0 160.7 291.7 C 156.1 288.3 151.8 284.6 147.7 280.7 C 143.7 276.8 140.0 272.7 136.5 268.5 C 133.0 264.3 129.7 260.0 126.6 255.6 C 123.4 251.2 120.5 246.8 117.5 242.1 C 114.6 237.5 111.7 232.8 109.0 227.8 C 106.3 222.8 103.5 217.7 101.1 212.3 C 98.6 206.8 96.2 201.0 94.3 195.0 C 92.5 189.0 90.7 182.5 89.8 176.0 C 88.9 169.4 88.3 162.4 88.7 155.6 C 89.1 148.8 90.1 141.6 92.1 134.9 C 94.1 128.3 97.0 121.5 100.6 115.5 C 104.3 109.6 108.9 103.8 114.1 99.1 C 119.2 94.3 125.3 90.1 131.5 86.9 C 137.7 83.7 144.6 81.4 151.4 79.9 C 158.1 78.4 165.2 77.9 172.0 78.0 C 178.7 78.1 185.5 79.1 191.9 80.4 C 198.2 81.7 204.3 83.8 210.0 85.8 C 215.7 87.9 221.1 90.4 226.2 92.8 C 231.3 95.2 236.1 97.8 240.8 100.3 C 245.5 102.7 250.0 105.1 254.6 107.6 C 259.1 110.0 263.6 112.3 268.2 114.8 C 272.9 117.4 277.5 119.9 282.2 122.8 C 286.9 125.7 291.7 128.7 296.3 132.3 C 300.9 135.8 305.6 139.7 309.8 144.1 C 314.0 148.6 318.1 153.5 321.5 158.8 C 325.0 164.1 328.0 169.9 330.3 175.9 C 332.5 182.0 334.2 188.5 335.1 195.0 Z" />
              <path d="M311.3 195.0 C 312.0 200.3 312.0 205.8 311.5 211.1 C 311.0 216.4 309.8 221.8 308.2 226.9 C 306.5 232.0 304.2 237.0 301.6 241.7 C 299.0 246.3 295.8 250.8 292.3 254.8 C 288.9 258.9 285.1 262.7 281.1 266.1 C 277.1 269.5 272.7 272.5 268.3 275.2 C 263.9 277.9 259.2 280.3 254.4 282.2 C 249.7 284.2 244.8 285.8 239.9 286.9 C 235.0 288.1 229.9 288.9 224.9 289.2 C 219.9 289.5 214.9 289.4 210.0 288.9 C 205.1 288.4 200.2 287.4 195.6 286.0 C 190.9 284.6 186.4 282.8 182.2 280.7 C 177.9 278.5 173.9 276.0 170.1 273.3 C 166.4 270.6 162.9 267.5 159.6 264.4 C 156.3 261.2 153.3 257.9 150.5 254.5 C 147.6 251.1 145.0 247.6 142.5 244.1 C 139.9 240.5 137.5 236.9 135.1 233.1 C 132.8 229.4 130.5 225.6 128.2 221.6 C 126.0 217.5 123.8 213.4 121.8 209.0 C 119.8 204.5 117.9 199.9 116.4 195.0 C 114.8 190.1 113.5 184.9 112.7 179.6 C 111.9 174.3 111.5 168.6 111.8 163.1 C 112.1 157.6 113.0 151.8 114.6 146.4 C 116.2 141.0 118.5 135.5 121.5 130.7 C 124.4 125.8 128.2 121.2 132.3 117.3 C 136.5 113.5 141.4 110.1 146.4 107.5 C 151.5 104.9 157.1 103.0 162.5 101.8 C 168.0 100.6 173.8 100.2 179.2 100.3 C 184.7 100.4 190.2 101.2 195.3 102.2 C 200.4 103.3 205.4 105.0 210.0 106.6 C 214.6 108.3 218.9 110.4 223.1 112.3 C 227.3 114.2 231.1 116.3 234.9 118.3 C 238.7 120.3 242.4 122.2 246.1 124.2 C 249.8 126.2 253.4 128.1 257.1 130.1 C 260.9 132.2 264.7 134.2 268.5 136.5 C 272.3 138.9 276.2 141.3 279.9 144.2 C 283.6 147.1 287.4 150.3 290.8 153.8 C 294.2 157.4 297.5 161.4 300.3 165.7 C 303.1 170.0 305.6 174.7 307.4 179.6 C 309.2 184.5 310.6 189.7 311.3 195.0 Z" />
              <path d="M287.4 195.0 C 288.0 199.0 288.0 203.2 287.6 207.3 C 287.2 211.4 286.3 215.5 285.1 219.4 C 283.8 223.3 282.1 227.1 280.0 230.7 C 278.0 234.2 275.6 237.6 273.0 240.8 C 270.4 243.9 267.4 246.7 264.3 249.3 C 261.3 251.9 258.0 254.3 254.6 256.4 C 251.2 258.4 247.6 260.2 244.0 261.7 C 240.4 263.2 236.6 264.4 232.8 265.3 C 229.1 266.2 225.2 266.8 221.4 267.0 C 217.6 267.3 213.7 267.2 210.0 266.8 C 206.3 266.4 202.5 265.6 199.0 264.6 C 195.4 263.5 192.0 262.1 188.7 260.5 C 185.5 258.9 182.4 256.9 179.5 254.9 C 176.6 252.8 174.0 250.4 171.5 248.0 C 169.0 245.7 166.7 243.1 164.5 240.5 C 162.3 237.9 160.3 235.2 158.4 232.5 C 156.4 229.8 154.6 227.0 152.8 224.2 C 150.9 221.3 149.2 218.4 147.5 215.3 C 145.8 212.2 144.1 209.1 142.6 205.7 C 141.1 202.3 139.6 198.7 138.4 195.0 C 137.2 191.3 136.2 187.3 135.6 183.2 C 135.0 179.1 134.7 174.8 134.9 170.6 C 135.2 166.4 135.8 162.0 137.0 157.8 C 138.3 153.7 140.0 149.5 142.3 145.8 C 144.6 142.1 147.4 138.6 150.6 135.6 C 153.8 132.7 157.5 130.1 161.4 128.1 C 165.2 126.1 169.5 124.7 173.7 123.8 C 177.9 122.8 182.3 122.5 186.5 122.6 C 190.6 122.6 194.8 123.3 198.8 124.1 C 202.7 124.9 206.5 126.1 210.0 127.4 C 213.5 128.7 216.8 130.3 220.0 131.8 C 223.2 133.2 226.1 134.8 229.1 136.4 C 232.0 137.9 234.7 139.4 237.6 140.9 C 240.4 142.4 243.2 143.8 246.1 145.4 C 248.9 146.9 251.8 148.5 254.7 150.3 C 257.6 152.1 260.6 154.0 263.4 156.2 C 266.3 158.4 269.2 160.8 271.8 163.5 C 274.4 166.2 276.9 169.3 279.1 172.6 C 281.2 175.8 283.1 179.5 284.5 183.2 C 285.9 186.9 286.9 191.0 287.4 195.0 Z" />
              <path d="M263.6 195.0 C 264.0 197.8 264.0 200.7 263.7 203.5 C 263.5 206.3 262.9 209.2 262.0 211.9 C 261.1 214.6 259.9 217.2 258.5 219.7 C 257.1 222.2 255.4 224.5 253.6 226.7 C 251.8 228.8 249.7 230.8 247.6 232.6 C 245.5 234.4 243.2 236.0 240.9 237.5 C 238.5 238.9 236.0 240.1 233.5 241.2 C 231.0 242.2 228.4 243.1 225.8 243.7 C 223.2 244.3 220.5 244.7 217.9 244.9 C 215.3 245.1 212.6 245.0 210.0 244.7 C 207.4 244.4 204.8 243.9 202.4 243.2 C 199.9 242.4 197.5 241.5 195.3 240.3 C 193.0 239.2 190.9 237.9 188.9 236.4 C 186.9 235.0 185.0 233.4 183.3 231.7 C 181.6 230.1 180.0 228.3 178.5 226.5 C 177.0 224.7 175.6 222.9 174.2 221.0 C 172.9 219.1 171.6 217.2 170.4 215.2 C 169.1 213.2 167.9 211.2 166.7 209.1 C 165.5 206.9 164.4 204.7 163.3 202.4 C 162.3 200.0 161.2 197.6 160.4 195.0 C 159.6 192.4 158.9 189.7 158.5 186.8 C 158.1 184.0 157.9 181.0 158.0 178.1 C 158.2 175.2 158.6 172.1 159.5 169.3 C 160.3 166.4 161.6 163.5 163.1 160.9 C 164.7 158.4 166.7 155.9 168.9 153.9 C 171.1 151.8 173.7 150.1 176.3 148.7 C 179.0 147.3 182.0 146.3 184.9 145.7 C 187.8 145.0 190.8 144.8 193.7 144.9 C 196.6 144.9 199.5 145.3 202.2 145.9 C 204.9 146.5 207.5 147.3 210.0 148.2 C 212.5 149.1 214.7 150.2 216.9 151.2 C 219.1 152.2 221.2 153.3 223.2 154.4 C 225.2 155.5 227.1 156.5 229.1 157.5 C 231.1 158.6 233.0 159.6 235.0 160.6 C 236.9 161.7 238.9 162.8 241.0 164.0 C 243.0 165.3 245.0 166.6 247.0 168.1 C 249.0 169.6 251.0 171.3 252.8 173.2 C 254.6 175.1 256.3 177.2 257.8 179.5 C 259.3 181.7 260.6 184.2 261.6 186.8 C 262.5 189.4 263.2 192.2 263.6 195.0 Z" />
            </svg>
          </div>
          <div className="cta-blob-right">
            <span className="cta-blob-right-fill" />
            <svg className="cta-svg-right" viewBox="0 0 260 260">
              <path d="M30 104 C 34 54, 72 22, 128 22 C 174 22, 208 48, 226 92" />
            </svg>
          </div>
        </div>

        <div className="container cta-container">
          <motion.div
            className="cta-text"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">JOIN US</span>
            <h2>Become the Next Featured Author</h2>
            <p>Publishing your book has never been easier.</p>
          </motion.div>

          <motion.div
            className="cta-card"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form onSubmit={sendEmail}>
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
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <div className="cta-row">
                <input
                  type="text"
                  name="bookTitle"
                  placeholder="Book Title"
                  value={formData.bookTitle}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre"
                  value={formData.genre}
                  onChange={handleChange}
                />
              </div>
              <textarea
                name="message"
                placeholder="Tell us about your book..."
                value={formData.message}
                onChange={handleChange}
                rows="3"
              />
              <button type="submit" className="btn-gold btn-block">
                Start Your Publishing Journey <FaArrowRight className="arrow-ico" />
              </button>
            </form>
            {popup.show && (
              <div
                className={`popup-message ${popup.success ? "success" : "error"}`}
              >
                {popup.msg}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
