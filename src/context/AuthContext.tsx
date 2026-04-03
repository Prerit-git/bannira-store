"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean; // Add kiya gaya
  userPhone: string | null;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
  login: (phone: string, otp: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initial loading true rakha hai
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // LocalStorage se check karne tak loading true rahegi
    const status = localStorage.getItem("isLoggedIn") === "true";
    const savedPhone = localStorage.getItem("userPhone");
    
    setIsLoggedIn(status);
    setUserPhone(savedPhone);
    
    // Logic khatam hone ke baad loading false
    setIsLoading(false);
  }, []);

  const login = (phone: string, otp: string) => {
    // Demo Logic: Phone '9999999999' with OTP '1234'
    if (phone.length >= 10 && otp === "1234") {
      setIsLoggedIn(true);
      setUserPhone(phone);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userPhone", phone);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserPhone(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userPhone");
    // clear() ki jagah specific items remove karna better hai 
    // taaki cart ya settings delete na ho jaye
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        isLoading, // Provide kiya gaya
        userPhone, 
        redirectPath, 
        setRedirectPath, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};