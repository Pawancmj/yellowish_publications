import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBookOpen, FaQuoteLeft } from "react-icons/fa";
import { useData } from "../../contexts/DataContext";
import "./AuthorDetails.css";

export default function AuthorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { authors, getAuthorPhoto } = useData(); // Removed deleteAuthor
  
  const author = authors.find((a) => String(a.id) === id);
  
  if (!author) {
    return (
      <div className="author-details">
        <div className="author-banner">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Author not found or loading...</h2>
            <p>Total authors loaded: {authors.length}</p>
            <button 
              onClick={() => navigate("/authors")}
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
              ← Back to Authors
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate("/authors");
    setTimeout(scrollToTop, 200);
  };

  // ✅ FIXED: SAFE ARRAY CHECK
  const authorBooks = Array.isArray(author.books) ? author.books : [];

  return (
    <div className="author-details">
      {/* Banner */}
      <div className="author-banner">
        <div className="author-photo">
          <img 
            src={getAuthorPhoto(author)} 
            alt={author.name} 
            onError={(e) => { e.target.src = "https://via.placeholder.com/200x200.png?text=No+Photo"; }}
          />
        </div>
        <div className="author-info">
          <h1>{author.name}</h1>
          <p className="genre">{author.genre || "Various Genres"}</p>
          <p>{author.bio || "No biography available."}</p>
          {author.updatedAt && (
            <p className="updated" style={{ fontSize: '14px', color: '#666' }}>
              Last Updated: {new Date(author.updatedAt.seconds * 1000).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Books */}
      <div className="author-books">
        <h2>
          <FaBookOpen /> Books by {author.name} ({authorBooks.length})
        </h2>
        {authorBooks.length > 0 ? (
          <ul>
            {authorBooks.map((book, index) => (
              <li key={index}>{book}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No books listed for this author yet.
          </p>
        )}
      </div>

      {/* Quote */}
      {author.quote && (
        <div className="author-quote">
          <FaQuoteLeft className="quote-icon" />
          <p>"{author.quote}"</p>
        </div>
      )}

      {/* ✅ ONLY BACK BUTTON - No Delete */}
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: '#6c757d', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back to Authors
        </button>
      </div>
    </div>
  );
}
