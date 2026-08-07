import { NavLink } from "react-router-dom";
import {
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaPhoneAlt,
  FaFacebook,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="columns">
          <div className="col">
            <h4 className="heading">Quick Links</h4>
            <ul className="linkList">
              <li><NavLink to="/" className="navLink">Home</NavLink></li>
              <li><NavLink to="/about" className="navLink">About Us</NavLink></li>
              <li><NavLink to="/authors" className="navLink">Our Authors</NavLink></li>
              <li><NavLink to="/store" className="navLink">Store</NavLink></li>
            </ul>
          </div>

          <div className="col">
            <h4 className="heading">Resources</h4>
            <ul className="linkList">
              <li><NavLink to="/store" className="navLink">Publish Your Book</NavLink></li>
              <li><NavLink to="/authors" className="navLink">Author Support</NavLink></li>
              <li><NavLink to="/about" className="navLink">Distribution</NavLink></li>
              <li><NavLink to="/login" className="navLink">Author Login</NavLink></li>
            </ul>
          </div>

          <div className="col">
            <h4 className="heading">Head Office</h4>
            <address className="addr">
              <FaMapMarkerAlt className="addr-icon" />
              Ghaziabad, Uttar Pradesh, India
            </address>
            <ul className="regionContacts">
              <li><FaPhoneAlt /> <a href="tel:+919871569192">+91 9871569192</a></li>
              <li><FaEnvelope /> <a href="mailto:Yellowishpublication1@gmail.com">Yellowishpublication1@gmail.com</a></li>
            </ul>
          </div>

          <div className="col">
            <h4 className="heading">Follow Us</h4>
            <div className="socials">
              <a href="https://www.facebook.com/share/1JdnHjwC6o/" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://www.instagram.com/yellowishpublication?igsh=MWphbHRuMTZtNmlweg==" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://wa.me/919871569192" target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>
        </div>

        <hr className="divider" />
        <div className="bottom-bar">
          <p className="copyright">© 2025 Yellowish Publication. All rights reserved.</p>
          <div className="legal-links">
            <a href="/" className="navLink">Privacy Policy</a>
            <span className="sep">|</span>
            <a href="/" className="navLink">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
