"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Menu, Search, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [searchOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/30 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-5"
        }`}
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

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 bg-[#F8F3EF] p-1 rounded-full">
                <User
                  size={26}
                  className={`transition-colors ${
                    scrolled ? "text-black" : "text-[#7B2D0A]"
                  }`}
                />
              </button>

              {/* Search icon */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className={`p-2 rounded-full bg-[#F8F3EF] ${
                  scrolled ? "text-black" : "text-[#7B2D0A]"
                }`}
              >
                <Search size={20} />
              </button>

              {/* Hamburger menu */}
              <Menu
                size={24}
                className={`cursor-pointer transition-colors ml-2 ${
                  scrolled ? "text-black" : "text-white"
                }`}
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
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 bg-[#F8F3EF] p-1 rounded-full">
                {/* Shopping bag icon for desktop */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-6 h-6 transition-colors ${
                    scrolled ? "text-black" : "text-[#7B2D0A]"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6M17 13l1.2 6M6 19a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>

              <button className="flex items-center gap-1 bg-[#F8F3EF] p-1 rounded-full">
                <User
                  size={25}
                  className={`transition-colors ${
                    scrolled ? "text-black" : "text-[#7B2D0A]"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FULLSCREEN SEARCH OVERLAY */}
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
    </>
  );
}
