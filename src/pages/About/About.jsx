import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../contexts/DataContext";
import { updatePageMeta, resetPageMeta } from "../../utils/seo";
import "./About.css";

// Assets — existing publishing / author imagery only.
import heroVisual from "../../assets/About.png";
import storyImage from "../../assets/Story.png";
import testimonialPhoto from "../../assets/author4.png";

// React Icons
import {
  FaArrowRight,
  FaGlobe,
  FaHeart,
  FaHandshake,
  FaAward,
  FaBullhorn,
  FaPalette,
  FaBookOpen,
  FaFileAlt,
  FaSearch,
  FaPen,
  FaQuoteLeft,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const SERVICES = [
  {
    num: "01",
    icon: FaPen,
    title: "Editing & Proofreading",
    desc: "Professional developmental editing and careful proofreading that polish your manuscript before it reaches readers.",
  },
  {
    num: "02",
    icon: FaPalette,
    title: "Book Design & Formatting",
    desc: "Beautiful cover design and clean interior formatting crafted for print and digital editions that look premium.",
  },
  {
    num: "03",
    icon: FaBookOpen,
    title: "Publishing & Distribution",
    desc: "Seamless publishing with global distribution across Amazon, Flipkart, Google Play and 150+ countries.",
  },
  {
    num: "04",
    icon: FaBullhorn,
    title: "Marketing & Author Support",
    desc: "Dedicated campaigns and hands-on author support that help your book find the right audience.",
  },
];

const WHY_CHOOSE = [
  {
    num: "01",
    icon: FaHeart,
    title: "Author First",
    desc: "Your story, your vision. We place authors at the heart of every decision we make.",
  },
  {
    num: "02",
    icon: FaAward,
    title: "Professional Quality",
    desc: "Editorial, design and print standards that give every book a polished, shelf-ready finish.",
  },
  {
    num: "03",
    icon: FaHandshake,
    title: "End-to-End Support",
    desc: "From manuscript to market, one trusted team walks beside you at every step.",
  },
  {
    num: "04",
    icon: FaGlobe,
    title: "Global Reach",
    desc: "Distribution across 150+ countries puts your work in front of readers worldwide.",
  },
];

const JOURNEY = [
  {
    num: "01",
    icon: FaFileAlt,
    title: "Share Your Manuscript",
    desc: "Send us your manuscript and we begin the journey together.",
  },
  {
    num: "02",
    icon: FaSearch,
    title: "Editorial Review",
    desc: "Our editors assess your work and map the path to publication.",
  },
  {
    num: "03",
    icon: FaPen,
    title: "Editing & Design",
    desc: "Refine your text, design the cover, and format the interior.",
  },
  {
    num: "04",
    icon: FaBookOpen,
    title: "Publishing",
    desc: "Your book is published in print and digital formats.",
  },
  {
    num: "05",
    icon: FaGlobe,
    title: "Distribution",
    desc: "Your book reaches readers across the globe.",
  },
];

const STATS = [
  { value: "15K+", label: "Authors" },
  { value: "20K+", label: "Books Published" },
  { value: "150+", label: "Countries" },
  { value: "24/7", label: "Author Support" },
];

// Real testimonial already used across the site (Homepage testimonials).
const TESTIMONIAL = {
  name: "Sarfaraz Khader",
  role: "Bestselling Author",
  quote:
    "They treated my manuscript like their own. Patient, professional, and incredibly supportive throughout.",
  photo: testimonialPhoto,
};

export default function About() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authors, getAuthorPhoto } = useData();

  // SEO — title, description, canonical for the About page.
  useEffect(() => {
    updatePageMeta({
      title: "About Us",
      description:
        "Yellowish Publication helps authors transform ideas and manuscripts into professionally edited, designed, published and distributed books — reaching readers across 150+ countries.",
      canonical: "/about",
      keywords:
        "about yellowish publication, book publishing company, self publishing, manuscript to book, publishing services",
    });
    return resetPageMeta;
  }, []);

  const featuredAuthors = authors.slice(0, 3);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) scrollToTop();
    else {
      navigate(path);
      setTimeout(scrollToTop, 300);
    }
  };

  return (
    <div className="about-page">
      {/* ================= HERO ================= */}
      <section className="about-hero" aria-label="About Yellowish Publication">
        <div className="about-hero-bg" aria-hidden="true">
          <div className="ah-blob-right">
            <span className="ah-glow" />
          </div>
          <div className="ah-wave-left" />
          <div className="ah-shape shape-a" />
          <div className="ah-shape shape-b" />
          <div className="ah-shape shape-c" />
        </div>

        <div className="about-hero-inner">
          <motion.div
            className="ah-copy"
            variants={staggerWrap}
            initial="hidden"
            animate="visible"
          >
<motion.h1 variants={slideFromLeft} custom={1}>
              Turning Stories Into
              <br />
              <span className="ah-accent">Books That Matter</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2}>
              Yellowish Publication helps authors transform ideas and
              manuscripts into professionally edited, designed, published and
              distributed books.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="ah-actions">
              <Link to="/store" className="btn-gold">
                Explore Our Books <FaArrowRight className="arrow-ico" />
              </Link>
              <Link to="/authors" className="ah-ghost">
                Meet Our Authors
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="ah-visual"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className="ah-frame">
              <img
                src={heroVisual}
                alt="An author at work with Yellowish Publication"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="about-story" aria-label="Our story">
        <div className="about-story-bg" aria-hidden="true">
          <span className="story-blob" />
          <span className="story-ring" />
        </div>
        <div className="container story-grid">
          <motion.div
            className="story-visual"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="story-frame">
              <img
                src={storyImage}
                alt="Inside the world of Yellowish Publication"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            className="story-copy"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="gold-label">Our Story</span>
            <h2>Built to Help Authors Be Heard</h2>
            <p>
              Yellowish Publication began with a simple belief — that every
              voice deserves to reach readers. What started as a small team of
              publishing enthusiasts has grown into a trusted partner for
              authors across the globe.
            </p>
            <p>
              From editing and design to distribution and marketing, we walk
              beside authors at every stage of the journey, turning ambitious
              ideas into beautifully finished books.
            </p>
            <blockquote className="story-highlight">
              "Every manuscript has a story. Our job is to help it reach the
              right reader."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="about-mission" aria-label="Our mission and vision">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">What Drives Us</span>
            <h2>Mission &amp; Vision</h2>
            <p>The purpose we serve and the future we're building for storytellers.</p>
          </motion.div>

          <div className="mv-wrap">
            <motion.article
              className="mv-panel mv-mission"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mv-icon">
                <FaPen />
              </span>
              <span className="mv-eyebrow">Our Mission</span>
              <h3>Empower Every Author</h3>
              <p>
                To empower authors with accessible publishing solutions,
                ensuring every voice finds its audience.
              </p>
            </motion.article>

            <motion.article
              className="mv-panel mv-vision"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.12 }}
            >
              <span className="mv-icon">
                <FaGlobe />
              </span>
              <span className="mv-eyebrow">Our Vision</span>
              <h3>Stories Without Borders</h3>
              <p>
                To be the most trusted global platform for storytellers and
                knowledge creators.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ================= OUR EXPERTISE ================= */}
      <section className="about-services" aria-label="Our expertise">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">Our Expertise</span>
            <h2>Everything You Need to Publish With Confidence</h2>
            <p>Four pillars of publishing, handled end-to-end by one team.</p>
          </motion.div>

          <div className="services-grid">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.num}
                  className="service-card"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                >
                  <span className="svc-num">{service.num}</span>
                  <span className="svc-icon">
                    <Icon />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHY AUTHORS CHOOSE US ================= */}
      <section className="about-why" aria-label="Why authors choose us">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">The Yellowish Difference</span>
            <h2>Why Authors Choose Yellowish</h2>
            <p>The reasons authors trust us with their most important work.</p>
          </motion.div>

          <div className="why-grid">
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.num}
                  className={`why-card why-card-${i % 2 === 0 ? "pink" : "gold"}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                >
                  <div className="why-top">
                    <span className="why-num">{item.num}</span>
                    <span className="why-icon">
                      <Icon />
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PUBLISHING JOURNEY ================= */}
      <section className="about-journey" aria-label="Publishing journey">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">How It Works</span>
            <h2>From Manuscript to Published Book</h2>
            <p>A clear, guided path from first draft to reader's shelf.</p>
          </motion.div>

          <div className="journey-track">
            {JOURNEY.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  className="journey-step"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="journey-node">
                    <span className="journey-num">{step.num}</span>
                    <span className="journey-ico">
                      <Icon />
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= NUMBERS / MILESTONES ================= */}
      <section className="about-stats" aria-label="Our numbers">
        <div className="about-stats-bg" aria-hidden="true">
          <span className="stats-blob stats-blob-a" />
          <span className="stats-blob stats-blob-b" />
          <span className="stats-ring" />
        </div>
        <div className="container stats-grid">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= BUILT AROUND AUTHORS ================= */}
      <section className="about-authors" aria-label="Built around authors">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label">Our Community</span>
            <h2>Built Around Authors</h2>
            <p>Writers from every genre trust Yellowish to tell their stories.</p>
          </motion.div>

          <div className="authors-row">
            {featuredAuthors.map((author, i) => (
              <motion.a
                key={author.id}
                className="author-mini"
                href={`/author/${author.id}`}
                onClick={(e) => handleNavClick(e, `/author/${author.id}`)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <span className="am-avatar">
                  <img
                    src={getAuthorPhoto(author)}
                    alt={author.name}
                    loading="lazy"
                  />
                </span>
                <span className="am-name">{author.name}</span>
                <span className="am-genre">
                  {author.genre ? author.genre.split("/")[0].trim() : "Various"}
                </span>
              </motion.a>
            ))}
          </div>

          <motion.div
            className="authors-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/authors" className="btn-gold">
              Meet Our Authors <FaArrowRight className="arrow-ico" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= AUTHOR QUOTE ================= */}
      <section className="about-quote" aria-label="Author testimonial">
        <div className="container">
          <motion.figure
            className="quote-wrap"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <span className="quote-mark" aria-hidden="true">
              <FaQuoteLeft />
            </span>
            <blockquote>{TESTIMONIAL.quote}</blockquote>
            <figcaption className="quote-author">
              <img src={TESTIMONIAL.photo} alt={TESTIMONIAL.name} loading="lazy" />
              <span className="qa-meta">
                <strong>{TESTIMONIAL.name}</strong>
                <span className="qa-role">{TESTIMONIAL.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="about-final-cta" aria-label="Publish your book with us">
        <div className="final-cta-bg" aria-hidden="true">
          <span className="final-blob final-blob-a" />
          <span className="final-blob final-blob-b" />
          <span className="final-ring" />
        </div>
        <div className="container final-cta-inner">
          <motion.div
            className="final-cta-copy"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-label gold-on-navy">Your Story Matters</span>
            <h2>Your Story Deserves to Be Published.</h2>
            <p>
              Take the next step and let Yellowish Publication help bring your
              book to readers.
            </p>
            <div className="final-cta-actions">
              <Link to="/authors" className="btn-gold">
                Become an Author <FaPen />
              </Link>
              <Link to="/store" className="final-cta-ghost">
                <FaBookOpen /> Explore Books
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
