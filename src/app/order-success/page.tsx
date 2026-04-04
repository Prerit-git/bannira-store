"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, MapPin, ArrowRight, 
  ShoppingBag, Truck, ReceiptText, 
  Download, ShieldCheck, HelpCircle, 
  Settings2, Calendar, CreditCard,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
      clearCart();
    }
  }, [clearCart]);

  const recommendedProducts = useMemo(() => {
    return products.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, []);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 pt-32 md:pt-44 px-4 select-none">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div className="lg:col-span-7 space-y-8">
          <div className="text-center md:text-left mb-12">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="relative inline-block mb-6"
            >
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                <Check size={36} className="text-[#D4AF37]" strokeWidth={3} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 left-0 w-20 h-20 border-2 border-[#D4AF37] rounded-full z-0"
              />
            </motion.div>
            <p className="text-green-500">ORDER SUCCESS</p>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2 italic">
              
              Thanks for choosing Bannira, {order.address.fullName.split(' ')[0]}!
            </h1>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em]">
              Order ID: #{order.orderId}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900">
                <Truck size={22} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Delivery Status</p>
                <h3 className="text-sm font-bold text-stone-900">Processing Order</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900">
                <Calendar size={22} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Estimated Delivery</p>
                <h3 className="text-sm font-bold text-stone-900">3-5 Business Days</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm space-y-8">
            <div className="flex items-start gap-6 relative">
              <div className="p-4 bg-stone-900 rounded-2xl text-[#D4AF37] shadow-xl">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Shipping Details</p>
                  <button className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[#7B2D0A] hover:underline">
                    <Settings2 size={12} /> Edit Details
                  </button>
                </div>
                <p className="text-sm font-bold text-stone-900 mb-1">{order.address.fullName}</p>
                <p className="text-[13px] text-stone-500 leading-relaxed font-serif italic">
                  {order.address.address}, {order.address.area}, {order.address.state} — {order.address.pincode}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-100 grid grid-cols-2 md:grid-cols-3 gap-6">
              <button className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl hover:bg-black hover:text-white transition-all group">
                <Download size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Invoice</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl hover:bg-black hover:text-white transition-all group">
                <HelpCircle size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Any Query?</span>
              </button>
              <Link href="/profile/orders" className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl hover:bg-black hover:text-white transition-all group">
                <Truck size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Track Order</span>
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-xl md:text-2xl font-serif italic text-stone-900">Complete the Look</h2>
              <Link href="/products" className="text-[10px] font-black uppercase tracking-widest text-[#7B2D0A] flex items-center gap-2">
                View Collection <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-40">
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-50">
                <div className="flex items-center gap-3">
                  <ReceiptText size={18} className="text-[#D4AF37]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">Bag Summary</span>
                </div>
                <span className="text-[10px] font-bold text-stone-400">{order.date}</span>
              </div>

              <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative">
                      <img src={item.image} className="w-14 h-18 object-cover rounded-xl bg-stone-50 shadow-sm" alt={item.name} />
                      {/* <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        {item.quantity}
                      </span> */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-900 ">{item.name}</h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tight italic">Size:  {item.size}, QTY: {item.quantity}</p>
                      <p className="text-xs font-bold mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-stone-100 space-y-4">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-stone-900">₹{order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  <span>Shipping Charges</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-stone-900">Grand Total</span>
                  <span className="text-3xl font-bold text-stone-900 tracking-tighter">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1C1C1C] px-8 py-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-500" /> Secure Payment
              </span>
              <span className="text-white opacity-60">{order.paymentMethod}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Link 
              href="/profile/orders" 
              className="w-full bg-black text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all group"
            >
              Track Your Order <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/products" 
              className="w-full bg-white text-stone-900 border border-stone-100 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 shadow-sm hover:bg-stone-50 active:scale-[0.98] transition-all"
            >
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}