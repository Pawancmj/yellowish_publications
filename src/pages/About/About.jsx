import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./About.css";
import {
  FaBookOpen,
  FaUsers,
  FaGlobe,
  FaAward,
  FaLightbulb,
  FaHandshake,
  FaPenNib,
} from "react-icons/fa";
import StoryImg from "../../assets/Story.png"; 
import emailjs from "@emailjs/browser";

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [popup, setPopup] = useState({ show: false, success: false, msg: "" });

  // Auto-hide popup after 3 seconds
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
            msg: "✅ Message sent successfully!",
          });
          setFormData({ name: "", email: "", message: "" });
        },
        () => {
          setPopup({
            show: true,
            success: false,
            msg: "❌ Failed to send. Please try again.",
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
    <div className="about">
      {/* ---------- Hero Section ---------- */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Ready to Publish Your Story?</h1>
          <p>
            Join hundreds of authors who trust{" "}
            <strong>Yellowish Publication</strong> to bring their stories to
            life. We believe every story deserves to be told.
          </p>
          <div className="hero-icons">
            <div className="hero-icon-card">
              <FaBookOpen className="hero-icon" />
              <span>Stories to Books</span>
            </div>
            <div className="hero-icon-card">
              <FaUsers className="hero-icon" />
              <span>Trusted by Authors</span>
            </div>
            <div className="hero-icon-card">
              <FaGlobe className="hero-icon" />
              <span>Global Reach</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Our Story ---------- */}
      <section className="about-story">
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            Yellowish Publication began with a vision to empower storytellers
            and knowledge sharers. From humble beginnings, we’ve grown into a
            trusted partner for authors, offering support at every stage of the
            publishing journey.
          </p>
          <p>
            Since our founding, we’ve published countless works spanning genres,
            giving both emerging and established authors a platform to reach
            global audiences.
          </p>
        </div>
        <div className="story-image">
          <img src={StoryImg} alt="Our Story - Yellowish Publication" />
        </div>
      </section>

      {/* ---------- Mission & Vision ---------- */}
      <section className="about-mission">
        <h2>Our Mission & Vision</h2>
        <div className="mission-vision">
          <div className="mv-card">
            <FaLightbulb className="mv-icon" />
            <h3>Our Mission</h3>
            <p>
              To empower authors with accessible publishing solutions, ensuring
              every voice finds its audience.
            </p>
          </div>
          <div className="mv-card">
            <FaGlobe className="mv-icon" />
            <h3>Our Vision</h3>
            <p>
              To be the most trusted global platform for storytellers and
              knowledge creators.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- What We Do ---------- */}
      <section className="about-services">
        <h2>What We Do</h2>
        <div className="services-grid">
          <div className="service-card">
            <FaBookOpen className="service-icon" />
            <h3>Editing & Proofreading</h3>
            <p>
              Professional editing to refine your manuscript for publication.
            </p>
          </div>
          <div className="service-card">
            <FaUsers className="service-icon" />
            <h3>Design & Formatting</h3>
            <p>Eye-catching cover design and interior formatting that sells.</p>
          </div>
          <div className="service-card">
            <FaGlobe className="service-icon" />
            <h3>Global Distribution</h3>
            <p>Making your book available to readers across the world.</p>
          </div>
          <div className="service-card">
            <FaAward className="service-icon" />
            <h3>Marketing & Promotion</h3>
            <p>Helping your book reach the right audience through campaigns.</p>
          </div>
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <FaHandshake className="value-icon" />
            <h3>Integrity</h3>
            <p>We put authors first, with honesty and transparency.</p>
          </div>
          <div className="value-card">
            <FaLightbulb className="value-icon" />
            <h3>Creativity</h3>
            <p>Encouraging innovation and fresh ideas in publishing.</p>
          </div>
          <div className="value-card">
            <FaGlobe className="value-icon" />
            <h3>Global Reach</h3>
            <p>Helping stories travel beyond borders and cultures.</p>
          </div>
        </div>
      </section>

      {/* ---------- Achievements ---------- */}
      <section className="about-achievements">
        <h2>Our Milestones</h2>
        <div className="achievements-grid">
          <div className="achievement">
            <h3>500+</h3>
            <p>Books Published</p>
          </div>
          <div className="achievement">
            <h3>100+</h3>
            <p>Authors Onboard</p>
          </div>
          <div className="achievement">
            <h3>20+</h3>
            <p>Countries Reached</p>
          </div>
        </div>
      </section>

      {/* ---------- Call to Action ---------- */}
      <section className="about-cta">
        <h2>Publish With Us</h2>
        <div className="cta-grid">
          <div className="cta-card">
            <FaPenNib className="cta-icon" />
            <h3>Share Your Story</h3>
            <p>Turn your manuscript into a published book with expert help.</p>
          </div>
          <div className="cta-card">
            <FaUsers className="cta-icon" />
            <h3>Join Our Authors</h3>
            <p>Be part of a growing community of storytellers worldwide.</p>
          </div>
          <div className="cta-card">
            <FaGlobe className="cta-icon" />
            <h3>Reach Readers</h3>
            <p>Distribute globally and connect with audiences everywhere.</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={sendEmail}>
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
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="cta-btn">
            Get in Touch
          </button>
        </form>

        {/* Popup Message */}
        {popup.show && (
          <div className={`popup-overlay`}>
            <div className={`popup-box ${popup.success ? "success" : "error"}`}>
              <p>{popup.msg}</p>
              <button onClick={() => setPopup({ ...popup, show: false })}>
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default About;
