"use client";

import { motion } from "framer-motion";
import { Sparkles, Truck, Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>([
    "FREE SHIPPING ON ALL ORDERS ABOVE ₹2999",
    "FLAT 10% OFF ON YOUR FIRST PURCHASE | USE CODE: BANNIRA10",
    "NEW FESTIVE KURTI COLLECTION IS NOW LIVE",
    "CASH ON DELIVERY AVAILABLE PAN INDIA"
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStripText = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const result = await res.json();
        if (result.success && result.data?.topStripText?.length > 0) {
          setAnnouncements(result.data.topStripText);
        }
      } catch (error) {
        console.error("Error loading top strip settings", error);
      }
    };

    fetchStripText();
  }, []);

  if (!mounted) {
    return null;
  }

  const items = announcements.map((text) => {
    let icon = <Sparkles size={14} className="text-[#D4AF37]" />;
    if (text.includes("SHIPPING")) {
      icon = <Truck size={14} className="text-[#D4AF37]" />;
    } else if (text.includes("DISCOUNT") || text.includes("OFF") || text.includes("CODE")) {
      icon = <Star size={14} className="text-[#D4AF37]" />;
    }
    return { text, icon };
  });

  const scrollingContent = [...items, ...items];

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
}