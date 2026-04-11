"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products"; 

interface ProductContextType {
  allProducts: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Helper function to create slug
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/products");
      
      if (!res.ok) throw new Error("Database connection failed");
      
      const data = await res.json();

      const formattedProducts = data.map((product: any) => {
        const id = product._id?.toString() || product.id;
        return {
          ...product,
          id: id,
          slug: `${generateSlug(product.name)}-${id.slice(-4)}`
        };
      });

      setAllProducts(formattedProducts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{ 
      allProducts, 
      isLoading, 
      error, 
      refreshProducts: fetchProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("Use useProducts provider");
  }
  return context;
}