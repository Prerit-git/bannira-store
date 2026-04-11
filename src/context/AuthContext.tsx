"use client";

import React, { createContext, useContext, useState } from "react";
import { useSession, signOut } from "next-auth/react";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: any; 
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";
  
  const user = session?.user ? {
    ...session.user,
    id: (session.user as any).id || (session.user as any)._id 
  } : null;

  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        isLoading, 
        user, 
        redirectPath, 
        setRedirectPath, 
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