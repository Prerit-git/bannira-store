"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Product } from "@/data/products";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const { isLoggedIn } = useAuth();
  const initialFetchDone = useRef(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/user/sync");
          const data = await res.json();
          if (data.wishlist) {
            setWishlist(data.wishlist);
          }
        } catch (e) {
          console.error("Error syncing wishlist", e);
        }
      } else {
        const savedWishlist = localStorage.getItem("bannira_wishlist");
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      }
      initialFetchDone.current = true;
      setIsInitialLoaded(true);
    };
    loadWishlist();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!initialFetchDone.current) return;

    localStorage.setItem("bannira_wishlist", JSON.stringify(wishlist));
    
    if (isLoggedIn) {
      const syncDB = async () => {
        const ids = wishlist.map((item: any) => item.id || item._id);
        await fetch("/api/user/update-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wishlist: ids }),
        });
      };
      const handler = setTimeout(syncDB, 500);
      return () => clearTimeout(handler);
    }
  }, [wishlist, isLoggedIn]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const productId = product.id || (product as any)._id;
      const isExist = prev.find((item) => (item.id || (item as any)._id) === productId);
      
      if (isExist) {
        return prev.filter((item) => (item.id || (item as any)._id) !== productId);
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => (item.id || (item as any)._id) !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => (item.id || (item as any)._id) === id);
  };
  
  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};