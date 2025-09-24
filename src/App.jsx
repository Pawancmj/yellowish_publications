import {  Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollTop from "./components/ScrollTop/ScrollTop"; // Correct import

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Authors from "./pages/Authors/Authors";
import AuthorDetails from "./pages/AuthorDetails/AuthorDetails";
import Books from "./pages/Books/Books";
import BookDetails from "./pages/BookDetails/BookDetails";

function App() {
  return (
   <>
      <ScrollTop /> {/* Scroll to top on route change */}
      <div className="app-container">
        <Navbar />
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
    </>
  );
}

export default App;
