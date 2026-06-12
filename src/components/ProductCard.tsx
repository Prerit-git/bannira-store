"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, ShoppingBag, X, Check, ArrowRight, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import SizeSelectionModal from "./SizeSelectionModal";

interface ProductCardProps {
  product: any;
  onAddToCartSuccess?: () => void;
}

const getOptimizedUrl = (url: string) => {
  if (!url || !url.includes("cloudinary.com")) return url || "/placeholder.jpg";
  return url.replace("/upload/", "/upload/q_auto,f_auto,w_800/");
};

const ProductCard = ({ product, onAddToCartSuccess }: ProductCardProps) => {
  const { id, _id, name, slug, category, price, originalPrice, images, badge, sizes, quantity, inStock, sizeVariants } = product;
  const productId = id || _id;
  const productSlug = slug;

  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, setRedirectPath } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, cart } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const isLowStock = inStock && quantity > 0 && quantity <= 5;
  const isOutOfStock = !inStock || quantity === 0;
  const active = isLoggedIn ? isInWishlist(productId) : false;
  
  const currentCartItems = isLoggedIn ? cart.filter((item) => item.id === productId) : [];
  const isAlreadyInCart = currentCartItems.length > 0;
  
  // Extract explicit sizes already added to format inside the primary button label
  const addedSizesString = currentCartItems.map(item => item.size).join(", ");

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isWishlistPage = pathname === "/wishlist";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      setRedirectPath(window.location.pathname);
      router.push("/login");
      return;
    }
    if (active) {
      setShowRemoveConfirm(true);
    } else {
      toggleWishlist(product);
    }
  };

  const confirmRemove = () => {
    toggleWishlist(product);
    setShowRemoveConfirm(false);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      setRedirectPath(window.location.pathname);
      router.push("/login");
      return;
    }
    if (!isOutOfStock) {
      setShowModal(true);
    }
  };

  const handleAddAnotherSizeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const onConfirmSize = (size: string) => {
    addToCart(product, size);
    setShowModal(false);
    if (!isWishlistPage) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    if (onAddToCartSuccess) {
      onAddToCartSuccess();
    }
  };

  useEffect(() => {
    if (!hovered || !images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [hovered, images]);

  return (
    <>
      <div
        className="group relative overflow-hidden transition-all duration-500 bg-white border border-gray-100 rounded-2xl hover:shadow-xl"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setCurrentIndex(0);
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F9F9]">
          <Link href={`/products/${productSlug}`} className="block h-full relative">
            <Image
              src={getOptimizedUrl(images && images.length > 0 ? images[currentIndex] : "")}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
          </Link>

          {badge && <span className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] tracking-widest px-2 py-1 rounded-full uppercase">{badge}</span>}
          {discount > 0 && <span className="absolute top-3 right-3 z-10 bg-[#D4AF37] text-black text-[9px] font-bold px-2 py-1 rounded-full shadow-sm">{discount}% OFF</span>}

          {isLowStock && (
            <div className="absolute bottom-3 left-3 z-10 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-[#7B2D0A]/20 shadow-sm">
              <p className="text-[9px] tracking-widest uppercase text-[#7B2D0A] font-bold font-poppins">Only {quantity} left</p>
            </div>
          )}

          <button
            onClick={handleWishlist}
            className={`absolute bottom-4 right-4 z-20 p-3 rounded-full shadow-lg transition-all active:scale-90 cursor-pointer
              ${active ? "bg-red-500 text-white" : "bg-white/80 text-gray-900 hover:bg-white"}`}
          >
            <Heart size={18} fill={active ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="p-3 md:p-5 flex flex-col min-h-[180px]">
          <p className="text-[9px] tracking-[0.2em] uppercase text-stone-400 font-bold mb-1 font-poppins">{category}</p>
          <Link href={`/products/${productSlug}`}>
            <h3 className="text-sm font-serif text-[#1A1A1A] mb-2 group-hover:text-[#7B2D0A] transition-colors line-clamp-2">{name}</h3>
          </Link>

          <div className="flex items-center gap-2 mb-4 font-poppins">
            <span className="text-lg font-bold text-[#1A1A1A]">₹{price.toLocaleString("en-IN")}</span>
            {originalPrice && <span className="text-xs text-stone-300 line-through">₹{originalPrice.toLocaleString("en-IN")}</span>}
          </div>

          <div className="w-full mt-auto">
            {isOutOfStock ? (
              <button
                disabled
                className="w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : isAlreadyInCart ? (
              <div className="flex gap-2 w-full">
                {/* Primary split redirecting to cart detailing sizing metadata */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push("/cart");
                  }}
                  className="flex-1 py-2 md:py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-stone-200 bg-stone-50 text-stone-600 flex items-center justify-center gap-1.5 hover:bg-stone-100 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1 font-semibold italic text-stone-500">
                    <Check size={12} className="text-green-600 hidden md:block" /> Added <br className="block md:hidden"/> ({addedSizesString})
                  </span>
                </button>
                
                {/* Secondary incremental action button triggering modal setup directly */}
                <button
                  onClick={handleAddAnotherSizeClick}
                  title="Add another size"
                  className="px-4 bg-[#7B2D0A] text-white hover:bg-black rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md shadow-black/5"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCartClick}
                className="w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-[#7B2D0A] text-white hover:bg-[#000000] active:scale-95 shadow-lg shadow-black/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoggedIn ? <><ShoppingBag size={14} /> Add to Bag</> : "Shop Now"}
              </button>
            )}
          </div>
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {showRemoveConfirm && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowRemoveConfirm(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-serif text-stone-900 mb-2">Remove from Wishlist?</h3>
                <p className="text-sm text-stone-500 mb-8 leading-relaxed">Are you sure you want to remove <span className="font-bold text-stone-800">{name}</span> from your favorites?</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={confirmRemove}
                    className="w-full py-4 bg-[#7B2D0A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Yes, Remove
                  </button>
                  <button
                    onClick={() => setShowRemoveConfirm(false)}
                    className="w-full py-4 bg-stone-100 text-stone-600 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                  >
                    No, Keep it
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {mounted && !isWishlistPage && createPortal(
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="fixed bottom-10 right-6 md:right-10 z-[9999] w-[90%] max-w-[400px]"
            >
              <div className="bg-white/95 backdrop-blur-2xl border border-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2.5rem] p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-2.5 rounded-full">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="font-poppins">
                    <p className="text-[11px] font-black uppercase tracking-tight text-stone-900 leading-none mb-1">Added to Bag</p>
                    <p className="text-[10px] text-stone-500 font-medium">{name}</p>
                  </div>
                </div>
                <Link 
                  href="/cart" 
                  className="bg-black text-white px-6 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#7B2D0A] transition-all flex items-center gap-2 shadow-xl shadow-black/20"
                >
                  View <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* 🔥 FIXED: Filter sizes dynamically to pass only sizes with valid stock count to modal */}
      <SizeSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={onConfirmSize}
        productName={name}
        sizeVariants={sizeVariants}
        availableSizes={(sizes || []).filter((size: string) => {
          const currentStock = sizeVariants instanceof Map
            ? sizeVariants.get(size) || 0
            : (sizeVariants?.[size] || 0);
          return currentStock > 0;
        })}
      />
    </>
  );
};

export default ProductCard;