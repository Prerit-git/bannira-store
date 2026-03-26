"use client";

import { useEffect, useState } from "react";
import { List, ShoppingBag } from "phosphor-react";
import Image from "next/image";
import { UserIcon } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/30 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
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

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 bg-[#F8F3EF] p-1 rounded-full">
            <ShoppingBag
              size={25}
              className={`transition-colors ${
                scrolled ? "text-black" : "text-[#7B2D0A]"
              }`}
            />
          </button>

          <button className="flex items-center gap-1 bg-[#F8F3EF] p-1 rounded-full">
            <UserIcon
              size={25}
              className={`transition-colors ${
                scrolled ? "text-black" : "text-[#7B2D0A]"
              }`}
            />
          </button>

          <List
            size={24}
            className={`md:hidden transition-colors ${
              scrolled ? "text-black" : "text-white"
            }`}
          />
        </div>
      </div>
    </header>
  );
}