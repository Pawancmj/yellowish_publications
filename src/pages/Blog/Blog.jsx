import { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../contexts/DataContext";
import {
  FaFeatherAlt,
  FaArrowRight,
  FaSearch,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaNewspaper,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

import { blogPosts, blogCategories } from "../../data/blogPosts";

import aboutImage from "../../assets/About.png";
import storyImage from "../../assets/Story.png";
import heroImage from "../../assets/hero.png";
import book6 from "../../assets/book6.png";
import book9 from "../../assets/book9.png";
import book13 from "../../assets/book13.png";

import "./Blog.css";

// Magazine-style floating thumbnails for the hero
const FLOATING_THUMBS = [
  { src: aboutImage, className: "ft-1", rotation: 5, label: "Behind the Cover" },
  { src: book6, className: "ft-2", rotation: -4, label: "Book Review" },
  { src: storyImage, className: "ft-3", rotation: 3, label: "Author Stories" },
  { src: book9, className: "ft-4", rotation: -3, label: "Marketing" },
  { src: heroImage, className: "ft-5", rotation: 4, label: "News" },
  { src: book13, className: "ft-6", rotation: -2, label: "Publishing" },
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

export default function Blog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addLead } = useData();

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = blogPosts.find((post) => post.featured) || blogPosts[0];

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        !query ||
        (post.title.toLowerCase() + post.excerpt.toLowerCase() + post.author.toLowerCase()).includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

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

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await addLead({
        name: email.trim(),
        email: email.trim(),
        phone: "",
        message: "Newsletter subscription",
        type: "newsletter",
        status: "new",
      });
      setSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="blog-page">
      {/* ================= HERO ================= */}
      <section className="blog-hero" aria-label="Our Blog">
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
                <FaNewspaper /> Our Blog
              </motion.span>
              <motion.h1 variants={fadeUp} custom={1}>
                Insights, Stories
                <br />& <span className="accent">Publishing Tips</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2}>
                Explore articles about writing, publishing, book marketing,
                author success stories and industry insights.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="hero-actions">
                <button
                  className="btn-gold"
                  onClick={() => scrollToSection("blog-feed")}
                >
                  Latest Articles <FaArrowRight className="arrow-ico" />
                </button>
                <Link
                  to="/about"
                  className="btn-outline"
                  onClick={(e) => handleNavClick(e, "/about")}
                >
                  <FaFeatherAlt /> Become an Author
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <motion.div
              className="thumb-mosaic"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            >
              {FLOATING_THUMBS.map((t) => (
                <div
                  className={`floating-thumb ${t.className}`}
                  key={t.className}
                >
                  <img src={t.src} alt="" loading="lazy" style={{ rotate: t.rotation }} />
                  <span className="thumb-label">{t.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ARTICLE ================= */}
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
            <span className="gold-label">EDITOR'S PICK</span>
            <h2>Featured Article</h2>
            <p>The story everyone is talking about this week.</p>
          </motion.div>

          <motion.article
            className="featured-post"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="fp-media">
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400.png?text=Article+Image";
                }}
              />
              <span className="fp-category">{featured.category}</span>
            </div>
            <div className="fp-body">
              <span className="gold-label fp-label">FEATURED</span>
              <h3>{featured.title}</h3>
              <p className="fp-excerpt">{featured.excerpt}</p>
              <div className="fp-meta">
                <div className="fp-author">
                  <img src={featured.avatar} alt={featured.author} loading="lazy" />
                  <div>
                    <span className="fp-author-name">{featured.author}</span>
                    <span className="fp-author-role">{featured.role}</span>
                  </div>
                </div>
                <span className="fp-date">
                  <FaCalendarAlt /> {featured.date}
                </span>
                <span className="fp-time">
                  <FaClock /> {featured.readingTime}
                </span>
              </div>
              <Link
                to={`/blog/${featured.slug}`}
                className="btn-gold fp-btn"
                onClick={(e) => handleNavClick(e, `/blog/${featured.slug}`)}
              >
                Read Article <FaArrowRight className="arrow-ico" />
              </Link>
            </div>
          </motion.article>
        </div>
      </section>

      {/* ================= ALL ARTICLES + FILTERS ================= */}
      <section id="blog-feed" className="feed-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="gold-label">READ & DISCOVER</span>
            <h2>Latest Articles</h2>
            <p>Fresh insights on writing, publishing, and everything in between.</p>
          </motion.div>

          {/* Category pills */}
          <nav className="cat-pills" aria-label="Blog categories">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Search bar */}
          <div className="blog-search">
            <FaSearch className="search-ico" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Grid */}
          {filteredPosts.length > 0 ? (
            <div className="posts-grid">
              {filteredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  className="post-card"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="post-media-link"
                    onClick={(e) => handleNavClick(e, `/blog/${post.slug}`)}
                  >
                    <div className="post-media">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x400.png?text=Article+Image";
                        }}
                      />
                      <span className="post-category">{post.category}</span>
                    </div>
                  </Link>
                  <div className="post-body">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="post-title"
                      onClick={(e) => handleNavClick(e, `/blog/${post.slug}`)}
                    >
                      {post.title}
                    </Link>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-meta">
                      <div className="post-author">
                        <FaUser className="post-user-ico" />
                        <span>{post.author}</span>
                      </div>
                      <span className="post-date">
                        <FaCalendarAlt /> {post.date}
                      </span>
                      <span className="post-time">
                        <FaClock /> {post.readingTime}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="post-readmore"
                      onClick={(e) => handleNavClick(e, `/blog/${post.slug}`)}
                    >
                      Read More <FaArrowRight className="arrow-ico" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaSearch className="empty-icon" />
              <h3>No articles found</h3>
              <p>
                We couldn't find any articles matching your search. Try a
                different keyword or category.
              </p>
              <button
                className="btn-gold empty-reset"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              >
                <FaSearch className="reset-ico" /> Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= NEWSLETTER CTA ================= */}
      <section className="newsletter-cta">
        <div className="cta-decor" aria-hidden="true">
          <div className="cta-blob-left">
            <span className="cta-blob-left-fill" />
          </div>
          <div className="cta-blob-right">
            <span className="cta-blob-right-fill" />
          </div>
        </div>
        <div className="container newsletter-inner">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">STAY IN THE LOOP</span>
            <h2>Never Miss a Publishing Update</h2>
            <p>
              Get writing tips, author stories, and industry news delivered
              straight to your inbox. Join our growing community of readers and
              writers.
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                <FaCheckCircle />
                <span>Thank you! You're on the list — welcome aboard.</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <div className="newsletter-field">
                  <FaEnvelope className="nl-ico" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-gold nl-btn">
                  Subscribe <FaArrowRight className="arrow-ico" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
