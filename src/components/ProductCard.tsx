"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const {
    id,
    name,
    category,
    price,
    originalPrice,
    image,
    images = [image],
    badge,
  } = product;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  
  const isOutOfStock = !product.inStock || product.quantity === 0;
  const isLowStock = product.inStock && product.quantity > 0 && product.quantity <= 5;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Auto carousel on hover
  useEffect(() => {
    if (!hovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [hovered, images.length]);

  const productPath = `/products/${id}`;

  return (
    <div
      className="group relative overflow-hidden backdrop-blur-md transition-all duration-500 hover:shadow-md bg-white border border-gray-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCurrentIndex(0);
      }}
    >
      {/* 1. WRAP ENTIRE TOP (IMAGE) IN LINK */}
      <Link href={productPath} className="relative block aspect-[3/4] overflow-hidden">
        {/* Desktop Carousel */}
        <div className="hidden md:block h-full">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
                ${index === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
            />
          ))}
        </div>

        {/* Mobile Single Image */}
        <div className="block md:hidden h-full">
          <img src={images[0]} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Overlays & Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {badge && (
          <span className="absolute top-3 left-3 z-10 bg-[#7B2D0A]/90 backdrop-blur px-3 py-1 text-[10px] tracking-widest text-[#D4AF37] border border-[#D4AF37]/40 rounded-sm">
            {badge}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute top-3 right-3 z-10 bg-[#D4AF37] text-[#7B2D0A] text-[10px] font-bold px-2 py-1 rounded-sm shadow">
            {discount}% OFF
          </span>
        )}

        {/* Low Stock Indicator */}
        {isLowStock && (
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1 border border-[#D4AF37]/60 bg-black/50 backdrop-blur-sm">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#D4AF37] font-bold">
              Only {product.quantity} left
            </p>
          </div>
        )}
      </Link>

      {/* 2. CONTENT AREA */}
      <div className="relative py-5 px-3 h-48 flex flex-col">
        {/* <div className="h-px w-full bg-linear-to-r from-transparent via-[#D4AF37]/60 to-transparent mb-1" /> */}

        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold mb-1">
              {category}
            </p>
            {/* WRAP NAME IN LINK */}
            <Link href={productPath}>
              <h3 className="text-sm md:text-md font-serif text-[#2A2A2A] leading-snug mb-2 transition duration-300 group-hover:text-[#7B2D0A] line-clamp-2 min-h-[2.5rem]">
                {name}
              </h3>
            </Link>
          </div>

          {/* WISHLIST ICON - Always visible and functional */}
          <button 
            onClick={(e) => {
              e.preventDefault(); // Stop page redirect
              e.stopPropagation(); // Stop parent click events
              console.log("Wishlist toggled for:", name);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors duration-300"
          >
            <Heart size={20} className="transition-transform active:scale-125" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-[#7B2D0A]">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* 3. CTA BUTTON - Also links to Details */}
        <Link href={productPath} className="mt-auto">
          <button
            disabled={isOutOfStock}
            className={`w-full py-3 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer
              ${isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#7B2D0A] text-[#F3E1B6] hover:bg-[#D4AF37] hover:text-[#7B2D0A]"
              }`}
          >
            {isOutOfStock ? "Sold Out" : "Shop Now"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;