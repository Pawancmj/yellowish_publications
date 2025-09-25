import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { books } from "../../data/books";
import { FaSearch, FaFilter, FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import "./Books.css";

export default function Books() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const filteredBooks = books
    .filter((book) =>
      (book.title.toLowerCase() + book.author.toLowerCase() + book.genre.toLowerCase())
        .includes(search.toLowerCase())
    )
    .filter((book) => (genre ? book.genre === genre : true))
    .sort((a, b) => {
      if (sortBy === "newest") return b.year - a.year;
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      return 0;
    });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="books-page">
      {/* Hero Section */}
      <div className="books-hero">
        <h1>Discover Stories That Inspire</h1>
        <p>Browse through our collection of books from amazing authors worldwide.</p>
        <div className="search-bar">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div>
          <FaFilter /> <span>Genre:</span>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All</option>
            <option value="Fiction">Fiction</option>
            <option value="Poetry">Poetry</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Academic">Academic</option>
          </select>
        </div>
        <div>
          <span>Sort By:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Default</option>
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.cover} alt={book.title} className="book-cover" />

              {/* main variable-height content — this will grow to push price & buttons to bottom */}
              <div className="card-main">
                <h3>{book.title}</h3>
                {book.subtitle && <p className="subtitle">{book.subtitle}</p>}
                <p className="author">By {book.author}</p>
                <p className="genre">{book.genre}</p>
              </div>

              {/* price just above buttons */}
              <p className="price">₹{book.price}</p>

              {/* buttons always at bottom */}
              <div className="card-buttons">
                <Link
                  to={`/book/${book.id}`}
                  className="details-btn"
                  onClick={(e) => handleNavClick(e, `/book/${book.id}`)}
                >
                  <FaInfoCircle /> View Details
                </Link>
                <button className="cart-btn">
                  <FaShoppingCart /> Buy Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-books">No books found.</p>
        )}
      </div>
    </div>
  );
}
