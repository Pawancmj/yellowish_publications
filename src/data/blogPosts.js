// Static blog posts — Yellowish Publication
// Images reuse existing editorial & book assets.
// Each post carries structured content blocks rendered by the
// Blog Detail page. Block types: p, h2, h3, ul, ol, quote,
// image, table, code, highlight.

import AboutImg from "../assets/About.png";
import StoryImg from "../assets/Story.png";
import heroImg from "../assets/hero.png";

import book1 from "../assets/book1.png";
import book2 from "../assets/book2.png";
import book4 from "../assets/book4.png";
import book5 from "../assets/book5.png";
import book6 from "../assets/book6.png";
import book9 from "../assets/book9.png";
import book16 from "../assets/book16.png";

import author1 from "../assets/author1.png";
import author2 from "../assets/author2.png";
import author3 from "../assets/author3.png";
import author4 from "../assets/author4.png";
import author5 from "../assets/author5.png";

export const blogCategories = [
  "All",
  "Publishing",
  "Writing Tips",
  "Author Stories",
  "Marketing",
  "Book Reviews",
  "Interviews",
  "News",
];

export const blogPosts = [
  {
    id: "p1",
    slug: "how-yellowish-publication-transforms-a-manuscript-into-a-bestseller",
    title: "How Yellowish Publication Transforms a Manuscript into a Bestseller",
    category: "Publishing",
    excerpt:
      "From raw draft to global bookshelf — a step-by-step look at the editorial, design, and distribution engine behind every Yellowish title.",
    author: "Aman Shukla",
    role: "Published Author",
    avatar: author1,
    image: AboutImg,
    date: "August 2, 2026",
    updatedDate: "August 4, 2026",
    readingTime: "6 min read",
    views: "24.3k",
    featured: true,
    authorBio:
      "Aman Shukla is a published author and publishing strategist who has guided dozens of manuscripts from first draft to global distribution. He writes about the craft and business of making books.",
    authorBooks: "1 book published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "Every bestselling book starts as a simple idea. At Yellowish Publication, that idea is carried through a carefully crafted pipeline — professional editing, striking cover design, meticulous formatting, and global distribution that puts your book in front of readers across 150+ countries. In this article, we open the doors to our process and show exactly how a manuscript becomes a book readers love.",
      },
      {
        type: "highlight",
        title: "The short version",
        text: "Edit ruthlessly, design deliberately, print to the highest standard, and distribute everywhere a reader might look. Everything else is discipline.",
      },
      {
        type: "h2",
        id: "the-journey-begins",
        text: "The Journey Begins With an Honest Read",
      },
      {
        type: "p",
        text: "The moment a manuscript lands on our desks, it is treated like the precious thing it is. Our first pass is a full read — no red pens yet, just listening. We want to understand the voice, the stakes, and the promise the book makes to its reader before we touch a single sentence.",
      },
      {
        type: "p",
        text: "This honest first read shapes everything that follows. It tells us whether the book needs structural surgery or gentle polishing, and it sets the roadmap for the editorial phase that comes next.",
      },
      {
        type: "image",
        src: AboutImg,
        alt: "A manuscript being reviewed at an editor's desk",
        caption: "Every project begins with a patient, page-by-page read.",
      },
      {
        type: "h2",
        id: "step-1-editorial-excellence",
        text: "Step 1 — Editorial Excellence",
      },
      {
        type: "p",
        text: "Great design and clever marketing cannot save a manuscript that is not ready. That is why editing comes first, and why we layer three distinct passes over every title:",
      },
      {
        type: "ul",
        items: [
          "Structural editing — reshaping plot, pacing, argument, and chapters so the book flows.",
          "Line editing — sharpening every sentence for rhythm, clarity, and voice.",
          "Proofreading — a meticulous final sweep for spelling, punctuation, and consistency.",
        ],
      },
      {
        type: "blockquote",
        text: "An editor's job is not to rewrite your book. It is to make your book the best version of itself — the version only you could write, cleaned and elevated.",
        cite: "Aman Shukla",
      },
      {
        type: "h2",
        id: "step-2-design-that-sells",
        text: "Step 2 — Design That Sells",
      },
      {
        type: "p",
        text: "Readers judge a book by its cover — and that is a good thing. Our in-house designers study genre conventions, colour psychology, and typography to build a cover that stops the scroll while staying faithful to your story's soul.",
      },
      {
        type: "p",
        text: "Inside, formatting matters just as much. Clean chapter openings, generous margins, and a consistent type system make the difference between a book that feels professional and one that feels homemade.",
      },
      {
        type: "h2",
        id: "step-3-print-and-quality",
        text: "Step 3 — Print & Quality Control",
      },
      {
        type: "p",
        text: "A premium reading experience extends to the physical object. We oversee printing with strict quality checks — paper stock, binding, and colour accuracy — so the book you hold feels as good as the story inside. Every author receives their copies, ready to sign and share.",
      },
      {
        type: "table",
        headers: ["Stage", "Typical Timeline", "Key Deliverable"],
        rows: [
          ["Editorial read & plan", "Week 1", "Editorial roadmap"],
          ["Structural & line editing", "Weeks 2–4", "Polished manuscript"],
          ["Cover design & formatting", "Weeks 4–6", "Final files"],
          ["Proofing & print", "Weeks 6–8", "Author copies"],
          ["Distribution & launch", "Week 8+", "Live listings"],
        ],
      },
      {
        type: "h2",
        id: "step-4-global-distribution",
        text: "Step 4 — Global Distribution",
      },
      {
        type: "p",
        text: "Once the book is real, we send it into the world. Titles are listed across Amazon, Flipkart, Google Play Books, Apple Books, and a network of international retailers, with print-on-demand ensuring your book is never out of stock.",
      },
      {
        type: "ul",
        items: [
          "Amazon.com and Amazon.in",
          "Flipkart",
          "Google Play Books",
          "Apple Books & Kobo",
          "Barnes & Noble and other international stores",
        ],
      },
      {
        type: "h2",
        id: "the-result",
        text: "The Result: A Book You're Proud to Share",
      },
      {
        type: "p",
        text: "When the first author copy arrives, the process completes its circle. The idea that began as a thought is now a book — professionally edited, beautifully designed, and available to readers on the other side of the world. That transformation, from draft to bestseller-grade title, is exactly what we do best.",
      },
    ],
  },
  {
    id: "p2",
    slug: "10-writing-tips-to-make-your-first-chapter-unforgettable",
    title: "10 Writing Tips to Make Your First Chapter Unforgettable",
    category: "Writing Tips",
    excerpt:
      "Your opening pages decide whether a reader stays or scrolls past. These proven techniques will hook readers from the very first line.",
    author: "Dr. Smaranika Pattnaik",
    role: "Academic Author",
    avatar: author2,
    image: book1,
    date: "July 28, 2026",
    updatedDate: "July 30, 2026",
    readingTime: "5 min read",
    views: "18.7k",
    featured: false,
    authorBio:
      "Dr. Smaranika Pattnaik is a certified counsellor, national award-winning educator, and the author of Optimize Your Mind. She writes about psychology, focus, and the craft of clear communication.",
    authorBooks: "2 books published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "The first chapter is your only chance to make a first impression. A reader who picks up your book — in a store, or on a screen — decides within a few pages whether to commit. These ten techniques are the ones our editors see in manuscripts that go on to win readers over.",
      },
      {
        type: "h2",
        id: "tip-1-hook-the-very-first-line",
        text: "Tip 1 — Hook the Very First Line",
      },
      {
        type: "p",
        text: "Open with a sentence that creates a question the reader must answer. It does not need to be explosive; it needs to be intriguing. A quiet, specific detail can be more magnetic than an explosion.",
      },
      {
        type: "blockquote",
        text: "The best first lines are promises. They tell the reader, quietly, what kind of ride this book is going to be.",
        cite: "Dr. Smaranika Pattnaik",
      },
      {
        type: "h2",
        id: "tip-2-start-in-the-action",
        text: "Tip 2 — Start in the Action",
      },
      {
        type: "p",
        text: "Begin in a moment of motion or tension, not in backstory. Let context arrive naturally as the scene unfolds. Readers trust a story that trusts them enough to start somewhere interesting.",
      },
      {
        type: "h2",
        id: "tip-3-a-voice-that-stands-out",
        text: "Tip 3 — A Voice That Stands Out",
      },
      {
        type: "p",
        text: "Voice is the personality of your prose — and it is what makes your book unlike anyone else's. Write the way you would tell the story aloud, then tighten. A distinctive voice keeps readers turning pages long after the plot itself would have.",
      },
      {
        type: "h2",
        id: "tips-4-through-10",
        text: "Tips 4 Through 10 — The Essential Checklist",
      },
      {
        type: "ol",
        items: [
          "Introduce a character the reader immediately cares about — even a small stake works.",
          "Make the setting vivid in two strokes, not two paragraphs.",
          "Plant a question early and promise it will be answered.",
          "Cut any sentence that slows the opening's momentum.",
          "End the chapter on a note that pulls the reader into chapter two.",
          "Show the world through your character's eyes, not the author's.",
          "Read the chapter aloud — your ear catches what your eye misses.",
        ],
      },
      {
        type: "highlight",
        title: "Editor's golden rule",
        text: "If a reader could skip your first chapter and not miss anything essential, the chapter isn't working yet. Rewrite until skipping it feels impossible.",
      },
      {
        type: "image",
        src: book1,
        alt: "Optimize Your Mind book cover",
        caption: "Great openings, like great covers, earn a second look.",
      },
      {
        type: "h2",
        id: "finally",
        text: "Finally — Write It, Then Sharpen It",
      },
      {
        type: "p",
        text: "None of these tips demand perfection on the first pass. Write the chapter badly if you must; then revise with the checklist beside you. The unforgettable first chapter is almost always a rewritten one.",
      },
    ],
  },
  {
    id: "p3",
    slug: "from-first-draft-to-published-author-rahul-debs-journey",
    title: "From First Draft to Published Author: Rahul Deb's Journey",
    category: "Author Stories",
    excerpt:
      "A physician who dreamed of writing — Dr. Rahul Deb on turning busy mornings into chapters and seeing his book reach readers worldwide.",
    author: "Rahul Deb",
    role: "Published Author",
    avatar: author3,
    image: book2,
    date: "July 21, 2026",
    updatedDate: "July 22, 2026",
    readingTime: "7 min read",
    views: "12.9k",
    featured: false,
    authorBio:
      "Dr. Rahul Deb is a physician, academic, and author of Generic Habits. He writes at the intersection of health, behaviour science, and everyday resilience.",
    authorBooks: "2 books published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "Writing a book while juggling a medical career sounds impossible — until you meet Dr. Rahul Deb. Over morning shifts and late nights, he turned a half-formed idea into a published title, and in this conversation he shares exactly how it happened.",
      },
      {
        type: "h2",
        id: "the-idea",
        text: "The Idea That Wouldn't Leave",
      },
      {
        type: "p",
        text: "The idea for Generic Habits came from the clinic. Again and again, patients would ask how to build routines that actually stick. The answers lived in behavioural science — but no one had written them in a way a busy reader could use. That gap became a book.",
      },
      {
        type: "blockquote",
        text: "I didn't start writing because I had time. I started because the idea kept showing up in my work, every single day, until ignoring it felt dishonest.",
        cite: "Dr. Rahul Deb",
      },
      {
        type: "h2",
        id: "writing-between-shifts",
        text: "Writing Between Shifts",
      },
      {
        type: "p",
        text: "The discipline came from tiny, protected routines: thirty minutes each morning before the ward, a notebook kept beside the desk, and a rule to end each session mid-sentence so the next one was easy to begin. Slow progress, he insists, is still progress.",
      },
      {
        type: "ul",
        items: [
          "Thirty focused minutes a day beat a heroic Sunday marathon.",
          "A running notebook catches ideas that vanish by evening.",
          "Deadlines, even self-imposed ones, turn intentions into chapters.",
        ],
      },
      {
        type: "image",
        src: book2,
        alt: "Generic Habits book cover",
        caption: "The book that began as a clinical observation.",
      },
      {
        type: "h2",
        id: "finding-a-publisher",
        text: "Finding a Publisher Who Believed",
      },
      {
        type: "p",
        text: "Submitting to publishers was nerve-wracking, but the fit mattered more than speed. Yellowish Publication paired him with an editor who understood the book's clinical roots, a designer who made the cover feel like a bestseller, and a distribution team that put the title on Amazon and Google Play Books within weeks of approval.",
      },
      {
        type: "h2",
        id: "the-day-it-launched",
        text: "The Day It Launched",
      },
      {
        type: "p",
        text: "Holding the first author copy, Dr. Deb says, felt like closing a loop that had been open for years. The book now sits on shelves — physical and digital — in countries he has never visited. His advice to hesitant authors is simple: your schedule is not the obstacle; your permission to start is.",
      },
    ],
  },
  {
    id: "p4",
    slug: "book-marketing-101-how-to-reach-readers-on-amazon-and-flipkart",
    title: "Book Marketing 101: How to Reach Readers on Amazon & Flipkart",
    category: "Marketing",
    excerpt:
      "Great books don't sell themselves. Learn the practical marketing moves that get your title noticed and keep sales climbing.",
    author: "Mukul Dagar",
    role: "Author & Mentor",
    avatar: author4,
    image: book9,
    date: "July 14, 2026",
    updatedDate: "July 16, 2026",
    readingTime: "6 min read",
    views: "21.1k",
    featured: false,
    authorBio:
      "Mukul Dagar is a youth psychologist, mentor to 2000+ UPSC aspirants, and the author of The Psychology of Dharma. He hosts The Mukul Dagar Show podcast.",
    authorBooks: "1 book published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "A beautifully printed book is only half the battle. On marketplaces like Amazon and Flipkart, your book competes with millions of others for a shopper's attention. The good news: a handful of disciplined moves, done consistently, can dramatically improve your title's visibility.",
      },
      {
        type: "h2",
        id: "optimise-your-listing",
        text: "Optimise Your Listing Like a Product Manager",
      },
      {
        type: "p",
        text: "Your product page is your bookstore window. Every element should pull its weight — the cover, the title, the blurb, the keywords. Write your description for browsers, not for yourself: lead with the reader's problem and the transformation your book delivers.",
      },
      {
        type: "highlight",
        title: "A strong description template",
        text: "Open with the reader's pain. Introduce your promise in one line. List three benefits in bullets. End with a soft, confident call to action.",
      },
      {
        type: "code",
        code: `"Struggling to make habits stick?\\nGeneric Habits turns behaviour science into a\\nsimple routine you can start today.\\n\\nInside you'll learn:\\n- The 2-minute rule that beats procrastination\\n- How to design your environment for focus\\n- Why willpower fails (and what replaces it)\\n\\nOrder your copy and build the life you keep promising yourself."`,
      },
      {
        type: "h2",
        id: "collect-reviews-early-and-often",
        text: "Collect Reviews Early and Often",
      },
      {
        type: "p",
        text: "Reviews are social proof, and marketplaces rank titles with more and better reviews higher in search. Send early copies to readers, friends, and book clubs, and make a polite review request part of your launch email. Never buy reviews — platforms detect and penalise it.",
      },
      {
        type: "h2",
        id: "choose-your-channels",
        text: "Know Where Your Readers Shop",
      },
      {
        type: "table",
        headers: ["Channel", "Best For", "First Move"],
        rows: [
          ["Amazon", "Global reach & reviews", "Perfect your A+ content and keywords"],
          ["Flipkart", "India's homegrown shoppers", "Get verified buyer reviews early"],
          ["Google Play Books", "Digital & audiobooks", "Run a launch discount window"],
          ["Apple Books", "Premium iOS readers", "Submit for featured collections"],
        ],
      },
      {
        type: "h2",
        id: "pricing-and-promotions",
        text: "Use Pricing as a Launch Lever",
      },
      {
        type: "p",
        text: "A temporary launch discount creates urgency and moves units, and early velocity teaches the algorithm that your book deserves attention. Pair the discount with a coordinated announcement on your social channels for a compounding effect.",
      },
      {
        type: "h2",
        id: "measure-and-repeat",
        text: "Measure, Learn, Repeat",
      },
      {
        type: "ol",
        items: [
          "Track page views and conversion weekly for the first month.",
          "Note which description sections readers engage with most.",
          "Test a new cover concept if click-through stays low.",
          "Double down on the channels that actually convert.",
        ],
      },
      {
        type: "blockquote",
        text: "Marketing is not a one-time event. It is a habit — and like all good habits, it compounds.",
        cite: "Mukul Dagar",
      },
      {
        type: "image",
        src: book9,
        alt: "The Psychology of Dharma cover",
        caption: "Consistent, small marketing actions outperform occasional bursts.",
      },
    ],
  },
  {
    id: "p5",
    slug: "review-the-psychology-of-dharma-by-mukul-dagar",
    title: "Review: The Psychology of Dharma by Mukul Dagar",
    category: "Book Reviews",
    excerpt:
      "A thoughtful blend of science and spirituality that helps distracted readers find purpose, balance, and inner strength.",
    author: "Dr. Heena Sachdeva",
    role: "Academic Author",
    avatar: author5,
    image: book6,
    date: "July 6, 2026",
    updatedDate: "July 7, 2026",
    readingTime: "4 min read",
    views: "9.4k",
    featured: false,
    authorBio:
      "Dr. Heena Sachdeva is a zoologist, educator, and author of Environment and Road Safety. She reviews books at the intersection of science, wellbeing, and modern life.",
    authorBooks: "2 books published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "In a world overflowing with noise, The Psychology of Dharma is a quiet anchor. Youth psychologist Mukul Dagar marries neuroscience with ancient wisdom, and the result is a book that reads like a conversation with a wise friend who also happens to know the research.",
      },
      {
        type: "h2",
        id: "the-core-argument",
        text: "The Core Argument",
      },
      {
        type: "p",
        text: "Dagar's central claim is refreshingly simple: purpose is not a luxury, it is a psychological necessity. Drawing on attention science, habit research, and the concept of dharma — right action aligned with one's nature — the book argues that clarity and balance are skills we can train.",
      },
      {
        type: "blockquote",
        text: "Distraction is not a moral failing. It is an environment that has not been designed for the mind you actually have.",
        cite: "The Psychology of Dharma, Chapter 3",
      },
      {
        type: "h2",
        id: "what-works",
        text: "What Works",
      },
      {
        type: "ul",
        items: [
          "Practical exercises appear at the end of every chapter, not just at the end of the book.",
          "The science is cited lightly — enough to be credible, never enough to lecture.",
          "Stories of UPSC aspirants ground the theory in recognisable, human struggle.",
        ],
      },
      {
        type: "h2",
        id: "what-could-be-better",
        text: "What Could Be Better",
      },
      {
        type: "p",
        text: "Readers new to eastern philosophy may want a glossary, and a few chapters repeat the same core idea from slightly different angles. These are small costs for a book that is otherwise remarkably focused.",
      },
      {
        type: "h2",
        id: "the-verdict",
        text: "The Verdict",
      },
      {
        type: "table",
        headers: ["Criteria", "Score"],
        rows: [
          ["Readability", "9 / 10"],
          ["Practical value", "9 / 10"],
          ["Depth", "8 / 10"],
          ["Re-readability", "8 / 10"],
        ],
      },
      {
        type: "highlight",
        title: "Our editors' verdict",
        text: "A must-read for anyone chasing clarity. If you've felt scattered and couldn't name why, start here.",
      },
      {
        type: "image",
        src: book6,
        alt: "The Psychology of Dharma book cover",
        caption: "The Psychology of Dharma, available on Amazon and Google Play Books.",
      },
    ],
  },
  {
    id: "p6",
    slug: "inside-the-cover-design-studio-crafting-covers-that-sell",
    title: "Inside the Cover Design Studio: Crafting Covers That Sell",
    category: "Interviews",
    excerpt:
      "We sit down with our design team to learn the psychology of colour, typography, and layout behind covers that stop the scroll.",
    author: "Editorial Team",
    role: "Yellowish Publication",
    avatar: author1,
    image: StoryImg,
    date: "June 29, 2026",
    updatedDate: "June 30, 2026",
    readingTime: "5 min read",
    views: "11.6k",
    featured: false,
    authorBio:
      "The Yellowish Publication editorial team brings together editors, designers, and publishing strategists who write about the craft behind every book we release.",
    authorBooks: "100+ books published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "Readers judge a book by its cover — and that is a good thing. Behind every Yellowish cover is a design process that blends research, psychology, and a little intuition. We sat down with our design studio to learn how they translate a manuscript's soul into a single, scroll-stopping image.",
      },
      {
        type: "h2",
        id: "first-we-listen-to-the-book",
        text: "First, We Listen to the Book",
      },
      {
        type: "p",
        text: "Design starts with reading. Our designers read the manuscript or a detailed brief before touching a single pixel, looking for the emotional core — the feeling the book should provoke at a glance. Genre research follows: what do readers expect from a romance, a fantasy, or an academic monograph?",
      },
      {
        type: "blockquote",
        text: "A great cover is a promise. It tells a browsing reader, in under a second, what this book will do to them — and makes them want to find out.",
        cite: "Lead Designer, Yellowish Publication",
      },
      {
        type: "h2",
        id: "the-psychology-of-colour",
        text: "The Psychology of Colour",
      },
      {
        type: "ul",
        items: [
          "Warm golds and creams signal wisdom, comfort, and premium quality.",
          "Deep navy suggests trust, authority, and serious non-fiction.",
          "Bold reds create urgency and emotional charge.",
          "Soft pinks and pastels speak to romance, memoir, and heart-led fiction.",
        ],
      },
      {
        type: "h2",
        id: "typography-does-the-heavy-lifting",
        text: "Typography Does the Heavy Lifting",
      },
      {
        type: "p",
        text: "Before colour, there is type. A cover's title must be legible at thumbnail size — the size it appears on a phone screen. Our designers choose display faces with personality and pair them with weights and spacing that survive shrinking.",
      },
      {
        type: "table",
        headers: ["Cover Element", "Contribution", "Designer's Priority"],
        rows: [
          ["Title typography", "Identity & recall", "Readable at thumbnail size"],
          ["Imagery", "Emotional pull", "Matches the genre's promise"],
          ["Colour palette", "Mood & shelf presence", "Contrast on any background"],
          ["Author name", "Trust & branding", "Prominent but not loud"],
        ],
      },
      {
        type: "h2",
        id: "from-concept-to-cover",
        text: "From Concept to Cover",
      },
      {
        type: "ol",
        items: [
          "Read the manuscript and isolate the emotional core.",
          "Research genre conventions and competitor covers.",
          "Develop three distinct concepts for the author to react to.",
          "Refine the chosen direction through a feedback round.",
          "Produce final files for print, digital, and thumbnail sizes.",
        ],
      },
      {
        type: "highlight",
        title: "Designer's advice to authors",
        text: "Bring your instincts, not your Pinterest board. The best covers emerge when an author trusts a professional to interpret the feeling they describe.",
      },
      {
        type: "image",
        src: StoryImg,
        alt: "A designer reviewing cover concepts",
        caption: "Concepts, feedback, and refinement — the cover's journey to the shelf.",
      },
    ],
  },
  {
    id: "p7",
    slug: "yellowish-publication-crosses-a-new-global-distribution-milestone",
    title: "Yellowish Publication Crosses a New Global Distribution Milestone",
    category: "News",
    excerpt:
      "Thousands of new readers across more countries now have access to our authors' titles — here's what's changing and why it matters.",
    author: "Editorial Team",
    role: "Yellowish Publication",
    avatar: author2,
    image: heroImg,
    date: "June 20, 2026",
    updatedDate: "June 20, 2026",
    readingTime: "3 min read",
    views: "8.2k",
    featured: false,
    authorBio:
      "The Yellowish Publication editorial team brings together editors, designers, and publishing strategists who write about the craft behind every book we release.",
    authorBooks: "100+ books published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "We are thrilled to announce that Yellowish Publication has expanded its global distribution network, making our authors' books available to readers in more regions than ever before. From print-on-demand to digital storefronts, your story can now travel further than ever.",
      },
      {
        type: "h2",
        id: "what-has-changed",
        text: "What Has Changed",
      },
      {
        type: "p",
        text: "Our distribution layer now spans additional marketplaces and regional bookstores, alongside the core channels authors already know. Print-on-demand capacity has grown, which means titles stay in stock worldwide and ship closer to the reader, cutting delivery times.",
      },
      {
        type: "ul",
        items: [
          "New marketplaces added across Europe and South-East Asia.",
          "Print-on-demand nodes expanded for faster regional fulfilment.",
          "Enhanced reporting so authors can track sales per region.",
        ],
      },
      {
        type: "table",
        headers: ["Region", "Coverage", "Status"],
        rows: [
          ["India", "Amazon.in, Flipkart, leading retailers", "Live"],
          ["North America", "Amazon.com, Barnes & Noble, Kobo", "Live"],
          ["Europe", "Major marketplaces & bookstores", "Expanded"],
          ["South-East Asia", "Regional stores & digital platforms", "New"],
        ],
      },
      {
        type: "h2",
        id: "why-it-matters",
        text: "Why It Matters for Authors",
      },
      {
        type: "p",
        text: "For authors, the milestone means one thing: reach. A book published with Yellowish is no longer limited by geography. Whether a reader in Delhi, London, or Singapore searches for your title, they can find it, order it, and hold it — usually within days.",
      },
      {
        type: "blockquote",
        text: "Every new market is a new reader who might never have met your story otherwise. That is the whole point of publishing.",
        cite: "Yellowish Publication Distribution Team",
      },
      {
        type: "h2",
        id: "what-is-next",
        text: "What's Next",
      },
      {
        type: "p",
        text: "This is a stepping stone, not a finish line. We are already working on deeper integration with library wholesalers and regional audio platforms. Keep an eye on this space — the bookshelf is getting larger, and your story belongs on it.",
      },
    ],
  },
  {
    id: "p8",
    slug: "why-every-author-needs-a-strong-author-brand",
    title: "Why Every Author Needs a Strong Author Brand",
    category: "Marketing",
    excerpt:
      "Your book sells once. Your author brand sells forever. Here's how to build a presence readers trust before you even publish.",
    author: "Sneh Tripathi",
    role: "Bestselling Author",
    avatar: author3,
    image: book16,
    date: "June 12, 2026",
    updatedDate: "June 14, 2026",
    readingTime: "5 min read",
    views: "15.3k",
    featured: false,
    authorBio:
      "Sneh Tripathi is the author of No Mercy No King, a dark fantasy of power and rebellion. She writes about creativity, world-building, and building an audience as an author.",
    authorBooks: "1 book published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "Your book sells once. Your author brand sells forever. Readers rarely fall for a single title — they fall for an author, then follow everything that author writes. Building a strong brand means giving readers something to follow before your launch day even arrives.",
      },
      {
        type: "h2",
        id: "brand-is-a-promise",
        text: "Your Brand Is a Promise",
      },
      {
        type: "p",
        text: "Think of your author brand as the consistent feeling readers get whenever they meet you — on a cover, a newsletter, or a social post. Consistency beats volume. A handful of well-made, on-brand posts outperform a firehose of scattered content.",
      },
      {
        type: "blockquote",
        text: "Readers don't follow books. They follow voices — and voices, once found, become loyal.",
        cite: "Sneh Tripathi",
      },
      {
        type: "h2",
        id: "the-building-blocks",
        text: "The Building Blocks of an Author Brand",
      },
      {
        type: "ol",
        items: [
          "Define your niche — the genre and theme you're known for.",
          "Choose your voice — how you talk about your work and your readers.",
          "Pick two channels and master them instead of being everywhere weakly.",
          "Share your process — drafts, research, and behind-the-scenes build trust.",
          "Start a newsletter — your most reliable, owned audience.",
        ],
      },
      {
        type: "h2",
        id: "start-before-launch",
        text: "Start Before Launch",
      },
      {
        type: "p",
        text: "The single biggest mistake new authors make is starting their marketing the week the book releases. By then, the relationship is already late. Begin sharing your journey months early — readers love watching a book come into being, and they reward the authors who let them in.",
      },
      {
        type: "highlight",
        title: "A simple 90-day plan",
        text: "Days 1–30: define your niche and set up your newsletter. Days 31–60: share process content weekly. Days 61–90: reveal the cover, open pre-orders, and invite your community to share.",
      },
      {
        type: "image",
        src: book16,
        alt: "No Mercy No King book cover",
        caption: "A strong author brand made this debut's launch feel like a reunion.",
      },
      {
        type: "h2",
        id: "keep-the-relationship",
        text: "Keep the Relationship Going",
      },
      {
        type: "p",
        text: "After the launch, the work is to keep showing up. Answer readers, thank reviewers, and begin sketching what's next. The authors who build a brand before their first book are the ones whose second book sells itself.",
      },
    ],
  },
  {
    id: "p9",
    slug: "a-beginners-guide-to-isbn-copyright-and-publishing-legalities",
    title: "A Beginner's Guide to ISBN, Copyright, and Publishing Legalities",
    category: "Publishing",
    excerpt:
      "New authors ask the same questions every week. We answer them — from ISBN basics to copyright protection and contracts.",
    author: "Sarfaraz Abdul Khader",
    role: "Published Author",
    avatar: author4,
    image: book4,
    date: "June 3, 2026",
    updatedDate: "June 5, 2026",
    readingTime: "8 min read",
    views: "19.8k",
    featured: false,
    authorBio:
      "Sarfaraz Abdul Khader is the author of Things That Cannot Be Indelible, a novel about growth, resilience, and relationships. He demystifies publishing for first-time authors.",
    authorBooks: "1 book published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "Publishing has its own language, and the legal side can feel intimidating. This beginner-friendly guide demystifies ISBN registration, copyright protection, publishing agreements, and the fine print every author should understand before signing.",
      },
      {
        type: "h2",
        id: "what-is-an-isbn",
        text: "What Is an ISBN?",
      },
      {
        type: "p",
        text: "An International Standard Book Number (ISBN) is your book's global identity card. Every edition — paperback, hardcover, ebook — needs its own ISBN so stores, libraries, and marketplaces can track and sell it. In many countries, the national ISBN agency issues them through approved distributors.",
      },
      {
        type: "table",
        headers: ["Question", "Answer"],
        rows: [
          ["Who issues ISBNs?", "The national agency, often via distributors."],
          ["One per edition?", "Yes — paperback and ebook need separate ISBNs."],
          ["Is an ISBN required?", "Required for most retail & library channels."],
          ["Who owns it?", "The publisher or self-publisher who registered it."],
        ],
      },
      {
        type: "code",
        code: `// A 13-digit ISBN structure\nconst isbn = "978-93-92154-00-3";\n//  978  country-prefix,  publisher,  title,  check digit`,
      },
      {
        type: "h2",
        id: "copyright-basics",
        text: "Copyright Basics",
      },
      {
        type: "p",
        text: "Copyright protects your expression — the specific words you wrote — from the moment it is fixed in a tangible form. You do not need to register it to own it, but registration strengthens your position if you ever need to defend it in court or before a platform.",
      },
      {
        type: "ul",
        items: [
          "Copyright protects expression, not ideas or titles.",
          "Registration is optional but recommended for serious titles.",
          "International treaties protect your work across most countries.",
          "Keep dated drafts as evidence of authorship.",
        ],
      },
      {
        type: "h2",
        id: "publishing-contracts",
        text: "Understanding the Contract",
      },
      {
        type: "p",
        text: "Your publishing agreement defines royalties, rights, and responsibilities. Read it twice, and read the sections that seem boring twice more. Key clauses to verify: royalty percentage and basis, rights granted (print, digital, audio, film), and how and when you can terminate.",
      },
      {
        type: "highlight",
        title: "Contract watch-list",
        text: "Royalty rate & basis • Rights scope & territory • Reversion / termination terms • Approval rights on cover and pricing • Who owns the ISBN.",
      },
      {
        type: "h2",
        id: "self-publishing-vs-traditional",
        text: "Self-Publishing vs Traditional",
      },
      {
        type: "table",
        headers: ["Factor", "Self / Assisted", "Traditional"],
        rows: [
          ["Speed to market", "Faster", "Slower"],
          ["Creative control", "Full", "Shared with publisher"],
          ["Royalty share", "Higher", "Lower per unit"],
          ["Upfront cost", "Possible", "Usually none"],
        ],
      },
      {
        type: "h2",
        id: "a-simple-check-list",
        text: "A Simple Pre-Publication Checklist",
      },
      {
        type: "ol",
        items: [
          "Decide on an ISBN for each edition.",
          "Register copyright if you plan international reach.",
          "Review your contract with royalty & rights clauses in mind.",
          "Confirm who holds the cover and interior design files.",
          "Keep a dated copy of your final manuscript.",
        ],
      },
      {
        type: "blockquote",
        text: "Legalities feel like a barrier until they feel like a safety net. Understand the basics, and publishing stops being intimidating.",
        cite: "Sarfaraz Abdul Khader",
      },
      {
        type: "image",
        src: book4,
        alt: "Things That Cannot Be Indelible book cover",
        caption: "A published title — the happy ending of a clear legal start.",
      },
    ],
  },
  {
    id: "p10",
    slug: "the-science-of-habit-lessons-from-a-bestselling-self-help-book",
    title: "The Science of Habit: Lessons from a Bestselling Self-Help Book",
    category: "Book Reviews",
    excerpt:
      "How small daily routines compound into extraordinary results — and what writers can borrow from behaviour science to finish their books.",
    author: "Dr. Rahul Deb",
    role: "Published Author",
    avatar: author5,
    image: book5,
    date: "May 26, 2026",
    updatedDate: "May 28, 2026",
    readingTime: "5 min read",
    views: "13.5k",
    featured: false,
    authorBio:
      "Dr. Rahul Deb is a physician, academic, and author of Generic Habits. He writes at the intersection of health, behaviour science, and everyday resilience.",
    authorBooks: "2 books published",
    authorSocial: {
      twitter: "#",
      linkedin: "#",
      facebook: "#",
    },
    content: [
      {
        type: "p",
        text: "Behavioural psychology teaches us that tiny, consistent actions reshape our lives. The same principle applies to writing. In this review, we explore how habit science can help authors finish manuscripts, build readership, and show up to the page every single day.",
      },
      {
        type: "h2",
        id: "the-one-percent-rule",
        text: "The One Percent Rule",
      },
      {
        type: "p",
        text: "Improvements of one percent compound quietly. Write two hundred words a day and, in a year, you have more than a manuscript — you have a relationship with your craft. The authors who finish are rarely the most talented; they are the most consistent.",
      },
      {
        type: "blockquote",
        text: "You do not rise to the level of your goals. You fall to the level of your systems.",
        cite: "Habit science, applied to writing",
      },
      {
        type: "h2",
        id: "cue-routine-reward",
        text: "Cue, Routine, Reward",
      },
      {
        type: "p",
        text: "Every habit has three parts. For writing, the cue might be your morning coffee, the routine your twenty-minute session, and the reward the small satisfaction of a finished page. Design the cue and the reward, and the routine becomes almost automatic.",
      },
      {
        type: "ol",
        items: [
          "Attach writing to an existing anchor — a meal, a commute, a coffee.",
          "Make the session tiny enough that refusing is hard.",
          "Reward yourself visibly — tick a box, mark the calendar.",
          "Never miss twice; two days off in a row is where habits die.",
        ],
      },
      {
        type: "h2",
        id: "environment-beats-willpower",
        text: "Environment Beats Willpower",
      },
      {
        type: "p",
        text: "We overestimate willpower and underestimate environment. A dedicated desk, a phone in another room, and a distraction-free editor make the right behaviour the easy behaviour. Design your space before you rely on your discipline.",
      },
      {
        type: "highlight",
        title: "Try this today",
        text: "Set one environmental trigger for writing — put your laptop on the desk the night before, with the document already open. Tomorrow, starting becomes the path of least resistance.",
      },
      {
        type: "image",
        src: book5,
        alt: "Environment and Road Safety book cover",
        caption: "Small daily actions, like traffic signs, guide behaviour over time.",
      },
      {
        type: "h2",
        id: "the-writers-takeaway",
        text: "The Writer's Takeaway",
      },
      {
        type: "p",
        text: "If you take one lesson into your next writing session, let it be this: stop waiting for inspiration and start building the system that makes writing unavoidable. Habit science is not about grit — it is about engineering your days so the work happens without a fight.",
      },
    ],
  },
];
