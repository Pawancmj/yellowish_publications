import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/logo.png"; // Logo image

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname === path) {
      // Already on this page → just smooth scroll
      scrollToTop();
    } else {
      // Navigate to another page, then scroll smoothly
      navigate(path);
      setTimeout(scrollToTop, 300); // Delay to allow page render
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo-container">
        <img src={Logo} alt="Yellowish Publication Logo" className="logo-img" />
        <div className="logo-text">
          Yellowish <span className="highlight">Publication</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <ul className="navList desktopNav">
        <li>
          <a href="/" onClick={(e) => handleNavClick(e, "/")} className="navLink">
            Home
          </a>
        </li>
        <li>
          <a href="/about" onClick={(e) => handleNavClick(e, "/about")} className="navLink">
            About Us
          </a>
        </li>
        <li>
          <a href="/authors" onClick={(e) => handleNavClick(e, "/authors")} className="navLink">
            Our Authors
          </a>
        </li>
        <li>
          <a href="/store" onClick={(e) => handleNavClick(e, "/store")} className="navLink">
            Store
          </a>
        </li>
      </ul>

      {/* Hamburger for Mobile */}
      <div className="hamburger" onClick={toggleMenu}>☰</div>

      {/* Mobile Menu */}
      <div className={`mobileMenu ${isOpen ? "open" : ""}`}>
        <button className="closeBtn" onClick={toggleMenu}>×</button>
        <ul className="mobileNavList">
          <li>
            <a href="/" onClick={(e) => handleNavClick(e, "/")} className="navLink">
              Home
            </a>
          </li>
          <li>
            <a href="/about" onClick={(e) => handleNavClick(e, "/about")} className="navLink">
              About Us
            </a>
          </li>
          <li>
            <a href="/authors" onClick={(e) => handleNavClick(e, "/authors")} className="navLink">
              Our Authors
            </a>
          </li>
          <li>
            <a href="/store" onClick={(e) => handleNavClick(e, "/store")} className="navLink">
              Store
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
