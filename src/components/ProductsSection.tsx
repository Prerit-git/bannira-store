"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

const categories = [
  "All",
  ...Array.from(new Set(products.map((p) => p.category))),
];

const ProductsSection = () => {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section className="relative py-24 md:py-32 bg-[#ffffff] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(123,45,10,0.1),transparent_70%)]" />

      {/* subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/pattern.svg')]" />

      <div className="container mx-auto px-4 relative z-10">
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

        {/* <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileTap={{ scale: 0.95 }}
              className={`relative px-6 py-2 text-xs tracking-[0.25em] uppercase rounded-full border transition-all duration-500 backdrop-blur-md
              ${
                active === cat
                  ? "bg-[#D4AF37] text-[#7B2D0A] border-[#D4AF37] shadow-lg"
                  : "border-[#D4AF37]/30 text-[#7B2D0A] hover:border-[#D4AF37]"
              }`}
            >
              {cat}

              {active === cat && (
                <motion.div
                  layoutId="filterGlow"
                  className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-md -z-10"
                />
              )}
            </motion.button>
          ))}
        </div> */}

        <motion.div
          layout
          className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {/* <AnimatePresence mode="wait"> */}
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
          {/* </AnimatePresence> */}
        </motion.div>

        {/* 💎 Premium CTA */}
        <div className="text-center mt-10 md:mt-20">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center gap-3 px-6 md:px-8 py-4 text-sm tracking-[0.3em] uppercase bg-[#7B2D0A] text-[#F3E1B6] rounded-md overflow-hidden transition-all duration-500 hover:bg-[#D4AF37] hover:text-[#7B2D0A]"
          >
            View More →{/* shine effect */}
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent translate-x-full hover:translate-x-full transition duration-700" />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
