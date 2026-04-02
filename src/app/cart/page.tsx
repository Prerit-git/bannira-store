"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const router = useRouter();

  const subtotal = totalPrice;
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const tax = Math.round(subtotal * 0.12);
  const finalTotal = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <ShoppingBag size={40} strokeWidth={1} className="text-stone-200 mb-6" />
        <h2 className="text-xl font-serif mb-8 italic text-stone-800">Your shopping bag is empty</h2>
        <Link href="/products" className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#7B2D0A] transition-all rounded-full">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 md:pt-40 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* --- HEADER --- */}
        <header className="mb-8 flex items-center justify-between border-b border-stone-100 pb-8">
          <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={() => router.back()} 
              className="p-2 -ml-2 hover:bg-stone-50 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl md:text-3xl font-serif text-stone-900 tracking-tight">Shopping Bag</h1>
          </div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest italic">
            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
          </span>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- PRODUCT LIST --- */}
          <div className="flex-1">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div 
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  className="flex gap-6 md:gap-10 py-8 border-b border-stone-50 group"
                >
                  {/* Clickable Image Container */}
                  <Link 
                    href={`/products/${item.id}`} 
                    className="w-24 md:w-32 aspect-[3/4] bg-[#F9F9F9] shrink-0 overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        {/* Clickable Name */}
                        <Link href={`/products/${item.id}`}>
                          <h3 className="text-base md:text-lg font-medium text-stone-900 uppercase tracking-tight hover:text-[#7B2D0A] transition-colors cursor-pointer">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                          <span>Size: <span className="text-stone-900">{item.size}</span></span>
                          <span className="text-stone-200">|</span>
                          <span>Price: ₹{item.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)} 
                        className="p-2 text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      {/* Tight Quantity Control */}
                      <div className="flex items-center border border-stone-200 rounded-full h-9 px-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-black disabled:opacity-20 transition-colors cursor-pointer"
                        >
                          <Minus size={12}/>
                        </button>
                        <span className="px-3 text-xs font-bold font-poppins min-w-[24px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-black transition-colors cursor-pointer"
                        >
                          <Plus size={12}/>
                        </button>
                      </div>
                      
                      <p className="text-lg font-bold text-stone-900 font-poppins tracking-tight italic">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* --- SUMMARY SIDEBAR --- */}
          <aside className="w-full lg:w-[360px]">
            <div className="bg-[#FBFBFB] p-8 md:p-10 sticky top-32 rounded-xl">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] mb-8 text-stone-900">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-400">
                  <span>Bag Subtotal</span>
                  <span className="text-stone-900 font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-400">
                  <span>GST (12%)</span>
                  <span className="text-stone-900 font-bold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-400">
                  <span>Standard Shipping</span>
                  <span className="text-[#7B2D0A] font-bold tracking-tighter">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                
                <div className="h-px bg-stone-200 my-6" />
                
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900">Total</span>
                  <span className="text-2xl font-bold text-stone-900 font-poppins">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => router.push("/checkout")} 
                className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#7B2D0A] transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
              >
                Go to Checkout <ArrowRight size={14} />
              </button>

              <div className="mt-8 flex flex-col items-center gap-4 border-t border-stone-200/50 pt-8">
                <div className="flex items-center gap-2 text-stone-400 text-[9px] uppercase tracking-widest font-bold">
                  <ShieldCheck size={14} className="text-[#D4AF37]" /> Secure Gateway Payment
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* --- MOBILE STICKY BAR --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-6 py-5 z-[50] md:hidden flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Grand Total</span>
            <span className="text-xl font-bold text-black font-poppins">₹{finalTotal.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => router.push("/checkout")} 
            className="px-10 py-3.5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg rounded-sm active:scale-95 cursor-pointer"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}