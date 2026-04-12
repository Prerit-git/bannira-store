"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import {
  ShoppingBag,
  Trash2,
  CheckCircle2,
  ArrowRight,
  X,
  ChevronLeft,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, authLoading, router]);

  const handleCartSuccess = (productId: string) => {
    removeFromWishlist(productId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-30 md:pt-40 pb-10 relative selection:bg-stone-200">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        {/* --- HEADER --- */}
        <header className="mb-10 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-6">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-stone-900 transition-all active:scale-95"
            >
              <div className="p-2 bg-stone-50 rounded-full group-hover:bg-stone-100 transition-colors">
                <ChevronLeft size={18} />
              </div>
              Back
            </button>

            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 transition-all px-5 py-2.5 border border-stone-100 rounded-full hover:border-red-100 hover:bg-red-50/30"
              >
                <Trash2
                  size={14}
                  className="group-hover:scale-110 transition-transform"
                />
                Empty List
              </button>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl md:text-5xl font-serif text-[#1C1C1C]">
              Your Wishlist
            </h1>
            <span className="text-xs font-medium text-stone-300 font-poppins tracking-widest uppercase">
              {wishlist.length} Items
            </span>
          </div>
        </header>

        {/* --- GRID --- */}
        {wishlist.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-8">
              <AnimatePresence mode="popLayout">
                {wishlist.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <ProductCard
                      product={item}
                      onAddToCartSuccess={() => handleCartSuccess(item.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-20 flex flex-col items-center border-t border-stone-100 pt-16"
            >
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-6">
                Want to see more?
              </p>
              <Link
                href="/products"
                className="group flex items-center gap-4 bg-white border border-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-stone-900 hover:text-white transition-all duration-500 shadow-xl shadow-stone-100"
              >
                Continue Shopping{" "}
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-transform duration-500"
                />
              </Link>
            </motion.div>
          </>
        ) : (
          /* --- EMPTY STATE --- */
          <div className="h-[50vh] flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <ShoppingBag
              size={40}
              strokeWidth={1}
              className="text-stone-200 mb-8"
            />
            <h2 className="text-2xl font-serif mb-4 italic text-stone-800">
              Your list is waiting
            </h2>
            <Link
              href="/products"
              className="w-full py-5 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#7B2D0A] transition-all shadow-2xl"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-[9999] flex justify-center px-4 md:px-0 pointer-events-none"
          >
            <div className="w-full max-w-[420px] bg-[#1C1C1C] text-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 p-3 flex items-center justify-between gap-2 backdrop-blur-2xl pointer-events-auto">
              <div className="flex items-center gap-3 pl-2">
                <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37] to-[#7B2D0A] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <div className="flex flex-col font-poppins min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] truncate">
                    Moved to Bag
                  </span>
                  <span className="text-[9px] text-stone-400 truncate">
                    Ready for checkout
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                <Link
                  href="/cart"
                  className="bg-white text-black px-5 md:px-6 py-3 rounded-2xl md:rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.15em] hover:bg-[#D4AF37] transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  View <ArrowRight size={14} className="hidden xs:block" />
                </Link>
                <button
                  onClick={() => setShowToast(false)}
                  className="p-2 text-stone-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
