"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Package, Truck, CheckCircle2, 
  MapPin, Clock, ShoppingBag, 
  ChevronRight, Search, Filter, Calendar, Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("active");

useEffect(() => {
  const history = localStorage.getItem("bannira_orders");
  if (history) {
    const parsedHistory = JSON.parse(history);
    setOrdersList(parsedHistory);
  }
}, []);

  if (ordersList.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag size={40} strokeWidth={1} className="text-stone-200" />
        </motion.div>
        <h2 className="text-2xl font-serif italic text-stone-900 mb-3">No Orders yet</h2>
        <p className="text-stone-400 text-sm max-w-xs mb-10 leading-relaxed">Items you acquire from our store will appear here for tracking.</p>
        <Link href="/products" className="bg-black text-[#D4AF37] px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
          Begin Journey
        </Link>
      </div>
    );
  }

  // --- VIEW 1: PREMIUM APP LIST VIEW ---
  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] pb-32 pt-30 md:pt-40">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          
          {/* APP HEADER */}
          <div className="flex items-center mb-8">
            <button onClick={()=> router.back()} className="p-3 bg-stone-50 rounded-full text-stone-900">
            <ChevronLeft size={20} />
          </button>
            <h1 className="text-2xl font-serif text-stone-900 italic">My Orders</h1>
            <div className="flex gap-2">
            </div>
          </div>

          {/* APP-STYLE TABS */}
          <div className="flex gap-2 mb-8 bg-stone-100 p-1.5 rounded-[1.2rem]">
            {['active', 'completed'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-stone-400'}`}
              >
                {tab} {tab === 'active' && `(${ordersList.length})`}
              </button>
            ))}
          </div>

          {/* ORDERS CARDS */}
          <div className="space-y-5">
            {ordersList.map((order) => (
              <motion.div 
                key={order.orderId}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-stone-50 cursor-pointer group"
              >
                <div className="flex gap-5">
                  <div className="relative w-24 h-32 bg-stone-50 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                    <img src={order.items[0].image} className="w-full h-full object-cover" alt="item" />
                  </div>
                  
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#7B2D0A] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#7B2D0A] rounded-full animate-pulse" /> In Processing
                        </span>
                        <ChevronRight size={16} className="text-stone-300 group-hover:text-black transition-colors" />
                      </div>
                      <h3 className="text-sm font-bold text-stone-900 mt-2 uppercase tracking-tight">Order #{order.orderId}</h3>
                      <p className="text-[10px] text-stone-400 mt-1 font-medium">{order.items.length}  piece(s)</p>
                    </div>

                    <div className="flex justify-between items-end border-t border-stone-50 pt-3">
                       <div className="flex items-center gap-2 text-stone-400">
                          <Calendar size={12} />
                          <span className="text-[10px] font-bold">{order.date}</span>
                       </div>
                       <p className="text-sm font-bold text-black font-poppins">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: FULL APP TRACKING VIEW ---
  return (
    <div className="min-h-screen bg-white pb-20 pt-30 md:pt-40">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* APP NAV */}
        <div className="flex items-center justify-between mb-8 sticky top-12 bg-white/80 backdrop-blur-lg z-20 py-2">
          <button onClick={() => setSelectedOrder(null)} className="p-3 bg-stone-50 rounded-full text-stone-900">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-[11px] font-black uppercase tracking-[0.3em]">Track Shipment</h1>
          <button className="p-3 bg-stone-50 rounded-full text-stone-900"><Info size={20} /></button>
        </div>

        {/* STATUS BANNER */}
        <div className="bg-[#1C1C1C] rounded-[2.5rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 blur-3xl" />
           <div className="flex flex-col gap-1 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Estimated Delivery</span>
              <h2 className="text-3xl font-serif italic text-white">In 2-3 working days</h2>
              <div className="h-1.5 w-full bg-white/10 rounded-full mt-6 overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} className="h-full bg-[#D4AF37]" />
              </div>
              {/* <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mt-3">Current Location: Delhi Atelier</p> */}
           </div>
        </div>

        {/* SHIPMENT INFO */}
        <div className="space-y-6">
           <div className="bg-stone-50 rounded-[2rem] p-8">
              <div className="flex gap-6 relative">
                 <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-stone-200" />
                 <div className="space-y-12 w-full">
                    <TrackingPoint title="Order Placed" time="00:00 AM" desc="We've received your order." active done />
                    <TrackingPoint title="Preparing for shipment" time="In Progress" desc="Ensuring the perfect finish for your piece." active isCurrent />
                    <TrackingPoint title="Dispatching" time="Pending" desc="Handing over to our courier partner." />
                    <TrackingPoint title="Arrival" time="Pending" desc="At your doorstep soon." />
                 </div>
              </div>
           </div>

           {/* MINI ADDRESS CARD */}
           <div className="bg-white rounded-3xl p-6 border border-stone-100 flex items-start gap-4">
              <div className="p-3 bg-stone-50 rounded-2xl"><MapPin size={20} className="text-[#7B2D0A]" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Delivering to</p>
                <p className="text-sm font-bold text-stone-900">{selectedOrder.address.fullName}</p>
                <p className="text-xs text-stone-500 mt-1 uppercase leading-tight">{selectedOrder.address.address}, {selectedOrder.address.area}, {selectedOrder.address.state}</p>
              </div>
           </div>
        </div>

        {/* FLOATING ACTION FOOTER (MOBILE ONLY) */}
        <div className="fixed bottom-8 left-4 right-4 md:hidden z-50">
           <button className="w-full bg-black text-[#D4AF37] py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
              Contact us
           </button>
        </div>

      </div>
    </div>
  );
}

// --- APP HELPERS ---
function TrackingPoint({ title, time, desc, active = false, done = false, isCurrent = false }: any) {
  return (
    <div className="flex gap-6 relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-700 
        ${done ? 'bg-black text-[#D4AF37]' : isCurrent ? 'bg-[#7B2D0A] text-white shadow-lg shadow-[#7B2D0A]/30 scale-110' : 'bg-white border-2 border-stone-100 text-stone-200'}`}>
        {done ? <CheckCircle2 size={18} /> : isCurrent ? <Truck size={18} /> : <Package size={18} />}
      </div>
      <div className={active ? 'opacity-100' : 'opacity-30'}>
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-900">{title}</h3>
          {isCurrent && <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />}
        </div>
        <p className="text-[9px] font-bold text-stone-400 uppercase mt-0.5">{time}</p>
        <p className="text-[11px] text-stone-500 mt-2 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}