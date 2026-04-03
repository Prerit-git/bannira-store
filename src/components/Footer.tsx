"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <img
            src="/bannira_web_logo.png"
            alt="Bannira Logo"
            className="mb-6 w-40 object-contain"
            loading="lazy"
          />
          <p className="text-gray-400 max-w-xs leading-relaxed">
            Bannira celebrates the elegance of tradition with timeless kurtis
            and ethnic wear, crafted for modern women who value style, comfort,
            and quality.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <a href="/products" className="hover:text-[#D4AF37] transition">
                Products
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-[#D4AF37] transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#D4AF37] transition">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-[#D4AF37] transition">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-6">
            Customer Service
          </h3>
          <ul className="space-y-3">
            <li>
              <a href="/shipping" className="hover:text-[#D4AF37] transition">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="/returns" className="hover:text-[#D4AF37] transition">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-[#D4AF37] transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-[#D4AF37] transition">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Follow Us</h3>
          <div className="flex space-x-6 text-gray-400">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-[#D4AF37] transition"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.337v21.326C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.658-4.788 1.325 0 2.466.098 2.796.142v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.312h3.588l-.467 3.622h-3.12V24h6.116c.726 0 1.325-.6 1.325-1.337V1.337C24 .6 23.4 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-[#D4AF37] transition"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5a4.25 4.25 0 00-4.25-4.25h-8.5zm8.02 3.77a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zm-4.02 1.96a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.5a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="hover:text-[#D4AF37] transition"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.724 9.903 9.903 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482 13.978 13.978 0 01-10.148-5.144 4.822 4.822 0 001.523 6.574 4.9 4.9 0 01-2.229-.616v.06a4.93 4.93 0 003.946 4.827 4.996 4.996 0 01-2.224.084 4.927 4.927 0 004.604 3.417A9.868 9.868 0 010 19.54a13.941 13.941 0 007.548 2.209c9.056 0 14.004-7.496 14.004-13.985 0-.213-.005-.425-.014-.636A9.936 9.936 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-16 pt-8 text-center text-gray-500 text-sm select-none">
        &copy; {new Date().getFullYear()} Bannira. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
