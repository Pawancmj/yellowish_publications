import { useParams, useNavigate } from "react-router-dom";
import { FaBookOpen, FaQuoteLeft } from "react-icons/fa";
import { authors } from "../../data/author";
import "./AuthorDetails.css";

export default function AuthorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const author = authors.find((a) => String(a.id) === id);

  if (!author) return <p>Author not found.</p>;

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate("/authors");
    setTimeout(scrollToTop, 200); // scroll after navigation
  };

  return (
    <div className="author-details">
      {/* Banner */}
      <div className="author-banner">
        <div className="author-photo">
          <img src={author.photo || "/placeholder.jpg"} alt={author.name} />
        </div>
        <div className="author-info">
          <h1>{author.name}</h1>
          <p className="genre">{author.genre}</p>
          <p>{author.bio}</p>
        </div>
      </div>

      {/* Books */}
      <div className="author-books">
        <h2>
          <FaBookOpen /> Books by {author.name}
        </h2>
        <ul>
          {author.books?.map((book, index) => (
            <li key={index}>{book}</li>
          ))}
        </ul>
      </div>

      {/* Quote */}
      {author.quote && (
        <div className="author-quote">
          <FaQuoteLeft className="quote-icon" />
          <p>{author.quote}</p>
        </div>
      )}

      {/* Back */}
      <div className="back-btn">
        <button onClick={handleBack}>← Back to Authors</button>
      </div>
    </div>
  );
}
