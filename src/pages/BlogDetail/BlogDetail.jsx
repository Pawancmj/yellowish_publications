import { useState, useEffect, useMemo, useRef } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../contexts/DataContext";
import {
  FaChevronRight,
  FaCalendarAlt,
  FaRegClock,
  FaClock,
  FaEye,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaLink,
  FaCheck,
  FaQuoteLeft,
  FaFeatherAlt,
  FaArrowRight,
  FaArrowLeft,
  FaEnvelope,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaReply,
  FaHeart,
  FaRegHeart,
  FaBookOpen,
  FaPenNib,
} from "react-icons/fa";

import { blogPosts } from "../../data/blogPosts";

import author1 from "../../assets/author1.png";
import author2 from "../../assets/author2.png";
import author3 from "../../assets/author3.png";

import book6 from "../../assets/book6.png";
import book9 from "../../assets/book9.png";
import book13 from "../../assets/book13.png";

import "./BlogDetail.css";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const CTA_BOOKS = [
  { src: book6, className: "cb-1", rotation: 5 },
  { src: book9, className: "cb-2", rotation: -4 },
  { src: book13, className: "cb-3", rotation: 2 },
];

const INITIAL_COMMENTS = [
  {
    id: 1,
    name: "Riya Sharma",
    date: "2 days ago",
    text: "This is exactly the clarity I needed. I've been sitting on my first draft for months — the tips here make the path feel achievable. Thank you!",
    avatar: author2,
    likes: 12,
    replies: [
      {
        id: 11,
        name: "Aman Shukla",
        date: "1 day ago",
        text: "So glad it resonated, Riya! Keep the momentum — one page at a time is still a book.",
        avatar: author1,
        likes: 4,
      },
    ],
  },
  {
    id: 2,
    name: "Vikram Nair",
    date: "1 day ago",
    text: "The section on the editorial pipeline is a great window into how professional publishing really works. Would love a follow-up on costing!",
    avatar: author3,
    likes: 7,
    replies: [],
  },
];

// ---------------------------------------------------------------
// Reading progress — thin golden line fixed to the top
// ---------------------------------------------------------------
function ReadingProgress({ progress }) {
  return (
    <div className="reading-progress" aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
    </div>
  );
}

// ---------------------------------------------------------------
// Circular progress ring (sidebar)
// ---------------------------------------------------------------
function ProgressRing({ progress }) {
  const size = 64;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="ring-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="ring-fg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <span className="ring-num">{Math.round(progress * 100)}%</span>
    </div>
  );
}

// ---------------------------------------------------------------
// Content block renderer
// ---------------------------------------------------------------
function ContentBlock({ block, dropCap }) {
  switch (block.type) {
    case "p":
      return <p className={dropCap ? "drop-cap" : ""}>{block.text}</p>;
    case "h2":
      return (
        <h2 id={block.id} className="article-h2">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 id={block.id} className="article-h3">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="article-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="article-list ordered">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="article-quote">
          <FaQuoteLeft className="quote-mark" />
          <p>{block.text}</p>
          {block.cite && <cite>— {block.cite}</cite>}
        </blockquote>
      );
    case "image":
      return (
        <figure className="article-figure">
          <img src={block.src} alt={block.alt || ""} loading="lazy" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case "table":
      return (
        <div className="table-wrap">
          <table className="article-table">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "code":
      return (
        <pre className="article-code">
          <code>{block.code}</code>
        </pre>
      );
    case "highlight":
      return (
        <div className="article-highlight">
          {block.title && <strong className="ah-title">{block.title}</strong>}
          <p>{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------
// Table of contents
// ---------------------------------------------------------------
function TocNav({ toc, activeHeading, onNavigate }) {
  if (!toc.length) return null;
  return (
    <nav className="toc-nav" aria-label="Table of contents">
      <span className="toc-heading">On this page</span>
      <ul>
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? "toc-sub" : ""}>
            <button
              type="button"
              className={activeHeading === item.id ? "active" : ""}
              onClick={() => onNavigate(item.id)}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ---------------------------------------------------------------
// Share buttons (vertical, used in the floating sidebar)
// ---------------------------------------------------------------
function ShareButtons({ shareUrl, title }) {
  const [copied, setCopied] = useState(false);

  const openShare = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=640,height=480");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="share-buttons" aria-label="Share this article">
      <button
        className="share-btn fb"
        aria-label="Share on Facebook"
        onClick={() =>
          openShare(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
          )
        }
      >
        <FaFacebookF />
      </button>
      <button
        className="share-btn tw"
        aria-label="Share on Twitter"
        onClick={() =>
          openShare(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`
          )
        }
      >
        <FaTwitter />
      </button>
      <button
        className="share-btn li"
        aria-label="Share on LinkedIn"
        onClick={() =>
          openShare(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
          )
        }
      >
        <FaLinkedinIn />
      </button>
      <button
        className="share-btn copy"
        aria-label="Copy link"
        onClick={handleCopy}
      >
        {copied ? <FaCheck /> : <FaLink />}
      </button>
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addLead } = useData();

  const index = blogPosts.findIndex((p) => p.slug === slug);
  const post = index >= 0 ? blogPosts[index] : null;

  const articleRef = useRef(null);

  const [pageProgress, setPageProgress] = useState(0);
  const [articleProgress, setArticleProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [liked, setLiked] = useState({});
  const [commentForm, setCommentForm] = useState({ name: "", text: "" });
  const [commentError, setCommentError] = useState("");

  const toc = useMemo(() => {
    if (!post) return [];
    return post.content
      .filter((b) => b.type === "h2" || b.type === "h3")
      .map((b) => ({ id: b.id, text: b.text, level: b.type === "h3" ? 3 : 2 }));
  }, [post]);

  const related = useMemo(() => {
    if (!post) return [];
    const sameCat = blogPosts.filter(
      (p) => p.id !== post.id && p.category === post.category
    );
    const others = blogPosts.filter(
      (p) => p.id !== post.id && p.category !== post.category
    );
    return [...sameCat, ...others].slice(0, 3);
  }, [post]);

  const latest = useMemo(
    () => blogPosts.filter((p) => p.id !== post?.id).slice(0, 3),
    [post]
  );

  const popular = useMemo(
    () =>
      blogPosts
        .filter((p) => p.id !== post?.id)
        .sort((a, b) => parseFloat(b.views) - parseFloat(a.views))
        .slice(0, 3),
    [post]
  );

  const prevPost = index > 0 ? blogPosts[index - 1] : null;
  const nextPost =
    index >= 0 && index < blogPosts.length - 1 ? blogPosts[index + 1] : null;

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

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Page + article reading progress
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setPageProgress(total > 0 ? (window.scrollY / total) * 100 : 0);

      const el = articleRef.current;
      if (el) {
        const span = el.offsetHeight - window.innerHeight;
        const done = -el.getBoundingClientRect().top;
        setArticleProgress(span > 0 ? Math.min(1, Math.max(0, done / span)) : 0);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scroll spy — highlight the heading currently in view
  useEffect(() => {
    if (!toc.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        });
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await addLead({
        name: email.trim(),
        email: email.trim(),
        phone: "",
        message: "Newsletter subscription — blog detail",
        type: "newsletter",
        status: "new",
      });
      setSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLike = (commentId) => {
    setLiked((prev) => {
      const isLiked = !!prev[commentId];
      return { ...prev, [commentId]: !isLiked };
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.text.trim()) {
      setCommentError("Please add your name and a comment before posting.");
      return;
    }
    setCommentError("");
    setComments((prev) => [
      {
        id: Date.now(),
        name: commentForm.name.trim(),
        date: "Just now",
        text: commentForm.text.trim(),
        avatar: author1,
        likes: 0,
        replies: [],
      },
      ...prev,
    ]);
    setCommentForm({ name: "", text: "" });
  };

  const goToContact = () => {
    if (location.pathname === "/") {
      setTimeout(() => {
        document
          .querySelector(".cta-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      navigate("/");
      setTimeout(() => {
        document
          .querySelector(".cta-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  if (!post) return <Navigate to="/blog" replace />;

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const SidebarInner = (
    <div className="sidebar-inner">
      <div className="sb-author">
        <img src={post.avatar} alt={post.author} loading="lazy" />
        <strong>{post.author}</strong>
        <span>{post.role}</span>
      </div>
      <div className="sb-progress">
        <ProgressRing progress={articleProgress} />
        <span className="sb-progress-label">Reading</span>
      </div>
      <div className="sb-share">
        <span className="sb-title">Share</span>
        <ShareButtons shareUrl={shareUrl} title={post.title} />
      </div>
      <TocNav
        toc={toc}
        activeHeading={activeHeading}
        onNavigate={scrollToHeading}
      />
    </div>
  );

  return (
    <div className="detail-page">
      <ReadingProgress progress={pageProgress} />

      {/* ================= BREADCRUMB ================= */}
      <div className="breadcrumb-bar">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="bc-link" onClick={(e) => handleNavClick(e, "/")}>
              Home
            </Link>
            <FaChevronRight className="bc-sep" />
            <Link to="/blog" className="bc-link" onClick={(e) => handleNavClick(e, "/blog")}>
              Blog
            </Link>
            <FaChevronRight className="bc-sep" />
            <span className="bc-current">{post.category}</span>
          </nav>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="detail-hero" aria-label="Article header">
        <div className="hero-blob" aria-hidden="true" />
        <div className="hero-blob-two" aria-hidden="true" />

        <div className="container hero-inner">
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <motion.span variants={fadeUp} className="hero-badge">
              {post.category}
            </motion.span>
            <motion.h1 variants={fadeUp} custom={1}>
              {post.title}
            </motion.h1>
            <motion.div variants={fadeUp} custom={2} className="hero-meta">
              <span className="hm-author">
                <img src={post.avatar} alt={post.author} loading="lazy" />
                <span className="hm-name">{post.author}</span>
              </span>
              <span className="hm-dot">•</span>
              <span className="hm-item">
                <FaCalendarAlt /> {post.date}
              </span>
              <span className="hm-dot">•</span>
              <span className="hm-item">
                <FaRegClock /> {post.readingTime}
              </span>
              <span className="hm-dot">•</span>
              <span className="hm-item">
                <FaEye /> {post.views} views
              </span>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="hero-share">
              <ShareButtons shareUrl={shareUrl} title={post.title} />
            </motion.div>
          </motion.div>

          <motion.figure
            className="hero-figure"
            initial={{ opacity: 0, y: 30, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/1200x675.png?text=Article+Image";
              }}
            />
          </motion.figure>
        </div>
      </section>

      {/* ================= READING ================= */}
      <section className="reading-section">
        <div className="reading-wrap">
          {/* Floating sticky sidebar — desktop */}
          <aside className="float-sidebar" aria-label="Article navigation">
            {SidebarInner}
          </aside>

          <article className="article-body" ref={articleRef}>
            {post.content.map((block, i) => (
              <ContentBlock key={i} block={block} dropCap={i === 0} />
            ))}
          </article>
        </div>

        {/* Sidebar content moved below the article on smaller screens */}
        <div className="sidebar-bottom">
          <div className="container">{SidebarInner}</div>
        </div>
      </section>

      {/* ================= AUTHOR ================= */}
      <section className="author-section">
        <div className="container">
          <motion.div
            className="author-glass"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="ag-media">
              <img src={post.avatar} alt={post.author} className="ag-photo" loading="lazy" />
              <span className="ag-glint" aria-hidden="true" />
            </div>
            <div className="ag-body">
              <span className="ag-label">ABOUT THE AUTHOR</span>
              <h3>{post.author}</h3>
              <p className="ag-bio">{post.authorBio}</p>
              <div className="ag-stats">
                <span>
                  <FaBookOpen /> {post.authorBooks}
                </span>
                <span>
                  <FaPenNib /> {post.role}
                </span>
              </div>
              <div className="ag-actions">
                <Link
                  to="/authors"
                  className="btn-gold"
                  onClick={(e) => handleNavClick(e, "/authors")}
                >
                  View Author Profile <FaArrowRight className="arrow-ico" />
                </Link>
                <div className="ag-social">
                  <a
                    href={post.authorSocial.twitter}
                    aria-label="Twitter"
                    className="share-btn tw"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href={post.authorSocial.linkedin}
                    aria-label="LinkedIn"
                    className="share-btn li"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    href={post.authorSocial.facebook}
                    aria-label="Facebook"
                    className="share-btn fb"
                  >
                    <FaFacebookF />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= PREV / NEXT ================= */}
      <section className="pn-section">
        <div className="container">
          <div className="pn-row">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="pn-link prev"
                onClick={(e) => handleNavClick(e, `/blog/${prevPost.slug}`)}
              >
                <FaArrowLeft className="pn-ico" />
                <span>
                  <small>Previous</small>
                  <strong>{prevPost.title}</strong>
                </span>
              </Link>
            ) : (
              <span className="pn-placeholder" />
            )}
            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="pn-link next"
                onClick={(e) => handleNavClick(e, `/blog/${nextPost.slug}`)}
              >
                <span>
                  <small>Next</small>
                  <strong>{nextPost.title}</strong>
                </span>
                <FaArrowRight className="pn-ico" />
              </Link>
            ) : (
              <span className="pn-placeholder" />
            )}
          </div>
        </div>
      </section>

      {/* ================= RELATED ARTICLES ================= */}
      <section className="related-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="gold-label">KEEP READING</span>
            <h2>Related Stories</h2>
            <p>Hand-picked articles that pair beautifully with this one.</p>
          </motion.div>

          <div className="related-grid">
            {related.map((p, i) => (
              <motion.article
                key={p.id}
                className="related-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/blog/${p.slug}`}
                  className="rc-link"
                  onClick={(e) => handleNavClick(e, `/blog/${p.slug}`)}
                >
                  <div className="rc-media">
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <div className="rc-overlay" />
                    <span className="rc-cat">{p.category}</span>
                    <div className="rc-body">
                      <h3 className="rc-title">{p.title}</h3>
                      <span className="rc-time">
                        <FaClock /> {p.readingTime}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LATEST / POPULAR ================= */}
      <section className="explore-section">
        <div className="container">
          <div className="explore-grid">
            <div className="explore-col">
              <span className="gold-label">FRESH</span>
              <h3>Latest Articles</h3>
              {latest.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="explore-item"
                  onClick={(e) => handleNavClick(e, `/blog/${p.slug}`)}
                >
                  <img src={p.image} alt="" loading="lazy" />
                  <span>
                    <strong>{p.title}</strong>
                    <small>
                      <FaCalendarAlt /> {p.date}
                    </small>
                  </span>
                </Link>
              ))}
            </div>
            <div className="explore-col">
              <span className="gold-label">READERS' FAVOURITES</span>
              <h3>Popular Articles</h3>
              {popular.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="explore-item"
                  onClick={(e) => handleNavClick(e, `/blog/${p.slug}`)}
                >
                  <img src={p.image} alt="" loading="lazy" />
                  <span>
                    <strong>{p.title}</strong>
                    <small>
                      <FaEye /> {p.views} views
                    </small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMMENTS ================= */}
      <section className="comments-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="gold-label">JOIN THE CONVERSATION</span>
            <h2>Discussion ({comments.length})</h2>
            <p>Thoughts, questions, and kind words from readers.</p>
          </motion.div>

          <div className="comments-wrap">
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <div className="cf-fields">
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentForm.name}
                  onChange={(e) =>
                    setCommentForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <textarea
                placeholder="Share your thoughts on this article..."
                rows={4}
                value={commentForm.text}
                onChange={(e) =>
                  setCommentForm((f) => ({ ...f, text: e.target.value }))
                }
              />
              {commentError && <p className="cf-error">{commentError}</p>}
              <button type="submit" className="btn-gold cf-submit">
                Post Comment <FaArrowRight className="arrow-ico" />
              </button>
            </form>

            <div className="comment-list">
              {comments.map((c) => {
                const isLiked = !!liked[c.id];
                const displayLikes = c.likes + (isLiked ? 1 : 0);
                return (
                  <div className="comment" key={c.id}>
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="c-avatar"
                      loading="lazy"
                    />
                    <div className="c-body">
                      <div className="c-meta">
                        <strong className="c-name">{c.name}</strong>
                        <span className="c-date">{c.date}</span>
                      </div>
                      <p className="c-text">{c.text}</p>
                      <div className="c-actions">
                        <button
                          className={`c-like ${isLiked ? "active" : ""}`}
                          aria-pressed={isLiked}
                          onClick={() => toggleLike(c.id)}
                        >
                          {isLiked ? <FaHeart /> : <FaRegHeart />} {displayLikes}
                        </button>
                        <button className="c-reply">
                          <FaReply /> Reply
                        </button>
                      </div>
                      {c.replies.map((r) => (
                        <div className="comment reply" key={r.id}>
                          <img
                            src={r.avatar}
                            alt={r.name}
                            className="c-avatar"
                            loading="lazy"
                          />
                          <div className="c-body">
                            <div className="c-meta">
                              <strong className="c-name">{r.name}</strong>
                              <span className="c-date">{r.date}</span>
                            </div>
                            <p className="c-text">{r.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="newsletter-cta">
        <div className="cta-decor" aria-hidden="true">
          <div className="cta-blob-left">
            <span className="cta-blob-left-fill" />
          </div>
          <div className="cta-blob-right">
            <span className="cta-blob-right-fill" />
          </div>
        </div>
        <div className="container">
          <motion.div
            className="newsletter-card"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="nl-illustration" aria-hidden="true">
              <div className="nl-orbit orbit-one" />
              <div className="nl-orbit orbit-two" />
              <div className="nl-envelope">
                <FaEnvelopeOpenText />
              </div>
            </div>
            <span className="gold-label">NEWSLETTER</span>
            <h2>Stay Updated With Publishing Insights</h2>
            <p>
              Writing tips, author stories, and industry news — delivered
              straight to your inbox. No noise, just what matters.
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

      {/* ================= FINAL CTA ================= */}
      <section className="final-cta">
        <div className="cta-decor" aria-hidden="true">
          <div className="cta-blob-left">
            <span className="cta-blob-left-fill" />
          </div>
          <div className="cta-blob-right">
            <span className="cta-blob-right-fill" />
          </div>
        </div>
        <div className="container">
          <div className="final-cta-grid">
            <motion.div
              className="final-copy"
              initial={{ opacity: 0, x: -26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="gold-label">TAKE THE NEXT STEP</span>
              <h2>Ready To Publish Your Story?</h2>
              <p>
                From editing to cover design to global distribution, we walk
                with you at every step. Your book deserves to be read.
              </p>
              <div className="final-cta-actions">
                <Link
                  to="/about"
                  className="btn-gold"
                  onClick={(e) => handleNavClick(e, "/about")}
                >
                  <FaFeatherAlt /> Publish Your Book
                </Link>
                <button className="btn-outline" onClick={goToContact}>
                  <FaEnvelope /> Contact Us
                </button>
              </div>
            </motion.div>

            <motion.div
              className="final-illustration"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              aria-hidden="true"
            >
              <div className="cta-blob-circle" />
              <div
                className="cta-books"
                style={{ rotate: "0deg" }}
              >
                {CTA_BOOKS.map((b) => (
                  <div className={`cta-book ${b.className}`} key={b.className}>
                    <img
                      src={b.src}
                      alt=""
                      loading="lazy"
                      style={{ rotate: b.rotation }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
