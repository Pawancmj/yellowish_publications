import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext"; // ✅ ADD THIS
import { FaSearch, FaFilter, FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import "./Books.css";

export default function Books() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("");

  // ✅ USE LIVE DATA FROM FIRESTORE
  const { books, addBook } = useData(); // ✅ LIVE DATA + CRUD

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FILTER LIVE FIRESTORE BOOKS (incl. newly added!)
  const filteredBooks = books
    .filter((book) =>
      (book.title?.toLowerCase() + 
       (book.author || book.authorsName || "").toLowerCase() + 
       (book.genre || "").toLowerCase())
        .includes(search.toLowerCase())
    )
    .filter((book) => (genre ? (book.genre || "") === genre : true))
    .sort((a, b) => {
      if (sortBy === "newest") return (b.updatedAt || b.year || 0) - (a.updatedAt || a.year || 0);
      if (sortBy === "priceLow") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceHigh") return (b.price || 0) - (a.price || 0);
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

      {/* Books Grid - NOW SHOWS LIVE FIRESTORE DATA */}
      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <img 
                src={book.cover || book.image || "https://via.placeholder.com/200x300?text=No+Image"} 
                alt={book.title} 
                className="book-cover"
              />

              <div className="card-main">
                <h3>{book.title}</h3>
                {book.subtitle && <p className="subtitle">{book.subtitle}</p>}
                <p className="author">By {book.author || book.authorsName || "Unknown"}</p>
                <p className="genre">{book.genre || "Uncategorized"}</p>
              </div>

              <p className="price">₹{book.price || 0}</p>

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
          <p className="no-books">No books found. <button onClick={() => addBook({title: "Test Book", price: 299})}>Add Test Book</button></p>
        )}
      </div>

      {/* Debug info */}
      <div className="debug-info" style={{fontSize: '12px', color: '#666', marginTop: '20px'}}>
        Total books from Firestore: {books.length} | Filtered: {filteredBooks.length}
      </div>
    </div>
  );
}
