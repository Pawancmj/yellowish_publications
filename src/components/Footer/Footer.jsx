import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaPhoneAlt, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./Footer.css";
import logo from "../../assets/logo.png";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) {
      scrollToTop();
    } else {
      navigate(path);
      setTimeout(scrollToTop, 400); // Longer delay for pages with video
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="columns">
          <div className="col">
            <img src={logo} alt="YellowBook Logo" className="logo" />
            <h4 className="heading">Yellowish Publication</h4>
            <p className="blurb">
              Empowering authors and connecting readers worldwide with quality publications and literary works.
            </p>
          </div>

          <div className="col">
            <h4 className="heading">Company</h4>
            <ul className="linkList">
              <li><a href="/" onClick={(e) => handleNavClick(e, "/")}>Home</a></li>
              <li><Link to="/about" onClick={(e) => handleNavClick(e, "/about")}>About</Link></li>
              <li><Link to="/authors" onClick={(e) => handleNavClick(e, "/authors")}>Our Authors</Link></li>
              <li><Link to="/store" onClick={(e) => handleNavClick(e, "/store")}>Store</Link></li>
            </ul>
          </div>

          <div className="col">
            <h4 className="heading">Address</h4>
            <address className="addr">Ghaziabad, Uttar Pradesh, India</address>
            <h5 className="subHeading">Connect with Us</h5>
            <div className="socials">
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="https://www.facebook.com/share/1JdnHjwC6o/" target="_blank" rel="noreferrer"><FaFacebook /></a>
              <a href="https://www.instagram.com/yellowishpublication" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://wa.me/919871569192" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
            </div>
          </div>

          <div className="col">
            <h4 className="heading">Contact</h4>
            <ul className="regionContacts">
              <li><FaPhoneAlt /> <a href="tel:+919871569192">+91 9871569192</a></li>
              <li><MdEmail /> <a href="mailto:Yellowishpublication1@gmail.com">Yellowishpublication1@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <hr className="divider" />
        <p className="copyright">© 2025 Yellowish Publication. All rights reserved.</p>
      </div>
    </footer>
  );
}
