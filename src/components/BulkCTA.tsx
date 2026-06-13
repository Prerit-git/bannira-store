"use client";

import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function BulkCTA() {
  const pathname = usePathname();

  const hiddenRoutes = [
    "/bulk-orders",     
    "/cart",            
    "/order-success",
    "/products"
  ];

  const shouldHide = hiddenRoutes.some(route => pathname === route || pathname.startsWith("/admin") || pathname.startsWith("/products/"));
  
  if (shouldHide) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed bottom-6 right-2 z-[999] md:bottom-8 md:right-10 pointer-events-auto"
    >
      <Link 
        href="/bulk-orders"
        className="flex items-center gap-3 bg-[#7B2D0A] text-white pl-4 pr-5 py-3.5 rounded-full border border-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-black transition-all duration-300 active:scale-95 group group-hover:border-[#D4AF37]/30"
      >
        <div className="p-1.5 bg-white/10 rounded-full text-[#D4AF37] group-hover:scale-110 transition-transform">
          <Briefcase size={14} />
        </div>
        
        <div className="flex flex-col text-left">
          <span className="text-[8px] font-black tracking-[0.2em] uppercase text-stone-400 leading-none mb-0.5">
            Enquire Now
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 text-white">
            Bulk Orders <ArrowRight size={12} className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}