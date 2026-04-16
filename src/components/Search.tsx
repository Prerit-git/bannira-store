"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search as SearchIcon, X, ArrowRight, History, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useProducts } from "@/context/ProductContext";

export default function Search() {
  const router = useRouter();
  const { allProducts } = useProducts();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const trendingTags = ["Cotton Kurti", "Maxi Dress", "Co-ord Sets", "Anarkali"];

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileSearchOpen]);

  const addToHistory = (searchTerm: string) => {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) return;
    const newHistory = [cleanTerm, ...history.filter((h) => h !== cleanTerm)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-[#D4AF37] font-black">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = allProducts.filter(
        (product: any) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, allProducts]);

  const handleSearch = (searchTerm: string) => {
    const exactProduct = allProducts.find(
      (p) => p.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (exactProduct) {
      handleProductClick(exactProduct);
    } else if (searchTerm.trim()) {
      addToHistory(searchTerm);
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsFocused(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleProductClick = (product: any) => {
    addToHistory(product.name);
    router.push(`/products/${product.slug}`);
    setIsFocused(false);
    setIsMobileSearchOpen(false);
    setQuery("");
  };

  const SearchContent = () => (
    <div className="w-full">
      {!query && (
        <div className="p-6 space-y-6 text-left">
          {history.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-stone-400">
                <History size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest">Recent Searches</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <button 
                    key={item} 
                    onClick={() => handleSearch(item)} 
                    className="px-4 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-full text-[11px] transition-all border border-stone-100 flex items-center gap-2 text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#D4AF37]">
              <Sparkles size={14} />
              <p className="text-[10px] font-black uppercase tracking-widest">Trending Now</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => handleSearch(tag)} 
                  className="px-4 py-1.5 bg-[#FDFCFB] hover:bg-[#7B2D0A] hover:text-white text-[#7B2D0A] rounded-full text-[11px] font-bold transition-all border border-[#7B2D0A]/10 text-left"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {query.length > 0 && (
        <div className="pb-4">
          <div className="p-4 border-b border-stone-50">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2 px-2">Suggestions</p>
            <div className="space-y-1">
              {results.slice(0, 3).map((product) => (
                <button
                  key={`suggestion-${product.id}`}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-stone-50 rounded-xl text-left text-sm text-stone-600 transition-all group"
                >
                  <SearchIcon size={14} className="text-stone-300 group-hover:text-[#D4AF37]" />
                  {getHighlightedText(product.name, query)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3 px-2">Products</p>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar">
              {results.length > 0 ? (
                results.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-4 p-2 hover:bg-[#FDFCFB] rounded-2xl cursor-pointer transition-all group border border-transparent hover:border-stone-100"
                  >
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-stone-100 relative flex-shrink-0">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-bold text-stone-800 truncate leading-tight">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{product.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                       <p className="text-sm font-black text-[#7B2D0A]">₹{product.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-sm text-stone-400 italic">No matches found for "{query}"</p>
                </div>
              )}
            </div>
            {results.length > 5 && (
              <button onClick={() => handleSearch(query)} className="w-full flex items-center justify-center gap-2 p-3 mt-3 text-[10px] font-black uppercase tracking-[0.2em] bg-stone-900 text-[#D4AF37] rounded-xl hover:bg-black transition-all">
                View All {results.length} Results <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div ref={searchRef} className="w-full">
      <div className="hidden md:block relative w-full max-w-xl mx-auto">
        <AnimatePresence>
          {isFocused && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFocused(false)} className="fixed inset-0 z-[50] bg-black/30 backdrop-blur-sm" />
          )}
        </AnimatePresence>

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative z-[70]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for kurtis, dresses and more..."
            className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-12 pr-10 text-white placeholder-white/60 focus:bg-white focus:text-stone-900 focus:shadow-[0_0_40px_rgba(212,175,55,0.3)] outline-none transition-all duration-500 text-sm"
          />
          <SearchIcon size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? "text-[#7B2D0A]" : "text-white/70"}`} />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setResults([]); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors">
              <X size={16} />
            </button>
          )}
        </form>

        <AnimatePresence>
          {isFocused && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-stone-100 overflow-hidden z-[60]">
              <SearchContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsMobileSearchOpen(true)} className="p-2 text-white flex items-center">
          <SearchIcon size={22} />
        </button>

        {mounted && isMobileSearchOpen && createPortal(
          <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-start pt-20 px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileSearchOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-4 border-b flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Bannira..."
                    className="w-full bg-stone-100 rounded-full py-3 pl-10 pr-10 text-stone-900 outline-none text-sm"
                  />
                  <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  {query && (
                    <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button onClick={() => setIsMobileSearchOpen(false)} className="w-10 h-10 flex items-center justify-center bg-stone-50 rounded-full text-stone-900">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[70vh] bg-white text-left">
                <SearchContent />
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}