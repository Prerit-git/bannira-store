"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

import { Autoplay, EffectFade } from "swiper/modules";

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  offer: string;
};

const slides: Slide[] = [
  {
    id: 1,
    image: "/assets/Breaker_slider/breaker_image1.webp",
    title: "Bannira",
    subtitle: "Discover the Elegance of Tradition",
    offer: "Flat 60% OFF - Festive Kurti Collection",
  },
  {
    id: 2,
    image: "/assets/Breaker_slider/breaker_image2.webp",
    title: "Bannira",
    subtitle: "Unveil Your Style this Season",
    offer: "Limited Time Offer - New Arrivals",
  },
];

const PageBreakerSlider: React.FC = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh]">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        speed={1200}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="h-full"
      >
        {slides.map(({ id, image, title, subtitle, offer }) => (
          <SwiperSlide key={id}>
            <div className="relative w-full h-[60vh] md:h-[80vh]">
              {/* Background Image */}
              <img
                src={image}
                alt={`${title} banner`}
                className="w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 md:px-12 max-w-4xl mx-auto">
                {/* Bannira Logo */}
                <img
                  src="/bannira_web_logo.png"
                  alt="Bannira Logo"
                  className="mb-8 w-36 md:w-48 object-contain"
                  loading="lazy"
                />

                <p className="italic text-xl md:text-3xl text-gray-200 mb-10 max-w-xl drop-shadow-md">
                  {subtitle}
                </p>

                <p className="text-5xl md:text-7xl font-extrabold text-[#D4AF37] mb-12 drop-shadow-lg">
                  {offer}
                </p>

                <button className="border border-white px-12 py-5 uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300 hover:tracking-wider text-lg font-semibold drop-shadow-md">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PageBreakerSlider;
