"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function SignInStrip() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Hydration errors se bachne ke liye
  useEffect(() => {
    setMounted(true);
  }, []);

  const hideOnPages = ["/login", "/register", "/checkout", "/order-success"];
  
  // Logic: Agar user logged in hai TOH hide karo, ya fir specific pages par hide karo
  const shouldHide = isLoggedIn || hideOnPages.includes(pathname);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {!shouldHide ? (
        <motion.section
          key="signin-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full bg-[#7B2D0A]/90 py-10 md:py-16 relative overflow-hidden border-t border-white/5"
        >
          {/* Background Decorative Elements (Royal Look) */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px]" />
             <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-[#D4AF37] mb-2">
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    Seamless Shopping
                  </span>
                </div>

                <h2 className="text-4xl md:text-6xl font-serif text-white italic leading-tight">
                  Your bag is waiting.
                </h2>
                <p className="text-stone-300 text-xs md:text-sm tracking-widest uppercase font-light">
                  Sign in to sync your wishlist & cart across all devices
                </p>
              </div>

              <div className="flex flex-col items-center gap-6 mt-4">
                <Link
                  href="/login"
                  className="group flex items-center gap-2 md:gap-5 bg-white text-black px-7 md:px-14 py-4 md:py-6 rounded-full text-[12px] md:text-[14px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all shadow-2xl active:scale-95"
                >
                  Sign In Now{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>

                <div className="flex items-center gap-4 text-stone-400">
                  <div className="h-[px] w-8 bg-stone-500/30" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Start your journey with Bannira
                  </span>
                  <div className="h-[1px] w-8 bg-stone-500/30" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}