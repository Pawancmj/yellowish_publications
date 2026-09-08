import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import "./Hero.css";
import { useData } from "../../contexts/DataContext";

import book5 from "../../assets/book5.png";
import book16 from "../../assets/book16.png";
import book13 from "../../assets/book13.png";
import book9 from "../../assets/book9.png";


const FALLBACK_POOL = [
  { id: "fallback-1", src: book13, title: "Published Book 1" },
  { id: "fallback-2", src: book5, title: "Published Book 2" },
  { id: "fallback-3", src: book9, title: "Published Book 3" },
  { id: "fallback-4", src: book16, title: "Published Book 4" },
];

const VISIBLE_BOOKS = 6;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { books, getBookCover } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);

  /* =========================================
      FETCH & PREVENT ADJACENT + GLOBAL DUPLICATES
  ========================================= */
  const sliderBooks = useMemo(() => {
    let baseList = [];
    const seenSrcs = new Set();

    if (Array.isArray(books) && books.length > 0) {
      books.forEach((book) => {
        const src = getBookCover ? getBookCover(book) : book.src;
        if (!src) return;
        if (seenSrcs.has(src)) return; // skip duplicate covers from data itself
        seenSrcs.add(src);
        baseList.push({
          id: book.id || `book-${Math.random()}`,
          title: book.title || "Published Book",
          src,
        });
      });
    }

    if (baseList.length === 0) {
      baseList = [...FALLBACK_POOL];
      baseList.forEach((b) => seenSrcs.add(b.src));
    }

    // Fill slots with fallback images if count < 6, checked against the WHOLE list
    let filledList = [...baseList];
    let fallbackIndex = 0;
    let attempts = 0;
    const maxAttempts = FALLBACK_POOL.length * 4; // safety guard against infinite loop

    while (filledList.length < VISIBLE_BOOKS && attempts < maxAttempts) {
      const fallbackItem = FALLBACK_POOL[fallbackIndex % FALLBACK_POOL.length];
      fallbackIndex++;
      attempts++;

      // Check against the ENTIRE list, not just the last item
      const alreadyPresent = filledList.some(
        (b) => b.src === fallbackItem.src
      );

      if (!alreadyPresent) {
        filledList.push({
          ...fallbackItem,
          id: `fallback-fill-${filledList.length}`,
        });
      }
    }

    // If still short (e.g. fallback pool exhausted), allow repeats but never adjacent
    while (filledList.length < VISIBLE_BOOKS) {
      const fallbackItem = FALLBACK_POOL[fallbackIndex % FALLBACK_POOL.length];
      fallbackIndex++;
      if (filledList[filledList.length - 1]?.src !== fallbackItem.src) {
        filledList.push({
          ...fallbackItem,
          id: `fallback-fill-${filledList.length}`,
        });
      }
    }

    // Expand pool for infinite slider loop — guard the seam between copies
    let expanded = [...filledList];
    while (expanded.length < VISIBLE_BOOKS * 3) {
      const nextCopy = [...filledList];
      // avoid identical src at the seam (last of expanded vs first of nextCopy)
      if (
        expanded[expanded.length - 1]?.src === nextCopy[0]?.src &&
        nextCopy.length > 1
      ) {
        // rotate the copy by one so the seam doesn't repeat
        nextCopy.push(nextCopy.shift());
      }
      expanded = expanded.concat(nextCopy);
    }

    return expanded;
  }, [books, getBookCover]);

  /* =========================================
      NAVIGATION
  ========================================= */
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderBooks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderBooks.length) % sliderBooks.length);
  };

  /* =========================================
      AUTO SLIDE
  ========================================= */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderBooks.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, sliderBooks.length]);

  /* =========================================
      VISIBLE SLOTS
  ========================================= */
  const visibleBooks = useMemo(() => {
    const result = [];
    for (let i = 0; i < VISIBLE_BOOKS; i++) {
      const targetIndex = (currentIndex + i) % sliderBooks.length;
      result.push({
        ...sliderBooks[targetIndex],
        slotIndex: i,
      });
    }
    return result;
  }, [sliderBooks, currentIndex]);

  return (
    <section className="hero" aria-label="Yellowish Publication Hero">
      <div className="hero-heading">
        <Motion.p
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          BOOKS THAT INSPIRE. STORIES THAT STAY.
        </Motion.p>

        <Motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          Discover Stories That <span>Inspire</span>
        </Motion.h1>

        <Motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          Stories that deserve to be told, books that deserve to be discovered, and voices that deserve to be heard.
        </Motion.p>
      </div>

      <div className="book-showcase">
        <button
          type="button"
          className="book-arrow book-arrow-left"
          onClick={prevSlide}
          aria-label="Previous books"
        >
          ‹
        </button>

        <div className="hero-books">
          {visibleBooks.map((book) => {
            const isFallback = String(book.id).includes("fallback");

            return (
              <div key={`slot-${book.slotIndex}`} className="hero-book-wrapper">
                {isFallback ? (
                  <div className="hero-book-link">
                    <div className="hero-book">
                      <img src={book.src} alt={book.title} />
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/book/${book.id}`}
                    className="hero-book-link"
                    aria-label={`View ${book.title}`}
                  >
                    <div className="hero-book">
                      <img src={book.src} alt={book.title} />
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="book-arrow book-arrow-right"
          onClick={nextSlide}
          aria-label="Next books"
        >
          ›
        </button>
      </div>
    </section>
  );
}