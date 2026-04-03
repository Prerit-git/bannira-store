"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    name: "Short Kurti",
    image: "/assets/Products/product-4.jpg",
    href: "/products?category=Short+Kurti",
  },
  {
    id: 2,
    name: "Printed Kurti",
    image: "/assets/Products/product-5.jpg",
    href: "/products?category=Printed+Kurti",
  },
  {
    id: 3,
    name: "Maxi Dresses",
    image: "/assets/Products/product-6.jpg",
    href: "/products?category=Maxi+Dresses",
  },
  {
    id: 4,
    name: "Office Wear",
    image: "/assets/Products/product-8.jpg",
    href: "/products?category=Office+Wear",
  },
];

const ShowcaseSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF9F6]">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-semibold text-[#2A1A12] mb-5"
          >
            Bannira Signature Styles
          </motion.h2>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37] bg-white" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent" />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {categories.map(({ id, name, image, href }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-[#2A1A12] border border-[#D4AF37]/20"
              >
                {/* Background Image */}
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-700 scale-105 group-hover:scale-110 group-hover:opacity-80"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#2A1A12] via-transparent to-transparent opacity-80" />

                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
                  <h3 className="text-white text-xl md:text-2xl font-serif mb-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                    {name}
                  </h3>
                  
                  <div className="overflow-hidden">
                    <span className="inline-block border-b border-[#D4AF37] text-[#F3E1B6] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] pb-1 transform translate-y-8 transition-transform duration-500 group-hover:translate-y-0">
                      Explore Style
                    </span>
                  </div>
                </div>

                <div className="absolute inset-3 border border-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;