import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import "./Home.css";

// About Image
import aboutImage from "../../assets/About.png";

// Hero Image
import heroImage from "../../assets/hero.png";

// Initial Data for image fallbacks
import { books as initialBooks } from "../../data/books";
import { authors as initialAuthors } from "../../data/author";

// Fallback images for any new items without cover/photo
import fallbackBook from "../../assets/book1.png";
import fallbackAuthor from "../../assets/author1.png";

// React Icons
import { FaBookOpen, FaGlobe, FaPenFancy, FaUsers } from "react-icons/fa";

// EmailJS
import emailjs from "@emailjs/browser";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { books, authors } = useData();

  // Get first 4 books and authors for featured sections
  const featuredBooks = books.slice(0, 4);
  const featuredAuthors = authors.slice(0, 4);

  // Smooth scroll function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle internal navigation links
  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) {
      scrollToTop(); // Already on the page
    } else {
      navigate(path); // Navigate then scroll
      setTimeout(scrollToTop, 300); // Delay for render
    }
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_9vpwjdo", "template_mzztq8n", e.target, "KBwcTEiUFQhCaMWZB")
      .then(
        () => {
          alert("🎉 Congratulations! You've joined the Yellowish Publications community.");
          e.target.reset();
        },
        (error) => {
          console.error(error.text);
          alert("❌ Something went wrong. Please try again!");
        }
      );
  };

  const handleContact = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_9vpwjdo", "template_1vzt7uv", e.target, "KBwcTEiUFQhCaMWZB")
      .then(
        () => {
          alert("✅ Thank you for contacting Yellowish Publication! We'll get back to you soon.");
          e.target.reset();
        },
        (error) => {
          console.error(error.text);
          alert("❌ Something went wrong. Please try again!");
        }
      );
  };

  // Helper to get a valid image URL for a book cover
  const getBookCover = (book) => {
    let result;
    // 1. If it has a valid external URL
    if (book.cover && typeof book.cover === 'string' && book.cover.startsWith('http')) {
      result = book.cover;
    } else if (book.cover && typeof book.cover === 'string' && book.cover.startsWith('/assets/')) {
      // 2. If it's a module string from Vite
      result = book.cover;
    } else {
      // 3. Fallback to its original local asset if existed
      const original = initialBooks.find(b => String(b.id) === String(book.id));
      if (original && original.cover) {
        result = original.cover;
      } else {
        // 4. Ultimate fallback
        result = fallbackBook;
      }
    }
    return result;
  };

  // Helper to get a valid image URL for an author photo
  const getAuthorPhoto = (author) => {
    // 1. External URL
    if (author.photo && typeof author.photo === 'string' && author.photo.startsWith('http')) {
      return author.photo;
    }
    if (author.image && typeof author.image === 'string' && author.image.startsWith('http')) {
      return author.image;
    }
    // 2. Fallback to original local asset
    const original = initialAuthors.find(a => a.id === String(author.id));
    if (original && original.photo) {
      return original.photo;
    }
    // 3. Ultimate fallback
    return fallbackAuthor;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section flex items-center justify-center text-center"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>
            Publishing <span>Dreams</span> into Reality
          </h1>
          <p>Yellowish Publication — where stories come alive with quality and care.</p>
          <div className="hero-buttons">
            <a href="/store" className="btn-primary" onClick={(e) => handleNavClick(e, "/store")}>
              Explore Our Store
            </a>
            <button className="btn-secondary">
              Publish With Us
            </button>
          </div>
        </div>
      </section>

      {/* About Us Teaser */}
      <section className="about-teaser">
        <div className="container about-container">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              At Yellowish Publication, we empower authors by providing seamless publishing, design, and marketing solutions to bring their stories to the world.
              We believe every story deserves to be told, and we are committed to turning your creative vision into reality.
              From professional editing and eye-catching cover designs to global distribution and promotional support, we handle every step of the publishing journey.
            </p>
            <a href="/about" className="btn-primary" onClick={(e) => handleNavClick(e, "/about")}>
              Know More About Us
            </a>
          </div>
          <div className="about-image">
            <img src={aboutImage} alt="About YellowBook Publication" />
          </div>
        </div>
      </section>

      {/* Featured Books — Now Dynamic from Firestore */}
      <section className="featured-books">
        <div className="container">
          <h2>Featured Books</h2>
          <div className="book-grid">
            {featuredBooks.map((book) => (
              <div
                className="book-card"
                key={book.id}
                onClick={(e) => handleNavClick(e, `/book/${book.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="book-img">
                  <img
                    src={getBookCover(book)}
                    alt={book.title}
                    onError={(e) => { e.target.src = fallbackBook; }}
                  />
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/store"
            className="btn-secondary mt-6"
            onClick={(e) => handleNavClick(e, "/store")}
          >
            Visit Store for More
          </a>
        </div>
      </section>

      {/* Meet Our Authors — Now Dynamic from Firestore */}
      <section className="authors">
        <div className="container">
          <h2>Meet Our Authors</h2>
          <div className="author-grid">
            {featuredAuthors.map((author) => (
              <div
                className="author-card"
                key={author.id}
                onClick={(e) => handleNavClick(e, `/author/${author.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="image-placeholder">
                  <img
                    src={getAuthorPhoto(author)}
                    alt={author.name}
                    onError={(e) => { e.target.src = fallbackAuthor; }}
                  />
                </div>
                <p>{author.name}</p>
              </div>
            ))}
          </div>
          <a href="/authors" className="btn-primary mt-6" onClick={(e) => handleNavClick(e, "/authors")}>
            View All Authors
          </a>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <div className="container">
          <h2>Why Choose Yellowish Publication?</h2>
          <div className="pillars">
            <div className="pillar">
              <FaBookOpen className="icon" />
              <p>Affordable Publishing Packages</p>
            </div>
            <div className="pillar">
              <FaGlobe className="icon" />
              <p>Global Reach & Distribution</p>
            </div>
            <div className="pillar">
              <FaPenFancy className="icon" />
              <p>Professional Editing & Design</p>
            </div>
            <div className="pillar">
              <FaUsers className="icon" />
              <p>Author-Centric Approach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>Author Success Stories</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>
                "Yellowish Publication made my publishing journey smooth and exciting. Their team is simply the best!"
              </p>
              <span>- Rahul Deb</span>
            </div>
            <div className="testimonial-card">
              <p>
                "Thanks to Yellowish Publication, my book reached readers across the globe. Highly recommended!"
              </p>
              <span>- Dr. Heena Sachdeva</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter">
        <div className="container">
          <h2>Join Our Community</h2>
          <p>Get updates on new releases, publishing tips, and author success stories.</p>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input type="email" name="user_email" placeholder="Enter your email" required />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <form className="contact-form" onSubmit={handleContact}>
            <input type="text" name="user_name" placeholder="Your Name" required />
            <input type="email" name="user_email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
