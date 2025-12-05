// src/contexts/DataContext.jsx - SIMPLIFIED VERSION
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { db, auth } from "../firebase";
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { books as initialBooks } from "../data/books";
import { authors as initialAuthors } from "../data/author";

const FIXED_USER_ID = "shared-app-user";

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [books, setBooks] = useState(initialBooks);
  const [authors, setAuthors] = useState(initialAuthors);
  const [currentUser, setCurrentUser] = useState(null);
  const booksUnsubscribeRef = useRef(null);
  const authorsUnsubscribeRef = useRef(null);

  // 1. Auth (optional - public reads don't need it)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth).catch(console.error);
      } else {
        setCurrentUser({ uid: FIXED_USER_ID });
        console.log("✅ Auth ready - Full CRUD enabled");
      }
    });
    return unsubscribe;
  }, []);

  // 2. ✅ PUBLIC READS - Listen to shared-app-user (works for everyone!)
  useEffect(() => {
    console.log("👂 Starting PUBLIC listeners...");

    // PUBLIC BOOKS - works without login
    const booksQuery = query(collection(db, `users/${FIXED_USER_ID}/books`));
    booksUnsubscribeRef.current = onSnapshot(booksQuery, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`📚 LIVE: ${booksData.length} books - PUBLIC ACCESS`);
      setBooks(booksData);
    });

    // PUBLIC AUTHORS - works without login
    const authorsQuery = query(collection(db, `users/${FIXED_USER_ID}/authors`));
    authorsUnsubscribeRef.current = onSnapshot(authorsQuery, (snapshot) => {
      const authorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`📖 LIVE: ${authorsData.length} authors - PUBLIC ACCESS`);
      setAuthors(authorsData);
    });

    return () => {
      if (booksUnsubscribeRef.current) booksUnsubscribeRef.current();
      if (authorsUnsubscribeRef.current) authorsUnsubscribeRef.current();
    };
  }, []);

  // 3. SEED DATA ONCE (admin only)
  useEffect(() => {
    if (currentUser?.uid && !books.length && !authors.length) {
      const seedData = async () => {
        try {
          console.log("🌱 Seeding initial data...");
          // Seed books
          for (const book of initialBooks) {
            await doc(db, `users/${FIXED_USER_ID}/books`, book.id).set({
              ...book,
              createdAt: new Date(),
              updatedAt: new Date()
            }, { merge: true });
          }
          // Seed authors
          for (const author of initialAuthors) {
            await doc(db, `users/${FIXED_USER_ID}/authors`, author.id).set({
              ...author,
              createdAt: new Date(),
              updatedAt: new Date()
            }, { merge: true });
          }
          console.log("✅ Initial data seeded");
        } catch (error) {
          console.error("❌ Seed error:", error);
        }
      };
      seedData();
    }
  }, [currentUser]);

  // 4. CRUD FUNCTIONS (admin only - blocked by security rules for public)
  const addBook = useCallback(async (book) => {
    try {
      const docRef = await addDoc(collection(db, `users/${FIXED_USER_ID}/books`), {
        ...book,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("✅ NEW BOOK ADDED:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Add book failed (admin only):", error.message);
    }
  }, []);

  const addAuthor = useCallback(async (author) => {
    try {
      const docRef = await addDoc(collection(db, `users/${FIXED_USER_ID}/authors`), {
        ...author,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("✅ NEW AUTHOR ADDED:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Add author failed (admin only):", error.message);
    }
  }, []);

  const updateBook = useCallback(async (id, updatedBook) => {
    try {
      await updateDoc(doc(db, `users/${FIXED_USER_ID}/books`, id), {
        ...updatedBook,
        updatedAt: new Date()
      });
      console.log("✅ Book updated");
    } catch (error) {
      console.error("❌ Update failed (admin only):", error.message);
    }
  }, []);

  const updateAuthor = useCallback(async (id, updatedAuthor) => {
    try {
      await updateDoc(doc(db, `users/${FIXED_USER_ID}/authors`, id), {
        ...updatedAuthor,
        updatedAt: new Date()
      });
      console.log("✅ Author updated");
    } catch (error) {
      console.error("❌ Update failed (admin only):", error.message);
    }
  }, []);

  const deleteBook = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, `users/${FIXED_USER_ID}/books`, id));
      console.log("✅ Book deleted");
    } catch (error) {
      console.error("❌ Delete failed (admin only):", error.message);
    }
  }, []);

  const deleteAuthor = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, `users/${FIXED_USER_ID}/authors`, id));
      console.log("✅ Author deleted");
    } catch (error) {
      console.error("❌ Delete failed (admin only):", error.message);
    }
  }, []);

  const value = {
    books,
    authors,
    currentUser,
    addBook,
    updateBook,
    deleteBook,
    addAuthor,
    updateAuthor,
    deleteAuthor,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
  