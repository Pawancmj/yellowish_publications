// src/contexts/DataContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { db, auth } from "../firebase";
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc,
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
  // Start with initial/static data as fallback
  const [books, setBooks] = useState(initialBooks);
  const [authors, setAuthors] = useState(initialAuthors);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const booksUnsubscribeRef = useRef(null);
  const authorsUnsubscribeRef = useRef(null);
  const hasSeededRef = useRef(false);

  // 1. Auth
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

  // 2. PUBLIC READS - Listen to Firestore with fallback to static data
  useEffect(() => {
    console.log("👂 Starting PUBLIC listeners...");
    let booksReceived = false;
    let authorsReceived = false;

    // PUBLIC BOOKS
    const booksQuery = query(collection(db, `users/${FIXED_USER_ID}/books`));
    booksUnsubscribeRef.current = onSnapshot(booksQuery, (snapshot) => {
      const booksData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      booksReceived = true;
      console.log(`📚 LIVE: ${booksData.length} books from Firestore`);
      
      // ✅ MERGE Firestore data with static data so things don't disappear
      const mergedBooks = [...booksData];
      for (const initialBook of initialBooks) {
        if (!booksData.find(b => b.id === initialBook.id)) {
          mergedBooks.push(initialBook);
        }
      }
      setBooks(mergedBooks);
      
      if (booksReceived && authorsReceived) setLoading(false);
    }, (error) => {
      console.error("❌ Books listener error:", error);
      setBooks(initialBooks);
      booksReceived = true;
      if (booksReceived && authorsReceived) setLoading(false);
    });

    // PUBLIC AUTHORS
    const authorsQuery = query(collection(db, `users/${FIXED_USER_ID}/authors`));
    authorsUnsubscribeRef.current = onSnapshot(authorsQuery, (snapshot) => {
      const authorsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      authorsReceived = true;
      console.log(`📖 LIVE: ${authorsData.length} authors from Firestore`);
      
      // ✅ MERGE Firestore data with static data
      const mergedAuthors = [...authorsData];
      for (const initialAuthor of initialAuthors) {
        if (!authorsData.find(a => String(a.id) === String(initialAuthor.id))) {
          mergedAuthors.push(initialAuthor);
        }
      }
      setAuthors(mergedAuthors);
      
      if (booksReceived && authorsReceived) setLoading(false);
    }, (error) => {
      console.error("❌ Authors listener error:", error);
      // On error, keep static data
      setAuthors(initialAuthors);
      authorsReceived = true;
      if (booksReceived && authorsReceived) setLoading(false);
    });

    // Safety timeout — if Firestore doesn't respond in 5s, stop loading
    const timeout = setTimeout(() => {
      if (!booksReceived || !authorsReceived) {
        console.warn("⏰ Firestore timeout — using static data");
        setLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (booksUnsubscribeRef.current) booksUnsubscribeRef.current();
      if (authorsUnsubscribeRef.current) authorsUnsubscribeRef.current();
    };
  }, []);

  // 3. SEED DATA ONCE (admin only) — Fixed: uses setDoc instead of broken doc().set()
  useEffect(() => {
    if (currentUser?.uid && !hasSeededRef.current) {
      // Check if Firestore already has data (to avoid re-seeding)
      const checkAndSeed = async () => {
        try {
          // Only seed if we detected Firestore is empty from the listeners
          const booksQuery = query(collection(db, `users/${FIXED_USER_ID}/books`));
          const unsubCheck = onSnapshot(booksQuery, async (snapshot) => {
            unsubCheck(); // Unsubscribe immediately after first check
            
            if (snapshot.docs.length === 0 && !hasSeededRef.current) {
              hasSeededRef.current = true;
              console.log("🌱 Seeding initial data to Firestore...");
              
              // Seed books
              for (const book of initialBooks) {
                const bookData = { ...book };
                // Remove imported image references — they won't work in Firestore
                // Store as empty or placeholder URL
                if (typeof bookData.cover !== 'string' || !bookData.cover.startsWith('http')) {
                  delete bookData.cover;
                }
                await setDoc(doc(db, `users/${FIXED_USER_ID}/books`, book.id), {
                  ...bookData,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }, { merge: true });
              }
              
              // Seed authors
              for (const author of initialAuthors) {
                const authorData = { ...author };
                if (typeof authorData.photo !== 'string' || !authorData.photo.startsWith('http')) {
                  delete authorData.photo;
                }
                await setDoc(doc(db, `users/${FIXED_USER_ID}/authors`, author.id), {
                  ...authorData,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }, { merge: true });
              }
              
              console.log("✅ Initial data seeded to Firestore");
            }
          });
        } catch (error) {
          console.error("❌ Seed error:", error);
        }
      };
      checkAndSeed();
    }
  }, [currentUser]);

  // 4. CRUD FUNCTIONS
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
    loading,
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

  