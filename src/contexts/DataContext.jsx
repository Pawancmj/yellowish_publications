// src/contexts/DataContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { db, auth, storage } from "../firebase";

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  query,
  setDoc,
} from "firebase/firestore";

import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { books as initialBooks } from "../data/books";
import { authors as initialAuthors } from "../data/author";

import {
  blogListQuery,
  normalizeBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  blogDocRef,
} from "../services/blogModel";

import {
  heroDocRef,
  normalizeHero,
  updateHero as updateHeroDoc,
} from "../services/heroModel";

import { buildSeedBlogs } from "../data/seedBlogs";

const FIXED_USER_ID = "shared-app-user";
const SHARED_LEADS_PATH = `users/${FIXED_USER_ID}/leads`;

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  // ============================================================
  // STATE
  // ============================================================

  // Static fallback data
  const [books, setBooks] = useState(initialBooks);
  const [authors, setAuthors] = useState(initialAuthors);

  // Firestore data
  const [leads, setLeads] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [hero, setHero] = useState(null);

  // Trusted Authors
  const [trustedAuthorPosts, setTrustedAuthorPosts] = useState([]);

  // Loading states
  const [heroLoading, setHeroLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // Auth
  const [currentUser, setCurrentUser] = useState(null);

  // ============================================================
  // UNSUBSCRIBE REFS
  // ============================================================

  const booksUnsubscribeRef = useRef(null);
  const authorsUnsubscribeRef = useRef(null);
  const leadsUnsubscribeRef = useRef(null);
  const publicLeadsUnsubscribeRef = useRef(null);
  const blogsUnsubscribeRef = useRef(null);
  const heroUnsubscribeRef = useRef(null);
  const trustedAuthorsUnsubscribeRef = useRef(null);

  // ============================================================
  // SEED REFS
  // ============================================================

  const hasSeededRef = useRef(false);
  const hasSeededBlogsRef = useRef(false);

  // ============================================================
  // 1. AUTH
  // ============================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          await signInAnonymously(auth).catch(console.error);
        } else {
          setCurrentUser({
            uid: FIXED_USER_ID,
          });

          console.log("✅ Auth ready - Full CRUD enabled");
        }
      }
    );

    return unsubscribe;
  }, []);

  // ============================================================
  // 2. PUBLIC READS
  // ============================================================

  useEffect(() => {
    console.log("👂 Starting PUBLIC listeners...");

    let booksReceived = false;
    let authorsReceived = false;

    // ==========================================================
    // PUBLIC BOOKS
    // ==========================================================

    const booksQuery = query(
      collection(
        db,
        `users/${FIXED_USER_ID}/books`
      )
    );

    booksUnsubscribeRef.current = onSnapshot(
      booksQuery,
      (snapshot) => {
        const booksData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        booksReceived = true;

        console.log(
          `📚 LIVE: ${booksData.length} books from Firestore`
        );

        // Merge Firestore data with static data
        const mergedBooks = [...booksData];

        for (const initialBook of initialBooks) {
          if (
            !booksData.find(
              (b) => b.id === initialBook.id
            )
          ) {
            mergedBooks.push(initialBook);
          }
        }

        setBooks(mergedBooks);

        if (booksReceived && authorsReceived) {
          setLoading(false);
        }
      },
      (error) => {
        console.error(
          "❌ Books listener error:",
          error
        );

        setBooks(initialBooks);

        booksReceived = true;

        if (booksReceived && authorsReceived) {
          setLoading(false);
        }
      }
    );

    // ==========================================================
    // PUBLIC AUTHORS
    // ==========================================================

    const authorsQuery = query(
      collection(
        db,
        `users/${FIXED_USER_ID}/authors`
      )
    );

    authorsUnsubscribeRef.current = onSnapshot(
      authorsQuery,
      (snapshot) => {
        const authorsData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        authorsReceived = true;

        console.log(
          `📖 LIVE: ${authorsData.length} authors from Firestore`
        );

        // Merge Firestore data with static data
        const mergedAuthors = [...authorsData];

        for (const initialAuthor of initialAuthors) {
          if (
            !authorsData.find(
              (a) =>
                String(a.id) ===
                String(initialAuthor.id)
            )
          ) {
            mergedAuthors.push(initialAuthor);
          }
        }

        setAuthors(mergedAuthors);

        if (booksReceived && authorsReceived) {
          setLoading(false);
        }
      },
      (error) => {
        console.error(
          "❌ Authors listener error:",
          error
        );

        setAuthors(initialAuthors);

        authorsReceived = true;

        if (booksReceived && authorsReceived) {
          setLoading(false);
        }
      }
    );

    // ==========================================================
    // PUBLIC LEADS
    // ==========================================================

    const leadsQuery = query(
      collection(
        db,
        `users/${FIXED_USER_ID}/leads`
      )
    );

    leadsUnsubscribeRef.current = onSnapshot(
      leadsQuery,
      (snapshot) => {
        const leadsData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        console.log(
          `📝 LIVE: ${leadsData.length} leads from Firestore`
        );

        // Sort latest first
        const sortedLeads = leadsData.sort(
          (a, b) => {
            const da = a.createdAt?.toDate
              ? a.createdAt.toDate()
              : new Date(a.createdAt || 0);

            const db = b.createdAt?.toDate
              ? b.createdAt.toDate()
              : new Date(b.createdAt || 0);

            return db - da;
          }
        );

        setLeads(sortedLeads);
      },
      (error) => {
        console.error(
          "❌ Leads listener error:",
          error
        );
      }
    );

    // ==========================================================
    // PUBLIC LEADS FALLBACK
    // ==========================================================

    const publicLeadsQuery = query(
      collection(db, "leads")
    );

    publicLeadsUnsubscribeRef.current = onSnapshot(
      publicLeadsQuery,
      (snapshot) => {
        const publicLeadsData =
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

        setLeads((existingLeads) => {
          const byId = new Map();

          [
            ...existingLeads,
            ...publicLeadsData,
          ].forEach((lead) => {
            byId.set(lead.id, lead);
          });

          return Array.from(byId.values()).sort(
            (a, b) => {
              const da = a.createdAt?.toDate
                ? a.createdAt.toDate()
                : new Date(a.createdAt || 0);

              const db = b.createdAt?.toDate
                ? b.createdAt.toDate()
                : new Date(b.createdAt || 0);

              return db - da;
            }
          );
        });
      },
      (error) => {
        console.error(
          "Public leads listener error:",
          error
        );
      }
    );

    // ==========================================================
    // SAFETY TIMEOUT
    // ==========================================================

    const timeout = setTimeout(() => {
      if (!booksReceived || !authorsReceived) {
        console.warn(
          "⏰ Firestore timeout — using static data"
        );

        setLoading(false);
      }
    }, 5000);

    // ==========================================================
    // CLEANUP
    // ==========================================================

    return () => {
      clearTimeout(timeout);

      if (booksUnsubscribeRef.current) {
        booksUnsubscribeRef.current();
      }

      if (authorsUnsubscribeRef.current) {
        authorsUnsubscribeRef.current();
      }

      if (leadsUnsubscribeRef.current) {
        leadsUnsubscribeRef.current();
      }

      if (publicLeadsUnsubscribeRef.current) {
        publicLeadsUnsubscribeRef.current();
      }
    };
  }, []);

  // ============================================================
  // 3. PUBLIC BLOGS
  // ============================================================

  useEffect(() => {
    const q = blogListQuery();

    blogsUnsubscribeRef.current = onSnapshot(
      q,
      (snapshot) => {
        const blogData = snapshot.docs.map((d) =>
          normalizeBlog(d)
        );

        console.log(
          `📄 LIVE: ${blogData.length} blogs from Firestore`
        );

        setBlogs(blogData);
        setBlogsLoading(false);
      },
      (error) => {
        console.error(
          "❌ Blogs listener error:",
          error
        );

        setBlogs([]);
        setBlogsLoading(false);
      }
    );

    return () => {
      if (blogsUnsubscribeRef.current) {
        blogsUnsubscribeRef.current();
      }
    };
  }, []);

  // ============================================================
  // 4. PUBLIC HERO
  // ============================================================

  useEffect(() => {
    heroUnsubscribeRef.current = onSnapshot(
      heroDocRef(),
      (snapshot) => {
        setHero(
          snapshot.exists()
            ? normalizeHero(snapshot)
            : null
        );

        setHeroLoading(false);
      },
      (error) => {
        console.error(
          "❌ Hero listener error:",
          error
        );

        setHero(null);
        setHeroLoading(false);
      }
    );

    return () => {
      if (heroUnsubscribeRef.current) {
        heroUnsubscribeRef.current();
      }
    };
  }, []);

  // ============================================================
  // 5. PUBLIC TRUSTED AUTHORS
  // ============================================================

  useEffect(() => {
    console.log(
      "📸 Starting Trusted Authors listener..."
    );

    const trustedAuthorsRef = collection(
      db,
      `users/${FIXED_USER_ID}/trustedAuthorPosts`
    );

    trustedAuthorsUnsubscribeRef.current =
      onSnapshot(
        trustedAuthorsRef,
        (snapshot) => {
          const posts = snapshot.docs
            .map((d) => ({
              id: d.id,
              ...d.data(),
            }))
            // Only active posts appear on Home
            .filter(
              (post) =>
                post.isActive !== false
            )
            // Oldest uploaded first
            .sort((a, b) => {
              const dateA =
                a.createdAt?.toDate
                  ? a.createdAt.toDate()
                  : new Date(
                      a.createdAt || 0
                    );

              const dateB =
                b.createdAt?.toDate
                  ? b.createdAt.toDate()
                  : new Date(
                      b.createdAt || 0
                    );

              return dateA - dateB;
            });

          console.log(
            `📸 LIVE: ${posts.length} trusted author posts from Firestore`
          );

          setTrustedAuthorPosts(posts);
        },
        (error) => {
          console.error(
            "❌ Trusted authors listener error:",
            error
          );

          setTrustedAuthorPosts([]);
        }
      );

    return () => {
      if (
        trustedAuthorsUnsubscribeRef.current
      ) {
        trustedAuthorsUnsubscribeRef.current();
      }
    };
  }, []);

  // ============================================================
  // 6. SEED DATA ONCE
  // ============================================================

  useEffect(() => {
    if (
      currentUser?.uid &&
      !hasSeededRef.current
    ) {
      const checkAndSeed = async () => {
        try {
          const booksQuery = query(
            collection(
              db,
              `users/${FIXED_USER_ID}/books`
            )
          );

          const unsubCheck = onSnapshot(
            booksQuery,
            async (snapshot) => {
              unsubCheck();

              if (
                snapshot.docs.length === 0 &&
                !hasSeededRef.current
              ) {
                hasSeededRef.current = true;

                console.log(
                  "🌱 Seeding initial data to Firestore..."
                );

                // ------------------------------------------------
                // Seed books
                // ------------------------------------------------

                for (const book of initialBooks) {
                  const bookData = {
                    ...book,
                  };

                  if (
                    typeof bookData.cover !==
                      "string" ||
                    !bookData.cover.startsWith(
                      "http"
                    )
                  ) {
                    delete bookData.cover;
                  }

                  await setDoc(
                    doc(
                      db,
                      `users/${FIXED_USER_ID}/books`,
                      book.id
                    ),
                    {
                      ...bookData,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                    {
                      merge: true,
                    }
                  );
                }

                // ------------------------------------------------
                // Seed authors
                // ------------------------------------------------

                for (const author of initialAuthors) {
                  const authorData = {
                    ...author,
                  };

                  if (
                    typeof authorData.photo !==
                      "string" ||
                    !authorData.photo.startsWith(
                      "http"
                    )
                  ) {
                    delete authorData.photo;
                  }

                  await setDoc(
                    doc(
                      db,
                      `users/${FIXED_USER_ID}/authors`,
                      author.id
                    ),
                    {
                      ...authorData,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                    {
                      merge: true,
                    }
                  );
                }

                console.log(
                  "✅ Initial data seeded to Firestore"
                );
              }
            }
          );
        } catch (error) {
          console.error(
            "❌ Seed error:",
            error
          );
        }
      };

      checkAndSeed();
    }
  }, [currentUser]);

  // ============================================================
  // 7. SEED BLOGS ONCE
  // ============================================================

  useEffect(() => {
    if (
      currentUser?.uid &&
      !hasSeededBlogsRef.current
    ) {
      const checkAndSeedBlogs = async () => {
        try {
          const blogsQuery =
            blogListQuery();

          const unsubCheck = onSnapshot(
            blogsQuery,
            async (snapshot) => {
              unsubCheck();

              if (
                snapshot.docs.length > 0 ||
                hasSeededBlogsRef.current
              ) {
                return;
              }

              hasSeededBlogsRef.current =
                true;

              console.log(
                "🌱 Seeding blogs to Firestore..."
              );

              const seeds = buildSeedBlogs();

              for (const seed of seeds) {
                await setDoc(
                  blogDocRef(seed.id),
                  seed,
                  {
                    merge: true,
                  }
                );
              }

              console.log(
                `✅ ${seeds.length} blogs seeded to Firestore`
              );
            },
            (error) => {
              console.error(
                "❌ Blogs seed check error:",
                error
              );
            }
          );
        } catch (error) {
          console.error(
            "❌ Blogs seed error:",
            error
          );
        }
      };

      checkAndSeedBlogs();
    }
  }, [currentUser]);

  // ============================================================
  // 8. BOOK CRUD
  // ============================================================

  const addBook = useCallback(
    async (book) => {
      try {
        const docRef = await addDoc(
          collection(
            db,
            `users/${FIXED_USER_ID}/books`
          ),
          {
            ...book,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        );

        console.log(
          "✅ NEW BOOK ADDED:",
          docRef.id
        );

        return docRef.id;
      } catch (error) {
        console.error(
          "❌ Add book failed (admin only):",
          error.message
        );

        throw error;
      }
    },
    []
  );

  const updateBook = useCallback(
    async (id, updatedBook) => {
      try {
        await updateDoc(
          doc(
            db,
            `users/${FIXED_USER_ID}/books`,
            id
          ),
          {
            ...updatedBook,
            updatedAt: new Date(),
          }
        );

        console.log("✅ Book updated");
      } catch (error) {
        console.error(
          "❌ Update failed (admin only):",
          error.message
        );

        throw error;
      }
    },
    []
  );

  const deleteBook = useCallback(
    async (id) => {
      try {
        await deleteDoc(
          doc(
            db,
            `users/${FIXED_USER_ID}/books`,
            id
          )
        );

        console.log("✅ Book deleted");
      } catch (error) {
        console.error(
          "❌ Delete failed (admin only):",
          error.message
        );

        throw error;
      }
    },
    []
  );

  // ============================================================
  // 9. AUTHOR CRUD
  // ============================================================

  const addAuthor = useCallback(
    async (author) => {
      try {
        const docRef = await addDoc(
          collection(
            db,
            `users/${FIXED_USER_ID}/authors`
          ),
          {
            ...author,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        );

        console.log(
          "✅ NEW AUTHOR ADDED:",
          docRef.id
        );

        return docRef.id;
      } catch (error) {
        console.error(
          "❌ Add author failed (admin only):",
          error.message
        );

        throw error;
      }
    },
    []
  );

  const updateAuthor = useCallback(
    async (id, updatedAuthor) => {
      try {
        await updateDoc(
          doc(
            db,
            `users/${FIXED_USER_ID}/authors`,
            id
          ),
          {
            ...updatedAuthor,
            updatedAt: new Date(),
          }
        );

        console.log("✅ Author updated");
      } catch (error) {
        console.error(
          "❌ Update failed (admin only):",
          error.message
        );

        throw error;
      }
    },
    []
  );

  const deleteAuthor = useCallback(
    async (id) => {
      try {
        await deleteDoc(
          doc(
            db,
            `users/${FIXED_USER_ID}/authors`,
            id
          )
        );

        console.log("✅ Author deleted");
      } catch (error) {
        console.error(
          "❌ Delete failed (admin only):",
          error.message
        );

        throw error;
      }
    },
    []
  );

  // ============================================================
  // 10. LEADS CRUD
  // ============================================================

  const addLead = useCallback(
    async (leadData) => {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth).catch(
            (authError) => {
              console.warn(
                "Anonymous auth failed, trying public Firestore write:",
                authError.message
              );
            }
          );
        }

        const cleanLead = {
          ...leadData,

          name:
            leadData.name?.trim() || "",

          email:
            leadData.email?.trim() || "",

          phone:
            leadData.phone?.trim() || "",

          message:
            leadData.message?.trim() || "",

          type:
            leadData.type || "contact",

          status:
            leadData.status || "new",

          createdAt:
            serverTimestamp(),

          authUid:
            auth.currentUser?.uid || null,
        };

        let docRef;

        try {
          docRef = await addDoc(
            collection(
              db,
              SHARED_LEADS_PATH
            ),
            cleanLead
          );
        } catch (
          sharedPathError
        ) {
          console.warn(
            "Shared leads path failed, trying public leads collection:",
            sharedPathError.message
          );

          docRef = await addDoc(
            collection(db, "leads"),
            cleanLead
          );
        }

        console.log(
          "✅ NEW LEAD ADDED:",
          docRef.id
        );

        return docRef.id;
      } catch (error) {
        console.error(
          "❌ Add lead failed:",
          error.message
        );

        throw error;
      }
    },
    []
  );

  const deleteLead = useCallback(
    async (id) => {
      try {
        await deleteDoc(
          doc(
            db,
            `users/${FIXED_USER_ID}/leads`,
            id
          )
        );

        await deleteDoc(
          doc(db, "leads", id)
        );

        console.log("✅ Lead deleted");
      } catch (error) {
        console.error(
          "❌ Delete lead failed (admin only):",
          error.message
        );

        throw error;
      }
    },
    []
  );

  // ============================================================
  // 11. BLOG CRUD
  // ============================================================

  const createBlogDoc = useCallback(
    async (data) => {
      try {
        const docRef =
          await createBlog(data);

        console.log(
          "✅ NEW BLOG CREATED:",
          docRef.id
        );

        return {
          id: docRef.id,
          error: null,
        };
      } catch (error) {
        console.error(
          "❌ Create blog failed (admin only):",
          error.message
        );

        return {
          id: null,
          error,
        };
      }
    },
    []
  );

  const updateBlogDoc = useCallback(
    async (id, data) => {
      try {
        await updateBlog(id, data);

        console.log(
          "✅ Blog updated:",
          id
        );

        return {
          error: null,
        };
      } catch (error) {
        console.error(
          "❌ Update blog failed (admin only):",
          error.message
        );

        return {
          error,
        };
      }
    },
    []
  );

  const deleteBlogDoc = useCallback(
    async (id) => {
      try {
        await deleteBlog(id);

        console.log(
          "✅ Blog deleted:",
          id
        );

        return {
          error: null,
        };
      } catch (error) {
        console.error(
          "❌ Delete blog failed (admin only):",
          error.message
        );

        return {
          error,
        };
      }
    },
    []
  );

  // ============================================================
  // 12. HERO
  // ============================================================

  const updateHero = useCallback(
    async (data) => {
      try {
        await updateHeroDoc(data);

        console.log(
          "✅ Hero updated"
        );

        return {
          error: null,
        };
      } catch (error) {
        console.error(
          "❌ Update hero failed (admin only):",
          error.message
        );

        return {
          error,
        };
      }
    },
    []
  );

  // ============================================================
  // 13. TRUSTED AUTHORS CRUD
  // ============================================================

  // ------------------------------------------------------------
  // ADD TRUSTED AUTHOR
  // ------------------------------------------------------------

  const addTrustedAuthorPost =
    useCallback(
      async ({
        file,
        username,
        likes,
        caption,
        instagramUrl,
        isActive = true,
      }) => {
        if (!file) {
          throw new Error(
            "Please select an image."
          );
        }

        try {
          const safeFileName =
            file.name.replace(
              /[^a-zA-Z0-9._-]/g,
              "_"
            );

          const imagePath =
            `trusted-author-posts/${Date.now()}-${safeFileName}`;

          const imageRef =
            ref(
              storage,
              imagePath
            );

          console.log(
            "📤 Uploading trusted author image..."
          );

          // Upload image to Firebase Storage
          await uploadBytes(
            imageRef,
            file,
            {
              contentType:
                file.type ||
                "image/jpeg",
            }
          );

          console.log(
            "✅ Image uploaded to Storage"
          );

          // Generate download URL
          const imageUrl =
            await getDownloadURL(
              imageRef
            );

          console.log(
            "🔗 Image URL generated"
          );

          // Save metadata in Firestore
          const docRef =
            await addDoc(
              collection(
                db,
                `users/${FIXED_USER_ID}/trustedAuthorPosts`
              ),
              {
                imageUrl,
                imagePath,

                username:
                  username?.trim() || "",

                likes:
                  likes?.trim() || "",

                caption:
                  caption?.trim() || "",

                instagramUrl:
                  instagramUrl?.trim() || "",

                isActive:
                  isActive !== false,

                createdAt:
                  serverTimestamp(),

                updatedAt:
                  serverTimestamp(),
              }
            );

          console.log(
            "✅ TRUSTED AUTHOR ADDED:",
            docRef.id
          );

          return {
            id: docRef.id,
            imageUrl,
          };
        } catch (error) {
          console.error(
            "❌ Add trusted author failed:",
            error
          );

          throw error;
        }
      },
      []
    );

  // ------------------------------------------------------------
  // UPDATE TRUSTED AUTHOR
  // ------------------------------------------------------------

  const updateTrustedAuthorPost =
    useCallback(
      async (id, data) => {
        try {
          const {
            file,
            ...fields
          } = data;

          const postRef =
            doc(
              db,
              `users/${FIXED_USER_ID}/trustedAuthorPosts`,
              id
            );

          // Get existing post
          const existingSnapshot =
            await getDoc(postRef);

          if (
            !existingSnapshot.exists()
          ) {
            throw new Error(
              "Trusted author post not found."
            );
          }

          const existingPost =
            existingSnapshot.data();

          let imageUrl =
            existingPost.imageUrl;

          let imagePath =
            existingPost.imagePath;

          // ------------------------------------------------------
          // Replace image if a new file was selected
          // ------------------------------------------------------

          if (file) {
            // Delete old image
            if (
              existingPost.imagePath
            ) {
              try {
                await deleteObject(
                  ref(
                    storage,
                    existingPost.imagePath
                  )
                );

                console.log(
                  "🗑️ Old trusted author image deleted"
                );
              } catch (
                storageError
              ) {
                console.warn(
                  "⚠️ Old image could not be deleted:",
                  storageError.message
                );
              }
            }

            const safeFileName =
              file.name.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
              );

            imagePath =
              `trusted-author-posts/${Date.now()}-${safeFileName}`;

            const imageRef =
              ref(
                storage,
                imagePath
              );

            // Upload new image
            await uploadBytes(
              imageRef,
              file,
              {
                contentType:
                  file.type ||
                  "image/jpeg",
              }
            );

            console.log(
              "✅ New trusted author image uploaded"
            );

            // Get new download URL
            imageUrl =
              await getDownloadURL(
                imageRef
              );
          }

          // ------------------------------------------------------
          // Update Firestore
          // ------------------------------------------------------

          await updateDoc(
            postRef,
            {
              ...fields,
              imageUrl,
              imagePath,
              updatedAt:
                serverTimestamp(),
            }
          );

          console.log(
            "✅ Trusted author updated:",
            id
          );
        } catch (error) {
          console.error(
            "❌ Update trusted author failed:",
            error
          );

          throw error;
        }
      },
      []
    );

  // ------------------------------------------------------------
  // DELETE TRUSTED AUTHOR
  // ------------------------------------------------------------

  const deleteTrustedAuthorPost =
    useCallback(
      async (post) => {
        try {
          // ------------------------------------------------------
          // Delete image from Firebase Storage
          // ------------------------------------------------------

          if (post.imagePath) {
            try {
              const imageRef =
                ref(
                  storage,
                  post.imagePath
                );

              await deleteObject(
                imageRef
              );

              console.log(
                "🗑️ Trusted author image deleted from Storage"
              );
            } catch (
              storageError
            ) {
              // Continue deleting Firestore document
              // even if Storage file doesn't exist
              console.warn(
                "⚠️ Storage image could not be deleted:",
                storageError.message
              );
            }
          }

          // ------------------------------------------------------
          // Delete Firestore document
          // ------------------------------------------------------

          await deleteDoc(
            doc(
              db,
              `users/${FIXED_USER_ID}/trustedAuthorPosts`,
              post.id
            )
          );

          console.log(
            "✅ Trusted author deleted:",
            post.id
          );
        } catch (error) {
          console.error(
            "❌ Delete trusted author failed:",
            error
          );

          throw error;
        }
      },
      []
    );

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = {
    // ----------------------------------------------------------
    // Data
    // ----------------------------------------------------------

    books,
    authors,
    leads,
    blogs,
    hero,

    // Trusted Authors
    trustedAuthorPosts,

    // ----------------------------------------------------------
    // Loading
    // ----------------------------------------------------------

    heroLoading,
    loading,
    blogsLoading,

    // ----------------------------------------------------------
    // Auth
    // ----------------------------------------------------------

    currentUser,

    // ----------------------------------------------------------
    // Books
    // ----------------------------------------------------------

    addBook,
    updateBook,
    deleteBook,

    // ----------------------------------------------------------
    // Authors
    // ----------------------------------------------------------

    addAuthor,
    updateAuthor,
    deleteAuthor,

    // ----------------------------------------------------------
    // Leads
    // ----------------------------------------------------------

    addLead,
    deleteLead,

    // ----------------------------------------------------------
    // Blogs
    // ----------------------------------------------------------

    createBlogDoc,
    updateBlogDoc,
    deleteBlogDoc,

    // ----------------------------------------------------------
    // Hero
    // ----------------------------------------------------------

    updateHero,

    // ----------------------------------------------------------
    // Trusted Authors
    // ----------------------------------------------------------

    addTrustedAuthorPost,
    updateTrustedAuthorPost,
    deleteTrustedAuthorPost,
  };

  // ============================================================
  // BOOK COVER HELPER
  // ============================================================

  const getBookCover = (book) => {
    let result;

    if (
      book.cover &&
      typeof book.cover === "string" &&
      book.cover.startsWith("http")
    ) {
      result = book.cover;
    } else if (
      book.cover &&
      typeof book.cover === "string" &&
      book.cover.startsWith("/assets/")
    ) {
      result = book.cover;
    } else {
      const original =
        initialBooks.find(
          (b) =>
            String(b.id) ===
            String(book.id)
        );

      if (
        original &&
        original.cover
      ) {
        result = original.cover;
      } else {
        result =
          "https://via.placeholder.com/200x300.png?text=No+Cover";
      }
    }

    return result;
  };

  // ============================================================
  // AUTHOR PHOTO HELPER
  // ============================================================

  const getAuthorPhoto = (author) => {
    let result;

    if (
      author.photo &&
      typeof author.photo === "string" &&
      author.photo.startsWith("http")
    ) {
      result = author.photo;
    } else if (
      author.image &&
      typeof author.image === "string" &&
      author.image.startsWith("http")
    ) {
      result = author.image;
    } else {
      const original =
        initialAuthors.find(
          (a) =>
            String(a.id) ===
            String(author.id)
        );

      if (
        original &&
        original.photo
      ) {
        result = original.photo;
      } else {
        result =
          "https://via.placeholder.com/150x150.png?text=No+Photo";
      }
    }

    return result;
  };

  // ============================================================
  // ADD HELPERS TO CONTEXT
  // ============================================================

  value.getBookCover =
    getBookCover;

  value.getAuthorPhoto =
    getAuthorPhoto;

  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <DataContext.Provider
      value={value}
    >
      {children}
    </DataContext.Provider>
  );
}