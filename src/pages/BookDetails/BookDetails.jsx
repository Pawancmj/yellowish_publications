import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { FaWhatsapp } from "react-icons/fa";
import "./BookDetails.css";

// Same business WhatsApp number used in the Footer and Contact page
const WHATSAPP_NUMBER = "919871569192";

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

  const whatsappMessage = [
    "Hello Yellowish Publication, I would like to buy this book:",
    "",
    `Book: ${book.title || "This book"}`,
    `Author: ${book.author || book.authorsName || "Unknown"}`,
    `Price: ₹${book.price || 0}`,
    `Book ID: ${book.id}`,
    "",
    "Please share the purchase details.",
  ].join("\n");

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="book-details">
      <img 
        src={getBookCover ? getBookCover(book) : (book.cover || book.image || "https://via.placeholder.com/300x450?text=No+Image")} 
        loading="lazy"
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
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="book-action-btn whatsapp-buy-btn"
            title="Buy on WhatsApp"
          >
            <FaWhatsapp /> Buy on WhatsApp
          </a>
          <button onClick={handleBack} className="book-action-btn back-btn">
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
