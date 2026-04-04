"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ChevronLeft, Tag, Check, Truck, X, AlertCircle, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    totalPrice, 
    appliedCoupon, 
    discount, 
    applyCoupon, 
    removeCoupon 
  } = useCart();
  
  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");
  const [showProgress, setShowProgress] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; size: string; name: string } | null>(null);
  const [couponStatus, setCouponStatus] = useState<"idle" | "success" | "invalid">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = totalPrice;
  const freeShippingThreshold = 5000;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 250;
  const tax = Math.round(subtotal * 0.12);
  const finalTotal = subtotal + shipping + tax - discount;

  const amountToFree = freeShippingThreshold - subtotal;
  const progressPercentage = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponStatus("success");
    } else {
      setCouponStatus("invalid");
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      removeFromCart(deleteTarget.id, deleteTarget.size);
      setDeleteTarget(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mb-6 text-stone-200">
          <ShoppingBag size={60} strokeWidth={1} />
        </motion.div>
        <h2 className="text-2xl font-serif mb-8 italic text-stone-800">Your shopping bag is empty</h2>
        <Link href="/products" className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#7B2D0A] transition-all rounded-full">
          Discover Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-30 md:pt-40 pb-40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        <header className="mb-0 md:mb-3 flex items-center justify-between border-b border-stone-100 pb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-stone-50 rounded-full transition-colors cursor-pointer">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl md:text-3xl font-serif text-stone-900 tracking-tight">Shopping Bag</h1>
          </div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest italic">
            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
          </span>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="flex-1">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div 
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-6 md:gap-8 py-5 border-b border-stone-100 group last:border-0"
                >
                  <Link href={`/products/${item.id}`} className="w-24 md:w-36 aspect-[3/4] bg-[#F9F9F9] shrink-0 overflow-hidden cursor-pointer rounded-sm shadow-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="text-md md:text-lg font-medium text-stone-900 hover:text-[#7B2D0A] transition-colors leading-tight">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-2">
                          <span>Size: <span className="text-stone-900">{item.size}</span></span>
                          <span className="text-stone-200">|</span>
                          <span>Price: ₹{item.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <button onClick={() => setDeleteTarget({ id: item.id, size: item.size, name: item.name })} className="p-2 text-stone-300 hover:text-red-500 transition-colors cursor-pointer rounded-full hover:bg-red-50">
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-6">
                      <div className="flex items-center border border-stone-200 rounded-full p-1 bg-white shadow-sm">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-black disabled:opacity-20 transition-colors cursor-pointer">
                          <Minus size={14}/>
                        </button>
                        <span className="px-4 text-sm font-bold font-poppins min-w-[32px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-black transition-colors cursor-pointer">
                          <Plus size={14}/>
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xl font-bold text-stone-900 font-poppins tracking-tight">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="w-full lg:w-[400px] space-y-6">
            <div className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <Tag size={18} className="text-[#7B2D0A]" />
                  <span className="text-xs font-black uppercase tracking-widest text-stone-900">Apply Offers</span>
               </div>
               {!appliedCoupon ? (
                 <form onSubmit={handleApplyCoupon} className="flex flex-col md:flex-row gap-2">
                    <input type="text" placeholder="Code: BANNIRA10" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-stone-900 focus:bg-white transition-all uppercase" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                    <button type="submit" className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#7B2D0A] transition-all active:scale-95">Apply</button>
                 </form>
               ) : (
                 <div className="flex justify-between items-center bg-green-50 border border-green-100 p-4 rounded-xl">
                    <div className="flex items-center gap-3 text-green-700">
                      <div className="p-1 bg-green-600 text-white rounded-full"><Check size={10} /></div>
                      <span className="text-xs font-bold uppercase tracking-tight">{appliedCoupon} Applied</span>
                    </div>
                    <button onClick={removeCoupon} className="text-[10px] font-bold text-stone-400 uppercase hover:text-red-500 transition-colors">Remove</button>
                 </div>
               )}
            </div>

            <div className="bg-[#FBFBFB] p-8 md:p-10 sticky top-32 rounded-[2rem] border border-stone-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
              <h3 className="text-[13px] font-black uppercase tracking-[0.3em] mb-10 text-stone-900 border-b border-stone-100 pb-5">Order Summary</h3>
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  <span>Bag Subtotal</span>
                  <span className="text-stone-900">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-green-600">
                    <span className="flex items-center gap-1.5"><Tag size={12}/> Discount</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  <span>Total Tax</span>
                  <span className="text-stone-900">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  <span>Shipping</span>
                  <span className={`${shipping === 0 ? "text-green-600" : "text-[#7B2D0A]"}`}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="h-px bg-stone-200 my-8" />
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">Total</span>
                  <span className="text-3xl font-bold text-stone-900 font-poppins tracking-tighter">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => router.push("/checkout")} className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#7B2D0A] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-2xl shadow-black/10 rounded-2xl">
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {cart.length > 0 && showProgress && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[88px] md:bottom-10 left-0 md:left-10 right-0 md:right-auto z-[60] w-full md:w-[350px] px-4 md:px-0"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-stone-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] md:shadow-2xl rounded-t-3xl md:rounded-3xl p-5 md:p-6 overflow-hidden relative">
              <div className="flex items-center justify-between mb-3 pt-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${subtotal >= freeShippingThreshold ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-[#7B2D0A]'}`}>
                        <Truck size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-900 leading-tight">
                            {subtotal >= freeShippingThreshold ? "Free Shipping Unlocked" : "Free Shipping Goal"}
                        </p>
                        <p className="text-[9px] text-stone-500 font-medium mt-0.5">
                            {subtotal >= freeShippingThreshold 
                                ? "Your delivery is now on us." 
                                : `Add ₹${amountToFree.toLocaleString()} more to save ₹250`}
                        </p>
                    </div>
                </div>
                <button onClick={() => setShowProgress(false)} className="p-1 hover:bg-stone-100 rounded-full text-stone-400">
                    <X size={14} />
                </button>
              </div>

              <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progressPercentage}%` }} 
                    className={`h-full ${subtotal >= freeShippingThreshold ? "bg-green-500" : "bg-[#7B2D0A]"}`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-6 py-6 z-[70] md:hidden flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Grand Total</span>
              <span className="text-2xl font-bold text-black font-poppins tracking-tighter">₹{finalTotal.toLocaleString()}</span>
            </div>
            <button onClick={() => router.push("/checkout")} className="px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl rounded-xl active:scale-95">
              Checkout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted && createPortal(
        <AnimatePresence>
          {deleteTarget && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteTarget(null)}
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
                <h3 className="text-xl font-serif text-stone-900 mb-2">Wait, are you sure?</h3>
                <p className="text-sm text-stone-500 mb-8 leading-relaxed">Do you really want to let go of this beautiful <span className="font-bold text-stone-800">{deleteTarget.name}</span>? It would look amazing on you!</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={confirmDelete}
                    className="w-full py-4 bg-[#7B2D0A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                  >
                    Yes, Remove it
                  </button>
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="w-full py-4 bg-stone-100 text-stone-600 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                  >
                    No, keep it
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {couponStatus !== "idle" && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCouponStatus("idle")}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl p-8 text-center"
              >
                {couponStatus === "success" ? (
                  <>
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-xl font-serif text-stone-900 mb-2">Offer Applied!</h3>
                    <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                      Congratulations! You just saved <span className="font-bold text-stone-900">₹{discount.toLocaleString()}</span> on your order.
                    </p>
                    <button
                      onClick={() => setCouponStatus("idle")}
                      className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle size={32} />
                    </div>
                    <h3 className="text-xl font-serif text-stone-900 mb-2">Invalid Code</h3>
                    <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                      Oops! That code doesn't exist. Please try again
                    </p>
                    <button
                      onClick={() => setCouponStatus("idle")}
                      className="w-full py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}