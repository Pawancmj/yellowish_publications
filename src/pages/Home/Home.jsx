import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import "./Home.css";

// Assets
import aboutImage from "../../assets/About.png";
import heroImage from "../../assets/hero.png";

// Distribution channel logos
import amazonLogo from "../../assets/distribution/amazon.svg";
import kindleLogo from "../../assets/distribution/kindle.svg";
import googlePlayBooksLogo from "../../assets/distribution/google-play-books.svg";
import flipkartLogo from "../../assets/distribution/flipkart.svg";
import appleBooksLogo from "../../assets/distribution/apple-books.svg";
import barnesNobleLogo from "../../assets/distribution/barnes-noble.svg";
import koboLogo from "../../assets/distribution/kobo.svg";

import book1 from "../../assets/book1.png";
import book5 from "../../assets/book5.png";
import book9 from "../../assets/book9.png";
import book13 from "../../assets/book13.png";

import author1 from "../../assets/author1.png";
import author2 from "../../assets/author2.png";
import author3 from "../../assets/author3.png";
import author4 from "../../assets/author4.png";
import author5 from "../../assets/author5.png";

import Hero from "../../components/Hero/Hero";

// React Icons
import {
  FaBookOpen,
  FaGlobe,
  FaPen,
  FaUsers,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaPlay,
  FaCheck,
  FaGoogle,
} from "react-icons/fa";

const FEATURES = [
  {
    icon: FaBookOpen,
    title: "100% Author Royalty",
    desc: "Authors earn every rupee from the sale of their books.",
  },
  {
    icon: FaGlobe,
    title: "Global Distribution",
    desc: "Your book reaches readers across 150+ countries worldwide.",
  },
  {
    icon: FaUsers,
    title: "Complete Support",
    desc: "Affordable packages with a team that guides you at every step.",
  },
  {
    icon: FaPen,
    title: "High Quality",
    desc: "Professional editing, design, and print quality guaranteed.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Deb",
    role: "Published Author",
    quote:
      "Yellowish Publication made my publishing journey smooth and exciting. Their team is simply the best!",
    photo: author5,
  },
  {
    name: "Dr. Heena Sachdeva",
    role: "Academic Author",
    quote:
      "Thanks to Yellowish Publication, my book reached readers across the globe. Highly recommended!",
    photo: author2,
  },
  {
    name: "Mukul Dagar",
    role: "Author & Mentor",
    quote:
      "From editing to cover design, every detail was handled with care. Truly a five-star publishing experience.",
    photo: author3,
  },
  {
    name: "Sarfaraz Khader",
    role: "Bestselling Author",
    quote:
      "They treated my manuscript like their own. Patient, professional, and incredibly supportive throughout.",
    photo: author4,
  },
];

const STATS = [
  { value: "15K+", label: "Authors" },
  { value: "20K+", label: "Books Published" },
  { value: "150+", label: "Countries" },
  { value: "24/7", label: "Author Support" },
];

const PACKAGES = [
  {
    name: "Basic",
    price: "₹4,999",
    features: [
      "Up to 100 pages",
      "10 author copies",
      "Standard cover design",
      "Amazon & Flipkart listing",
      "Email support",
    ],
  },
  {
    name: "Premium",
    price: "₹9,999",
    featured: true,
    features: [
      "Up to 250 pages",
      "25 author copies",
      "Custom cover + editing",
      "Global distribution",
      "Marketing assistance",
      "Priority support",
    ],
  },
  {
    name: "Elite",
    price: "₹14,999",
    features: [
      "Unlimited pages",
      "50 author copies",
      "Premium design + editing",
      "Global + print distribution",
      "Dedicated author manager",
    ],
  },
];

// ✅ FIXED — uses real imported logos, no broken DISTRIBUTION/rotate code
const DISTRIBUTION_CHANNELS = [
  { name: "Flipkart", logo: flipkartLogo, desc: "Shop our books on Flipkart", link: "#" },
  { name: "Apple Books", logo: appleBooksLogo, desc: "Available on Apple Books", link: "#" },
  { name: "Barnes & Noble", logo: barnesNobleLogo, desc: "Find us on Barnes & Noble", link: "#" },
  { name: "Kobo", logo: koboLogo, desc: "Read on your Kobo device", link: "#" },
  { name: "Amazon", logo: amazonLogo, desc: "Available on Amazon", link: "#" },
  { name: "Amazon Kindle", logo: kindleLogo, desc: "Read on Kindle devices", link: "#" },
  { name: "Google Play Books", logo: googlePlayBooksLogo, desc: "Available on Google Play", link: "#" },
];

const REVIEW_HIGHLIGHTS = [
  {
    name: "Aman Shukla",
    rating: 5,
    quote: "A truly professional publishing team. My book is finally out and it looks stunning!",
    photo: author1,
  },
  {
    name: "Sneh Tripathi",
    rating: 5,
    quote: "They took care of everything — design, printing, and distribution. Highly recommend!",
    photo: author5,
  },
  {
    name: "Dr. Smaranika Pattnaik",
    rating: 5,
    quote: "Warm, helpful, and experts in their craft. My experience with them was flawless.",
    photo: author3,
  },
];

const VIDEO_TILES = [
  { img: aboutImage },
  { img: book9 },
  { img: author2 },
  { img: book5 },
  { img: heroImage },
  { img: book13 },
  { img: author4 },
  { img: book1 },
];

const GOOGLE_REVIEWS = [
  {
    name: "Rahul Deb",
    date: "2 weeks ago",
    rating: 5,
    text: "One of the best publishing platforms in India. Professional team, great design support, and timely delivery. Highly recommended for new authors!",
  },
  {
    name: "Dr. Heena Sachdeva",
    date: "1 month ago",
    rating: 5,
    text: "They guided me through every step of publishing. My academic book is now available on Amazon and Google Play Books. Thank you Yellowish!",
  },
  {
    name: "Mukul Dagar",
    date: "2 months ago",
    rating: 4,
    text: "Very supportive and transparent team. The cover design was beautiful and the global distribution helped my book reach international readers.",
  },
];

const GALLERY_CATEGORIES = ["All Books", "Fiction", "Poetry", "Academic", "Hindi"];

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <FaStar key={i} className="star filled" />;
        if (i === full && half) return <FaStarHalfAlt key={i} className="star filled" />;
        return <FaRegStar key={i} className="star" />;
      })}
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { books, getBookCover, addLead } = useData();

  const [activeCategory, setActiveCategory] = useState("All Books");

  // ✅ Distribution carousel hooks — added here, inside the component
  const distTrackRef = useRef(null);
  const [distActiveDot, setDistActiveDot] = useState(0);
  const [distPerView, setDistPerView] = useState(6);

  useEffect(() => {
    const updatePerView = () => {
      if (window.innerWidth <= 640) setDistPerView(2);
      else if (window.innerWidth <= 1024) setDistPerView(4);
      else setDistPerView(6);
    };
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  const distDotsCount = Math.ceil(DISTRIBUTION_CHANNELS.length / distPerView);

  const scrollDistTo = (index) => {
    const track = distTrackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
  };

  const handleDistPrev = () => scrollDistTo(Math.max(distActiveDot - 1, 0));
  const handleDistNext = () => scrollDistTo(Math.min(distActiveDot + 1, distDotsCount - 1));

  const handleDistScroll = () => {
    const track = distTrackRef.current;
    if (!track) return;
    setDistActiveDot(Math.round(track.scrollLeft / track.clientWidth));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) {
      scrollToTop();
    } else {
      navigate(path);
      setTimeout(scrollToTop, 300);
    }
  };

  const galleryBooks = books.slice(0, 10);

  const filteredGallery =
    activeCategory === "All Books"
      ? galleryBooks
      : galleryBooks.filter((book) => {
          const genre = (book.genre || "").toLowerCase();
          const subtitle = (book.subtitle || "").toLowerCase();
          if (activeCategory === "Fiction") {
            return /fiction|fantasy/i.test(genre) || /tale|story|novel/i.test(subtitle);
          }
          if (activeCategory === "Poetry") {
            return /poetry|poem/i.test(genre) || /poetry|poem|verse/i.test(subtitle);
          }
          if (activeCategory === "Academic") {
            return /academic|management|mathematics|maths|law|psychology|science|astronomy|business|nature|research/i.test(genre);
          }
          if (activeCategory === "Hindi") {
            return /hindi/i.test(genre + " " + subtitle);
          }
          return true;
        });

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleCallBack = async (e) => {
    e.preventDefault();
    const name = e.target.user_name.value.trim();
    const email = e.target.user_email.value.trim();
    const phone = e.target.user_phone.value.trim();
    const language = e.target.user_language.value;

    if (!name) {
      alert("⚠️ Please enter your name!");
      return;
    }
    if (!email) {
      alert("⚠️ Please enter your email!");
      return;
    }
    if (!phone) {
      alert("⚠️ Please enter your phone number!");
      return;
    }
    if (!validatePhone(phone)) {
      alert("⚠️ Phone number must be exactly 10 digits (e.g., 9876543210)");
      return;
    }

    try {
      await addLead({
        name,
        email,
        phone,
        language,
        message: `Language preference: ${language}`,
        type: "contact",
        status: "new",
      });
      alert("✅ Thank you for contacting Yellowish Publication! We'll get back to you soon.");
      e.target.reset();
      e.target.user_language.value = "";
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong. Please try again!");
    }
  };

  return (
    <div className="home-page">
      {/* Section 2 — Hero */}
      <Hero />

      {/* Section 3 — Features Grid */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon />
                  </div>
                  <div className="feature-body">
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5 — Call-to-Action / Lead Form */}
      <section className="cta-section">
        <div className="cta-decor" aria-hidden="true">
          <div className="cta-blob-left">
            <svg
              className="cta-svg"
              viewBox="0 0 420 420"
              preserveAspectRatio="xMidYMid slice"
            >
              <path d="M442.3 195.0 C 443.9 207.0 444.1 219.7 442.9 231.9 C 441.7 244.1 439.0 256.5 435.2 268.2 C 431.4 279.9 426.2 291.4 420.1 302.1 C 414.1 312.7 406.8 322.9 398.9 332.3 C 391.1 341.6 382.2 350.2 373.0 358.0 C 363.8 365.8 353.9 372.9 343.7 379.1 C 333.5 385.2 322.8 390.6 312.0 395.1 C 301.1 399.6 289.8 403.3 278.5 405.9 C 267.2 408.6 255.7 410.4 244.2 411.1 C 232.8 411.9 221.2 411.7 210.0 410.4 C 198.8 409.2 187.6 406.9 176.9 403.8 C 166.3 400.6 155.9 396.4 146.2 391.5 C 136.4 386.6 127.1 380.8 118.5 374.6 C 109.9 368.3 101.9 361.3 94.4 354.1 C 86.9 347.0 80.0 339.3 73.5 331.5 C 66.9 323.8 60.9 315.7 55.1 307.6 C 49.2 299.4 43.7 291.1 38.3 282.5 C 32.8 273.9 27.5 265.2 22.4 255.9 C 17.3 246.7 12.2 237.2 7.7 227.0 C 3.2 216.9 -1.3 206.2 -4.8 195.0 C -8.3 183.8 -11.5 171.8 -13.2 159.6 C -15.0 147.4 -16.0 134.5 -15.3 121.8 C -14.5 109.1 -12.6 95.9 -8.9 83.5 C -5.2 71.1 0.1 58.6 6.9 47.4 C 13.7 36.3 22.3 25.7 31.9 16.9 C 41.4 8.0 52.6 0.2 64.2 -5.7 C 75.7 -11.6 88.6 -16.0 101.1 -18.7 C 113.6 -21.5 126.9 -22.4 139.4 -22.3 C 151.9 -22.1 164.5 -20.2 176.3 -17.8 C 188.1 -15.4 199.4 -11.6 210.0 -7.7 C 220.6 -3.9 230.5 0.8 240.0 5.3 C 249.6 9.7 258.4 14.5 267.2 19.1 C 275.9 23.6 284.2 28.1 292.7 32.6 C 301.2 37.1 309.6 41.4 318.2 46.1 C 326.7 50.8 335.4 55.5 344.1 60.9 C 352.8 66.3 361.8 71.9 370.3 78.5 C 378.9 85.1 387.6 92.3 395.4 100.5 C 403.2 108.7 410.8 117.8 417.2 127.7 C 423.5 137.5 429.2 148.4 433.4 159.6 C 437.6 170.8 440.7 183.0 442.3 195.0 Z" />
              <path d="M430.4 195.0 C 431.9 206.4 432.1 218.4 431.0 230.0 C 429.8 241.6 427.3 253.3 423.7 264.4 C 420.1 275.5 415.1 286.4 409.3 296.6 C 403.6 306.7 396.7 316.4 389.2 325.2 C 381.8 334.1 373.4 342.3 364.7 349.7 C 356.0 357.1 346.5 363.8 336.9 369.6 C 327.2 375.5 317.0 380.6 306.7 384.9 C 296.4 389.1 285.7 392.6 275.0 395.1 C 264.3 397.6 253.3 399.3 242.5 400.1 C 231.6 400.8 220.6 400.6 210.0 399.4 C 199.4 398.2 188.7 396.1 178.6 393.1 C 168.5 390.1 158.7 386.1 149.4 381.4 C 140.2 376.8 131.4 371.3 123.2 365.4 C 115.0 359.4 107.4 352.8 100.3 346.0 C 93.2 339.2 86.7 331.9 80.5 324.5 C 74.3 317.2 68.6 309.5 63.0 301.8 C 57.5 294.0 52.2 286.2 47.1 278.0 C 41.9 269.9 36.9 261.6 32.0 252.8 C 27.2 244.1 22.4 235.0 18.1 225.4 C 13.8 215.8 9.5 205.7 6.2 195.0 C 2.9 184.3 -0.1 173.0 -1.8 161.5 C -3.4 149.9 -4.4 137.6 -3.7 125.6 C -3.0 113.5 -1.2 100.9 2.3 89.2 C 5.8 77.4 10.9 65.6 17.3 55.0 C 23.8 44.5 31.9 34.4 41.0 26.0 C 50.0 17.6 60.7 10.2 71.7 4.6 C 82.6 -1.0 94.8 -5.2 106.7 -7.8 C 118.6 -10.4 131.1 -11.3 143.0 -11.1 C 154.9 -11.0 166.9 -9.2 178.0 -6.9 C 189.2 -4.6 199.9 -1.0 210.0 2.7 C 220.1 6.3 229.5 10.8 238.5 15.0 C 247.5 19.2 255.9 23.8 264.2 28.1 C 272.6 32.4 280.4 36.7 288.5 40.9 C 296.6 45.2 304.5 49.3 312.6 53.8 C 320.7 58.2 329.0 62.6 337.3 67.7 C 345.5 72.9 354.0 78.2 362.1 84.5 C 370.2 90.8 378.5 97.6 385.9 105.4 C 393.3 113.2 400.5 121.8 406.5 131.1 C 412.5 140.5 418.0 150.8 421.9 161.4 C 425.9 172.1 428.9 183.6 430.4 195.0 Z" />
              <path d="M418.5 195.0 C 419.9 205.8 420.1 217.2 419.0 228.1 C 418.0 239.1 415.5 250.2 412.1 260.7 C 408.7 271.2 404.0 281.5 398.6 291.1 C 393.1 300.7 386.6 309.8 379.5 318.2 C 372.5 326.6 364.6 334.3 356.3 341.3 C 348.1 348.3 339.1 354.6 330.0 360.2 C 320.9 365.7 311.3 370.6 301.5 374.6 C 291.8 378.6 281.6 381.9 271.5 384.3 C 261.4 386.7 251.0 388.3 240.7 389.0 C 230.5 389.7 220.1 389.5 210.0 388.3 C 199.9 387.2 189.9 385.2 180.3 382.4 C 170.8 379.5 161.4 375.7 152.7 371.4 C 144.0 367.0 135.6 361.7 127.9 356.1 C 120.1 350.6 113.0 344.3 106.2 337.8 C 99.5 331.4 93.4 324.5 87.5 317.5 C 81.6 310.5 76.2 303.3 71.0 296.0 C 65.7 288.7 60.8 281.3 55.9 273.5 C 51.0 265.8 46.2 258.0 41.7 249.7 C 37.1 241.4 32.5 232.9 28.5 223.8 C 24.4 214.6 20.3 205.1 17.2 195.0 C 14.1 184.9 11.2 174.2 9.7 163.3 C 8.1 152.3 7.2 140.7 7.9 129.3 C 8.5 117.9 10.2 106.0 13.6 94.9 C 16.9 83.8 21.6 72.5 27.7 62.6 C 33.8 52.6 41.6 43.1 50.1 35.1 C 58.7 27.2 68.8 20.2 79.1 14.9 C 89.5 9.6 101.0 5.7 112.3 3.2 C 123.5 0.7 135.4 -0.1 146.6 0.0 C 157.9 0.2 169.2 1.9 179.8 4.0 C 190.3 6.2 200.5 9.6 210.0 13.1 C 219.5 16.5 228.4 20.7 237.0 24.7 C 245.5 28.7 253.4 33.0 261.3 37.1 C 269.2 41.2 276.6 45.2 284.3 49.3 C 291.9 53.3 299.4 57.2 307.1 61.4 C 314.8 65.6 322.6 69.8 330.4 74.6 C 338.2 79.5 346.2 84.5 353.9 90.5 C 361.6 96.4 369.4 102.9 376.4 110.2 C 383.4 117.6 390.2 125.8 395.9 134.6 C 401.6 143.4 406.7 153.2 410.5 163.2 C 414.2 173.3 417.1 184.2 418.5 195.0 Z" />
              <path d="M406.6 195.0 C 407.9 205.2 408.1 215.9 407.1 226.2 C 406.1 236.5 403.8 247.0 400.6 256.9 C 397.4 266.8 392.9 276.6 387.8 285.6 C 382.7 294.6 376.5 303.2 369.9 311.1 C 363.2 319.0 355.7 326.4 348.0 333.0 C 340.2 339.6 331.8 345.5 323.2 350.7 C 314.5 356.0 305.5 360.5 296.3 364.3 C 287.1 368.1 277.5 371.2 268.0 373.5 C 258.4 375.7 248.6 377.3 239.0 377.9 C 229.3 378.5 219.5 378.3 210.0 377.3 C 200.5 376.3 191.0 374.3 182.0 371.6 C 173.0 369.0 164.2 365.4 156.0 361.3 C 147.7 357.2 139.9 352.2 132.6 346.9 C 125.3 341.7 118.5 335.7 112.2 329.7 C 105.8 323.6 100.0 317.1 94.5 310.5 C 88.9 303.9 83.9 297.2 78.9 290.2 C 73.9 283.3 69.3 276.3 64.7 269.0 C 60.1 261.8 55.6 254.4 51.3 246.6 C 47.0 238.7 42.7 230.7 38.8 222.1 C 35.0 213.5 31.2 204.5 28.2 195.0 C 25.3 185.5 22.6 175.4 21.1 165.1 C 19.6 154.8 18.8 143.8 19.4 133.1 C 20.0 122.3 21.7 111.1 24.8 100.6 C 27.9 90.1 32.4 79.5 38.2 70.1 C 43.9 60.8 51.2 51.8 59.3 44.3 C 67.3 36.8 76.9 30.2 86.6 25.2 C 96.4 20.2 107.2 16.5 117.9 14.1 C 128.5 11.8 139.7 11.0 150.3 11.2 C 160.9 11.3 171.5 12.9 181.5 15.0 C 191.4 17.0 201.0 20.2 210.0 23.5 C 219.0 26.7 227.4 30.7 235.4 34.5 C 243.5 38.2 250.9 42.3 258.4 46.1 C 265.8 50.0 272.8 53.8 280.0 57.6 C 287.2 61.4 294.3 65.0 301.5 69.0 C 308.8 73.0 316.1 76.9 323.5 81.5 C 330.9 86.1 338.4 90.8 345.7 96.4 C 352.9 102.0 360.3 108.1 366.9 115.1 C 373.5 122.0 379.9 129.7 385.3 138.0 C 390.6 146.4 395.5 155.6 399.0 165.1 C 402.6 174.6 405.2 184.8 406.6 195.0 Z" />
              <path d="M394.7 195.0 C 395.9 204.6 396.1 214.6 395.1 224.3 C 394.2 234.0 392.0 243.9 389.0 253.2 C 386.0 262.5 381.8 271.6 377.0 280.1 C 372.2 288.6 366.4 296.7 360.2 304.1 C 353.9 311.5 346.9 318.4 339.6 324.6 C 332.3 330.8 324.4 336.4 316.3 341.3 C 308.2 346.2 299.7 350.5 291.0 354.1 C 282.4 357.6 273.4 360.5 264.5 362.7 C 255.5 364.8 246.3 366.2 237.2 366.8 C 228.1 367.4 218.9 367.2 210.0 366.3 C 201.1 365.3 192.2 363.5 183.7 360.9 C 175.3 358.4 167.0 355.1 159.2 351.2 C 151.5 347.3 144.1 342.7 137.3 337.7 C 130.4 332.8 124.1 327.2 118.1 321.5 C 112.1 315.8 106.7 309.7 101.5 303.5 C 96.3 297.3 91.5 291.0 86.9 284.5 C 82.2 278.0 77.8 271.4 73.5 264.6 C 69.2 257.7 64.9 250.8 60.9 243.4 C 56.9 236.1 52.8 228.5 49.2 220.5 C 45.6 212.4 42.0 203.9 39.2 195.0 C 36.5 186.1 33.9 176.6 32.6 166.9 C 31.2 157.2 30.4 146.9 31.0 136.8 C 31.5 126.7 33.1 116.2 36.0 106.3 C 38.9 96.5 43.2 86.5 48.6 77.7 C 54.0 68.9 60.8 60.4 68.4 53.4 C 76.0 46.4 84.9 40.2 94.1 35.5 C 103.3 30.8 113.5 27.3 123.4 25.1 C 133.4 22.9 143.9 22.2 153.9 22.3 C 163.8 22.4 173.9 23.9 183.2 25.9 C 192.6 27.8 201.6 30.8 210.0 33.9 C 218.4 36.9 226.3 40.6 233.9 44.2 C 241.5 47.7 248.5 51.5 255.4 55.2 C 262.4 58.8 269.0 62.3 275.8 65.9 C 282.5 69.5 289.2 72.9 296.0 76.7 C 302.8 80.4 309.7 84.1 316.6 88.4 C 323.5 92.7 330.7 97.1 337.5 102.4 C 344.2 107.7 351.2 113.4 357.4 119.9 C 363.6 126.4 369.6 133.7 374.7 141.5 C 379.7 149.3 384.2 158.0 387.6 166.9 C 390.9 175.8 393.4 185.4 394.7 195.0 Z" />
              <path d="M382.7 195.0 C 383.9 204.0 384.1 213.4 383.2 222.4 C 382.3 231.5 380.3 240.7 377.5 249.4 C 374.7 258.1 370.7 266.7 366.2 274.6 C 361.7 282.6 356.3 290.1 350.5 297.1 C 344.6 304.0 338.1 310.4 331.2 316.2 C 324.4 322.0 317.0 327.3 309.4 331.9 C 301.9 336.5 293.9 340.5 285.8 343.8 C 277.7 347.1 269.4 349.9 261.0 351.8 C 252.6 353.8 243.9 355.2 235.5 355.7 C 227.0 356.3 218.3 356.1 210.0 355.2 C 201.7 354.3 193.3 352.6 185.4 350.2 C 177.5 347.9 169.8 344.7 162.5 341.1 C 155.3 337.5 148.4 333.1 142.0 328.5 C 135.6 323.9 129.6 318.7 124.0 313.3 C 118.4 308.0 113.4 302.3 108.5 296.5 C 103.6 290.7 99.2 284.8 94.8 278.7 C 90.4 272.6 86.3 266.5 82.3 260.1 C 78.2 253.7 74.3 247.2 70.5 240.3 C 66.7 233.4 62.9 226.4 59.6 218.8 C 56.2 211.3 52.9 203.4 50.3 195.0 C 47.7 186.6 45.3 177.8 44.0 168.7 C 42.7 159.6 42.0 150.0 42.5 140.6 C 43.0 131.1 44.5 121.3 47.2 112.1 C 50.0 102.9 53.9 93.5 59.0 85.3 C 64.0 77.0 70.4 69.1 77.5 62.5 C 84.6 55.9 93.0 50.2 101.6 45.8 C 110.2 41.4 119.7 38.1 129.0 36.1 C 138.3 34.0 148.2 33.3 157.5 33.4 C 166.8 33.6 176.2 35.0 184.9 36.8 C 193.7 38.6 202.1 41.4 210.0 44.3 C 217.9 47.1 225.3 50.6 232.3 53.9 C 239.4 57.2 246.0 60.8 252.5 64.2 C 259.0 67.6 265.2 70.9 271.5 74.2 C 277.8 77.6 284.1 80.8 290.4 84.3 C 296.8 87.8 303.3 91.2 309.7 95.3 C 316.2 99.3 322.9 103.5 329.2 108.4 C 335.6 113.3 342.0 118.7 347.8 124.8 C 353.6 130.9 359.3 137.6 364.0 145.0 C 368.7 152.3 373.0 160.3 376.1 168.7 C 379.2 177.0 381.6 186.0 382.7 195.0 Z" />
              <path d="M370.8 195.0 C 371.9 203.3 372.1 212.1 371.2 220.5 C 370.4 229.0 368.6 237.6 365.9 245.7 C 363.3 253.8 359.7 261.7 355.5 269.1 C 351.3 276.5 346.2 283.6 340.8 290.0 C 335.4 296.5 329.2 302.5 322.9 307.9 C 316.5 313.3 309.6 318.1 302.6 322.4 C 295.5 326.7 288.1 330.4 280.6 333.5 C 273.1 336.6 265.3 339.2 257.4 341.0 C 249.6 342.9 241.6 344.1 233.7 344.6 C 225.8 345.2 217.8 345.0 210.0 344.2 C 202.2 343.3 194.5 341.7 187.1 339.5 C 179.7 337.3 172.5 334.4 165.8 331.0 C 159.1 327.7 152.6 323.6 146.7 319.3 C 140.7 315.0 135.1 310.1 129.9 305.2 C 124.8 300.2 120.0 294.9 115.5 289.5 C 111.0 284.1 106.8 278.6 102.7 272.9 C 98.7 267.3 94.9 261.5 91.1 255.6 C 87.3 249.6 83.7 243.6 80.1 237.2 C 76.6 230.8 73.1 224.2 69.9 217.2 C 66.8 210.1 63.7 202.8 61.3 195.0 C 58.9 187.2 56.7 179.0 55.5 170.5 C 54.3 162.1 53.6 153.1 54.1 144.3 C 54.6 135.5 55.9 126.4 58.5 117.8 C 61.0 109.2 64.7 100.5 69.4 92.8 C 74.1 85.2 80.1 77.8 86.7 71.7 C 93.3 65.5 101.1 60.2 109.0 56.1 C 117.0 51.9 125.9 48.9 134.6 47.0 C 143.3 45.1 152.4 44.5 161.1 44.6 C 169.8 44.7 178.5 46.0 186.7 47.7 C 194.8 49.4 202.6 52.0 210.0 54.7 C 217.4 57.3 224.2 60.6 230.8 63.7 C 237.4 66.7 243.5 70.0 249.6 73.2 C 255.7 76.4 261.4 79.5 267.3 82.6 C 273.2 85.7 279.0 88.7 284.9 91.9 C 290.8 95.2 296.8 98.4 302.9 102.1 C 308.9 105.9 315.1 109.8 321.0 114.3 C 326.9 118.9 332.9 123.9 338.3 129.6 C 343.7 135.3 349.0 141.6 353.4 148.4 C 357.8 155.2 361.8 162.7 364.7 170.5 C 367.6 178.3 369.7 186.7 370.8 195.0 Z" />
              <path d="M358.9 195.0 C 359.9 202.7 360.1 210.8 359.3 218.6 C 358.5 226.5 356.8 234.4 354.4 241.9 C 351.9 249.4 348.6 256.8 344.7 263.6 C 340.8 270.5 336.1 277.0 331.1 283.0 C 326.1 289.0 320.4 294.5 314.5 299.5 C 308.6 304.5 302.2 309.0 295.7 313.0 C 289.2 316.9 282.3 320.4 275.4 323.3 C 268.4 326.1 261.2 328.5 253.9 330.2 C 246.7 331.9 239.3 333.1 231.9 333.6 C 224.6 334.0 217.2 333.9 210.0 333.1 C 202.8 332.3 195.6 330.8 188.8 328.8 C 182.0 326.8 175.3 324.1 169.1 321.0 C 162.8 317.8 156.9 314.1 151.4 310.1 C 145.8 306.1 140.7 301.6 135.9 297.0 C 131.1 292.4 126.7 287.5 122.5 282.5 C 118.3 277.5 114.5 272.4 110.7 267.2 C 106.9 261.9 103.4 256.6 99.9 251.1 C 96.4 245.6 93.0 240.0 89.8 234.1 C 86.5 228.1 83.2 222.1 80.3 215.5 C 77.4 209.0 74.5 202.2 72.3 195.0 C 70.1 187.8 68.0 180.2 66.9 172.3 C 65.8 164.5 65.1 156.2 65.6 148.1 C 66.1 139.9 67.3 131.5 69.7 123.5 C 72.1 115.6 75.5 107.5 79.8 100.4 C 84.2 93.3 89.7 86.5 95.8 80.8 C 101.9 75.1 109.1 70.1 116.5 66.3 C 123.9 62.5 132.2 59.8 140.2 58.0 C 148.2 56.2 156.7 55.6 164.7 55.7 C 172.8 55.8 180.9 57.0 188.4 58.6 C 195.9 60.2 203.2 62.6 210.0 65.1 C 216.8 67.5 223.2 70.5 229.3 73.4 C 235.4 76.2 241.0 79.3 246.6 82.2 C 252.3 85.1 257.6 88.0 263.0 90.9 C 268.5 93.8 273.8 96.5 279.3 99.6 C 284.8 102.6 290.4 105.6 296.0 109.0 C 301.6 112.5 307.3 116.1 312.8 120.3 C 318.3 124.6 323.8 129.2 328.8 134.5 C 333.8 139.7 338.7 145.5 342.8 151.9 C 346.9 158.2 350.5 165.1 353.2 172.3 C 355.9 179.5 357.9 187.3 358.9 195.0 Z" />
              <path d="M347.0 195.0 C 347.9 202.1 348.1 209.6 347.4 216.8 C 346.7 223.9 345.1 231.3 342.8 238.2 C 340.6 245.1 337.5 251.8 333.9 258.1 C 330.4 264.4 326.0 270.4 321.4 275.9 C 316.8 281.4 311.6 286.5 306.2 291.2 C 300.7 295.8 294.9 299.9 288.9 303.5 C 282.9 307.2 276.5 310.4 270.1 313.0 C 263.7 315.7 257.1 317.8 250.4 319.4 C 243.8 321.0 236.9 322.0 230.2 322.5 C 223.5 322.9 216.6 322.8 210.0 322.1 C 203.4 321.3 196.8 320.0 190.5 318.1 C 184.2 316.3 178.1 313.8 172.3 310.9 C 166.6 308.0 161.1 304.6 156.0 300.9 C 151.0 297.2 146.2 293.1 141.8 288.9 C 137.4 284.6 133.4 280.1 129.5 275.5 C 125.6 270.9 122.1 266.2 118.6 261.4 C 115.2 256.6 111.9 251.7 108.7 246.6 C 105.5 241.5 102.4 236.4 99.4 230.9 C 96.4 225.5 93.4 219.9 90.7 213.9 C 88.0 207.9 85.4 201.6 83.3 195.0 C 81.3 188.4 79.4 181.3 78.4 174.1 C 77.3 167.0 76.7 159.3 77.2 151.8 C 77.6 144.4 78.7 136.5 80.9 129.2 C 83.1 121.9 86.2 114.5 90.2 108.0 C 94.2 101.4 99.3 95.2 104.9 89.9 C 110.6 84.7 117.2 80.1 124.0 76.6 C 130.8 73.1 138.4 70.6 145.8 69.0 C 153.2 67.3 161.0 66.8 168.4 66.9 C 175.8 67.0 183.2 68.1 190.1 69.5 C 197.1 70.9 203.7 73.2 210.0 75.5 C 216.3 77.7 222.1 80.5 227.7 83.1 C 233.3 85.7 238.5 88.6 243.7 91.2 C 248.9 93.9 253.8 96.6 258.8 99.2 C 263.8 101.9 268.7 104.4 273.8 107.2 C 278.8 110.0 284.0 112.7 289.1 115.9 C 294.2 119.1 299.5 122.4 304.6 126.3 C 309.6 130.2 314.7 134.5 319.3 139.3 C 323.9 144.1 328.4 149.5 332.2 155.3 C 335.9 161.1 339.3 167.5 341.7 174.1 C 344.2 180.7 346.1 187.9 347.0 195.0 Z" />
              <path d="M335.1 195.0 C 335.9 201.5 336.0 208.3 335.4 214.9 C 334.8 221.4 333.3 228.1 331.3 234.4 C 329.2 240.7 326.4 246.9 323.1 252.6 C 319.9 258.4 316.0 263.9 311.7 268.9 C 307.5 273.9 302.7 278.6 297.8 282.8 C 292.8 287.0 287.5 290.8 282.0 294.1 C 276.5 297.4 270.8 300.3 264.9 302.8 C 259.1 305.2 253.0 307.1 246.9 308.6 C 240.8 310.0 234.6 311.0 228.4 311.4 C 222.3 311.8 216.0 311.7 210.0 311.0 C 204.0 310.3 197.9 309.1 192.2 307.4 C 186.5 305.7 180.9 303.4 175.6 300.8 C 170.4 298.2 165.4 295.0 160.7 291.7 C 156.1 288.3 151.8 284.6 147.7 280.7 C 143.7 276.8 140.0 272.7 136.5 268.5 C 133.0 264.3 129.7 260.0 126.6 255.6 C 123.4 251.2 120.5 246.8 117.5 242.1 C 114.6 237.5 111.7 232.8 109.0 227.8 C 106.3 222.8 103.5 217.7 101.1 212.3 C 98.6 206.8 96.2 201.0 94.3 195.0 C 92.5 189.0 90.7 182.5 89.8 176.0 C 88.9 169.4 88.3 162.4 88.7 155.6 C 89.1 148.8 90.1 141.6 92.1 134.9 C 94.1 128.3 97.0 121.5 100.6 115.5 C 104.3 109.6 108.9 103.8 114.1 99.1 C 119.2 94.3 125.3 90.1 131.5 86.9 C 137.7 83.7 144.6 81.4 151.4 79.9 C 158.1 78.4 165.2 77.9 172.0 78.0 C 178.7 78.1 185.5 79.1 191.9 80.4 C 198.2 81.7 204.3 83.8 210.0 85.8 C 215.7 87.9 221.1 90.4 226.2 92.8 C 231.3 95.2 236.1 97.8 240.8 100.3 C 245.5 102.7 250.0 105.1 254.6 107.6 C 259.1 110.0 263.6 112.3 268.2 114.8 C 272.9 117.4 277.5 119.9 282.2 122.8 C 286.9 125.7 291.7 128.7 296.3 132.3 C 300.9 135.8 305.6 139.7 309.8 144.1 C 314.0 148.6 318.1 153.5 321.5 158.8 C 325.0 164.1 328.0 169.9 330.3 175.9 C 332.5 182.0 334.2 188.5 335.1 195.0 Z" />
              <path d="M323.2 195.0 C 323.9 200.9 324.0 207.0 323.5 213.0 C 322.9 218.9 321.6 225.0 319.7 230.7 C 317.9 236.4 315.3 242.0 312.4 247.2 C 309.4 252.4 305.9 257.3 302.0 261.9 C 298.2 266.4 293.9 270.6 289.4 274.4 C 284.9 278.2 280.1 281.7 275.1 284.7 C 270.2 287.7 265.0 290.3 259.7 292.5 C 254.4 294.7 248.9 296.5 243.4 297.8 C 237.9 299.1 232.2 299.9 226.7 300.3 C 221.1 300.7 215.5 300.6 210.0 300.0 C 204.5 299.4 199.1 298.2 193.9 296.7 C 188.7 295.2 183.6 293.1 178.9 290.7 C 174.1 288.4 169.6 285.5 165.4 282.5 C 161.2 279.4 157.3 276.0 153.7 272.5 C 150.0 269.0 146.7 265.3 143.5 261.5 C 140.3 257.7 137.4 253.8 134.5 249.8 C 131.7 245.9 129.0 241.8 126.3 237.6 C 123.7 233.4 121.1 229.2 118.6 224.7 C 116.1 220.2 113.7 215.6 111.4 210.6 C 109.2 205.7 107.0 200.5 105.3 195.0 C 103.6 189.5 102.1 183.7 101.2 177.8 C 100.4 171.8 99.9 165.5 100.3 159.3 C 100.6 153.2 101.6 146.7 103.4 140.7 C 105.2 134.6 107.8 128.5 111.1 123.1 C 114.4 117.7 118.6 112.5 123.2 108.2 C 127.9 103.9 133.3 100.1 139.0 97.2 C 144.6 94.3 150.8 92.2 156.9 90.9 C 163.1 89.5 169.5 89.1 175.6 89.2 C 181.7 89.2 187.8 90.2 193.6 91.3 C 199.3 92.5 204.8 94.4 210.0 96.2 C 215.2 98.1 220.0 100.4 224.6 102.6 C 229.3 104.7 233.6 107.1 237.8 109.3 C 242.1 111.5 246.2 113.7 250.3 115.9 C 254.5 118.1 258.5 120.2 262.7 122.5 C 266.9 124.8 271.1 127.0 275.4 129.6 C 279.6 132.3 284.0 135.0 288.1 138.2 C 292.3 141.5 296.5 145.0 300.3 149.0 C 304.1 153.0 307.8 157.4 310.9 162.2 C 314.0 167.0 316.8 172.3 318.8 177.8 C 320.9 183.2 322.4 189.1 323.2 195.0 Z" />
              <path d="M311.3 195.0 C 312.0 200.3 312.0 205.8 311.5 211.1 C 311.0 216.4 309.8 221.8 308.2 226.9 C 306.5 232.0 304.2 237.0 301.6 241.7 C 299.0 246.3 295.8 250.8 292.3 254.8 C 288.9 258.9 285.1 262.7 281.1 266.1 C 277.1 269.5 272.7 272.5 268.3 275.2 C 263.9 277.9 259.2 280.3 254.4 282.2 C 249.7 284.2 244.8 285.8 239.9 286.9 C 235.0 288.1 229.9 288.9 224.9 289.2 C 219.9 289.5 214.9 289.4 210.0 288.9 C 205.1 288.4 200.2 287.4 195.6 286.0 C 190.9 284.6 186.4 282.8 182.2 280.7 C 177.9 278.5 173.9 276.0 170.1 273.3 C 166.4 270.6 162.9 267.5 159.6 264.4 C 156.3 261.2 153.3 257.9 150.5 254.5 C 147.6 251.1 145.0 247.6 142.5 244.1 C 139.9 240.5 137.5 236.9 135.1 233.1 C 132.8 229.4 130.5 225.6 128.2 221.6 C 126.0 217.5 123.8 213.4 121.8 209.0 C 119.8 204.5 117.9 199.9 116.4 195.0 C 114.8 190.1 113.5 184.9 112.7 179.6 C 111.9 174.3 111.5 168.6 111.8 163.1 C 112.1 157.6 113.0 151.8 114.6 146.4 C 116.2 141.0 118.5 135.5 121.5 130.7 C 124.4 125.8 128.2 121.2 132.3 117.3 C 136.5 113.5 141.4 110.1 146.4 107.5 C 151.5 104.9 157.1 103.0 162.5 101.8 C 168.0 100.6 173.8 100.2 179.2 100.3 C 184.7 100.4 190.2 101.2 195.3 102.2 C 200.4 103.3 205.4 105.0 210.0 106.6 C 214.6 108.3 218.9 110.4 223.1 112.3 C 227.3 114.2 231.1 116.3 234.9 118.3 C 238.7 120.3 242.4 122.2 246.1 124.2 C 249.8 126.2 253.4 128.1 257.1 130.1 C 260.9 132.2 264.7 134.2 268.5 136.5 C 272.3 138.9 276.2 141.3 279.9 144.2 C 283.6 147.1 287.4 150.3 290.8 153.8 C 294.2 157.4 297.5 161.4 300.3 165.7 C 303.1 170.0 305.6 174.7 307.4 179.6 C 309.2 184.5 310.6 189.7 311.3 195.0 Z" />
              <path d="M299.3 195.0 C 300.0 199.6 300.0 204.5 299.6 209.2 C 299.1 213.9 298.1 218.6 296.6 223.1 C 295.2 227.6 293.1 232.1 290.8 236.2 C 288.5 240.3 285.7 244.2 282.7 247.8 C 279.6 251.4 276.2 254.7 272.7 257.7 C 269.2 260.7 265.3 263.4 261.4 265.8 C 257.5 268.2 253.4 270.2 249.2 272.0 C 245.0 273.7 240.7 275.1 236.4 276.1 C 232.0 277.2 227.6 277.8 223.2 278.1 C 218.8 278.4 214.3 278.3 210.0 277.9 C 205.7 277.4 201.4 276.5 197.3 275.3 C 193.2 274.1 189.2 272.5 185.4 270.6 C 181.7 268.7 178.1 266.5 174.8 264.1 C 171.5 261.7 168.4 259.0 165.5 256.2 C 162.6 253.5 160.0 250.5 157.5 247.5 C 155.0 244.5 152.7 241.4 150.4 238.3 C 148.2 235.1 146.0 232.0 143.9 228.7 C 141.9 225.3 139.8 222.0 137.9 218.4 C 135.9 214.9 133.9 211.2 132.2 207.3 C 130.4 203.4 128.7 199.3 127.4 195.0 C 126.0 190.7 124.8 186.1 124.1 181.4 C 123.5 176.7 123.1 171.7 123.4 166.9 C 123.6 162.0 124.4 156.9 125.8 152.1 C 127.2 147.3 129.3 142.5 131.9 138.2 C 134.5 134.0 137.8 129.9 141.5 126.5 C 145.2 123.1 149.5 120.1 153.9 117.8 C 158.4 115.5 163.3 113.9 168.1 112.8 C 172.9 111.7 178.0 111.4 182.8 111.4 C 187.7 111.5 192.5 112.2 197.0 113.2 C 201.6 114.1 205.9 115.6 210.0 117.0 C 214.1 118.5 217.9 120.3 221.6 122.0 C 225.2 123.7 228.6 125.6 232.0 127.3 C 235.4 129.1 238.6 130.8 241.8 132.5 C 245.1 134.3 248.3 135.9 251.6 137.7 C 254.9 139.6 258.2 141.3 261.6 143.4 C 264.9 145.5 268.4 147.6 271.7 150.2 C 275.0 152.7 278.3 155.5 281.3 158.7 C 284.3 161.8 287.2 165.3 289.7 169.1 C 292.1 172.9 294.3 177.1 295.9 181.4 C 297.5 185.7 298.7 190.4 299.3 195.0 Z" />
              <path d="M287.4 195.0 C 288.0 199.0 288.0 203.2 287.6 207.3 C 287.2 211.4 286.3 215.5 285.1 219.4 C 283.8 223.3 282.1 227.1 280.0 230.7 C 278.0 234.2 275.6 237.6 273.0 240.8 C 270.4 243.9 267.4 246.7 264.3 249.3 C 261.3 251.9 258.0 254.3 254.6 256.4 C 251.2 258.4 247.6 260.2 244.0 261.7 C 240.4 263.2 236.6 264.4 232.8 265.3 C 229.1 266.2 225.2 266.8 221.4 267.0 C 217.6 267.3 213.7 267.2 210.0 266.8 C 206.3 266.4 202.5 265.6 199.0 264.6 C 195.4 263.5 192.0 262.1 188.7 260.5 C 185.5 258.9 182.4 256.9 179.5 254.9 C 176.6 252.8 174.0 250.4 171.5 248.0 C 169.0 245.7 166.7 243.1 164.5 240.5 C 162.3 237.9 160.3 235.2 158.4 232.5 C 156.4 229.8 154.6 227.0 152.8 224.2 C 150.9 221.3 149.2 218.4 147.5 215.3 C 145.8 212.2 144.1 209.1 142.6 205.7 C 141.1 202.3 139.6 198.7 138.4 195.0 C 137.2 191.3 136.2 187.3 135.6 183.2 C 135.0 179.1 134.7 174.8 134.9 170.6 C 135.2 166.4 135.8 162.0 137.0 157.8 C 138.3 153.7 140.0 149.5 142.3 145.8 C 144.6 142.1 147.4 138.6 150.6 135.6 C 153.8 132.7 157.5 130.1 161.4 128.1 C 165.2 126.1 169.5 124.7 173.7 123.8 C 177.9 122.8 182.3 122.5 186.5 122.6 C 190.6 122.6 194.8 123.3 198.8 124.1 C 202.7 124.9 206.5 126.1 210.0 127.4 C 213.5 128.7 216.8 130.3 220.0 131.8 C 223.2 133.2 226.1 134.8 229.1 136.4 C 232.0 137.9 234.7 139.4 237.6 140.9 C 240.4 142.4 243.2 143.8 246.1 145.4 C 248.9 146.9 251.8 148.5 254.7 150.3 C 257.6 152.1 260.6 154.0 263.4 156.2 C 266.3 158.4 269.2 160.8 271.8 163.5 C 274.4 166.2 276.9 169.3 279.1 172.6 C 281.2 175.8 283.1 179.5 284.5 183.2 C 285.9 186.9 286.9 191.0 287.4 195.0 Z" />
              <path d="M275.5 195.0 C 276.0 198.4 276.0 202.0 275.7 205.4 C 275.4 208.8 274.6 212.3 273.5 215.6 C 272.5 218.9 271.0 222.2 269.3 225.2 C 267.6 228.2 265.5 231.1 263.3 233.7 C 261.1 236.3 258.6 238.8 256.0 241.0 C 253.4 243.2 250.6 245.2 247.7 246.9 C 244.8 248.7 241.8 250.2 238.8 251.4 C 235.7 252.7 232.5 253.7 229.3 254.5 C 226.1 255.2 222.9 255.8 219.7 256.0 C 216.4 256.2 213.2 256.1 210.0 255.8 C 206.8 255.4 203.7 254.8 200.7 253.9 C 197.7 253.0 194.7 251.8 192.0 250.4 C 189.2 249.1 186.6 247.4 184.2 245.6 C 181.8 243.9 179.5 241.9 177.4 239.9 C 175.3 237.9 173.3 235.7 171.5 233.5 C 169.6 231.3 168.0 229.1 166.3 226.7 C 164.6 224.4 163.1 222.1 161.6 219.7 C 160.0 217.3 158.5 214.8 157.1 212.2 C 155.7 209.6 154.2 206.9 152.9 204.0 C 151.7 201.2 150.4 198.2 149.4 195.0 C 148.4 191.8 147.5 188.5 147.0 185.0 C 146.5 181.6 146.3 177.9 146.5 174.4 C 146.7 170.8 147.2 167.0 148.3 163.5 C 149.3 160.0 150.8 156.5 152.7 153.4 C 154.6 150.3 157.1 147.3 159.8 144.8 C 162.4 142.3 165.6 140.1 168.9 138.4 C 172.1 136.7 175.7 135.5 179.3 134.7 C 182.8 133.9 186.6 133.7 190.1 133.7 C 193.6 133.8 197.2 134.3 200.5 135.0 C 203.8 135.7 207.0 136.7 210.0 137.8 C 213.0 138.9 215.8 140.2 218.5 141.5 C 221.2 142.7 223.6 144.1 226.1 145.4 C 228.6 146.7 230.9 147.9 233.3 149.2 C 235.7 150.5 238.1 151.7 240.5 153.0 C 242.9 154.3 245.4 155.6 247.8 157.2 C 250.3 158.7 252.8 160.3 255.2 162.1 C 257.6 164.0 260.1 166.0 262.3 168.4 C 264.5 170.7 266.6 173.2 268.4 176.0 C 270.2 178.8 271.8 181.9 273.0 185.0 C 274.2 188.2 275.1 191.6 275.5 195.0 Z" />
              <path d="M263.6 195.0 C 264.0 197.8 264.0 200.7 263.7 203.5 C 263.5 206.3 262.9 209.2 262.0 211.9 C 261.1 214.6 259.9 217.2 258.5 219.7 C 257.1 222.2 255.4 224.5 253.6 226.7 C 251.8 228.8 249.7 230.8 247.6 232.6 C 245.5 234.4 243.2 236.0 240.9 237.5 C 238.5 238.9 236.0 240.1 233.5 241.2 C 231.0 242.2 228.4 243.1 225.8 243.7 C 223.2 244.3 220.5 244.7 217.9 244.9 C 215.3 245.1 212.6 245.0 210.0 244.7 C 207.4 244.4 204.8 243.9 202.4 243.2 C 199.9 242.4 197.5 241.5 195.3 240.3 C 193.0 239.2 190.9 237.9 188.9 236.4 C 186.9 235.0 185.0 233.4 183.3 231.7 C 181.6 230.1 180.0 228.3 178.5 226.5 C 177.0 224.7 175.6 222.9 174.2 221.0 C 172.9 219.1 171.6 217.2 170.4 215.2 C 169.1 213.2 167.9 211.2 166.7 209.1 C 165.5 206.9 164.4 204.7 163.3 202.4 C 162.3 200.0 161.2 197.6 160.4 195.0 C 159.6 192.4 158.9 189.7 158.5 186.8 C 158.1 184.0 157.9 181.0 158.0 178.1 C 158.2 175.2 158.6 172.1 159.5 169.3 C 160.3 166.4 161.6 163.5 163.1 160.9 C 164.7 158.4 166.7 155.9 168.9 153.9 C 171.1 151.8 173.7 150.1 176.3 148.7 C 179.0 147.3 182.0 146.3 184.9 145.7 C 187.8 145.0 190.8 144.8 193.7 144.9 C 196.6 144.9 199.5 145.3 202.2 145.9 C 204.9 146.5 207.5 147.3 210.0 148.2 C 212.5 149.1 214.7 150.2 216.9 151.2 C 219.1 152.2 221.2 153.3 223.2 154.4 C 225.2 155.5 227.1 156.5 229.1 157.5 C 231.1 158.6 233.0 159.6 235.0 160.6 C 236.9 161.7 238.9 162.8 241.0 164.0 C 243.0 165.3 245.0 166.6 247.0 168.1 C 249.0 169.6 251.0 171.3 252.8 173.2 C 254.6 175.1 256.3 177.2 257.8 179.5 C 259.3 181.7 260.6 184.2 261.6 186.8 C 262.5 189.4 263.2 192.2 263.6 195.0 Z" />
            </svg>
          </div>
          <div className="cta-blob-right">
            <span className="cta-blob-right-fill" />
            <svg className="cta-svg-right" viewBox="0 0 260 260">
              <path d="M30 104 C 34 54, 72 22, 128 22 C 174 22, 208 48, 226 92" />
            </svg>
          </div>
        </div>
        <div className="container cta-container">
          <div className="cta-text">
            <h2>Ready to start your journey?</h2>
            <p>
              At Yellowish Publication, we empower authors by providing seamless
              publishing, design, and marketing solutions to bring their stories
              to the world.
            </p>
          </div>
          <div className="cta-card">
            <form onSubmit={handleCallBack}>
              <input type="text" name="user_name" placeholder="Your Name" required />
              <input type="email" name="user_email" placeholder="Your Email" required />
              <input
                type="tel"
                name="user_phone"
                placeholder="Your Phone (10 digits)"
                pattern="[0-9]{10}"
                maxLength="10"
                title="Phone number must be exactly 10 digits"
                required
              />
              <select name="user_language" defaultValue="" required>
                <option value="" disabled>
                  Select Language
                </option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
                <option value="Other">Other</option>
              </select>
              <button type="submit" className="btn-gold btn-block">
                SEND ME A CALL BACK
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Section 6 — Books Published Gallery */}
      <section className="books-section">
        <div className="container">
          <div className="section-head">
            <h2>BOOKS PUBLISHED</h2>
          </div>
          <div className="filter-tabs">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {filteredGallery.length > 0 ? (
            <div className="books-gallery">
              {filteredGallery.map((book) => (
                <div
                  className="book-tile"
                  key={book.id}
                  onClick={(e) => handleNavClick(e, `/book/${book.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={getBookCover(book)}
                    alt={book.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x300.png?text=No+Cover";
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="no-books">No books in this category yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Section 7 — Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2>Loved by authors worldwide</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <img src={t.photo} alt={t.name} className="t-avatar" loading="lazy" />
                <div className="t-body">
                  <p className="t-quote">"{t.quote}"</p>
                  <span className="t-name">{t.name}</span>
                  <span className="t-role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — Stats Bar */}
      <section className="stats-bar">
        <div className="container stats-container">
          {STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9 — Pricing Packages */}
      {/* Section 9 — Pricing Packages */}
<section className="pricing-section">
  <div className="container">

    <div className="pricing-head">
      <h2>Publishing Packages</h2>
      <p>Simple, transparent pricing to bring your book to life.</p>
    </div>

    <div className="pricing-grid">
      {PACKAGES.map((pkg) => (
        <div
          className={`pricing-card ${pkg.featured ? "featured" : ""}`}
          key={pkg.name}
        >
          <div className="pricing-header">
            <h3>{pkg.name}</h3>
            <span className="price">{pkg.price}</span>
          </div>

          <div className="pricing-body">
            <ul>
              {pkg.features.map((feature) => (
                <li key={feature}>
                  <FaCheck className="check" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="/store"
              className="btn-gold"
              onClick={(e) => handleNavClick(e, "/store")}
            >
              KNOW MORE
            </a>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
      {/* Section 10 — Distribution Channels */}
<section className="distribution-section">
  <div className="distribution-container">

    <div className="dist-heading-wrap">
      <h2 className="dist-heading">Our Distribution Channels</h2>
      <p className="dist-subheading">
        Our books are available across leading platforms worldwide.
      </p>
    </div>

    <div className="dist-marquee">
      <div className="dist-track">

        {/* First set */}
        {DISTRIBUTION_CHANNELS.map((channel, i) => (
          <div className="dist-card" key={`first-${i}`}>
            <div className="dist-icon">
              <img
                src={channel.logo}
                alt={`${channel.name} logo`}
                loading="lazy"
              />
            </div>

            <h3 className="dist-name">{channel.name}</h3>

            <p className="dist-desc">{channel.desc}</p>

            <a
              className="dist-cart"
              href={channel.link}
              aria-label={`Shop on ${channel.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        ))}

        {/* Duplicate set for seamless infinite scrolling */}
        {DISTRIBUTION_CHANNELS.map((channel, i) => (
          <div className="dist-card" key={`second-${i}`}>
            <div className="dist-icon">
              <img
                src={channel.logo}
                alt={`${channel.name} logo`}
                loading="lazy"
              />
            </div>

            <h3 className="dist-name">{channel.name}</h3>

            <p className="dist-desc">{channel.desc}</p>

            <a
              className="dist-cart"
              href={channel.link}
              aria-label={`Shop on ${channel.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M9 21a1 1 0 100-2 1 1 0 000-2zM18 21a1 1 0 100-2 1 1 0 000 2z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        ))}

      </div>
    </div>

  </div>
</section>
      {/* Section 11 — Customer Review Highlights */}
      <section className="review-highlights">
        <div className="container">
          <span className="gold-label">GOOGLE CUSTOMER REVIEWS</span>
          <h2>What Authors Think About Us</h2>
          <div className="reviews-grid">
            {REVIEW_HIGHLIGHTS.map((review) => (
              <div className="review-card" key={review.name}>
                <img src={review.photo} alt={review.name} className="review-photo" loading="lazy" />
                <Stars rating={review.rating} />
                <p className="review-quote">"{review.quote}"</p>
                <span className="review-name">{review.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 12 — Video / Gallery Grid */}
      <section className="video-section">
        <div className="container">
          <h2>Watch Author Stories</h2>
          <div className="video-grid">
            {VIDEO_TILES.map((tile, index) => (
              <div className="video-tile" key={index}>
                <img src={tile.img} alt="Gallery preview" loading="lazy" />
                <div className="tile-overlay" />
                <div className="play-btn">
                  <FaPlay />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 13 — Google Reviews Widget */}
      <section className="google-reviews-section">
        <div className="container">
          <h2 className="gr-red">Don't Just Believe What We Say</h2>
          <p className="gr-sub">Read What Authors Have To Say About Us</p>
          <div className="gr-card">
            <div className="gr-summary">
              <div className="gr-logo">
                <FaGoogle />
              </div>
              <div className="gr-rating">
                <span className="gr-score">4.5</span>
                <Stars rating={4.5} />
                <span className="gr-count">Based on 120+ Google reviews</span>
              </div>
            </div>
            <div className="gr-grid">
              {GOOGLE_REVIEWS.map((review) => (
                <div className="gr-review" key={review.name}>
                  <div className="gr-review-top">
                    <img
                      src={
                        review.name === "Rahul Deb"
                          ? author5
                          : review.name === "Dr. Heena Sachdeva"
                          ? author2
                          : author3
                      }
                      alt={review.name}
                      loading="lazy"
                      className="gr-avatar"
                    />
                    <div className="gr-review-meta">
                      <span className="gr-name">{review.name}</span>
                      <span className="gr-date">{review.date}</span>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                  <p className="gr-text">
                    {review.text} <span className="gr-read">Read more</span>
                  </p>
                  <span className="gr-badge">
                    <FaGoogle /> Posted on Google
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}