import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Authors from "./pages/Authors/Authors";
import AuthorDetails from "./pages/AuthorDetails/AuthorDetails";
import Books from "./pages/Books/Books";
import BookDetails from "./pages/BookDetails/BookDetails";

// Scroll to top whenever route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll to top on route change
    window.scrollTo({ top: 0, behavior: "instant" }); 
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <ScrollToTop /> {/* Scroll to top on every route change */}
        <main style={{ flex: 1, width: "100%" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/author/:id" element={<AuthorDetails />} />
            <Route path="/store" element={<Books />} />
            <Route path="/book/:id" element={<BookDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
