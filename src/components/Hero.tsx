"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Slide = {
  image?: string;
  desktopImage?: string;
  mobileImage?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  discount?: string;
  cta?: string;
  showContent?: boolean;
  overlay?: boolean;
  link: string; // Added link property to the type
};

/* ================= DATA ================= */
const slides: Slide[] = [
  {
    desktopImage: "/assets/hero-slide-3.jpg",
    mobileImage: "/assets/hero-slide-3.jpg",
    subtitle: "New Arrivals",
    title: "Designer Kurti Sets",
    description: "Mirror work & embroidered kurti sets with palazzos — effortless fusion dressing for every occasion.",
    discount: "STARTING ₹1,499",
    cta: "Shop Now",
    overlay: true,
    link: "/products",
  },
  {
    desktopImage: "/assets/hero-slide-1.webp",
    mobileImage: "https://www.biba.in/dw/image/v2/BKQK_PRD/on/demandware.static/-/Library-Sites-BibaSharedLibrary/en_IN/dw79d1f9b7/A-A-SS26/SS26-Edit-M.jpg",
    overlay: false,
    link: "/products",
  },
  {
    desktopImage: "/assets/hero-slide-2.jpg",
    mobileImage: "/assets/hero-slide-2.jpg",
    subtitle: "Flowing Elegance",
    title: "Maxi Dresses",
    description: "Vibrant Bandhani and paisley prints on flowing silhouettes — where Rajasthani heritage meets modern grace.",
    discount: "UP TO 35% OFF",
    cta: "Explore Maxis",
    overlay: true,
    link: "/products",
  },
  {
    desktopImage: "https://www.biba.in/dw/image/v2/BKQK_PRD/on/demandware.static/-/Library-Sites-BibaSharedLibrary/en_IN/dwded9a678/A-A-SS26/SS'26-Banner-3.jpg",
    mobileImage: "https://www.biba.in/dw/image/v2/BKQK_PRD/on/demandware.static/-/Library-Sites-BibaSharedLibrary/en_IN/dw6e1be403/A-A-SS26/SS'26-Banner-3-M.jpg",
    showContent: false,
    overlay: false,
    link: "/products",
  },
];

/* ================= COMPONENT ================= */
const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const router = useRouter(); // Initialize router

  const handleRedirection = (link: string) => {
    router.push(link);
  };

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ================= IMAGE & OVERLAY (CLICKABLE) ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 cursor-pointer" // Added cursor-pointer
          onClick={() => handleRedirection(slide.link)} // Click on banner redirects
        >
          <picture>
            {slide.mobileImage && <source media="(max-width: 768px)" srcSet={slide.mobileImage} />}
            {slide.desktopImage && <source media="(min-width: 769px)" srcSet={slide.desktopImage} />}
            <img
              src={slide.desktopImage || slide.mobileImage}
              className="w-full h-full object-cover"
              alt={slide.title || "Hero Banner"}
            />
          </picture>

          {slide.overlay !== false && (
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, hsla(20,38%,12%,0.85), hsla(20,38%,12%,0.4))",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ================= CONTENT ================= */}
      {slide.showContent !== false && (
        <div className="relative z-10 min-h-screen flex items-center justify-center text-center px-6 pointer-events-none">
          {/* pointer-events-none allows clicks to pass through to the image, 
              but we will re-enable them for the CTA button specifically */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl pointer-events-auto" // Re-enable pointer events for text area
            >
              {slide.discount && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4">
                  <span className="text-xs tracking-[0.3em] border px-4 py-1 text-[#D4AF37] border-[#D4AF37] bg-black/20">
                    {slide.discount}
                  </span>
                </motion.div>
              )}

              {slide.subtitle && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm uppercase tracking-[0.3em] text-[#F3E1B6] mb-2">
                  {slide.subtitle}
                </motion.p>
              )}

              {slide.title && (
                <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="text-5xl md:text-8xl font-bold text-[#F3E1B6] mb-4 font-serif">
                  {slide.title}
                </motion.h1>
              )}

              {slide.description && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm md:text-base text-[#F3E1B6]/80 mb-6 max-w-md mx-auto leading-relaxed">
                  {slide.description}
                </motion.p>
              )}

              {slide.cta && (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents double-triggering since parent is also clickable
                    handleRedirection(slide.link);
                  }}
                  className="relative px-8 py-3 border border-[#D4AF37] text-[#F3E1B6] overflow-hidden group cursor-pointer"
                >
                  <span className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-20 transition duration-300" />
                  <span className="relative z-10 tracking-widest uppercase text-xs font-bold">
                    {slide.cta}
                  </span>
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ================= NAVIGATION ================= */}
      <button onClick={prev} className="absolute left-5 top-1/2 -translate-y-1/2 z-20 text-[#D4AF37] hover:scale-110 transition cursor-pointer p-2">
        <ChevronLeft size={32} />
      </button>

      <button onClick={next} className="absolute right-5 top-1/2 -translate-y-1/2 z-20 text-[#D4AF37] hover:scale-110 transition cursor-pointer p-2">
        <ChevronRight size={32} />
      </button>

      {/* ================= DOTS ================= */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1 transition-all duration-500 rounded-full"
            style={{
              width: i === current ? "40px" : "15px",
              backgroundColor: i === current ? "#D4AF37" : "rgba(212,175,55,0.3)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;