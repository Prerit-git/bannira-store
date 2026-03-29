"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion"; // Added for smoother content transitions
import { useRouter } from "next/navigation"; // Added for redirection
import "swiper/css";
import "swiper/css/effect-fade";

import { Autoplay, EffectFade } from "swiper/modules";

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  offer: string;
  link: string; // Added link for redirection
};

const slides: Slide[] = [
  {
    id: 1,
    image: "/assets/Breaker_slider/breaker_image1.webp",
    title: "Bannira",
    subtitle: "Discover the Elegance of Tradition",
    offer: "Flat 60% OFF - Festive Collection",
    link: "/products",
  },
  {
    id: 2,
    image: "/assets/Breaker_slider/breaker_image2.webp",
    title: "Bannira",
    subtitle: "Unveil Your Style this Season",
    offer: "Limited Time Offer - New Arrivals",
    link: "/products",
  },
];

const PageBreakerSlider: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        speed={1500}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="h-full"
      >
        {slides.map(({ id, image, title, subtitle, offer, link }) => (
          <SwiperSlide key={id}>
            {/* Clickable Image Container */}
            <div 
              className="relative w-full h-full cursor-pointer group"
              onClick={() => handleNavigate(link)}
            >
              {/* Background Image with subtle zoom on hover */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={image}
                  alt={`${title} banner`}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
              </div>

              {/* Dark Overlay - Adjusted to match your Royal theme */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>

              {/* Content Wrapper */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 md:px-12 max-w-5xl mx-auto z-10">
                
                {/* Logo with fade-in */}
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  src="/bannira_web_logo.png"
                  alt="Bannira Logo"
                  className="mb-6 w-32 md:w-44 object-contain brightness-0 invert opacity-80"
                  loading="lazy"
                />

                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="italic text-lg md:text-2xl text-[#F3E1B6] mb-6 font-serif"
                >
                  {subtitle}
                </motion.p>

                {/* Offer Heading */}
                <motion.h2 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-4xl md:text-7xl font-extrabold text-[#D4AF37] mb-10 tracking-tight drop-shadow-2xl"
                >
                  {offer}
                </motion.h2>

                {/* CTA Button */}
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents double routing
                    handleNavigate(link);
                  }}
                  className="group relative border border-[#D4AF37] px-10 py-4 uppercase tracking-[0.2em] text-sm font-bold overflow-hidden"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                    Shop the Collection
                  </span>
                  <div className="absolute inset-0 bg-[#D4AF37] translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                </motion.button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PageBreakerSlider;