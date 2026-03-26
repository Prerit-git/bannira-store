"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
};

/* ================= DATA ================= */
const slides: Slide[] = [
  {
    desktopImage: "/assets/hero-slide-1.jpg",
    mobileImage: "/assets/hero-slide-1.jpg",
    subtitle: "Bridal Collection 2026",
    title: "Royal Lehengas",
    description:
      "Handcrafted with centuries-old Zardozi techniques by master artisans.",
    discount: "FLAT 40% OFF",
    cta: "Shop Bridal",
    overlay: true,
  },
  {
    desktopImage: "/assets/hero-slide-2.jpg",
    mobileImage: "/assets/hero-slide-2.jpg",
    subtitle: "Heritage Weaves",
    title: "Bandhani Sarees",
    description:
      "Thousands of hand-tied knots create the legendary Bandhani patterns of Rajasthan.",
    discount: "UP TO 35% OFF",
    cta: "Explore Sarees",
    overlay: true,
  },
  {
    desktopImage:
      "https://www.biba.in/dw/image/v2/BKQK_PRD/on/demandware.static/-/Library-Sites-BibaSharedLibrary/en_IN/dwded9a678/A-A-SS26/SS'26-Banner-3.jpg",
    mobileImage:
      "https://www.biba.in/dw/image/v2/BKQK_PRD/on/demandware.static/-/Library-Sites-BibaSharedLibrary/en_IN/dw6e1be403/A-A-SS26/SS'26-Banner-3-M.jpg",
    showContent: false,
    overlay: false,
  },
];

/* ================= COMPONENT ================= */
const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % slides.length),
    [],
  );

  const prev = useCallback(
    () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const getImage = () => {
    return slide.desktopImage || slide.mobileImage || "";
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ================= IMAGE ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <picture>
            {slide.mobileImage && (
              <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
            )}
            {slide.desktopImage && (
              <source media="(min-width: 769px)" srcSet={slide.desktopImage} />
            )}
            <img
              src={getImage()}
              className="w-full h-full object-cover"
              alt=""
            />
          </picture>

          {/* Overlay (optional) */}
          {slide.overlay !== false && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, hsla(20,38%,12%,0.85), hsla(20,38%,12%,0.4))",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ================= CONTENT ================= */}
      {slide.showContent !== false && (
        <div className="relative z-10 min-h-screen flex items-center justify-center text-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Discount */}
              {slide.discount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <span className="text-xs tracking-[0.3em] border px-4 py-1 text-[#D4AF37] border-[#D4AF37]">
                    {slide.discount}
                  </span>
                </motion.div>
              )}

              {/* Subtitle */}
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm uppercase tracking-[0.3em] text-[#F3E1B6] mb-2"
                >
                  {slide.subtitle}
                </motion.p>
              )}

              {/* Title */}
              {slide.title && (
                <motion.h1
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-8xl font-bold text-[#F3E1B6] mb-4"
                >
                  {slide.title}
                </motion.h1>
              )}

              {/* Description (replaces price) */}
              {slide.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm md:text-base text-[#F3E1B6]/80 mb-6 max-w-md mx-auto"
                >
                  {slide.description}
                </motion.p>
              )}

              {/* CTA */}
              {slide.cta && (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(212,175,55,0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-3 border border-[#D4AF37] text-[#F3E1B6] overflow-hidden group cursor-pointer"
                >
                  {/* glow layer */}
                  <span className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-20 transition duration-300" />

                  {/* text */}
                  <span className="relative z-10 tracking-widest">
                    {slide.cta}
                  </span>
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ================= NAVIGATION ================= */}
      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 text-[#D4AF37]"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 text-[#D4AF37]"
      >
        <ChevronRight size={28} />
      </button>

      {/* ================= DOTS ================= */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1 transition-all duration-300"
            style={{
              width: i === current ? "40px" : "20px",
              backgroundColor:
                i === current ? "#D4AF37" : "rgba(212,175,55,0.3)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
