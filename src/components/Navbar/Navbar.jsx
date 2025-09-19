import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/logo.png"; // Logo image

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname === path) {
      scrollToTop(); // Same page, smooth scroll
    } else {
      navigate(path);
      setTimeout(scrollToTop, 400); // Slightly longer delay for video-heavy pages
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={Logo} alt="Yellowish Publication Logo" className="logo-img" />
        <div className="logo-text">
          Yellowish <span className="highlight">Publication</span>
        </div>
      </div>

      <ul className="navList desktopNav">
        <li>
          <a href="/" onClick={(e) => handleNavClick(e, "/")} className="navLink">Home</a>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => isActive ? "navLink active" : "navLink"}
            onClick={(e) => handleNavClick(e, "/about")}
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/authors"
            className={({ isActive }) => isActive ? "navLink active" : "navLink"}
            onClick={(e) => handleNavClick(e, "/authors")}
          >
            Our Authors
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/store"
            className={({ isActive }) => isActive ? "navLink active" : "navLink"}
            onClick={(e) => handleNavClick(e, "/store")}
          >
            Store
          </NavLink>
        </li>
      </ul>

      <div className="hamburger" onClick={toggleMenu}>☰</div>

      <div className={`mobileMenu ${isOpen ? "open" : ""}`}>
        <button className="closeBtn" onClick={toggleMenu}>×</button>
        <ul className="mobileNavList">
          <li><a href="/" onClick={(e) => handleNavClick(e, "/")} className="navLink">Home</a></li>
          <li><NavLink to="/about" className="navLink" onClick={(e) => handleNavClick(e, "/about")}>About Us</NavLink></li>
          <li><NavLink to="/authors" className="navLink" onClick={(e) => handleNavClick(e, "/authors")}>Our Authors</NavLink></li>
          <li><NavLink to="/store" className="navLink" onClick={(e) => handleNavClick(e, "/store")}>Store</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
