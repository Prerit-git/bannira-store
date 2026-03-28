"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import Link from "next/link";

const ProductsSection = () => {
  const featured = products.slice(0, 10);

  return (
    <section className="relative py-24 md:py-32 bg-[#ffffff] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(123,45,10,0.1),transparent_70%)]" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#D4AF37] mb-4">
            ✦ Curated Collection ✦
          </p>

          <h2 className="text-4xl md:text-6xl font-semibold text-[#7B2D0A] mb-6 leading-tight">
            Featured Collection
          </h2>

          {/* animated divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
            <div className="w-2 h-2 rotate-45 border border-[#D4AF37]" />
            <div className="h-px w-20 bg-linear-to-l from-transparent via-[#D4AF37] to-transparent" />
          </div>
        </div>
        <div className=" max-w-6xl mx-auto">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={10}
            slidesPerView={2.2}
            navigation
            loop={true}
            autoplay={false}
            speed={600}
            // autoplay={{
            //   delay: 3000,
            //   disableOnInteraction: false,
            //   pauseOnMouseEnter: true,
            // }}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                slidesPerGroup: 2.2,
                spaceBetween: 10,
              },
              1024: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 5 },
              1280: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 5 },
            }}
          >
            {featured.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-16">
          <Link href="/products">
            <button className="px-5 py-2 bg-[#7B2D0A] text-[#F3E1B6] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#7B2D0A] transition">
              View More →
            </button>
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default ProductsSection;
