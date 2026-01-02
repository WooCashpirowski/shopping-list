'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Shop } from '@/types/database';

interface ShopContextType {
  selectedShop: Shop | null;
  selectedShopId: string | null;
  setSelectedShop: (shop: Shop) => void;
  clearSelectedShop: () => void;
  isLoading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [selectedShop, setSelectedShopState] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShop = async () => {
      // Load selected shop from localStorage
      const storedShopId = localStorage.getItem('selectedShopId');
      
      if (storedShopId) {
        // Fetch the actual shop data from database
        const { data } = await supabase
          .from('shops')
          .select('*')
          .eq('id', storedShopId)
          .single();
        
        if (data) {
          setSelectedShopState(data);
        } else {
          // Shop no longer exists, clear localStorage
          localStorage.removeItem('selectedShopId');
        }
      }
      
      setIsLoading(false);
    };

    loadShop();
  }, []);

  const setSelectedShop = (shop: Shop) => {
    setSelectedShopState(shop);
    localStorage.setItem('selectedShopId', shop.id);
  };

  const clearSelectedShop = () => {
    setSelectedShopState(null);
    localStorage.removeItem('selectedShopId');
  };

  return (
    <ShopContext.Provider
      value={{
        selectedShop,
        selectedShopId: selectedShop?.id || null,
        setSelectedShop,
        clearSelectedShop,
        isLoading,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShopContext() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
}
