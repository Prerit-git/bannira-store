"use client";

import { motion } from "framer-motion";
import { Sparkles, Truck, Star } from "lucide-react";

const announcements = [
  { text: "FREE SHIPPING ON ALL ORDERS ABOVE ₹4999", icon: <Truck size={14} /> },
  { text: "FLAT 10% OFF ON YOUR FIRST PURCHASE | USE CODE: BANNIRA10", icon: <Star size={14} /> },
  { text: "NEW FESTIVE KURTI COLLECTION IS NOW LIVE", icon: <Sparkles size={14} /> },
  { text: "CASH ON DELIVERY AVAILABLE PAN INDIA", icon: <Truck size={14} /> },
];

const AnnouncementBar = () => {
  const scrollingContent = [...announcements, ...announcements];

  return (
    <div className="fixed top-0 left-0 w-full z-[100] bg-[#7B2D0A] overflow-hidden border-b border-white/5 h-10 flex items-center">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"], 
        }}
        transition={{
          duration: 30, 
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {scrollingContent.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 px-10 border-x border-white/10"
          >
            <span className="text-[#D4AF37]">{item.icon}</span>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#F3E1B6] font-sans">
              {item.text}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;