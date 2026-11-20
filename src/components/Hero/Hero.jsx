import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import "./Hero.css";
import { useData } from "../../contexts/DataContext";
import { NO_COVER_PLACEHOLDER } from "../../utils/coverPlaceholder";

// Five or fewer selected books keep the original static showcase.
const STATIC_BOOK_LIMIT = 5;

// Responsive slot counts. These mirror the CSS custom properties in Hero.css.
const DESKTOP_VISIBLE_BOOKS = 5;
const TABLET_VISIBLE_BOOKS = 4;
const MOBILE_VISIBLE_BOOKS = 2;

const VISIBLE_COUNT_MEDIA_QUERIES = [
  {
    query: "(max-width: 768px)",
    count: MOBILE_VISIBLE_BOOKS,
  },
  {
    query: "(max-width: 1100px)",
    count: TABLET_VISIBLE_BOOKS,
  },
];

const AUTO_SLIDE_DELAY = 3200;
const SLIDE_DURATION = 900;

// Symmetric, restrained stagger: baseline / higher / lower / higher / baseline.
const STAGGER_OFFSETS = [0, -18, 10, -18, 0];

function readVisibleBookCount() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return DESKTOP_VISIBLE_BOOKS;
  }

  // Smallest breakpoint first so the most specific match wins.
  for (const { query, count } of VISIBLE_COUNT_MEDIA_QUERIES) {
    if (window.matchMedia(query).matches) {
      return count;
    }
  }

  return DESKTOP_VISIBLE_BOOKS;
}

function useVisibleBookCount() {
  const [visibleCount, setVisibleCount] = useState(
    readVisibleBookCount
  );

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }

    const mediaQueries = VISIBLE_COUNT_MEDIA_QUERIES.map(
      ({ query }) => window.matchMedia(query)
    );

    const handleChange = () =>
      setVisibleCount(readVisibleBookCount());

    setVisibleCount(readVisibleBookCount());

    mediaQueries.forEach((mediaQuery) => {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener(
          "change",
          handleChange
        );
      } else {
        // Safari < 14 fallback.
        mediaQuery.addListener(handleChange);
      }
    });

    return () => {
      mediaQueries.forEach((mediaQuery) => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener(
            "change",
            handleChange
          );
        } else {
          mediaQuery.removeListener(handleChange);
        }
      });
    };
  }, []);

  return visibleCount;
}

function positiveModulo(value, divisor) {
  if (!divisor || !Number.isFinite(divisor)) return 0;
  return ((value % divisor) + divisor) % divisor;
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

  // Keep the latest cover helper without re-creating the slide list on every
  // context render (DataContext re-renders regularly).
  const getBookCoverRef = useRef(getBookCover);
  getBookCoverRef.current = getBookCover;

  const visibleCount = useVisibleBookCount();
  const trackRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);
  const [slideStep, setSlideStep] = useState(0);
  const [animateTrack, setAnimateTrack] = useState(false);
  const [position, setPosition] = useState(0);

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
  const carouselEnabled = bookCount > STATIC_BOOK_LIMIT;

  // Three copies let the track wrap without ever showing an empty slot or a
  // missing book. The middle copy starts in view; the outer copies make both
  // navigation directions seamless.
  const trackBooks = useMemo(() => {
    if (!carouselEnabled) return sliderBooks;
    return [
      ...sliderBooks,
      ...sliderBooks,
      ...sliderBooks,
    ];
  }, [carouselEnabled, sliderBooks]);

  /* =========================================
      RESET / MEASUREMENT
  ========================================= */

  useEffect(() => {
    setPosition(carouselEnabled ? bookCount : 0);
    setAnimateTrack(false);
  }, [carouselEnabled, bookCount]);

  useLayoutEffect(() => {
    if (!trackRef.current || bookCount === 0) {
      return undefined;
    }

    const measure = () => {
      const track = trackRef.current;
      const firstItem = track?.querySelector(
        ".hero-book-wrapper"
      );

      if (!track || !firstItem) return;

      const styles = window.getComputedStyle(track);
      const gap =
        Number.parseFloat(
          styles.columnGap || styles.gap || "0"
        ) || 0;
      const nextStep =
        firstItem.getBoundingClientRect().width + gap;

      setSlideStep((previous) =>
        Math.abs(previous - nextStep) < 0.5
          ? previous
          : nextStep
      );
    };

    measure();
    window.addEventListener("resize", measure);

    return () =>
      window.removeEventListener("resize", measure);
  }, [bookCount, carouselEnabled, visibleCount]);

  // Re-enable the transition one frame after a hidden wrap reset.
  useLayoutEffect(() => {
    if (animateTrack || typeof window === "undefined") {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() =>
      setAnimateTrack(true)
    );

    return () => window.cancelAnimationFrame(frame);
  }, [animateTrack]);

  /* =========================================
      NAVIGATION
  ========================================= */

  const nextSlide = () => {
    if (!carouselEnabled) return;
    setPosition((previous) => previous + 1);
  };

  const prevSlide = () => {
    if (!carouselEnabled || position <= 0) return;
    setPosition((previous) => previous - 1);
  };

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !carouselEnabled ||
      isPaused ||
      bookCount === 0 ||
      slideStep <= 0
    ) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setPosition((previous) => previous + 1);
    }, AUTO_SLIDE_DELAY);

    return () => window.clearInterval(interval);
  }, [
    prefersReducedMotion,
    carouselEnabled,
    isPaused,
    bookCount,
    slideStep,
  ]);

  // Once the wrap animation finishes, jump by one whole cycle with the
  // transition disabled. The duplicate copy looks identical, so no motion jump
  // is visible and every book keeps its place in the rotation.
  useEffect(() => {
    if (!carouselEnabled || bookCount === 0) {
      return undefined;
    }

    const lowerBound = 0;
    const upperBound = bookCount * 2;

    if (
      position > lowerBound &&
      position < upperBound
    ) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setAnimateTrack(false);
      setPosition((previous) => {
        if (previous >= upperBound) {
          return previous - bookCount;
        }
        if (previous <= lowerBound) {
          return previous + bookCount;
        }
        return previous;
      });
    }, prefersReducedMotion ? 0 : SLIDE_DURATION + 60);

    return () => window.clearTimeout(timeout);
  }, [
    bookCount,
    carouselEnabled,
    position,
    prefersReducedMotion,
  ]);

  const trackStyle = carouselEnabled
    ? {
        transform: `translate3d(${-position * slideStep}px, 0, 0)`,
        transition:
          animateTrack &&
          !prefersReducedMotion &&
          slideStep > 0
            ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : "none",
      }
    : undefined;

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

      <div
        className="book-showcase"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
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
          <>
            {carouselEnabled && (
              <button
                type="button"
                className="book-arrow book-arrow-left"
                onClick={prevSlide}
                aria-label="Previous books"
              >
                ‹
              </button>
            )}

            <div
              ref={trackRef}
              className={`hero-books ${
                carouselEnabled
                  ? "hero-books--carousel"
                  : "hero-books--static"
              }`}
              style={trackStyle}
            >
              {trackBooks.map((book, index) => {
                const customBadge =
                  typeof book.customBadge ===
                  "string"
                    ? book.customBadge.trim()
                    : "";

                const visualSlot = carouselEnabled
                  ? positiveModulo(
                      index - position,
                      visibleCount
                    )
                  : positiveModulo(index, visibleCount);

                const stagger =
                  STAGGER_OFFSETS[
                    visualSlot % STAGGER_OFFSETS.length
                  ];

                const duplicateCopy = carouselEnabled
                  ? index < bookCount ||
                    index >= bookCount * 2
                  : false;

                const highPriority = carouselEnabled
                  ? index >= bookCount &&
                    index < bookCount * 2 &&
                    index - bookCount < visibleCount
                  : index < visibleCount;

                return (
                  <div
                    key={`${book.id}-${index}`}
                    className="hero-book-wrapper"
                    style={{
                      "--hero-stagger": `${stagger}px`,
                    }}
                    aria-hidden={
                      duplicateCopy ? "true" : undefined
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
              })}
            </div>

            {carouselEnabled && (
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
