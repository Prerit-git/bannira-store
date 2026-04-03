"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  userPhone: string | null;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
  login: (phone: string, otp: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    const savedPhone = localStorage.getItem("userPhone");
    
    setIsLoggedIn(status);
    setUserPhone(savedPhone);
    
    setIsLoading(false);
  }, []);

  const login = (phone: string, otp: string) => {
    //Phone '9999999999' with OTP '1234'
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
   
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        isLoading, 
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