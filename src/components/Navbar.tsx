"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  Menu,
  X,
  ShoppingCart,
  Heart,
  Package,
  UserCircle,
  LogOut,
  SearchIcon,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  
  const { isLoggedIn, logout, setRedirectPath } = useAuth();
  
  const wishlistCount = wishlist.length;
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // Mobile search state
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll lock jab menu ya search open ho
  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen, searchOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  const handleLoginClick = () => {
    setRedirectPath(pathname);
    setMenuOpen(false);
    router.push("/login");
  };

  const isHome = pathname === "/";
  const navbarBg = isHome
    ? scrolled
      ? "bg-black/80 backdrop-blur-md shadow-md py-2"
      : "bg-transparent py-4"
    : "bg-black/90 backdrop-blur-md shadow-md py-2";

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navbarBg}`}>
        <div className="max-w-7xl mx-auto px-6">
          
          {/* ================= DESKTOP NAVBAR ================= */}
          <div className="hidden md:flex items-center justify-between py-2">
            <Link href={"/"} className={`transition-all duration-500 ${scrolled ? "scale-75" : "scale-100"}`}>
              <Image src={"/bannira_web_logo.png"} alt="logo" width={180} height={80} priority className="object-contain w-auto h-auto" />
            </Link>

            <div className="flex-1 px-10">
              <div className="relative w-full max-w-xl mx-auto group">
                <input 
                  type="search" 
                  placeholder="Search kurtis, dresses..." 
                  className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-12 pr-4 text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all" 
                />
                <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-[#D4AF37] transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-8">
              {/* Profile, Wishlist, Cart Desktop Icons (Existing Logic) */}
              {/* ... (Maintained as per your previous code) ... */}
              <div className="relative group flex flex-col items-center cursor-pointer">
                <User size={24} className="text-white group-hover:text-[#D4AF37] transition-colors" />
                <span className="text-[10px] uppercase tracking-widest text-white mt-1">Profile</span>
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100">
                   {/* Dropdown Content */}
                   <div className="p-5">
                    {isLoggedIn ? (
                      <div className="space-y-1 text-left">
                        <Link href="/profile" className="flex items-center gap-3 py-2 text-sm text-gray-700 hover:text-[#7B2D0A]"><UserCircle size={18} /> Profile</Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 py-2 w-full text-sm text-red-600 font-bold"><LogOut size={18} /> Logout</button>
                      </div>
                    ) : (
                      <button onClick={handleLoginClick} className="w-full bg-[#7B2D0A] text-white py-3 rounded-lg text-[11px] font-black uppercase tracking-widest">Login</button>
                    )}
                  </div>
                </div>
              </div>

              <Link href="/wishlist" className="flex flex-col items-center relative group text-white">
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-widest mt-1">Wishlist</span>
              </Link>

              <Link href="/cart" className="flex flex-col items-center relative group text-white">
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-widest mt-1">Bag</span>
              </Link>
            </div>
          </div>

          {/* ================= MOBILE NAVBAR ================= */}
          <div className="flex items-center justify-between md:hidden py-1">
            <Link href={"/"}>
              <Image src={"/bannira_web_logo.png"} alt="logo" width={120} height={40} priority className="object-contain w-auto h-auto" />
            </Link>

            <div className="flex items-center gap-1">
              {/* FIXED: Search Trigger */}
              <button 
                onClick={() => setSearchOpen(true)} 
                className="p-2 text-white active:scale-90 transition-transform"
              >
                <SearchIcon size={22} />
              </button>
              
              <Link href="/wishlist" className="relative p-2 text-white">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D4AF37] text-black text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 text-white">
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D4AF37] text-black text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => setMenuOpen(true)} 
                className="p-2 text-white"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY (Fixed Logic) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6"
          >
            <div className="flex justify-end">
              <button onClick={() => setSearchOpen(false)} className="text-white p-2">
                <X size={32} />
              </button>
            </div>
            <div className="mt-20 relative px-4">
              <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] mb-4 font-bold">Search Bannira</p>
              <input 
                autoFocus 
                type="search" 
                placeholder="Dresses, Kurtis, Sets..." 
                className="w-full bg-transparent border-b border-white/30 py-4 text-2xl text-white outline-none focus:border-[#D4AF37] transition-colors" 
              />
              <SearchIcon size={24} className="absolute right-4 top-[70%] -translate-y-1/2 text-white/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE SIDE DRAWER (Existing Logic) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[100] flex flex-col">
              {/* Drawer Content */}
              <div className="p-6 border-b flex justify-between items-center">
                <p className="font-serif text-xl text-[#7B2D0A] font-bold italic text-center w-full">Bannira</p>
                <X size={24} onClick={() => setMenuOpen(false)} className="text-gray-400 absolute right-6" />
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* User Info & Links */}
                <div className="bg-gray-50 p-5 rounded-2xl">
                  {isLoggedIn ? (
                    <button onClick={handleLogout} className="w-full text-red-600 font-bold uppercase text-[10px] tracking-widest">Logout</button>
                  ) : (
                    <button onClick={handleLoginClick} className="w-full bg-[#7B2D0A] text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em]">Login / Signup</button>
                  )}
                </div>
                <div className="space-y-1">
                  <MobileNavLink href="/products" onClick={() => setMenuOpen(false)} label="New Arrivals" />
                  <MobileNavLink href="/wishlist" onClick={() => setMenuOpen(false)} label={`Wishlist (${wishlistCount})`} />
                  <MobileNavLink href="/cart" onClick={() => setMenuOpen(false)} label={`Bag (${cartCount})`} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center justify-between py-5 border-b border-gray-50 text-[#2A1A12] font-medium text-base group active:text-[#7B2D0A] transition-colors">
      {label}
      <ArrowRight size={18} className="text-gray-300" />
    </Link>
  );
}