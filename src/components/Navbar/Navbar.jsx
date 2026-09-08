import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaPen, FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";
import Logo from "../../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* ================= LOGO ================= */}
        <NavLink
          to="/"
          className="logo-container"
          onClick={closeMenu}
        >
          <img
            src={Logo}
            alt="Yellowish Publication Logo"
            className="logo-img"
          />

          <div className="logo-content">
            <div className="logo-text">
              Yellowish <span>Publication</span>
            </div>

            <div className="logo-tagline">
              Inspiring Minds. Creating Impact.
            </div>
          </div>
        </NavLink>


        {/* ================= DESKTOP NAV ================= */}
        <ul className="desktopNav nav-center">

          <li>
            <NavLink
              to="/"
              onClick={closeMenu}
              className="navLink"
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className="navLink"
            >
              About Us
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/authors"
              onClick={closeMenu}
              className="navLink"
            >
              Our Authors
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/store"
              onClick={closeMenu}
              className="navLink"
            >
              Store
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/blog"
              onClick={closeMenu}
              className="navLink"
            >
              Blog
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className="navLink"
            >
              Contact Us
            </NavLink>
          </li>

        </ul>


        {/* ================= RIGHT ACTIONS ================= */}
        <div className="nav-actions">

          <NavLink
            to="/author"
            className="author-button"
          >
            <FaPen />
            <span>Become an Author</span>
          </NavLink>

          
        </div>


        {/* ================= HAMBURGER ================= */}
        <button
          type="button"
          className="hamburger"
          onClick={toggleMenu}
          aria-label={
            isOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isOpen}
          aria-controls="mobileMenu"
        >
          ☰
        </button>

      </div>


      {/* ================= MOBILE MENU ================= */}

      <div
        id="mobileMenu"
        className={`mobileMenu ${isOpen ? "open" : ""}`}
      >

        <button
          type="button"
          className="closeBtn"
          onClick={closeMenu}
          aria-label="Close navigation menu"
        >
          ×
        </button>

        <div className="mobile-logo">

          <img
            src={Logo}
            alt="Yellowish Publication"
          />

          <div>
            <div className="mobile-logo-title">
              Yellowish <span>Publication</span>
            </div>

            <small>
              Inspiring Minds. Creating Impact.
            </small>
          </div>

        </div>


        <ul className="mobileNavList">

          <li>
            <NavLink
              to="/"
              onClick={closeMenu}
              className="navLink"
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className="navLink"
            >
              About Us
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/authors"
              onClick={closeMenu}
              className="navLink"
            >
              Our Authors
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/store"
              onClick={closeMenu}
              className="navLink"
            >
              Store
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/blog"
              onClick={closeMenu}
              className="navLink"
            >
              Blog
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className="navLink"
            >
              Contact Us
            </NavLink>
          </li>

        </ul>


        <NavLink
          to="/author"
          onClick={closeMenu}
          className="mobile-author-button"
        >
          <FaPen />
          Become an Author
        </NavLink>

      </div>


      {/* BACKDROP */}

      <div
        className={`menu-backdrop ${
          isOpen ? "open" : ""
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

    </nav>
  );
}