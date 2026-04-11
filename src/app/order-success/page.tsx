"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, MapPin, ArrowRight, 
  ShoppingBag, Truck, ReceiptText, 
  Download, ShieldCheck, HelpCircle, 
  Calendar, CreditCard,
  Loader2,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function OrderSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
      
      if (clearCart) {
        clearCart();
        localStorage.removeItem("bannira_cart");
        localStorage.removeItem("bannira_coupon");
      }
    }
  }, [clearCart]);

  const handleContinueShopping = () => {
    router.refresh(); 
    router.push("/products");
  };

  const recommendedProducts = useMemo(() => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, []);

  if (!order) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#7B2D0A] mb-4" size={30} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Authenticating Order...</p>
      </div>
    );
  }

  const address = order.shippingAddress || order.address;
  const totalAmount = order.totalAmount || order.total;
  const orderId = order._id || order.orderId;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 pt-32 md:pt-44 px-4 select-none">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
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
              <p className="text-green-600 font-bold text-[10px] tracking-[0.3em]">ORDER PLACED SUCCESSFULLY</p>
              <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2 italic">
                A masterpiece is on its way, {address?.fullName?.split(' ')[0] || 'Guest'}.
              </h1>
              <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em]">
                Order Id: #{orderId?.toString().slice(-8).toUpperCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900">
                  <Truck size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Shipment Status</p>
                  <h3 className="text-sm font-bold text-stone-900">{order.orderStatus || "Processing"}</h3>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900">
                  <Calendar size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Delivery Window</p>
                  <h3 className="text-sm font-bold text-stone-900">Within 3-5 Working Days</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm space-y-8">
              <div className="flex items-start gap-6 relative">
                <div className="p-4 bg-stone-900 rounded-2xl text-[#D4AF37] shadow-xl">
                  <MapPin size={24} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-2">Delivery Destination</p>
                  <p className="text-sm font-bold text-stone-900 mb-1">{address?.fullName}</p>
                  <p className="text-[13px] text-stone-500 leading-relaxed font-serif italic">
                    {address?.address}, {address?.area}, {address?.state} — {address?.pincode}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-100 grid grid-cols-2 md:grid-cols-3 gap-6">
                <button className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl hover:bg-black hover:text-white transition-all group">
                  <Download size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-center">Download Bill</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl hover:bg-black hover:text-white transition-all group">
                  <HelpCircle size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-center">Concierge Help</span>
                </button>
                <Link href={`/profile/orders/${orderId}`} className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl hover:bg-black hover:text-white transition-all group">
                  <Truck size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-center">Track Journey</span>
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden mb-8">
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-50">
                  <div className="flex items-center gap-3">
                    <ReceiptText size={18} className="text-[#D4AF37]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">Items Summary</span>
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-6">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img src={item.image} className="w-14 h-18 object-cover rounded-xl bg-stone-50 shadow-sm" alt={item.name} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-900 truncate">{item.name}</h4>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tight italic">Qty: {item.quantity} · Size: {item.size}</p>
                        <p className="text-xs font-bold mt-1 text-[#7B2D0A]">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-stone-100 space-y-4">
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-stone-900">Total Amount Paid</span>
                    <span className="text-3xl font-bold text-stone-900 tracking-tighter">₹{totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1C1C1C] px-8 py-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-500" /> Insured Payment
                </span>
                <span className="text-white opacity-60 uppercase">{order.paymentMethod || "Prepaid"}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Link 
                href={`/profile/orders/${orderId}`} 
                className="w-full bg-black text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#7B2D0A] transition-all group"
              >
                Track Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={handleContinueShopping} 
                className="w-full bg-white text-stone-900 border border-stone-100 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 shadow-sm hover:bg-stone-50 transition-all cursor-pointer active:scale-95"
              >
                <ShoppingBag size={18} /> Continue Shopping
              </button>
            </div>
          </aside>
        </div>

        {/* RECOMMENDED PRODUCTS SECTION */}
        <div className="mt-12 pt-20 border-t border-stone-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7B2D0A] mb-2">Handpicked for you</p>
              <h2 className="text-3xl md:text-4xl font-serif italic text-stone-900">Complete the Look</h2>
            </div>
            <Link href="/products" className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-black transition-colors flex items-center gap-2 group">
              View Collection <ChevronRight
               size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {recommendedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}