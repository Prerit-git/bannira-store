"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"; // Added useCallback

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

  useEffect(() => {
    const savedCart = localStorage.getItem("bannira_cart");
    const savedCoupon = localStorage.getItem("bannira_coupon");
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    if (savedCoupon) setAppliedCoupon(savedCoupon);
  }, []);

  useEffect(() => {
    localStorage.setItem("bannira_cart", JSON.stringify(cart));
    if (appliedCoupon) {
      localStorage.setItem("bannira_coupon", appliedCoupon);
    } else {
      localStorage.removeItem("bannira_coupon");
    }
  }, [cart, appliedCoupon]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (appliedCoupon === "BANNIRA10") {
      setDiscount(Math.round(totalPrice * 0.10));
    } else {
      setDiscount(0);
    }
  }, [totalPrice, appliedCoupon]);

  const addToCart = (product: any, size: string) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: product.id, 
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

  // ==========================================
  // FIX: wrap clearCart in useCallback
  // ==========================================
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