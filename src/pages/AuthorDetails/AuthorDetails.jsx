import { useParams, Link } from "react-router-dom";
import { FaBookOpen, FaQuoteLeft } from "react-icons/fa";
import { authors } from "../../data/author";
import "./AuthorDetails.css";

export default function AuthorDetails() {
  const { id } = useParams();
  const author = authors.find((a) => String(a.id) === id);

  if (!author) return <p>Author not found.</p>;

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
        <Link to="/authors">← Back to Authors</Link>
      </div>
    </div>
  );
}
