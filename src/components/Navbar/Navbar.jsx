import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={Logo} alt="Yellowish Publication Logo" className="logo-img" />
        <div className="logo-text">
          Yellowish <span className="highlight">Publication</span>
        </div>
      </div>

      <ul className="navList desktopNav">
        <li><NavLink to="/" onClick={closeMenu} className="navLink">Home</NavLink></li>
        <li><NavLink to="/about" onClick={closeMenu} className="navLink">About Us</NavLink></li>
        <li><NavLink to="/authors" onClick={closeMenu} className="navLink">Our Authors</NavLink></li>
        <li><NavLink to="/store" onClick={closeMenu} className="navLink">Store</NavLink></li>
      </ul>

      <div className="hamburger" onClick={toggleMenu}>☰</div>

      <div className={`mobileMenu ${isOpen ? "open" : ""}`}>
        <button className="closeBtn" onClick={toggleMenu}>×</button>
        <ul className="mobileNavList">
          <li><NavLink to="/" onClick={closeMenu} className="navLink">Home</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu} className="navLink">About Us</NavLink></li>
          <li><NavLink to="/authors" onClick={closeMenu} className="navLink">Our Authors</NavLink></li>
          <li><NavLink to="/store" onClick={closeMenu} className="navLink">Store</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
