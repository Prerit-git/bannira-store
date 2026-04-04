"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (size: string) => void;
  productName: string;
  availableSizes: string[];
  initialSize?: string;
}

export default function SizeSelectionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName, 
  availableSizes,
  initialSize 
}: SizeModalProps) {
  const allSizes = ["S", "M", "L", "XL", "XXL"];
  const [tempSize, setTempSize] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialSize) setTempSize(initialSize);
    }
    else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, initialSize]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden relative z-[10000] shadow-[0_30px_100px_rgba(0,0,0,0.25)] border border-stone-100"
      >
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-all duration-300 hover:rotate-90"
        >
          <X size={24}/>
        </button>
        
        <div className="p-8 md:p-12">
          <header className="text-center mb-10">
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-3"
            >
              <div className="h-px w-6 bg-[#D4AF37]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#7B2D0A]">
                {initialSize ? "Update Your Fit" : "The Perfect Fit"}
              </p>
              <div className="h-px w-6 bg-[#D4AF37]" />
            </motion.div>
            
            <h3 className="text-2xl md:text-3xl font-serif text-stone-900 mb-2 leading-tight">
              {initialSize ? "Change your selection" : "Please select your fit"}
            </h3>
            <p className="text-stone-400 text-[11px] font-medium uppercase tracking-widest italic">{productName}</p>
          </header>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {allSizes.map((size, index) => {
              const isAvailable = availableSizes.includes(size);
              const isCurrent = size === initialSize;
              return (
                <motion.button
                  key={size}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  disabled={!isAvailable}
                  onClick={() => setTempSize(size)}
                  className={`relative h-16 rounded-2xl text-sm font-bold transition-all duration-500 overflow-hidden border
                    ${!isAvailable 
                      ? "opacity-20 cursor-not-allowed border-stone-100 bg-stone-50 text-stone-300" 
                      : tempSize === size 
                        ? "bg-stone-900 text-white border-stone-900 shadow-2xl scale-105" 
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900"
                    }`}
                >
                  {tempSize === size && (
                    <motion.div 
                      layoutId="checkIcon"
                      className="absolute top-1 right-1"
                    >
                      <Check size={12} className={isCurrent ? "text-green-400" : "text-[#D4AF37]"} />
                    </motion.div>
                  )}
                  {size}
                </motion.button>
              );
            })}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onConfirm(tempSize);
              setTempSize(""); 
            }}
            disabled={!tempSize || tempSize === initialSize}
            className={`w-full py-5 rounded-2xl font-bold uppercase text-[11px] tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl cursor-pointer
              ${(!tempSize || tempSize === initialSize)
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-[#7B2D0A] text-white shadow-stone-200"
              }`}
          >
            {tempSize === initialSize ? (
              "Already Selected"
            ) : tempSize ? (
              <span className="flex items-center gap-2">
                {initialSize ? "Update Bag" : `Confirm ${tempSize}`} <ArrowRight size={16}/>
              </span>
            ) : "Pick your size"}
          </motion.button>

          <p className="text-center text-[9px] text-stone-400 mt-6 uppercase tracking-widest leading-loose">
            <span className="text-[#D4AF37]">Premium Bannira Experience</span>
          </p>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}