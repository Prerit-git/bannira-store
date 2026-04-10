"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, size: string) => void;
  updateQuantity: (id: string, size: string, newQuantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  totalPrice: number;
  appliedCoupon: string | null;
  discount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/user/sync");
          const data = await res.json();
          if (data.cart) {
            setCart(data.cart);
          }
        } catch (e) {
          console.error("Cart sync error", e);
        }
      } else {
        const savedCart = localStorage.getItem("bannira_cart");
        if (savedCart) setCart(JSON.parse(savedCart));
      }
      
      const savedCoupon = localStorage.getItem("bannira_coupon");
      if (savedCoupon) setAppliedCoupon(savedCoupon);
      
      setIsInitialLoaded(true);
    };
    loadCart();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isInitialLoaded) return;

    localStorage.setItem("bannira_cart", JSON.stringify(cart));
    
    if (isLoggedIn) {
      const syncDB = async () => {
        const cartData = cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size
        }));

        await fetch("/api/user/update-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: cartData }),
        });
      };
      const handler = setTimeout(syncDB, 1000);
      return () => clearTimeout(handler);
    }

    if (appliedCoupon) {
      localStorage.setItem("bannira_coupon", appliedCoupon);
    } else {
      localStorage.removeItem("bannira_coupon");
    }
  }, [cart, appliedCoupon, isLoggedIn, isInitialLoaded]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (appliedCoupon === "BANNIRA10") {
      setDiscount(Math.round(totalPrice * 0.10));
    } else {
      setDiscount(0);
    }
  }, [totalPrice, appliedCoupon]);

  const addToCart = (product: any, size: string) => {
    const productId = product.id || product._id;
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === productId && item.size === size);
      
      if (existingItem) {
        return prev.map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: productId, 
        name: product.name, 
        price: product.price, 
        image: product.image || (product.images && product.images[0]), 
        size, 
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (id: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem("bannira_cart");
    localStorage.removeItem("bannira_coupon");
  }, []); 

  const applyCoupon = (code: string) => {
    if (code.toUpperCase() === "BANNIRA10") {
      setAppliedCoupon("BANNIRA10");
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      totalPrice,
      appliedCoupon,
      discount,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};