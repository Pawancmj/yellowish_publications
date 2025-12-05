// src/App.js
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext"; // Add this

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollTop from "./components/ScrollTop/ScrollTop";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Authors from "./pages/Authors/Authors";
import AuthorDetails from "./pages/AuthorDetails/AuthorDetails";
import Books from "./pages/Books/Books";
import BookDetails from "./pages/BookDetails/BookDetails";
import Admin from "./pages/Admindashboard/Admin";
import AdminForm from "./pages/Admindashboard/AdminForm";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        {" "}
        {/* Wrap with DataProvider */}
        <ScrollTop />
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
              <Route path="/admin121-secret" element={<Admin />} /> {/* this is dashboard page*/}
              <Route path="/login" element={<AdminForm />} /> {/* this is login page*/}
            </Routes>
          </main>
          <Footer />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
