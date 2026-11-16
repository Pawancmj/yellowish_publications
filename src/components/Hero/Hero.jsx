import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import "./Hero.css";
import { useData } from "../../contexts/DataContext";
import { NO_COVER_PLACEHOLDER } from "../../utils/coverPlaceholder";

// Desktop shows up to six covers at once; mobile CSS shows two.
const VISIBLE_BOOKS = 6;
const MOBILE_VISIBLE_BOOKS = 2;
const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

function readIsMobileViewport() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }

  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

// Mirrors the CSS mobile breakpoint so arrows/rotation only appear when the
// selection does not fit in the visible showcase slots.
function useVisibleBookCount() {
  const [isMobile, setIsMobile] = useState(
    readIsMobileViewport
  );

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      MOBILE_MEDIA_QUERY
    );

    const handleChange = (event) =>
      setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(
        "change",
        handleChange
      );

      return () =>
        mediaQuery.removeEventListener(
          "change",
          handleChange
        );
    }

    // Safari < 14 fallback.
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return isMobile
    ? MOBILE_VISIBLE_BOOKS
    : VISIBLE_BOOKS;
}

// Swap a broken cover for the shared placeholder exactly once.
function handleCoverError(event) {
  const image = event.currentTarget;

  if (
    !image ||
    image.dataset.coverFallback === "true"
  ) {
    return;
  }

  image.dataset.coverFallback = "true";
  image.src = NO_COVER_PLACEHOLDER;
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const {
    featuredHeroBooks,
    homepageSettingsLoading,
    homepageSettingsError,
    getBookCover,
  } = useData();

  // Keep the latest cover helper without re-creating the slide list on every
  // context render (DataContext re-renders regularly).
  const getBookCoverRef = useRef(getBookCover);
  getBookCoverRef.current = getBookCover;

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = useVisibleBookCount();

  /* =========================================
      FEATURED BOOKS ONLY (ADMIN ORDER)
  ========================================= */

  const sliderBooks = useMemo(() => {
    const source = Array.isArray(featuredHeroBooks)
      ? featuredHeroBooks
      : [];

    const resolveCover = getBookCoverRef.current;
    const seenIds = new Set();
    const result = [];

    source.forEach((book) => {
      if (
        !book ||
        book.id === undefined ||
        book.id === null
      ) {
        return;
      }

      const id = String(book.id);

      // Guard against duplicate IDs in a malformed document.
      if (seenIds.has(id)) return;

      const cover = resolveCover
        ? resolveCover(book)
        : book.cover;

      seenIds.add(id);

      result.push({
        id,
        title: book.title || "Published Book",
        src:
          typeof cover === "string" && cover
            ? cover
            : NO_COVER_PLACEHOLDER,
        customBadge: book.customBadge,
      });
    });

    return result;
  }, [featuredHeroBooks]);

  /* =========================================
      KEEP THE WINDOW IN RANGE
  ========================================= */

  useEffect(() => {
    setCurrentIndex((previous) => {
      if (sliderBooks.length === 0) return 0;

      // When everything fits, always start at the admin's first book so the
      // configured order is shown exactly as saved.
      if (sliderBooks.length <= visibleCount) {
        return 0;
      }

      return previous % sliderBooks.length;
    });
  }, [sliderBooks.length, visibleCount]);

  const sliderEnabled =
    sliderBooks.length > visibleCount;

  /* =========================================
      NAVIGATION
  ========================================= */

  const nextSlide = () => {
    if (!sliderEnabled) return;

    setCurrentIndex(
      (previous) =>
        (previous + 1) % sliderBooks.length
    );
  };

  const prevSlide = () => {
    if (!sliderEnabled) return;

    setCurrentIndex(
      (previous) =>
        (previous - 1 + sliderBooks.length) %
        sliderBooks.length
    );
  };

  /* =========================================
      AUTO SLIDE (ONLY WHEN NEEDED)
  ========================================= */

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !sliderEnabled
    ) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex(
        (previous) =>
          (previous + 1) % sliderBooks.length
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [
    prefersReducedMotion,
    sliderEnabled,
    sliderBooks.length,
  ]);

  /* =========================================
      VISIBLE SLOTS
  ========================================= */

  const visibleBooks = useMemo(() => {
    if (sliderBooks.length === 0) return [];

    const count = Math.min(
      visibleCount,
      sliderBooks.length
    );

    const result = [];

    for (let i = 0; i < count; i++) {
      result.push(
        sliderBooks[
          (currentIndex + i) % sliderBooks.length
        ]
      );
    }

    return result;
  }, [sliderBooks, currentIndex, visibleCount]);

  /* Prefetch the next slide window so covers are warm before they rotate in */
  useEffect(() => {
    if (!sliderEnabled) return undefined;

    const prefetch = () => {
      for (let i = 0; i < visibleCount; i++) {
        const targetIndex =
          (currentIndex +
            visibleCount +
            i) %
          sliderBooks.length;

        const src = sliderBooks[targetIndex]?.src;

        if (src) {
          const image = new Image();
          image.decoding = "async";
          image.src = src;
        }
      }
    };

    const raf = requestAnimationFrame(prefetch);

    return () => cancelAnimationFrame(raf);
  }, [
    currentIndex,
    sliderBooks,
    sliderEnabled,
    visibleCount,
  ]);

  const showLoadingState =
    homepageSettingsLoading &&
    sliderBooks.length === 0;

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
        {showLoadingState ? (
          <div
            className="hero-books-empty"
            role="status"
            aria-live="polite"
          >
            <strong>Loading featured books…</strong>
          </div>
        ) : sliderBooks.length === 0 ? (
          <div
            className="hero-books-empty"
            role="status"
            aria-live="polite"
          >
            <strong>Featured books coming soon</strong>
            <span>
              {homepageSettingsError
                ? "We couldn't load the featured selection right now. Please try again shortly."
                : "Our next featured selection is being prepared."}
            </span>
          </div>
        ) : (
          <>
            {sliderEnabled && (
              <button
                type="button"
                className="book-arrow book-arrow-left"
                onClick={prevSlide}
                aria-label="Previous books"
              >
                ‹
              </button>
            )}

            <div className="hero-books">
              {visibleBooks.map((book) => {
                const customBadge =
                  typeof book.customBadge ===
                  "string"
                    ? book.customBadge.trim()
                    : "";

                return (
                  <div
                    key={book.id}
                    className="hero-book-wrapper"
                  >
                    <Link
                      to={`/book/${book.id}`}
                      className="hero-book-link"
                      aria-label={`View ${book.title}`}
                    >
                      <div className="hero-book">
                        <img
                          src={book.src}
                          alt={book.title}
                          width={470}
                          height={705}
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                          onError={handleCoverError}
                        />
                        {customBadge ? (
                          <span className="hero-book-badge">
                            {customBadge}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {sliderEnabled && (
              <button
                type="button"
                className="book-arrow book-arrow-right"
                onClick={nextSlide}
                aria-label="Next books"
              >
                ›
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
