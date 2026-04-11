"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { 
  ChevronLeft, Package, Truck, CheckCircle2, 
  MapPin, Loader2, CreditCard, Box 
} from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/detail?id=${id}`);
        const data = await res.json();
        if (res.ok) setOrder(data.order);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatDate = (dateStr: string, daysToAdd = 0) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const groupItems = (items: any[]) => {
    const grouped = items.reduce((acc: any, item: any) => {
      const key = `${item.productId || item.id}-${item.size}`;
      if (!acc[key]) acc[key] = { ...item };
      else acc[key].quantity += item.quantity;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  // --- SHIMMER / SKELETON UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pb-20 pt-32 md:pt-40 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-6 w-32 bg-stone-200 animate-pulse rounded-md mb-4" />
            <div className="h-96 w-full bg-white rounded-[2.5rem] animate-pulse border border-stone-100" />
            <div className="h-64 w-full bg-white rounded-[2.5rem] animate-pulse border border-stone-100" />
          </div>
          <div className="lg:col-span-5 space-y-6 lg:pt-12">
            <div className="h-48 w-full bg-stone-900/10 rounded-[2rem] animate-pulse" />
            <div className="h-48 w-full bg-white rounded-[2rem] animate-pulse border border-stone-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) return <div className="h-screen flex items-center justify-center font-serif italic">Order not found</div>;

  const addr = order.shippingAddress || order.address;

  // Animation Variants
  const container:Variants ={
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim:Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#FAF9F6] pb-20 pt-32 md:pt-40"
    >
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-6">
          <motion.button 
            variants={itemAnim}
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-black transition-colors mb-4"
          >
            <ChevronLeft size={16} /> Back to History
          </motion.button>

          <motion.div variants={itemAnim} className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm">
              <div className="space-y-10 relative">
                 <div className="absolute left-[19px] top-8 bottom-8 w-px bg-stone-100" />
                 <TrackingPoint title="Order Confirmed" time={formatDate(order.createdAt)} desc="Order received successfully." active done />
                 <TrackingPoint title="Preparing Shipment" time={formatDate(order.createdAt, 1)} desc="We are packing your items." active isCurrent />
                 <TrackingPoint title="In Transit" time={formatDate(order.createdAt, 2)} desc="Your package is on its way." />
                 <TrackingPoint title="Delivered" time={formatDate(order.createdAt, 3)} desc="Arriving at your doorstep." />
              </div>
          </motion.div>

          <motion.div variants={itemAnim} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
             <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-8 border-b border-stone-50 pb-4">Items Summary</h3>
             <div className="space-y-6">
                {groupItems(order.items).map((item: any, i: number) => (
                  <div key={i} className="flex gap-6 items-center">
                    <img src={item.image} className="w-16 h-22 object-cover rounded-2xl bg-stone-50 shadow-sm" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-tight">{item.name}</h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Qty: {item.quantity} · Size: {item.size}</p>
                      <p className="text-sm font-bold text-stone-900 mt-2 font-poppins">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>

        <aside className="lg:col-span-5 space-y-6 lg:pt-12">
          <motion.div variants={itemAnim} className="bg-[#1C1C1C] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl" />
             <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-[#D4AF37]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Billing Info</span>
                </div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase">{order.paymentMethod}</span>
             </div>
             <div className="space-y-4">
               <div className="flex justify-between text-xs text-stone-500 uppercase tracking-widest font-bold"><span>Subtotal</span><span className="text-white">₹{order.totalAmount.toLocaleString()}</span></div>
               <div className="flex justify-between text-xs text-stone-500 uppercase tracking-widest font-bold"><span>Delivery</span><span className="text-white font-black tracking-tighter">Free</span></div>
               <div className="h-px bg-white/10 my-2" />
               <div className="flex justify-between items-center"><span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Grand Total</span><span className="text-3xl font-serif text-[#D4AF37]">₹{order.totalAmount.toLocaleString()}</span></div>
             </div>
          </motion.div>

          <motion.div variants={itemAnim} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
             <div className="flex items-center gap-2 mb-6 border-b border-stone-50 pb-4">
                <MapPin size={16} className="text-[#7B2D0A]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-900">Shipping Destination</span>
             </div>
             <p className="text-sm font-bold text-stone-900 mb-1">{addr?.fullName}</p>
             <p className="text-xs text-stone-500 leading-relaxed italic font-serif mb-4">
                {addr?.address}, {addr?.area}, <br />
                {addr?.state} — {addr?.pincode}
             </p>
             <p className="text-[10px] font-bold text-stone-400 border-t border-stone-50 pt-4 uppercase tracking-widest">Phone: {addr?.phone}</p>
          </motion.div>

          <motion.button 
            variants={itemAnim}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-stone-900 text-white py-5 rounded-[1.5rem] font-bold uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-black transition-all"
          >
            Need Assistance?
          </motion.button>
        </aside>

      </div>
    </motion.div>
  );
}

function TrackingPoint({ title, time, desc, active = false, done = false, isCurrent = false }: any) {
  return (
    <div className={`flex gap-6 relative z-10 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-25'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-700
        ${done ? 'bg-black text-[#D4AF37]' : isCurrent ? 'bg-[#7B2D0A] text-white ring-4 ring-[#7B2D0A]/10' : 'bg-white border-2 border-stone-100 text-stone-200'}`}>
        {done ? <CheckCircle2 size={18} /> : isCurrent ? <Truck size={18} /> : <Package size={18} />}
      </div>
      <div>
        <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-widest">{title}</h3>
        <p className="text-[9px] font-bold text-[#7B2D0A] uppercase mt-0.5 tracking-tighter">{time}</p>
        <p className="text-[11px] text-stone-500 mt-2 font-medium leading-relaxed italic">{desc}</p>
      </div>
    </div>
  );
}