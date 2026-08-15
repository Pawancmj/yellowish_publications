import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Lock body scroll while the mobile drawer is open so the page
  // behind the backdrop cannot scroll.
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navList desktopNav nav-left">
          <li><NavLink to="/" onClick={closeMenu} className="navLink">Home</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu} className="navLink">About Us</NavLink></li>
          <li><NavLink to="/authors" onClick={closeMenu} className="navLink">Our Authors</NavLink></li>
        </ul>

        <div className="logo-container">
          <img src={Logo} alt="Yellowish Publication Logo" className="logo-img" />
          <div className="logo-text">
            Yellowish <span className="highlight">Publication</span>
          </div>
        </div>

        <ul className="navList desktopNav nav-right">
          <li><NavLink to="/store" onClick={closeMenu} className="navLink">Store</NavLink></li>
          <li><NavLink to="/blog" onClick={closeMenu} className="navLink">Blog</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu} className="navLink">Contact Us</NavLink></li>
        </ul>

        <button
          type="button"
          className="hamburger"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobileMenu"
        >
          ☰
        </button>
      </div>

      <div id="mobileMenu" className={`mobileMenu ${isOpen ? "open" : ""}`}>
        <button type="button" className="closeBtn" onClick={toggleMenu} aria-label="Close navigation menu">×</button>
        <ul className="mobileNavList">
          <li><NavLink to="/" onClick={closeMenu} className="navLink">Home</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu} className="navLink">About Us</NavLink></li>
          <li><NavLink to="/authors" onClick={closeMenu} className="navLink">Our Authors</NavLink></li>
          <li><NavLink to="/store" onClick={closeMenu} className="navLink">Store</NavLink></li>
          <li><NavLink to="/blog" onClick={closeMenu} className="navLink">Blog</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu} className="navLink">Contact Us</NavLink></li>
        </ul>
      </div>

      <div
        className={`menu-backdrop ${isOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
    </nav>
  );
}