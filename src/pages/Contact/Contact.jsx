import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../contexts/DataContext";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaWhatsapp,
  FaBookOpen,
  FaArrowRight,
  FaFeatherAlt,
  FaPen,
  FaLightbulb,
  FaHandshake,
  FaGlobe,
  FaChevronDown,
  FaCommentDots,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaSpinner,
  FaPaperclip,
} from "react-icons/fa";

import book1 from "../../assets/book1.png";
import book5 from "../../assets/book5.png";
import book9 from "../../assets/book9.png";
import book13 from "../../assets/book13.png";

import "./Contact.css";

const CONTACT_INFO = [
  {
    icon: FaMapMarkerAlt,
    title: "Office Address",
    value: "Ghaziabad, Uttar Pradesh, India",
    href: "https://maps.google.com/?q=Ghaziabad,Uttar+Pradesh,India",
    target: "_blank",
  },
  {
    icon: FaPhoneAlt,
    title: "Phone Number",
    value: "+91 98715 69192",
    href: "tel:+919871569192",
  },
  {
    icon: FaEnvelope,
    title: "Email",
    value: "Yellowishpublication1@gmail.com",
    href: "mailto:Yellowishpublication1@gmail.com",
  },
  {
    icon: FaClock,
    title: "Working Hours",
    value: "Mon – Sat · 9:00 AM – 7:00 PM",
  },
];

const WHY_CONTACT = [
  {
    icon: FaPaperPlane,
    title: "Quick Response",
    desc: "Every enquiry is answered within 24 hours by a real member of our publishing team.",
  },
  {
    icon: FaLightbulb,
    title: "Publishing Guidance",
    desc: "Get honest, expert advice on editing, design, printing, and the right package for your book.",
  },
  {
    icon: FaHandshake,
    title: "Author Support",
    desc: "From manuscript to market, we walk beside you at every step of the journey.",
  },
  {
    icon: FaGlobe,
    title: "Global Distribution",
    desc: "Publish and sell your book across 150+ countries through Amazon, Flipkart and more.",
  },
];

const FAQS = [
  {
    q: "How long does publishing take?",
    a: "Most titles move from accepted manuscript to published book within 30–60 days. The exact timeline depends on the package you choose and the amount of editing and design work required.",
  },
  {
    q: "How much does it cost?",
    a: "Publishing packages start at a transparent, all-inclusive price. Reach out to us and we'll share the package that fits your book, budget, and goals — with no hidden charges.",
  },
  {
    q: "Do you help with editing?",
    a: "Yes. Our editorial team provides professional proofreading, line editing, and structural feedback to make sure your manuscript reads beautifully before it reaches readers.",
  },
  {
    q: "Can I publish internationally?",
    a: "Absolutely. Our books are distributed globally through Amazon, Flipkart, Google Play Books, Apple Books, Barnes & Noble, and more — in print and digital formats.",
  },
];

const BOOK_TYPES = [
  "Fiction",
  "Non-Fiction",
  "Academic",
  "Poetry",
  "Children's Books",
  "Self-Help",
  "Biography",
  "Other",
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

export default function Contact() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addLead } = useData();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    bookType: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

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

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please enter your full name.";
    if (!form.email.trim()) errs.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Please enter a valid email address.";
    if (!form.phone.trim()) errs.phone = "Please enter your phone number.";
    else if (!/^[0-9]{10}$/.test(form.phone.trim()))
      errs.phone = "Phone number must be exactly 10 digits.";
    if (!form.subject.trim()) errs.subject = "Please add a subject.";
    if (!form.bookType) errs.bookType = "Please select a book type.";
    if (!form.message.trim()) errs.message = "Please write your message.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    try {
      await addLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: `${form.subject} · Book Type: ${form.bookType}\n\n${form.message}`,
        type: "contact",
        status: "new",
      });
      setToast("Message sent successfully! We'll get back to you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        bookType: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setToast("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      {/* ================= HERO ================= */}
      <section className="contact-hero" aria-label="Contact Yellowish Publication">
        <div className="contact-hero-bg" aria-hidden="true">
          <div className="chero-blob-right">
            <span className="chero-glow" />
          </div>
          <div className="chero-wave-left" />
          <div className="chero-shape shape-a" />
          <div className="chero-shape shape-b" />
          <div className="chero-shape shape-c" />
        </div>

        <div className="contact-hero-inner">
          <div className="contact-hero-copy">
            <motion.div variants={staggerWrap} initial="hidden" animate="visible">
              <motion.span variants={fadeUp} className="contact-hero-badge">
                <FaEnvelope /> Contact Yellowish Publication
              </motion.span>
              <motion.h1 variants={fadeUp} custom={1}>
                Let's Start Your
                <br />
                <span className="accent">Publishing Journey</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2}>
                Whether you're ready to publish your first book or simply have
                questions, we're here to help.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="contact-hero-actions">
                <button
                  className="btn-gold"
                  onClick={() => scrollToSection("contact-form")}
                >
                  Contact Now <FaArrowRight className="arrow-ico" />
                </button>
                <button
                  className="contact-btn-outline"
                  onClick={(e) => handleNavClick(e, "/store")}
                >
                  <FaBookOpen /> Explore Books
                </button>
              </motion.div>
            </motion.div>
          </div>

          <div className="contact-hero-visual" aria-hidden="true">
            <motion.div
              className="contact-floating-stage"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
              <span className="pg-glow pg-glow-pink" />
              <span className="pg-glow pg-glow-cream" />
              <span className="pg-glow pg-glow-white" />

              <div className="pbook pbook-back-left">
                <div className="pbook-inner">
                  <img src={book9} alt="" loading="lazy" />
                </div>
              </div>
              <div className="pbook pbook-back-right">
                <div className="pbook-inner">
                  <img src={book5} alt="" loading="lazy" />
                </div>
              </div>
              <div className="pbook pbook-main">
                <div className="pbook-glow" />
                <div className="pbook-inner">
                  <img src={book1} alt="" loading="lazy" />
                </div>
              </div>
              <div className="pbook pbook-top">
                <div className="pbook-inner">
                  <img src={book13} alt="" loading="lazy" />
                </div>
              </div>
              <div className="pbook pbook-bottom">
                <div className="pbook-inner">
                  <img src={book13} alt="" loading="lazy" />
                </div>
              </div>

              <div className="pg-icon pg-icon-chat">
                <FaCommentDots />
              </div>
              <div className="pg-icon pg-icon-book">
                <FaBookOpen />
              </div>
              <div className="pg-icon pg-icon-pen">
                <FaPen />
              </div>
              <div className="pg-icon pg-icon-env">
                <FaEnvelopeOpenText />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT INFORMATION ================= */}
      <section className="contact-info-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="contact-gold-label">CONTACT INFORMATION</span>
            <h2>Get In Touch</h2>
            <p>Reach us directly through any of these channels.</p>
          </motion.div>

          <div className="contact-info-grid">
            {CONTACT_INFO.map((info, i) => {
              const Icon = info.icon;
              const Wrapper = info.href ? "a" : "div";
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <Wrapper
                    className="contact-info-card"
                    href={info.href}
                    target={info.target || undefined}
                    rel={info.target ? "noreferrer" : undefined}
                  >
                    <div className="ci-icon">
                      <Icon />
                    </div>
                    <div className="ci-body">
                      <h3>{info.title}</h3>
                      <p>{info.value}</p>
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section id="contact-form" className="contact-form-section">
        <div className="container">
          <div className="contact-form-wrap">
            <motion.div
              className="form-side-left"
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="contact-gold-label">LET'S TALK</span>
              <h2>We'd Love To Hear From You</h2>
              <p>
                Send us a message about your manuscript, publishing packages,
                or anything else on your mind. Our team replies within one
                business day.
              </p>
              <ul className="form-contact-list">
                {CONTACT_INFO.map((info) => {
                  const Icon = info.icon;
                  const Wrapper = info.href ? "a" : "div";
                  return (
                    <li key={info.title}>
                      <Wrapper
                        href={info.href}
                        target={info.target || undefined}
                        rel={info.target ? "noreferrer" : undefined}
                      >
                        <span className="fci-icon">
                          <Icon />
                        </span>
                        <span className="fci-text">
                          <strong>{info.title}</strong>
                          {info.value}
                        </span>
                      </Wrapper>
                    </li>
                  );
                })}
              </ul>
              <div className="form-note">
                <FaPaperclip /> Prefer a quick chat? Message us on WhatsApp —
                we're always happy to help.
              </div>
            </motion.div>

            <motion.div
              className="form-side-right"
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="cf-name">Full Name</label>
                    <input
                      id="cf-name"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="cf-email">Email</label>
                    <input
                      id="cf-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="cf-phone">Phone Number</label>
                    <input
                      id="cf-phone"
                      type="tel"
                      placeholder="10 digit mobile number"
                      maxLength="10"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="cf-book-type">Book Type</label>
                    <select
                      id="cf-book-type"
                      value={form.bookType}
                      onChange={(e) => setField("bookType", e.target.value)}
                    >
                      <option value="" disabled>
                        Select book type
                      </option>
                      {BOOK_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.bookType && (
                      <span className="field-error">{errors.bookType}</span>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="cf-subject">Subject</label>
                  <input
                    id="cf-subject"
                    type="text"
                    placeholder="What is this about?"
                    value={form.subject}
                    onChange={(e) => setField("subject", e.target.value)}
                  />
                  {errors.subject && (
                    <span className="field-error">{errors.subject}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="cf-message">Message</label>
                  <textarea
                    id="cf-message"
                    rows="5"
                    placeholder="Tell us about your manuscript or question..."
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                  />
                  {errors.message && (
                    <span className="field-error">{errors.message}</span>
                  )}
                </div>

                <button type="submit" className="btn-gold contact-submit" disabled={sending}>
                  {sending ? (
                    <>
                      <FaSpinner className="spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Send Message <FaPaperPlane />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= WHY CONTACT US ================= */}
      <section className="why-contact-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="contact-gold-label">WHY CONTACT US</span>
            <h2>What You Get When You Reach Out</h2>
            <p>Real people, honest advice, and a team that cares about your book.</p>
          </motion.div>

          <div className="why-grid">
            {WHY_CONTACT.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="why-card"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <div className="why-icon">
                    <Icon />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="contact-map-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="contact-gold-label">FIND US</span>
            <h2>Our Location</h2>
            <p>Visit our head office in Ghaziabad, Uttar Pradesh.</p>
          </motion.div>

          <motion.div
            className="map-wrap"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <iframe
              title="Yellowish Publication office location"
              src="https://www.google.com/maps?q=Ghaziabad,Uttar+Pradesh,India&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="contact-faq-section">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="accent-line" />
            <span className="contact-gold-label">FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to the questions we hear most often.</p>
          </motion.div>

          <div className="faq-list">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div className={`faq-item ${open ? "open" : ""}`} key={faq.q}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    <span>{faq.q}</span>
                    <FaChevronDown className="faq-chevron" />
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="contact-cta">
        <div className="cta-decor" aria-hidden="true">
          <div className="ccta-blob-left">
            <span className="ccta-blob-left-fill" />
          </div>
          <div className="ccta-blob-right">
            <span className="ccta-blob-right-fill" />
          </div>
        </div>
        <div className="container contact-cta-inner">
          <motion.div
            className="contact-cta-copy"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="contact-gold-label">YOUR STORY MATTERS</span>
            <h2>Ready To Publish Your Book?</h2>
            <p>
              Take the first step today. Our team will guide you from manuscript
              to a beautiful, published book.
            </p>
            <div className="contact-cta-actions">
              <button
                className="btn-gold"
                onClick={(e) => handleNavClick(e, "/authors")}
              >
                Publish Your Book <FaFeatherAlt />
              </button>
              <button
                className="contact-btn-outline"
                onClick={(e) => handleNavClick(e, "/store")}
              >
                <FaBookOpen /> Browse Books
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/919871569192"
        target="_blank"
        rel="noreferrer"
        className="contact-wa-float"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>

      {toast && (
        <div className="contact-toast" role="status">
          <FaCheckCircle /> {toast}
        </div>
      )}
    </div>
  );
}
