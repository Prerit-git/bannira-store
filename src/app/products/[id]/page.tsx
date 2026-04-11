"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ChevronLeft,
  ShoppingBag,
  Heart,
  ArrowRight,
  CheckCircle2,
  Check,
  AlertCircle,
  Settings2,
} from "lucide-react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SizeSelectionModal from "@/components/SizeSelectionModal";
import { createPortal } from "react-dom";
import { useProducts } from "@/context/ProductContext";
import ProductSkeleton from "@/components/ProductSkeleton";

const getOptimizedUrl = (url: string) => {
  if (!url || !url.includes("cloudinary.com")) return url || "/placeholder.jpg";
  return url.replace("/upload/", "/upload/q_auto,f_auto,w_1000/");
};

export default function ProductDetails() {
  const { allProducts, isLoading } = useProducts();
  const { id } = useParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { addToCart, cart, removeFromCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isLoggedIn, setRedirectPath } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRemoveWishlistModal, setShowRemoveWishlistModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Added to Bag");
  const [mounted, setMounted] = useState(false);

  const allSizes = ["S", "M", "L", "XL", "XXL"];

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [400, 500], [0, 1]);
  const headerY = useTransform(scrollY, [400, 500], [-20, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = useMemo(() => {
    // return allProducts.find((p) => (p.id || p._id) === id);
    return allProducts.find((p: any) => p.slug === id);
  }, [id, allProducts]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(
        (p) =>
          p.category === product.category &&
          // (p.id || p._id) !== (product.id || product._id),
          p.slug !== product.slug,
      )
      .slice(0, 5);
  }, [product, allProducts]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(
      scrollRef.current.scrollLeft / scrollRef.current.offsetWidth,
    );
    if (index !== selectedImage) setSelectedImage(index);
  };

  const scrollToImage = (index: number) => {
    setSelectedImage(index);
    scrollRef.current?.scrollTo({
      left: index * scrollRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-serif">Product Not Found</h2>
        <Link
          href="/products"
          className="text-[#7B2D0A] font-bold uppercase tracking-widest text-xs underline"
        >
          Back to Collection
        </Link>
      </div>
    );
  }

  // Yahan ID handling fix ki gayi hai
  const productId = (product.id || product._id || product.slug) as string;
  const isOutOfStock = !product.inStock || product.quantity === 0;
  
  const cartItem = isLoggedIn
    ? cart.find((item) => item.id === productId)
    : null;
    
  const isAlreadyInCart = !!cartItem;
  const sizeInCart = cartItem?.size || "";
  
  // TypeScript Error Fixed: Force cast to string
  const active = isLoggedIn && isInWishlist(productId);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!isLoggedIn) {
      setRedirectPath(window.location.pathname);
      router.push("/login");
      return;
    }
    if (isAlreadyInCart || !selectedSize) {
      setShowModal(true);
    } else {
      confirmAddToCart(selectedSize);
    }
  };

  const confirmAddToCart = (size: string) => {
    const isUpdating = isAlreadyInCart;
    if (isUpdating && cartItem) removeFromCart(cartItem.id, cartItem.size);
    addToCart(product, size);
    setSuccessMessage(isUpdating ? "Bag Updated" : "Added to Bag");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setShowModal(false);
    setSelectedSize("");
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      setRedirectPath(window.location.pathname);
      router.push("/login");
      return;
    }
    active ? setShowRemoveWishlistModal(true) : toggleWishlist(product);
  };

  const confirmRemoveWishlist = () => {
    if (product) {
      toggleWishlist(product);
      setShowRemoveWishlistModal(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-21 md:pt-40 pb-32 md:pb-20">
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="fixed top-30 inset-x-0 z-[60] bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:hidden flex items-center justify-between"
      >
        <div className="flex flex-col min-w-0 flex-1 mr-4">
          <span className="text-[10px] font-bold text-[#7B2D0A] uppercase tracking-tighter truncate">
            {product.name}
          </span>
          <span className="text-sm font-bold text-[#2A1A12]">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`${isOutOfStock ? "bg-gray-100 text-gray-400" : isAlreadyInCart ? "bg-black text-white" : "bg-[#7B2D0A] text-white"} px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 shadow-lg`}
        >
          {isOutOfStock
            ? "Sold Out"
            : isAlreadyInCart
              ? "Change Size"
              : "Add to bag"}
        </button>
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-0 md:px-8">
        <button
          onClick={() => router.back()}
          className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#7B2D0A] hover:text-[#D4AF37] mb-6 px-4 md:px-0 transition-colors"
        >
          <ChevronLeft size={14} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 xl:gap-16 items-start">
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-y-auto no-scrollbar max-h-[700px] px-4 md:px-0">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => scrollToImage(idx)}
                  className={`relative flex-shrink-0 w-24 aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-[#7B2D0A]" : "border-transparent opacity-60"}`}
                >
                  <Image
                    src={getOptimizedUrl(img)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="relative w-full md:flex-1 aspect-[4/5] md:aspect-[3/4] bg-white overflow-hidden md:rounded-sm shadow-sm">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar md:hidden"
              >
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="min-w-full h-full snap-center relative"
                  >
                    <Image
                      src={getOptimizedUrl(img)}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="hidden md:block h-full relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full w-full"
                  >
                    <Image
                      src={getOptimizedUrl(images[selectedImage])}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 px-4 md:px-0 lg:sticky lg:top-28">
            <div className="bg-white p-6 md:p-8 md:border md:border-[#D4AF37]/20 md:shadow-xl space-y-6 md:space-y-8 rounded-2xl md:rounded-sm">
              <section>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-2">
                  {product.category}
                </p>
                <h1 className="text-2xl md:text-4xl font-serif text-[#2A1A12] leading-tight mb-3">
                  {product.name}
                </h1>
                <span className="text-3xl font-bold text-[#7B2D0A]">
                  ₹{product.price.toLocaleString()}
                </span>
              </section>

              <section
                className={isOutOfStock ? "opacity-50 pointer-events-none" : ""}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">
                  {isAlreadyInCart ? "Selected Size" : "Select Fit"}
                </span>
                <div className="flex gap-3 flex-wrap">
                  {allSizes.map((size) => {
                    const isAvailable = product.sizes?.includes(size);
                    const isInBag = isAlreadyInCart && sizeInCart === size;
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable || isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`relative min-w-[56px] h-14 flex items-center justify-center text-sm font-bold transition-all border-2 rounded-xl ${!isAvailable ? "opacity-20 cursor-not-allowed border-gray-100" : ""} ${isInBag ? "bg-[#7B2D0A] border-[#7B2D0A] text-black cursor-not-allowed" : ""} ${!isInBag && selectedSize === size ? "bg-black border-black text-white" : "border-gray-100 text-gray-400 bg-gray-50/50"}`}
                      >
                        {isInBag && (
                          <Check
                            size={12}
                            className="absolute -top-1 -right-1 bg-white text-[#7B2D0A] rounded-full p-0.5 border border-[#7B2D0A]"
                          />
                        )}
                        {size}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="hidden md:flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all ${isOutOfStock ? "bg-gray-100 text-gray-400" : isAlreadyInCart ? "bg-black text-white hover:bg-[#7B2D0A]" : "bg-[#7B2D0A] text-[#F3E1B6] hover:bg-black"}`}
                >
                  {isOutOfStock ? (
                    <>
                      <AlertCircle size={18} /> Out of Stock
                    </>
                  ) : isAlreadyInCart ? (
                    <>
                      <Settings2 size={18} /> Change Fit / Size
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add To Bag
                    </>
                  )}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-full border py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all ${active ? "bg-red-50 border-red-200 text-red-500" : "border-[#7B2D0A] text-[#7B2D0A]"}`}
                >
                  <Heart size={18} fill={active ? "currentColor" : "none"} />{" "}
                  {active ? "In Wishlist" : "Wishlist"}
                </button>
              </section>
            </div>
          </div>
        </div>

        <section className="px-4 md:px-0 mt-20 md:mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2">
                Curated for you
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-[#2A1A12] italic">
                Similar Items
              </h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-black"
            >
              Explore Collection{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
            <AnimatePresence>
              {similarProducts.map((item, idx) => (
                <motion.div
                  key={(item.id || item._id) as string}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 md:hidden">
        <div className="flex gap-4">
          <button
            onClick={handleWishlistToggle}
            className={`p-4 border rounded-2xl transition-all ${active ? "bg-red-50 border-red-100 text-red-500" : "border-gray-200 text-gray-400"}`}
          >
            <Heart size={20} fill={active ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-transform flex items-center justify-center gap-3 ${isOutOfStock ? "bg-gray-100 text-gray-400" : isAlreadyInCart ? "bg-black text-white" : "bg-[#7B2D0A] text-[#F3E1B6]"}`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : isAlreadyInCart
                ? "Change Size"
                : "Add To Bag"}
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <>
            <AnimatePresence>
              {showRemoveWishlistModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowRemoveWishlistModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-serif mb-2">
                      Wait, reconsider?
                    </h3>
                    <p className="text-sm text-stone-500 mb-8">
                      Remove <span className="font-bold">{product.name}</span>{" "}
                      from wishlist?
                    </p>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={confirmRemoveWishlist}
                        className="w-full py-4 bg-[#7B2D0A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                      >
                        Yes, Remove it
                      </button>
                      <button
                        onClick={() => setShowRemoveWishlistModal(false)}
                        className="w-full py-4 bg-stone-100 text-stone-600 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                      >
                        Keep it
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  className="fixed bottom-24 md:bottom-10 right-6 md:right-10 z-[9999] w-[90%] max-w-[400px]"
                >
                  <div className="bg-white/95 backdrop-blur-2xl border border-stone-200 shadow-2xl rounded-[2.5rem] p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 text-green-600 p-2.5 rounded-full">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="font-poppins">
                        <p className="text-[11px] font-black uppercase text-stone-900 leading-none mb-1">
                          {successMessage}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate max-w-[120px]">
                          {product.name}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/cart"
                      className="bg-black text-white px-6 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                      View <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>,
          document.body,
        )}

      <SizeSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAddToCart}
        productName={product.name}
        availableSizes={product.sizes}
        initialSize={sizeInCart}
      />
    </div>
  );
}