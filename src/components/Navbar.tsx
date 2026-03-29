"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  Menu,
  Search,
  X,
  Handbag,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  const isHome = pathname === "/";
  const navbarBg = isHome
    ? scrolled
      ? "bg-black/30 backdrop-blur-md shadow-sm py-2"
      : "bg-transparent py-2"
    : "bg-black/70 backdrop-blur-md shadow-sm py-2";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navbarBg}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* MOBILE NAVBAR TOP ROW */}
          <div className="flex items-center justify-between md:hidden">
            {/* Logo left */}
            <div
              className={`transition-all duration-500 ${
                scrolled ? "scale-75" : "scale-100"
              }`}
            >
              <Image
                src={"/bannira_web_logo.png"}
                alt="logo"
                width={140}
                height={60}
                priority
                className="object-contain w-auto h-auto scale-90"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* <button className="flex items-center gap-1  p-1 rounded-full">
                <User
                  size={20}
                  className={`transition-colors ${
                    scrolled ? "text-white" : "text-[#ffffff]"
                  }`}
                />
              </button> */}

              {/* Search icon */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className={`p-2 rounded-full  ${
                  scrolled ? "text-white" : "text-[#ffffff]"
                }`}
              >
                <Search size={20} />
              </button>

              {/* Hamburger menu */}
              <Menu
                size={24}
                onClick={() => setMenuOpen(true)}
                className="cursor-pointer text-white ml-2"
              />
            </div>
          </div>

          {/* DESKTOP NAVBAR */}
          <div className="hidden md:flex items-center justify-between py-2">
            {/* Logo left */}
            <div
              className={`transition-all duration-500 ${
                scrolled ? "scale-75" : "scale-100"
              }`}
            >
              <Image
                src={"/bannira_web_logo.png"}
                alt="logo"
                width={180}
                height={80}
                priority
                className="object-contain w-auto h-auto scale-80 md:scale-100"
              />
            </div>

            {/* Search Box center */}
            <div className="flex-1 px-4">
              <div className="relative w-full max-w-xl mx-auto">
                <input
                  type="search"
                  placeholder="Search for kurtis, maxi dresses, kurti sets..."
                  className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-full py-2 pl-12 pr-4 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
                />
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
                />
              </div>
            </div>

            {/* Icons right */}
            <div className="flex items-center gap-6">
              {/* PROFILE */}
              <div className="relative group flex flex-col items-center cursor-pointer">
                <User size={25} className="text-white" />
                <span className="text-xs text-white mt-1">Profile</span>

                {/* DROPDOWN */}
                <div className="absolute top-12 -right-20 w-64 bg-white text-black rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold">Welcome</p>
                    <p className="text-sm text-gray-500 mb-3">
                      Please Login to access your profile.
                    </p>
                    <button className="border border-[#7B2D0A] text-[#7B2D0A] px-4 py-2 text-sm font-semibold hover:bg-red-50 transition">
                      LOGIN / SIGNUP
                    </button>
                  </div>
                </div>
              </div>

              {/* WISHLIST */}
              <div className="flex flex-col items-center cursor-pointer">
                <Heart size={25} className="text-white" />
                <span className="text-xs text-white mt-1">Wishlist</span>
              </div>

              {/* CART */}
              <div className="flex flex-col items-center cursor-pointer">
                <ShoppingCart size={25} className="text-white" />
                <span className="text-xs text-white mt-1">Cart</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 w-full h-30 bg-black/20 backdrop-blur-md z-9999 flex items-center justify-center px-6 transition-all duration-300 ease-in-out ${
          searchOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-full"
        }`}
      >
        <div className="relative w-full max-w-lg">
          <input
            autoFocus={searchOpen}
            type="search"
            placeholder="Search kurtis, maxi dresses, kurti sets..."
            className="w-full rounded-full py-4 pl-14 pr-14 bg-white/20 backdrop-blur-md border border-white/30 placeholder-gray-200 text-white focus:outline-none focus:ring-4 focus:ring-[#D4AF37] transition"
          />
          <Search
            size={24}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white"
          />
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20 transition"
          >
            <X size={28} />
          </button>
        </div>
      </div>
      {/* OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen
            ? "bg-black/40 backdrop-blur-sm opacity-100 visible"
            : "bg-black/0 backdrop-blur-0 opacity-0 invisible"
        }`}
      />

      {/* DRAWER */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl
  transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
  ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="p-4 border-b">
          <p className="font-semibold text-lg">Welcome</p>
          <p className="text-sm text-gray-500 mb-3">
            Please Login to access your profile.
          </p>
          <button className="w-full border border-[#7B2D0A] text-[#7B2D0A] px-4 py-2 text-sm font-semibold hover:bg-red-50 transition">
            LOGIN / SIGNUP
          </button>
        </div>

        {/* MENU OPTIONS */}
        <div className="p-4 space-y-4 text-sm">
          <div className="flex items-center gap-3 cursor-pointer">
            <Heart size={20} />
            <span>Wishlist</span>
          </div>

          <div className="flex items-center gap-3 cursor-pointer">
            <ShoppingCart size={20} />
            <span>Cart</span>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4"
        >
          <X size={24} />
        </button>
      </div>
    </>
  );
}
