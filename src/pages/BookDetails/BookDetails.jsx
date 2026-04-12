import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import "./BookDetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ USE LIVE FIRESTORE DATA (read-only for public)
  const { books, getBookCover } = useData(); 
  
  // ✅ FIND BOOK FROM LIVE DATA
  const book = books.find((b) => b.id === id);
  
  // Loading state while data loads
  if (!book) {
    return (
      <div className="book-details">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Book not found or loading...</h2>
          <p>Total books loaded: {books.length}</p>
          <button 
            onClick={() => navigate("/store")}
            style={{ 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate("/store");
    setTimeout(scrollToTop, 200);
  };

  return (
    <div className="book-details">
      <img 
        src={getBookCover ? getBookCover(book) : (book.cover || book.image || "https://via.placeholder.com/300x450?text=No+Image")} 
        onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
        alt={book.title} 
        className="book-details-cover" 
      />
      
      <div className="book-details-info">
        <h1>{book.title}</h1>
        {book.subtitle && <h3 className="subtitle">{book.subtitle}</h3>}
        <p className="author">By {book.author || book.authorsName || "Unknown"}</p>
        <p className="genre">Genre: {book.genre || "Uncategorized"}</p>
        {book.year && <p className="year">Published: {book.year}</p>}
        {book.updatedAt && (
          <p className="updated">Last Updated: {new Date(book.updatedAt.seconds * 1000).toLocaleDateString()}</p>
        )}
        
        <div className="description">
          {book.description || "No description available."}
        </div>
        
        <p className="price">₹{book.price || 0}</p>

        {/* ✅ ONLY PUBLIC BUTTONS - No Delete */}
        <div className="details-buttons">
          <button className="buy-btn">
            Buy Now - ₹{book.price || 0}
          </button>
          <button onClick={handleBack} className="back-btn">
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
