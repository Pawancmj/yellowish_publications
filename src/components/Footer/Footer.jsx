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
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/authors">Our Authors</NavLink>
            <NavLink to="/store">Store</NavLink>
          </div>

          <div className="col">
            <h4 className="heading">Resources</h4>
            <NavLink to="/store">Publish Your Book</NavLink>
            <NavLink to="/authors">Author Support</NavLink>
            <NavLink to="/about">Distribution</NavLink>
            <NavLink to="/login">Author Login</NavLink>
          </div>

          <div className="col">
            <h4 className="heading">Head Office</h4>

            <div className="contact">
  <FaPhoneAlt />
  <a
    className="contact-link"
    href="tel:+919871569192"
  >
    +91 9871569192
  </a>
</div>

<div className="contact">
  <FaEnvelope />
  <a
    className="contact-link"
    href="mailto:Yellowishpublication1@gmail.com"
  >
    Yellowishpublication1@gmail.com
  </a>
</div>
          </div>

          <div className="col">
            <h4 className="heading">Follow Us</h4>

            <div className="socials">
              <a
                href="https://www.facebook.com/share/1JdnHjwC6o/"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/yellowishpublication"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                <FaLinkedin />
              </a>
              <a
                href="https://wa.me/919871569192"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        <div className="bottom-bar">
          <p>© 2025 Yellowish Publication. All rights reserved.</p>

          <div>
            <a href="/">Privacy Policy</a>
            <span>|</span>
            <a href="/">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}