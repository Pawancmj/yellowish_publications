import { useParams, useNavigate } from "react-router-dom";
import { books } from "../../data/books";
import "./BookDetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === id);

  if (!book) return <p className="not-found">Book not found.</p>;

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate("/store");
    setTimeout(scrollToTop, 200); // scroll after navigation
  };

  return (
    <div className="book-details">
      <img src={book.cover} alt={book.title} className="book-details-cover" />
      <div className="book-info">
        <h1>{book.title}</h1>
        {book.subtitle && <h3 className="subtitle">{book.subtitle}</h3>}
        <p className="author">By {book.author}</p>
        <p className="genre">Genre: {book.genre}</p>
        <p className="year">Published: {book.year}</p>
        <p className="description">{book.description}</p>
        <p className="price">₹{book.price}</p>

        <div className="details-buttons">
          <button className="buy-btn">Buy Now</button>
          <button onClick={handleBack} className="back-btn">
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
