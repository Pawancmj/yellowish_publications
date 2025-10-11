// src/contexts/DataContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { books as initialBooks } from "../data/books";
import { authors as initialAuthors } from "../data/author";

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedBooks = localStorage.getItem("yellowish_books");
    const storedAuthors = localStorage.getItem("yellowish_authors");

    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(initialBooks);
    }

    if (storedAuthors) {
      setAuthors(JSON.parse(storedAuthors));
    } else {
      setAuthors(initialAuthors);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem("yellowish_books", JSON.stringify(books));
    }
  }, [books]);

  useEffect(() => {
    if (authors.length > 0) {
      localStorage.setItem("yellowish_authors", JSON.stringify(authors));
    }
  }, [authors]);

  // Book CRUD operations
  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now().toString(), // Simple ID generation
    };
    setBooks((prev) => [...prev, newBook]);
  };

  const updateBook = (id, updatedBook) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...updatedBook } : book))
    );
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  // Author CRUD operations
  const addAuthor = (author) => {
    const newAuthor = {
      ...author,
      id: Date.now().toString(),
      books: author.books || [],
    };
    setAuthors((prev) => [...prev, newAuthor]);
  };

  const updateAuthor = (id, updatedAuthor) => {
    setAuthors((prev) =>
      prev.map((author) =>
        author.id === id ? { ...author, ...updatedAuthor } : author
      )
    );
  };

  const deleteAuthor = (id) => {
    setAuthors((prev) => prev.filter((author) => author.id !== id));
  };

  const value = {
    books,
    authors,
    addBook,
    updateBook,
    deleteBook,
    addAuthor,
    updateAuthor,
    deleteAuthor,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
