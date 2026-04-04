"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function SignInStrip() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  const hideOnPages = ["/login", "/register", "/checkout", "/order-success"];
  const shouldHide = isLoggedIn || hideOnPages.includes(pathname);

  return (
    <AnimatePresence>
      {!shouldHide && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full bg-[#7B2D0A]/70 py-5 md:py-10 relative overflow-hidden border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-5">
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
              </div>

              <div className="flex flex-col items-center gap-6">
                <Link
                  href="/login"
                  className="group flex items-center gap-2 md:gap-5 bg-white text-black px-7 md:px-14 py-3 md:py-5 rounded-full text-[14px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all shadow-2xl active:scale-95"
                >
                  Sign In Now{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>

                <div className="flex items-center gap-4 text-stone-300">
                  <div className="h-[1px] w-8 bg-stone-200" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Start your journey
                  </span>
                  <div className="h-[1px] w-8 bg-stone-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
