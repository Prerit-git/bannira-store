"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, ShoppingBag, ChevronRight, 
  CreditCard, ArrowRight, Hash 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function OrdersPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn) return;
      try {
        setIsFetching(true);
        const res = await fetch("/api/orders/user");
        const data = await res.json();
        if (res.ok) setOrdersList(data.orders || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsFetching(false);
      }
    };
    if (!authLoading) fetchOrders();
  }, [isLoggedIn, authLoading]);

  const groupItems = (items: any[]) => {
    const grouped = items.reduce((acc: any, item: any) => {
      const key = `${item.productId || item.id}-${item.size}`;
      if (!acc[key]) acc[key] = { ...item };
      else acc[key].quantity += item.quantity;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  if (isFetching || authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pb-32 pt-32 md:pt-40 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-stone-200 animate-pulse rounded-lg mb-10" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 border border-stone-100 space-y-6">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-stone-100 animate-pulse rounded" />
                <div className="h-4 w-20 bg-stone-100 animate-pulse rounded" />
              </div>
              <div className="flex gap-4">
                <div className="w-14 h-18 bg-stone-100 animate-pulse rounded-xl" />
                <div className="flex-1 space-y-2 py-2">
                  <div className="h-3 w-full bg-stone-100 animate-pulse rounded" />
                  <div className="h-3 w-24 bg-stone-100 animate-pulse rounded" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-stone-100 animate-pulse rounded" />
                  <div className="h-4 w-20 bg-stone-100 animate-pulse rounded" />
                </div>
                <div className="h-10 w-32 bg-stone-100 animate-pulse rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ordersList.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} strokeWidth={1} className="text-stone-300" />
        </div>
        <h2 className="text-xl font-serif text-stone-900 mb-2">No orders yet</h2>
        <Link href="/products" className="bg-black text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32 pt-32 md:pt-40">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-10">
           <button onClick={() => router.back()} className="p-2.5 bg-white rounded-full shadow-sm text-stone-900"><ChevronLeft size={20} /></button>
           <h1 className="text-2xl font-serif text-stone-900 italic font-medium">My Orders</h1>
        </div>

        <div className="grid gap-6">
          {ordersList.map((order) => {
            const grouped = groupItems(order.items);
            const displayId = order._id.toString().slice(-8).toUpperCase();
            
            return (
              <motion.div 
                key={order._id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#7B2D0A] rounded-full" />
                        <p className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">{order.orderStatus}</p>
                      </div>
                      <p className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                        ID: <span className="text-stone-900 font-black">#{displayId}</span>
                      </p>
                    </div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {grouped.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img src={item.image} className="w-14 h-18 object-cover rounded-xl bg-stone-50" alt={item.name} />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-tight">{item.quantity} × {item.name}</h4>
                          <p className="text-[9px] text-stone-400 font-bold uppercase mt-1">Size: {item.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                    <div>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Total Amount</p>
                      <p className="text-sm font-bold text-stone-900">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <Link 
                      href={`/profile/orders/${order._id}`}
                      className="bg-stone-900 text-[#D4AF37] px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-black transition-all"
                    >
                      Track Order <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}