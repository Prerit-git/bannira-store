"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";

type Slide = {
  imageUrl?: string;
  desktopImage?: string;
  mobileImage?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  discount?: string;
  cta?: string;
  showContent?: boolean;
  overlay?: boolean;
  link: string;
};

export default function HeroSection() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const result = await res.json();
        
        if (result.success && result.data?.heroBanners?.length > 0) {
          const mappedSlides: Slide[] = result.data.heroBanners.map((b: any) => ({
            desktopImage: b.imageUrl,
            mobileImage: b.mobileImageUrl || b.imageUrl, 
            subtitle: b.subtitle || "",
            title: b.title || "",
            description: b.subtitle || "",
            cta: "Shop Now",
            link: b.ctaLink || "/products",
            showContent: true,
            overlay: true,
          }));
          setSlides(mappedSlides);
        } else {
          // Fallback static data
          setSlides([
            {
              desktopImage: "/assets/hero-slide-3.jpg",
              mobileImage: "/assets/hero-slide-3.jpg",
              subtitle: "New Arrivals",
              title: "Designer Kurtis",
              description: "Mirror work & embroidered kurti sets with palazzos — effortless fusion dressing for every occasion.",
              discount: "STARTING ₹1,499",
              cta: "Shop Now",
              overlay: true,
              link: "/products",
            },
            {
              desktopImage: "/assets/hero-slide-1.webp",
              mobileImage: "https://www.biba.in/dw/image/v2/BKQK_PRD/on/demandware.static/-/Library-Sites-BibaSharedLibrary/en_IN/dw79d1f9b7/A-A-SS26/SS26-Edit-M.jpg",
              cta: "Shop Now",
              overlay: false,
              link: "/products",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load hero banner data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <section className="relative h-screen w-full bg-[#1A1A18] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center h-24 w-24">
          <div className="absolute animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-[#D4AF37]"></div>
          <div className="absolute rounded-full h-12 w-12 bg-[#2A1A12] opacity-60"></div>
          <span className="absolute text-[8px] font-bold tracking-[0.2em] text-[#F3E1B6] uppercase">
            Bannira
          </span>
        </div>
        <p className="mt-4 text-[8px] text-[#8C7A6B] tracking-[0.3em] uppercase">
          Preparing your style...
        </p>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black hero-swiper-wrapper">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        speed={1200}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        allowTouchMove={true}
        slidesPerView={1}
        spaceBetween={0}
        navigation={{
          nextEl: ".next-hero",
          prevEl: ".prev-hero",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination-custom",
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="relative w-full h-full cursor-pointer"
              onClick={() => router.push(slide.link)}
            >
              <picture>
                {slide.mobileImage && <source media="(max-width: 768px)" srcSet={slide.mobileImage} />}
                {slide.desktopImage && <source media="(min-width: 769px)" srcSet={slide.desktopImage} />}
                <img
                  src={slide.desktopImage || slide.mobileImage || ""}
                  className="h-full w-full object-cover"
                  alt={slide.title || "Banner"}
                />
              </picture>

              {/* {slide.overlay !== false && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to right, hsla(20,38%,12%,0.8), hsla(20,38%,12%,0.2))",
                  }}
                />
              )} */}

              {slide.showContent !== false && (
                <div className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none">
                  <div className="max-w-2xl pointer-events-auto">
                    {slide.discount && (
                      <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-4"
                      >
                        <span className="text-[10px] md:text-xs tracking-[0.3em] border px-4 py-1 text-[#D4AF37] border-[#D4AF37] bg-black/40 backdrop-blur-sm">
                          {slide.discount}
                        </span>
                      </motion.div>
                    )}

                    {slide.subtitle && (
                      <motion.p 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#F3E1B6] mb-3"
                      >
                        {slide.subtitle}
                      </motion.p>
                    )}

                    {slide.title && (
                      <motion.h1 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-4xl md:text-8xl font-bold text-[#F3E1B6] mb-4 font-serif leading-tight"
                      >
                        {slide.title}
                      </motion.h1>
                    )}

                    {slide.description && (
                      <motion.p 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xs md:text-base text-[#F3E1B6]/80 mb-8 max-w-md mx-auto leading-relaxed hidden md:block"
                      >
                        {slide.description}
                      </motion.p>
                    )}

                    {/* Button tabhi render hoga jab title / desc kuch exist karta ho */}
                    {slide.title && slide.cta && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(slide.link);
                        }}
                        className="px-8 py-3 border border-[#D4AF37] text-[#F3E1B6] bg-black/10 backdrop-blur-sm tracking-widest uppercase text-[10px] font-bold"
                      >
                        {slide.cta}
                      </motion.button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="prev-hero absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-black shadow-2xl hover:bg-[#D4AF37] hover:text-white transition-all duration-300 active:scale-90">
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>

      <button className="next-hero absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-black shadow-2xl hover:bg-[#D4AF37] hover:text-white transition-all duration-300 active:scale-90">
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      <div className="swiper-pagination-custom absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"></div>

      <style jsx global>{`
        .hero-swiper-wrapper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: white !important;
          opacity: 0.4;
          border-radius: 999px;
          transition: all 0.5s ease;
        }
        .hero-swiper-wrapper .swiper-pagination-bullet-active {
          width: 35px;
          background: #D4AF37 !important;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}