import { motion as Motion, useReducedMotion } from "framer-motion"; 
import { Link } from "react-router-dom"; 
import { useEffect, useMemo, useState } from "react"; 
 
import "./Hero.css"; 
import { useData } from "../../contexts/DataContext"; 
 
import book5 from "../../assets/book5.png"; 
import book9 from "../../assets/book9.png"; 
import book13 from "../../assets/book13.png"; 
import book16 from "../../assets/book16.png"; 
 
const DEFAULT_BOOKS = [ 
  { 
    id: "default-1", 
    src: book13, 
    title: "Published Book", 
  }, 
  { 
    id: "default-2", 
    src: book5, 
    title: "Published Book", 
  }, 
  { 
    id: "default-3", 
    src: book9, 
    title: "Published Book", 
  }, 
  { 
    id: "default-4", 
    src: book16, 
    title: "Published Book", 
  }, 
]; 
 
const VISIBLE_BOOKS = 6; 
 
export default function Hero() { 
  const prefersReducedMotion = useReducedMotion(); 
 
  const { 
    books, 
    getBookCover, 
  } = useData(); 
 
  const [currentIndex, setCurrentIndex] = useState(0); 
 
  /* ========================================= 
     BOOK DATA 
  ========================================= */ 
 
  const allBooks = useMemo(() => { 
    if (books && books.length > 0) { 
      return books.map((book) => ({ 
        id: book.id, 
        title: book.title || "Published Book", 
        src: getBookCover(book), 
      })); 
    } 
 
    return DEFAULT_BOOKS; 
  }, [books, getBookCover]); 
 
  /* ========================================= 
     MAKE SURE AT LEAST 6 BOOKS EXIST 
  ========================================= */ 
 
  const sliderBooks = useMemo(() => { 
    if (!allBooks.length) return []; 
 
    if (allBooks.length >= VISIBLE_BOOKS) { 
      return allBooks; 
    } 
 
    const result = []; 
 
    for (let i = 0; i < VISIBLE_BOOKS; i++) { 
      result.push( 
        allBooks[i % allBooks.length] 
      ); 
    } 
 
    return result; 
  }, [allBooks]); 
 
  /* ========================================= 
     NEXT 
  ========================================= */ 
 
  const nextSlide = () => { 
    if (sliderBooks.length <= VISIBLE_BOOKS) { 
      return; 
    } 
 
    setCurrentIndex((prev) => { 
      return ( 
        (prev + 1) % 
        sliderBooks.length 
      ); 
    }); 
  }; 
 
  /* ========================================= 
     PREVIOUS 
  ========================================= */ 
 
  const prevSlide = () => { 
    if (sliderBooks.length <= VISIBLE_BOOKS) { 
      return; 
    } 
 
    setCurrentIndex((prev) => { 
      return ( 
        (prev - 1 + sliderBooks.length) % 
        sliderBooks.length 
      ); 
    }); 
  }; 
 
  /* ========================================= 
     AUTO SLIDE 
  ========================================= */ 
 
  useEffect(() => { 
    if (prefersReducedMotion) return; 
 
    if (sliderBooks.length <= VISIBLE_BOOKS) { 
      return; 
    } 
 
    const interval = setInterval(() => { 
      setCurrentIndex((prev) => { 
        return ( 
          (prev + 1) % 
          sliderBooks.length 
        ); 
      }); 
    }, 3500); 
 
    return () => clearInterval(interval); 
  }, [ 
    prefersReducedMotion, 
    sliderBooks.length, 
  ]); 
 
  /* ========================================= 
     VISIBLE BOOKS 
  ========================================= */ 
 
  const visibleBooks = useMemo(() => { 
    if (!sliderBooks.length) { 
      return []; 
    } 
 
    const result = []; 
 
    for (let i = 0; i < VISIBLE_BOOKS; i++) { 
      result.push( 
        sliderBooks[ 
          (currentIndex + i) % 
            sliderBooks.length 
        ] 
      ); 
    } 
 
    return result; 
  }, [ 
    sliderBooks, 
    currentIndex, 
  ]); 
 
  /* ========================================= 
     RENDER 
  ========================================= */ 
 
  return ( 
    <section 
      className="hero" 
      aria-label="Yellowish Publication Hero" 
    > 
 
      {/* ===================================== 
          HERO TEXT 
      ===================================== */} 
 
      <div className="hero-heading"> 
 
        <Motion.p 
          className="hero-eyebrow" 
          initial={{ 
            opacity: 0, 
            y: 10, 
          }} 
          animate={{ 
            opacity: 1, 
            y: 0, 
          }} 
          transition={{ 
            duration: 0.5, 
          }} 
        > 
          BOOKS THAT INSPIRE. STORIES THAT STAY. 
        </Motion.p> 
 
        <Motion.h1 
          className="hero-title" 
          initial={{ 
            opacity: 0, 
            y: 20, 
          }} 
          animate={{ 
            opacity: 1, 
            y: 0, 
          }} 
          transition={{ 
            duration: 0.65, 
            delay: 0.1, 
          }} 
        > 
          Discover Stories That{" "} 
          <span>Inspire</span> 
        </Motion.h1> 
 
        <Motion.p 
          className="hero-description" 
          initial={{ 
            opacity: 0, 
            y: 15, 
          }} 
          animate={{ 
            opacity: 1, 
            y: 0, 
          }} 
          transition={{ 
            duration: 0.55, 
            delay: 0.2, 
          }} 
        > 
          Explore a wide collection of books 
          across genres written by talented 
          authors. Find your next great read 
          and inspire your journey. 
        </Motion.p> 
 
      </div> 
 
 
      {/* ===================================== 
          ORANGE BOOK SHOWCASE 
      ===================================== */} 
 
      <div className="book-showcase"> 
 
        {/* LEFT ARROW */} 
 
        <button 
          type="button" 
          className="book-arrow book-arrow-left" 
          onClick={prevSlide} 
          aria-label="Previous books" 
        > 
          ‹ 
        </button> 
 
 
        {/* BOOKS */} 
 
        <div className="hero-books"> 
 
          {visibleBooks.map( 
            (book, index) => { 
 
              const isDefault = 
                String(book.id).startsWith( 
                  "default-" 
                ); 
 
              return ( 
                <Motion.div 
                  key={`${book.id}-${index}`} 
                  className="hero-book-wrapper" 
                  initial={ 
                    prefersReducedMotion 
                      ? false 
                      : { 
                          opacity: 0, 
                          y: 20, 
                        } 
                  } 
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                  }} 
                  transition={{ 
                    duration: 0.45, 
                    delay: index * 0.06, 
                  }} 
                > 
 
                  {isDefault ? ( 
                    <div className="hero-book-link"> 
 
                      <div className="hero-book"> 
                        <img 
                          src={book.src} 
                          alt={book.title} 
                          loading="lazy" 
                        /> 
                      </div> 
 
                    </div> 
                  ) : ( 
                    <Link 
                      to={`/book/${book.id}`} 
                      className="hero-book-link" 
                      aria-label={`View ${book.title}`} 
                    > 
 
                      <div className="hero-book"> 
                        <img 
                          src={book.src} 
                          alt={book.title} 
                          loading="lazy" 
                        /> 
                      </div> 
 
                    </Link> 
                  )} 
 
                </Motion.div> 
              ); 
            } 
          )} 
 
        </div> 
 
 
        {/* RIGHT ARROW */} 
 
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