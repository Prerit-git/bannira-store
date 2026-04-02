"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ChevronLeft,
  ShoppingBag,
  Heart,
  Plus,
  Shirt,
  Droplets,
  ArrowRight,
  CheckCircle2,
  Check,
  AlertCircle,
} from "lucide-react";
import { products, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SizeSelectionModal from "@/components/SizeSelectionModal";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isLoggedIn, setRedirectPath } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const allSizes = ["S", "M", "L", "XL", "XXL"];

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [400, 500], [0, 1]);
  const headerY = useTransform(scrollY, [400, 500], [-20, 0]);

  useEffect(() => {
    const found = products.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setSelectedImage(0);
    }
  }, [id]);

  // Stock & Cart Logic
  const isOutOfStock = product ? (!product.inStock || product.quantity === 0) : false;
  const cartItem = cart.find((item) => item.id === id);
  const isAlreadyInCart = !!cartItem;
  const sizeInCart = cartItem?.size || "";
  const active = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (isOutOfStock || isAlreadyInCart) return;

    if (!isLoggedIn) {
      setRedirectPath(window.location.pathname);
      router.push("/login");
      return;
    }

    if (selectedSize) {
      confirmAddToCart(selectedSize);
    } else {
      setShowModal(true);
    }
  };

  const confirmAddToCart = (size: string) => {
    if (product) {
      addToCart(product, size);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
      setShowModal(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      setRedirectPath(window.location.pathname);
      router.push("/login");
      return;
    }
    if (product) toggleWishlist(product);
  };

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 5);
  }, [product]);

  if (!product) return null;

  const images = product.images || [product.image];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 md:pt-40 pb-32 md:pb-20 selection:bg-[#7B2D0A] selection:text-white">
      
      {/* MOBILE STICKY MINI HEADER */}
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="fixed top-20 inset-x-0 z-[60] bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:hidden flex items-center justify-between"
      >
        <div className="flex flex-col min-w-0 flex-1 mr-4">
          <span className="text-[10px] font-bold text-[#7B2D0A] uppercase tracking-tighter truncate">{product.name}</span>
          <span className="text-sm font-bold text-[#2A1A12]">₹{product.price.toLocaleString()}</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAlreadyInCart}
          className={`${isOutOfStock ? "bg-gray-100 text-gray-400" : isAlreadyInCart ? "bg-stone-200 text-stone-500" : "bg-[#7B2D0A] text-white"} px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 shadow-lg`}
        >
          {isOutOfStock ? "Out of Stock" : isAlreadyInCart ? "Already in bag" : "Add to bag"}
        </button>
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-0 md:px-8">
        <div className="px-4 md:px-0">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#7B2D0A] hover:text-[#D4AF37] mb-6 transition-colors">
            <ChevronLeft size={14} /> Back to Collection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 xl:gap-16 items-start">
          {/* LEFT: IMAGE GALLERY remains same */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="hidden md:flex md:flex-col gap-3 overflow-y-auto no-scrollbar max-h-[700px]">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`relative flex-shrink-0 w-24 aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-[#7B2D0A]" : "border-transparent opacity-60"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative w-full md:flex-1 aspect-[4/5] md:aspect-[3/4] bg-white overflow-hidden md:rounded-sm shadow-sm">
              <div className="hidden md:block h-full">
                <AnimatePresence mode="wait">
                  <motion.img key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-5 px-4 md:px-0 lg:sticky lg:top-28">
            <div className="bg-white p-6 md:p-8 md:border md:border-[#D4AF37]/20 md:shadow-xl md:shadow-[#7B2D0A]/5 space-y-6 md:space-y-8 rounded-2xl md:rounded-sm">
              <section>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-2">{product.category}</p>
                <h1 className="text-2xl md:text-4xl font-serif text-[#2A1A12] leading-tight mb-3">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[#7B2D0A]">₹{product.price.toLocaleString()}</span>
                </div>
              </section>

              {/* SIZE SELECTION - Disabled if Out of Stock */}
              <section className={isOutOfStock ? "opacity-50 pointer-events-none" : ""}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {isAlreadyInCart ? "Selected Fit" : isOutOfStock ? "Sizes Unavailable" : "Select Fit"}
                  </span>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {allSizes.map((size) => {
                    const isAvailable = product.sizes.includes(size);
                    const isInBag = isAlreadyInCart && sizeInCart === size;
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable || isAlreadyInCart || isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`relative min-w-[56px] h-14 flex items-center justify-center text-sm font-bold transition-all border-2 rounded-xl 
                        ${!isAvailable ? "opacity-20 cursor-not-allowed border-gray-100" : ""}
                        ${isAlreadyInCart ? (isInBag ? "bg-[#7B2D0A] border-[#7B2D0A] text-white" : "border-gray-50 text-gray-300 opacity-50") : ""}
                        ${!isAlreadyInCart && selectedSize === size ? "bg-[#7B2D0A] border-[#7B2D0A] text-white shadow-lg" : ""}
                        ${!isAlreadyInCart && isAvailable && selectedSize !== size ? "border-gray-100 text-gray-400 bg-gray-50/50 hover:border-[#7B2D0A]/30" : ""}
                        `}
                      >
                        {isInBag && <Check size={14} className="absolute -top-1 -right-1 bg-white text-[#7B2D0A] rounded-full p-0.5 shadow-sm border border-[#7B2D0A]" />}
                        {size}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ACTIONS */}
              <section className="hidden md:flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAlreadyInCart}
                  className={`w-full py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95
                  ${isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" : isAlreadyInCart ? "bg-stone-100 text-stone-400 cursor-not-allowed" : "bg-[#7B2D0A] text-[#F3E1B6] hover:bg-[#D4AF37] hover:text-[#7B2D0A]"}
                  `}
                >
                  {isOutOfStock ? (
                    <><AlertCircle size={18} /> Out of Stock</>
                  ) : isAlreadyInCart ? (
                    <><CheckCircle2 size={18} /> Already in Bag</>
                  ) : (
                    <><ShoppingBag size={18} /> Add To Bag</>
                  )}
                </button>
                <button onClick={handleWishlistToggle} className={`w-full border py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all ${active ? "bg-red-50 border-red-200 text-red-500" : "border-[#7B2D0A] text-[#7B2D0A]"}`}>
                  <Heart size={18} fill={active ? "currentColor" : "none"} /> 
                  {active ? "In Wishlist" : "Wishlist"}
                </button>
              </section>

              {/* Rest of UI... */}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FOOTER ACTIONS */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 md:hidden">
        <div className="flex gap-4">
          <button onClick={handleWishlistToggle} className={`p-4 border rounded-2xl transition-all ${active ? "bg-red-50 border-red-100 text-red-500" : "border-gray-200 text-gray-400"}`}>
            <Heart size={20} fill={active ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAlreadyInCart}
            className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3 
            ${isOutOfStock ? "bg-gray-100 text-gray-400" : isAlreadyInCart ? "bg-stone-100 text-stone-400" : "bg-[#7B2D0A] text-[#F3E1B6]"}
            `}
          >
            {isOutOfStock ? "Out of Stock" : isAlreadyInCart ? <><CheckCircle2 size={16} /> Added</> : <><ShoppingBag size={18} /> Add To Bag</>}
          </button>
        </div>
      </div>

      <SizeSelectionModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={confirmAddToCart} productName={product.name} availableSizes={product.sizes} />
    </div>
  );
}