import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import "./Hero.css";
import { useData } from "../../contexts/DataContext";
import { NO_COVER_PLACEHOLDER } from "../../utils/coverPlaceholder";

// Same visual duplication technique as the Distribution Channels marquee.
// The number of rendered sets is calculated from the measured slot size so
// even a very small selection has no blank gaps on wide screens.
const MIN_MARQUEE_COPIES = 4;
const MAX_MARQUEE_COPIES = 24;

// Symmetric, restrained stagger: baseline / higher / lower / higher / baseline.
const STAGGER_OFFSETS = [0, -18, 10, -18, 0];

function calculateMarqueeCopies({
  bookCount,
  slideWidth,
  gap,
  viewportWidth,
}) {
  if (bookCount <= 1 || slideWidth <= 0 || viewportWidth <= 0) {
    return 1;
  }

  // One cycle is half the track: (copies / 2) full book sets.
  // Keep at least one full cycle on screen after the halfway reset point.
  const setAdvance = bookCount * (slideWidth + gap);
  const needed = Math.ceil(
    (2 * (viewportWidth + gap)) / setAdvance
  );
  const evenNeeded = needed % 2 === 0 ? needed : needed + 1;

  return Math.min(
    MAX_MARQUEE_COPIES,
    Math.max(MIN_MARQUEE_COPIES, evenNeeded)
  );
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
    featuredHeroBooksLoading,
    featuredHeroBooksError,
    getBookCover,
  } = useData();

  // Keep the latest cover helper without re-creating the book list on every
  // context render (DataContext re-renders regularly).
  const getBookCoverRef = useRef(getBookCover);
  getBookCoverRef.current = getBookCover;

  const trackRef = useRef(null);
  const [marqueeCopies, setMarqueeCopies] = useState(
    MIN_MARQUEE_COPIES
  );

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

  const bookCount = sliderBooks.length;

  // A single book stays still; every larger selection becomes a continuous
  // right-to-left marquee. Duplicates are visual only.
  const marqueeEnabled =
    bookCount > 1 && !prefersReducedMotion;
  const renderedCopies = marqueeEnabled
    ? marqueeCopies
    : 1;

  /* =========================================
      MEASURE HOW MANY VISUAL COPIES ARE NEEDED
  ========================================= */

  useLayoutEffect(() => {
    if (!marqueeEnabled || !trackRef.current) {
      return undefined;
    }

    const measure = () => {
      const track = trackRef.current;
      const firstSlot = track?.querySelector(
        ".hero-book-wrapper"
      );

      if (!track || !firstSlot) return;

      const styles = window.getComputedStyle(track);
      const gap =
        Number.parseFloat(
          styles.columnGap || styles.gap || "0"
        ) || 0;
      const slideWidth =
        firstSlot.getBoundingClientRect().width;
      const viewportWidth =
        track.parentElement?.clientWidth ||
        window.innerWidth;

      setMarqueeCopies((previous) => {
        const next = calculateMarqueeCopies({
          bookCount,
          slideWidth,
          gap,
          viewportWidth,
        });

        return previous === next ? previous : next;
      });
    };

    measure();
    window.addEventListener("resize", measure);

    return () =>
      window.removeEventListener("resize", measure);
  }, [bookCount, marqueeEnabled]);

  /* =========================================
      RENDERING TRACK (VISUAL COPIES ONLY)
  ========================================= */

  const trackBooks = useMemo(() => {
    const result = [];

    for (let copy = 0; copy < renderedCopies; copy++) {
      sliderBooks.forEach((book, index) => {
        result.push({
          book,
          copyIndex: copy,
          setIndex: index,
        });
      });
    }

    return result;
  }, [renderedCopies, sliderBooks]);

  const showLoadingState =
    featuredHeroBooksLoading && bookCount === 0;

  return (
    <section
      className="hero"
      aria-label="Yellowish Publication Hero"
    >
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
        ) : bookCount === 0 ? (
          <div
            className="hero-books-empty"
            role="status"
            aria-live="polite"
          >
            <strong>Featured books coming soon</strong>
            <span>
              {featuredHeroBooksError
                ? "We couldn't load the featured selection right now. Please try again shortly."
                : "Our next featured selection is being prepared."}
            </span>
          </div>
        ) : (
          <div
            className={
              marqueeEnabled
                ? "hero-marquee"
                : "hero-books-static-wrap"
            }
          >
            <div
              key={renderedCopies}
              ref={trackRef}
              className={`hero-books ${
                marqueeEnabled
                  ? "hero-books--marquee"
                  : "hero-books--static"
              }`}
            >
              {trackBooks.map(
                ({ book, copyIndex, setIndex }) => {
                  const customBadge =
                    typeof book.customBadge ===
                    "string"
                      ? book.customBadge.trim()
                      : "";

                  const stagger =
                    STAGGER_OFFSETS[
                      setIndex % STAGGER_OFFSETS.length
                    ];

                  const duplicateCopy =
                    copyIndex > 0;

                  const highPriority =
                    copyIndex === 0 &&
                    setIndex <
                      STAGGER_OFFSETS.length;

                  return (
                    <div
                      key={`${book.id}-${copyIndex}`}
                      className="hero-book-wrapper"
                      style={{
                        "--hero-stagger": `${stagger}px`,
                      }}
                      aria-hidden={
                        duplicateCopy
                          ? "true"
                          : undefined
                      }
                    >
                      <Link
                        to={`/book/${book.id}`}
                        className="hero-book-link"
                        aria-label={`View ${book.title}`}
                        tabIndex={
                          duplicateCopy ? -1 : undefined
                        }
                      >
                        <div className="hero-book">
                          <img
                            src={book.src}
                            alt={book.title}
                            width={576}
                            height={864}
                            loading={
                              highPriority
                                ? "eager"
                                : "lazy"
                            }
                            fetchPriority={
                              highPriority
                                ? "high"
                                : "auto"
                            }
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
                }
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
