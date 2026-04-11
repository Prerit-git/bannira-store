"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

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
  const [notification, setNotification] = useState<{message: string, visible: boolean}>({
  message: "",
  visible: false
});

const showToast = (msg: string) => {
  setNotification({ message: msg, visible: true });
  setTimeout(() => setNotification({ message: "", visible: false }), 3000);
};

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
    const availableStock = product.quantity;

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === productId && item.size === size);
      
      if (existingItem) {
        if (existingItem.quantity + 1 > availableStock) {
          showToast(`Limit reached: Only ${availableStock} units available in stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (availableStock < 1) {
        showToast("Out of stock");
        return prev;
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

  const updateQuantity = async (id: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const res = await fetch(`/api/products/${id}`);

      if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch stock");
    }
      const productData = await res.json();
      
      if (!res.ok) throw new Error("Failed to fetch stock");

      const availableStock = productData.quantity;

      if (newQuantity > availableStock) {
        showToast(`Limit reached: Only ${availableStock} units available in stock.`);
        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Stock validation error:", error);
    }
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

      <AnimatePresence>
      {notification.visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[999] w-[90%] md:w-auto"
        >
          <div className="bg-[#1C1C1C] text-[#D4AF37] px-8 py-4 rounded-2xl shadow-2xl border border-[#D4AF37]/20 flex items-center gap-4 backdrop-blur-md bg-opacity-95">
            <div className="bg-[#D4AF37] text-black rounded-full p-1">
              <ShieldCheck size={16} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
              {notification.message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};