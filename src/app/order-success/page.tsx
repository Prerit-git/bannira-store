"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, Package, MapPin, ArrowRight, 
  ShoppingBag, Truck, Receipt, Sparkles, 
  ArrowLeft, Download, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

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

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 pt-30 md:pt-40 px-4 select-none">
      <div className="max-w-[600px] mx-auto">
        
        <div className="flex items-center justify-center mb-5 md:hidden">
          
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 bg-green-200 px-2 py-2 rounded-full">Order Confirmed</span>
        </div>

        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="relative inline-block"
          >
            <div className="w-20 h-20 bg-[#1C1C1C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10">
              <Check size={36} className="text-[#D4AF37]" strokeWidth={3} />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-0 left-0 w-20 h-20 border-2 border-[#D4AF37] rounded-full z-0"
            />
          </motion.div>
          
          <h1 className="text-3xl font-serif text-stone-900 mb-2 italic">A Fine Choice, {order.address.fullName.split(' ')[0]}!</h1>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Order #{order.orderId}</p>
        </div>

        <div className="space-y-4">
          
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-stone-50 flex items-center gap-5">
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-[#7B2D0A]">
              <Truck size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Current Status</p>
              <h3 className="text-sm font-bold text-stone-900">Order Success</h3>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-stone-50">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-50 pb-4">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Order Summary</span>
                </div>
                <span className="text-[10px] font-bold text-stone-400">{order.date}</span>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.image} className="w-12 h-16 object-cover rounded-xl bg-stone-50" />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold uppercase truncate">{item.name}</p>
                      <p className="text-[9px] text-stone-400 font-bold">SIZE {item.size} · QTY {item.quantity}</p>
                    <p className="text-xs font-bold">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-stone-50 space-y-3">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Grand Total</span>
                  <span className="text-xl font-serif text-stone-900 tracking-tighter">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="bg-stone-50 px-6 py-4 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-stone-400">
              <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-green-600"/> Secure Payment</span>
              <span>{order.paymentMethod}</span>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-stone-50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#7B2D0A]/5 rounded-2xl text-[#7B2D0A]">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Deliver To</p>
                <p className="text-sm font-bold text-stone-900 mb-1">{order.address.fullName}</p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {order.address.address}, {order.address.area},<br />
                  {order.address.state} — {order.address.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 px-2">
          <Link 
            href="/profile/orders" 
            className="w-full bg-[#1C1C1C] text-[#D4AF37] py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
          >
            Track Your Order <ArrowRight size={16} />
          </Link>
          
          <div className="mt-8 text-center space-y-4">
             <button className="text-[10px] font-black uppercase tracking-widest text-stone-300 hover:text-stone-900 transition-colors flex items-center gap-2 mx-auto">
               <Download size={14} /> Download Invoice
             </button>
             <p className="text-[10px] text-stone-400 italic">Expected arrival in 3-5 business days.</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-stone-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-black transition-all">
            <ShoppingBag size={14} /> Back to Store
          </Link>
        </div>

      </div>
    </div>
  );
}