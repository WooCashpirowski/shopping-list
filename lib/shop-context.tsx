'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Shop } from '@/types/database';

const DEFAULT_SHOP_ID = '00000000-0000-0000-0000-000000000001';

interface ShopContextType {
  selectedShop: Shop | null;
  selectedShopId: string;
  setSelectedShop: (shop: Shop) => void;
  isLoading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [selectedShop, setSelectedShopState] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShop = async () => {
      // Load selected shop from localStorage or use default
      const storedShopId = localStorage.getItem('selectedShopId');
      const shopId = storedShopId || DEFAULT_SHOP_ID;
      
      // Fetch the actual shop data from database
      const { data } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();
      
      if (data) {
        setSelectedShopState(data);
      } else {
        // Fallback to default if shop not found
        const { data: defaultShop } = await supabase
          .from('shops')
          .select('*')
          .eq('id', DEFAULT_SHOP_ID)
          .single();
        
        if (defaultShop) {
          setSelectedShopState(defaultShop);
          localStorage.setItem('selectedShopId', DEFAULT_SHOP_ID);
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

  return (
    <ShopContext.Provider
      value={{
        selectedShop,
        selectedShopId: selectedShop?.id || DEFAULT_SHOP_ID,
        setSelectedShop,
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
