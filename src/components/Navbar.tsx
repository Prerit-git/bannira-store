"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  Menu,
  X,
  Heart,
  UserCircle,
  LogOut,
  Search as SearchIcon,
  ShoppingBag,
  Clock,
  LayoutGrid,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Truck,
  Shirt,
  PhoneCall,
  UserPlus,
  Package,
  History,
  Store,
  Layers,
  MessageCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { InstagramLogo, WhatsappLogo } from "phosphor-react";

interface NavbarProps {
  isBarVisible?: boolean;
}

export default function Navbar({ isBarVisible = true }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { isLoggedIn, logout, setRedirectPath, userPhone } = useAuth();

  const wishlistCount = wishlist.length;
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const topSpacing = isBarVisible ? "top-2 md:top-5" : "top-0";

  const handleProtectedNavigation = (e: any, path: string) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setRedirectPath(path);
      router.push("/login");
    } else {
      router.push(path);
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
  }, [menuOpen, searchOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  const isHome = pathname === "/";
  const navbarBg = isHome
    ? scrolled
      ? "bg-[#7B2D0A] backdrop-blur-md shadow-md pt-5 md:pt-4"
      : "bg-transparent py-4"
    : "bg-[#7B2D0A] backdrop-blur-md shadow-md pt-5 md:pt-4";

  return (
    <>
      <header
        className={`fixed ${topSpacing} left-0 w-full z-50 transition-all duration-500 ${navbarBg}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href={"/"}
            className={`transition-all duration-500 ${scrolled ? "scale-75" : "scale-75"}`}
          >
            <Image
              src={"/bannira_web_logo2.png"}
              alt="logo"
              width={180}
              height={80}
              priority
              className="object-cover w-auto h-auto -ml-2 md:ml-0"
            />
          </Link>

          <div className="hidden md:flex flex-1 px-10">
            <div className="relative w-full max-w-xl mx-auto group">
              <input
                type="search"
                placeholder="Search kurtis, dresses..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-12 pr-4 text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all"
              />
              <SearchIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="relative group flex flex-col items-center cursor-pointer">
              <User
                size={24}
                className="text-white group-hover:text-[#D4AF37] transition-colors"
              />
              <span className="text-[10px] uppercase tracking-widest text-white mt-1">
                Account
              </span>

              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="p-5">
                  {isLoggedIn ? (
                    <div className="space-y-1">
                      <div className="pb-3 border-b border-gray-50 mb-2 text-left">
                        <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                          Active User
                        </p>
                        <p className="text-sm font-bold text-stone-800">
                          {userPhone}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 py-3 text-sm text-gray-700 hover:text-[#7B2D0A] transition-colors"
                      >
                        <UserCircle size={18} /> Profile
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="flex items-center justify-between py-3 text-sm text-gray-700 hover:text-[#7B2D0A] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Package size={18} /> My Orders
                        </div>
                        <span className="text-[8px] bg-stone-100 px-2 py-0.5 rounded-full font-black uppercase">
                          Track
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 py-3 w-full text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition-all mt-2"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => router.push("/login")}
                      className="w-full bg-[#7B2D0A] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                      <UserPlus size={16} className="inline mr-2" /> Login / Sign Up
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => handleProtectedNavigation(e, "/wishlist")}
              className="flex flex-col items-center relative group text-white"
            >
              <Heart
                size={24}
                className="group-hover:text-[#D4AF37] transition-colors"
              />
              {isLoggedIn && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-md">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[10px] uppercase tracking-widest mt-1">
                Wishlist
              </span>
            </button>

            <button
              onClick={(e) => handleProtectedNavigation(e, "/cart")}
              className="flex flex-col items-center relative group text-white"
            >
              <ShoppingBag
                size={24}
                className="group-hover:text-[#D4AF37] transition-colors"
              />
              {isLoggedIn && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
              <span className="text-[10px] uppercase tracking-widest mt-1">
                Bag
              </span>
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-white"
            >
              <SearchIcon size={22} />
            </button>
            <button
              onClick={(e) => handleProtectedNavigation(e, "/wishlist")}
              className="flex flex-col items-center relative group text-white"
            >
              <Heart
                size={24}
                className="group-hover:text-[#D4AF37] transition-colors"
              />
              {isLoggedIn && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={(e) => handleProtectedNavigation(e, "/cart")}
              className="relative p-2 text-white"
            >
              <ShoppingBag size={22} />
              {isLoggedIn && cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4AF37] text-black text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#FDFCFB] z-[100] flex flex-col shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center bg-white border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <UserCircle size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                      Account
                    </p>
                    <p className="text-xs font-bold text-stone-900">
                      {isLoggedIn ? userPhone : "Guest User"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-stone-50 rounded-full text-stone-900 active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 no-scrollbar">
                {!isLoggedIn && (
                  <div className="bg-[#1C1C1C] rounded-3xl p-6 text-white text-center">
                    <p className="text-sm font-serif italic mb-4">Discover Latest Arrivals</p>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/login");
                      }}
                      className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black uppercase text-[10px] tracking-widest"
                    >
                      <UserCircle size={16} className="inline mr-2" /> Sign In
                    </button>
                  </div>
                )}

                <section className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 px-2">
                    Menu
                  </p>
                  <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
                    <DrawerLink
                      href="/products"
                      icon={<Store size={18} />}
                      label="Shop All"
                      onClick={() => setMenuOpen(false)}
                    />
                    <DrawerLink
                      href="/profile/orders"
                      icon={<History size={18} />}
                      label="Track Orders"
                      onClick={() => setMenuOpen(false)}
                    />
                    <DrawerLink
                      href="/wishlist"
                      icon={<Heart size={18} />}
                      label="My Wishlist"
                      onClick={() => setMenuOpen(false)}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 px-2">
                    Categories
                  </p>
                  <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
                    <DrawerLink
                      href="/products?category=kurtis"
                      icon={<Shirt size={18} />}
                      label="Premium Kurtis"
                      onClick={() => setMenuOpen(false)}
                    />
                    <DrawerLink
                      href="/products?category=dresses"
                      icon={<Sparkles size={18} />}
                      label="Festive Wear"
                      onClick={() => setMenuOpen(false)}
                    />
                  </div>
                </section>

                <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-900 shadow-sm border border-stone-100">
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">Support</p>
                      <p className="text-[9px] text-stone-400 font-bold uppercase italic">Contact Bannira</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-stone-300" />
                </div>
              </div>

              <div className="p-6 bg-white border-t border-stone-100 space-y-6">
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 active:scale-95 transition-all"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex gap-5">
                    <Link href="https://instagram.com" className="text-stone-400 hover:text-black transition-colors">
                      <InstagramLogo size={18} />
                    </Link>
                    <Link href="https://wa.me/yournumber" className="text-stone-400 hover:text-black transition-colors">
                      <WhatsappLogo size={18} />
                    </Link>
                  </div>
                  <p className="text-[9px] font-black text-stone-300 tracking-[0.2em] uppercase">
                    Bannira © 2026
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setSearchOpen(false)}
                className="text-white p-2"
              >
                <X size={32} />
              </button>
            </div>
            <div className="mt-20 relative px-4">
              <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                Search Bannira
              </p>
              <input
                autoFocus
                type="search"
                placeholder="Search Kurtis, Dresses, etc.."
                className="w-full bg-transparent border-b border-white/30 py-4 text-2xl font-serif italic text-white outline-none focus:border-[#D4AF37]"
              />
              <SearchIcon
                size={24}
                className="absolute right-4 top-[70%] -translate-y-1/2 text-white/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ActionTile({ icon, title, subtitle, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-5 rounded-[1.8rem] text-left border border-stone-100 shadow-sm active:bg-stone-50 active:scale-95 transition-all flex flex-col gap-3"
    >
      <div className="p-2.5 bg-stone-50 rounded-xl w-fit">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">
          {title}
        </p>
        <p className="text-[9px] text-stone-400 font-bold uppercase mt-0.5">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

function DrawerLink({ href, icon, label, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white border border-stone-50 rounded-2xl active:bg-stone-100 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="text-stone-400">{icon}</div>
        <span className="text-sm font-bold text-stone-800 uppercase tracking-tight">
          {label}
        </span>
      </div>
      <ChevronRight size={16} className="text-stone-200" />
    </Link>
  );
}