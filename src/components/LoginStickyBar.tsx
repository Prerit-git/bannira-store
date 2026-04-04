"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X, Crown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const LoginStickyBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const { isLoggedIn, isLoading } = useAuth(); 
  
  const [dismissed, setDismissed] = useState(false);

  const isLoginPage = pathname === "/login" || pathname === "/register";

  if (isLoading || isLoggedIn || isLoginPage || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 1.5 }}
        className="fixed bottom-6 inset-x-5 z-[100] md:max-w-[450px] md:mx-auto"
      >
        <div className="relative overflow-hidden bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 blur-[50px] rounded-full pointer-events-none" />

          <div className="flex items-center justify-between gap-4 relative z-10">
            
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#7B2D0A] rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                <Crown size={18} className="text-white" strokeWidth={2.5} />
              </div>
              
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Join Bannira</span>
                  <Sparkles size={10} className="text-[#D4AF37] animate-pulse" />
                </div>
                <h3 className="text-white text-[12px] font-serif italic leading-tight truncate">
                  Exclusive Kurti deals
                </h3>
              </div>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="bg-white text-black h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-[#D4AF37] transition-all active:scale-95 shrink-0"
            >
              Sign In <ArrowRight size={12} />
            </button>

            <button 
              onClick={() => setDismissed(true)}
              className="p-1 text-white/30 hover:text-white transition-colors ml-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginStickyBar;