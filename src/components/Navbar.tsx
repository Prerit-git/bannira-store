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
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Image
          src={"/bannira_web_logo.png"}
          alt="png"
          width={180}
          height={80}
          loading="eager"
          className="object-cover w-auto h-auto"
        />

        {/* Nav Links */}
        {/* <nav className="hidden md:flex items-center gap-8">
          {["Home", "Collections", "New Arrivals", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm tracking-wide transition ${
                scrolled
                  ? "text-dark hover:text-primary"
                  : "text-white hover:text-gold"
              }`}
            >
              {item}
            </a>
          ))}
        </nav> */}

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 bg-[#F8F3EF] p-1 cursor-pointer rounded-full">
            <ShoppingBag
              size={25}
              className={`cursor-pointer ${
                scrolled ? "text-dark" : "text-[#7B2D0A]"
              }`}
            />
          </button>
          <button className="flex items-center gap-1 bg-[#F8F3EF] p-1 cursor-pointer rounded-full">
            <UserIcon
              size={25}
              className={`cursor-pointer ${
                scrolled ? "text-dark" : "text-[#7B2D0A]"
              }`}
            />
          </button>
          <List
            size={24}
            className={`md:hidden ${scrolled ? "text-dark" : "text-white"}`}
          />
        </div>
      </div>
    </header>
  );
}
