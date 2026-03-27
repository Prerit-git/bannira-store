"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const {
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
  const isLowStock =
    product.inStock && product.quantity > 0 && product.quantity <= 5;

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

  return (
    <div
      className="group relative overflow-hidden backdrop-blur-md transition-all duration-500 hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCurrentIndex(0);
      }}
    >
      {/* Image */}
      <Link href="">
        <div
          className="relative aspect-[3/4] overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setCurrentIndex(0);
          }}
        >
          {/* Desktop Carousel */}
          <div className="hidden md:block">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
${index === currentIndex ? "opacity-100" : "opacity-0"}
`}
              />
            ))}
          </div>

          {/* Mobile Single Image */}
          <div className="block md:hidden">
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover"
            />
            {isLowStock && (
              <div className="block md:hidden absolute bottom-0 left-0  px-4 py-1 border border-[#D4AF37]/60 bg-black/50 backdrop-blur-sm">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]">
                  Only {product.quantity} left
                </p>
              </div>
            )}
          </div>

          {/* Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

          <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
            <button className="flex items-center gap-2 bg-[#F3E1B6] text-[#7B2D0A] px-4 py-2 text-xs tracking-widest uppercase rounded-md shadow-lg hover:bg-[#D4AF37] transition">
              <Heart size={16} />
              Add to Wishlist
            </button>
            {isLowStock && (
              <div className="absolute bottom-2 right-0 -translate-1/2 px-4 py-1 border border-[#D4AF37]/60 bg-black/40 backdrop-blur-sm">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]">
                  Only {product.quantity} left
                </p>
              </div>
            )}
          </div>

          <button className="md:hidden absolute bottom-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-md active:scale-90 transition">
            <Heart size={18} className="text-[#7B2D0A]" />
          </button>

          {badge && (
            <span className="absolute top-3 left-3 bg-[#7B2D0A]/90 backdrop-blur px-3 py-1 text-[10px] tracking-widest text-[#D4AF37] border border-[#D4AF37]/40 rounded-sm">
              {badge}
            </span>
          )}

          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-[#D4AF37] text-[#7B2D0A] text-[10px] font-bold px-2 py-1 rounded-sm shadow">
              {discount}% OFF
            </span>
          )}

          {images.length > 1 && (
            <div className="hidden md:flex absolute bottom-3 w-full justify-center gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    i === currentIndex ? "bg-[#D4AF37] w-3" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="relative py-5 px-2 h-45">
        <div className="h-px w-full bg-linear-to-r from-transparent via-[#D4AF37]/60 to-transparent mb-2 relative overflow-hidden" />

        <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]/90 mb-1">
          {category}
        </p>

        <Link href="">
          <h3 className="text-sm md:text-md font-semibold text-[#2A2A2A] leading-snug mb-2 transition duration-300 group-hover:text-[#7B2D0A] line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-[#7B2D0A]">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          disabled={isOutOfStock}
          className={`absolute bottom-0 left-0 w-full py-3 text-[11px] tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer
  ${
    isOutOfStock
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-[#7B2D0A] text-[#F3E1B6] hover:bg-[#D4AF37] hover:text-[#7B2D0A]"
  }`}
        >
          {isOutOfStock ? "Sold Out" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
