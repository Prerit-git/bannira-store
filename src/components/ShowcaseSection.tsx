"use client";

import React from "react";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Short Kurti",
    image: "/assets/Products/product-4.jpg",
    href: "/",
  },
  {
    id: 2,
    name: "Printed Kurti",
    image: "/assets/Products/product-5.jpg",
    href: "/",
  },
  {
    id: 3,
    name: "Maxi Dresses",
    image: "/assets/Products/product-6.jpg",
    href: "/",
  },
  {
    id: 4,
    name: "Office Wear",
    image: "/assets/Products/product-8.jpg",
    href: "/",
  },
];

const ShowcaseSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-serif font-semibold text-[#7B2D0A] text-center mb-5">
          Bannira Signature Styles
        </h2>
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-20 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
          <div className="w-2 h-2 rotate-45 border border-[#D4AF37]" />
          <div className="h-px w-20 bg-linear-to-l from-transparent via-[#D4AF37] to-transparent" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
          {categories.map(({ id, name, image, href }) => (
            <Link
              key={id}
              href={href}
              className="group relative block border-4 border-[#D4AF37] overflow-hidden rounded-md cursor-pointer"
            >
              <img
                src={image}
                alt={name}
                className="w-full h-60 md:h-100 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/25 flex flex-col justify-end p-2 md:p-6">
                <h3 className="text-white text-2xl font-semibold uppercase tracking-wide mb-3">
                  {name}
                </h3>
                <span className="inline-block border border-white text-white text-sm uppercase px-4 py-2 tracking-widest transition-all duration-300 group-hover:bg-white text-center group-hover:text-[#7B2D0A]">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
