import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

import "./Hero.css";

import { useData } from "../../contexts/DataContext";

import book5 from "../../assets/book5.png";
import book9 from "../../assets/book9.png";
import book13 from "../../assets/book13.png";
import book16 from "../../assets/book16.png";

import author1 from "../../assets/author1.png";
import author2 from "../../assets/author2.png";
import author3 from "../../assets/author3.png";
import author4 from "../../assets/author4.png";

const AUTHOR_AVATARS = [
  { src: author1, name: "Published author one" },
  { src: author2, name: "Published author two" },
  { src: author3, name: "Published author three" },
  { src: author4, name: "Published author four" },
];

// Single spacious diamond collage inside a 480x350px stage.
// Top and bottom books centered; left and right books horizontally aligned.
// Books keep 30px+ clear whitespace between each other.
// These are the DEFAULT sources. Admin-managed images (hero.images) override
// them slot-for-slot; any slot without a configured image keeps its default.
const FLOATING_BOOKS = [
  {
    slotId: "hero-1",
    src: book13,
    alt: "Published book cover",
    className: "left-[184px] top-[8px] z-20",
    height: "h-[150px]",
    rotation: 4,
  },
  {
    slotId: "hero-2",
    src: book5,
    alt: "Published book cover",
    className: "left-[28px] top-[95px] z-10",
    height: "h-[165px]",
    rotation: -4,
  },
  {
    slotId: "hero-3",
    src: book9,
    alt: "Published book cover",
    className: "left-[330px] top-[95px] z-10",
    height: "h-[165px]",
    rotation: 4,
  },
  {
    slotId: "hero-4",
    src: book16,
    alt: "Published book cover",
    className: "left-[182px] top-[195px] z-20",
    height: "h-[155px]",
    rotation: 0,
  },
];

const slideFromLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerWrap = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

function FloatingBook({ src, alt, className, height, rotation, onError, book }) {
  const inner = (
    <div
      className={`relative aspect-[3/4] ${height} transition-transform duration-300 ${
        book ? "cursor-pointer group-hover:scale-[1.05]" : ""
      }`}
      style={{ rotate: rotation }}
    >
      <img
        src={src}
        alt={book ? `${alt} — ${book.title}` : alt}
        width={170}
        height={226}
        loading="lazy"
        onError={onError}
        className="h-full w-full rounded-md object-cover shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 group-hover:shadow-[0_18px_38px_rgba(0,0,0,0.2)]"
      />
    </div>
  );

  // No linked book → render the cover as before (not clickable).
  if (!book) {
    return <div className={`absolute ${className}`}>{inner}</div>;
  }

  return (
    <div className={`absolute ${className}`}>
      <Link
        to={`/book/${book.id}`}
        className="group block"
        aria-label={`View details for ${book.title}`}
        title={book.title}
      >
        {inner}
      </Link>
    </div>
  );
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { hero, heroLoading, books, getBookCover } = useData();
  const [failedSlots, setFailedSlots] = useState({});

  // Resolve the source for a slot:
  // 1. A linked book always supplies its own cover (no mismatch possible).
  // 2. Otherwise a legacy image (old hero data, no book) is shown as-is.
  // 3. Otherwise the slot's default fallback image keeps the composition.
  const resolveSource = (defaultBook, index, linked) => {
    if (linked) return getBookCover(linked);
    const slot = !heroLoading && hero?.images ? hero.images[index] : null;
    const configured = slot?.imageUrl;
    if (configured && !failedSlots[defaultBook.slotId]) return configured;
    return defaultBook.src;
  };

  // Resolve the book linked to a slot from the live books collection.
  // Returns null when no book is selected (cover stays non-clickable).
  const resolveBook = (index) => {
    if (heroLoading) return null;
    const slot = hero?.images?.[index];
    if (!slot?.bookId) return null;
    return (
      (books || []).find((b) => String(b.id) === String(slot.bookId)) || null
    );
  };

  const handleSlotError = (slotId) => {
    setFailedSlots((prev) => ({ ...prev, [slotId]: true }));
  };

  return (
    <section className="hero w-full bg-[#FFFDFC]" aria-label="Hero">
      {/* Pure CSS decorative background layers behind the hero content */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-blob-right">
          <span className="hero-glow" />
        </div>
        <div className="hero-wave-left" />
        <div className="hero-cloud-top-left">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-cloud-top-center">
          <span />
        </div>
        <div className="hero-cloud-middle" />
      </div>

      <div className="hero-content mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 pt-[24px] pb-[40px] md:grid-cols-[42%_58%] md:gap-8 md:pt-[32px] md:pb-[56px] lg:grid-cols-[40%_60%] lg:gap-10 lg:pt-[32px] lg:pb-[80px]">
          {/* Left column */}
          <Motion.div
            className="flex flex-col items-center text-center md:items-start md:text-left lg:items-start lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerWrap}
          >
            <Motion.h1
              variants={slideFromLeft}
              className="mb-4 max-w-[420px] font-display text-[clamp(2.25rem,9vw,3.5rem)] font-semibold leading-[1.15] tracking-[-1px] text-ink md:mb-[18px] md:text-[46px] lg:mb-[22px] lg:text-[72px]"
            >
              Publishing
              <br />
              Made Easy
            </Motion.h1>

            <Motion.p
              variants={fadeUp}
              className="mb-6 max-w-[340px] text-[17px] leading-[1.45] text-[#6B7280] sm:text-[18px] md:mb-8 md:max-w-[400px] lg:mb-[34px]"
            >
              Start your publishing journey today.
              <br />
              We help authors bring their stories to the world with
              high-quality printing and global distribution.
            </Motion.p>

            <Motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-[18px] md:justify-start lg:justify-start"
            >
              <Link
                to="/store"
                className="inline-flex h-[44px] items-center justify-center rounded-[10px] bg-primary px-7 py-3.5 text-[16px] font-semibold text-ink transition-colors duration-300 hover:bg-[#E8B000]"
              >
                Know More
              </Link>

              <div className="flex items-center">
                <div className="flex -space-x-2.5">
                  {AUTHOR_AVATARS.slice(0, 3).map((author) => (
                    <img
                      key={author.src}
                      src={author.src}
                      alt={author.name}
                      width={30}
                      height={30}
                      loading="lazy"
                      className="h-[30px] w-[30px] rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <span className="ml-3 text-[13px] font-medium text-ink">
                  Join 15,000+ Authors
                </span>
              </div>
            </Motion.div>
          </Motion.div>

          {/* Right column — spacious diamond collage, 480x350 stage */}
            <div className="hero-stage-wrap relative mx-auto flex h-[195px] w-full max-w-[420px] items-center justify-center sm:h-[252px] md:h-[300px] lg:h-[350px] lg:max-w-none lg:-translate-x-20">
            <div className="hero-stage relative h-[350px] w-[480px] shrink-0">
              <Motion.div
                className="relative h-full w-full"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, -4, 0] }
                }
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                {FLOATING_BOOKS.map((book, index) => {
                  const linked = resolveBook(index);
                  return (
                    <FloatingBook
                      key={book.slotId}
                      {...book}
                      src={resolveSource(book, index, linked)}
                      onError={() => handleSlotError(book.slotId)}
                      book={linked}
                    />
                  );
                })}
              </Motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
