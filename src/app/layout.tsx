import type { Metadata } from "next";
import "./globals.css";
import { Libre_Baskerville, Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import { WishlistProvider } from "@/context/WishlistContext";
// import { AuthProvider } from "@/context/AuthContext";
// import { CartProvider } from "@/context/CartContext";
// import LoginStickyBar from "@/components/LoginStickyBar";
import ScrollToTop from "@/components/ScrollToTop";
import LayoutWrapper from "@/components/LayoutWrapper";
// import { ProductProvider } from "@/context/ProductContext";
// import { SessionProvider } from "next-auth/react";
import Providers from "@/components/Providers";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bannira Store",
  description: "Culture in color, Style in spirit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${libre.variable} ${poppins.variable} antialiased`}>
        <Providers>
          <ScrollToTop />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
