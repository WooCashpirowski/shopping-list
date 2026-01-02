import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useShopContext } from '@/lib/shop-context';

import type { Item, InsertItem, UpdateItem, Shop, CategoryWithPosition } from '@/types/database';

const SHOP_ID = '00000000-0000-0000-0000-000000000001';

// Fetch categories with shop-specific positions
export function useCategories(shopId?: string) {
  const { selectedShopId } = useShopContext();
  const effectiveShopId = shopId || selectedShopId;
  
  return useQuery({
    queryKey: ['categories', effectiveShopId],
    queryFn: async () => {
      // Fetch all categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*');
      
      if (catError) throw catError;
      
      // If no shop is selected, return categories without shop-specific positions
      if (!effectiveShopId) {
        return categories.map((cat, index) => ({
          ...cat,
          position: index,
        })) as CategoryWithPosition[];
      }
      
      // Fetch shop-specific positions
      const { data: positions, error: posError } = await supabase
        .from('shop_category_positions')
        .select('*')
        .eq('shop_id', effectiveShopId)
        .order('position', { ascending: true });
      
      if (posError) throw posError;
      
      // If no positions exist for this shop, create default positions
      if (!positions || positions.length === 0) {
        const defaultPositions = categories.map((cat, index) => ({
          shop_id: effectiveShopId,
          category_id: cat.id,
          position: index,
        }));
        
        const { error: insertError } = await supabase
          .from('shop_category_positions')
          .insert(defaultPositions);
        
        if (insertError) throw insertError;
        
        // Return categories with default positions
        return categories.map((cat, index) => ({
          ...cat,
          position: index,
        })) as CategoryWithPosition[];
      }
      
      // Map categories with their shop-specific positions
      const positionsMap = new Map(positions.map(p => [p.category_id, p.position]));
      
      return categories
        .map(cat => ({
          ...cat,
          position: positionsMap.get(cat.id) ?? 999,
        }))
        .sort((a, b) => a.position - b.position) as CategoryWithPosition[];
    },
  });
}

// Fetch items
export function useItems(shopId?: string) {
  const { selectedShopId } = useShopContext();
  const effectiveShopId = shopId || selectedShopId;
  
  return useQuery({
    queryKey: ['items', effectiveShopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('shop_id', effectiveShopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Item[];
    },
  });
}

// Add item mutation
export function useAddItem() {
  const queryClient = useQueryClient();
  const { selectedShopId } = useShopContext();
  
  return useMutation({
    mutationFn: async (item: InsertItem) => {
      const { data, error } = await supabase
        .from('items')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', selectedShopId] });
    },
  });
}

// Update item mutation
export function useUpdateItem() {
  const queryClient = useQueryClient();
  const { selectedShopId } = useShopContext();
  
  return useMutation({
    mutationFn: async ({ id, update }: { id: string; update: UpdateItem }) => {
      const { data, error } = await supabase
        .from('items')
        .update({ ...update, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', selectedShopId] });
    },
  });
}

// Delete item mutation
export function useDeleteItem() {
  const queryClient = useQueryClient();
  const { selectedShopId } = useShopContext();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', selectedShopId] });
    },
  });
}

// Toggle done mutation
export function useToggleDone() {
  const queryClient = useQueryClient();
  const { selectedShopId } = useShopContext();
  
  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const { error } = await supabase
        .from('items')
        .update({ done, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', selectedShopId] });
    },
  });
}

// Delete all items mutation
export function useDeleteAllItems() {
  const queryClient = useQueryClient();
  const { selectedShopId } = useShopContext();
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('shop_id', selectedShopId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', selectedShopId] });
    },
  });
}

// Update category keywords
export function useUpdateCategoryKeywords() {
  const queryClient = useQueryClient();
  const { selectedShopId } = useShopContext();
  
  return useMutation({
    mutationFn: async ({ categoryId, keywords }: { categoryId: string; keywords: string[] }) => {
      const { error } = await supabase
        .from('categories')
        .update({ keywords })
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', selectedShopId] });
    },
  });
}

// Update category positions for specific shop
export function useUpdateCategoryPositions() {
  const queryClient = useQueryClient();
  const { selectedShopId } = useShopContext();
  
  return useMutation({
    mutationFn: async (updates: { id: string; position: number }[]) => {
      const promises = updates.map(({ id, position }) =>
        supabase
          .from('shop_category_positions')
          .update({ position })
          .eq('shop_id', selectedShopId)
          .eq('category_id', id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        throw new Error('Failed to update category positions');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', selectedShopId] });
    },
  });
}

export const SHOP_ID_CONSTANT = SHOP_ID;

// ===== SHOPS MANAGEMENT =====

// Fetch all shops
export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Shop[];
    },
  });
}

// Create a new shop
export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      // Create the new shop
      const { data: newShop, error: shopError } = await supabase
        .from('shops')
        .insert({ name })
        .select()
        .single();
      
      if (shopError) throw shopError;
      
      // Get default positions from the default shop to copy order
      const { data: defaultPositions, error: posError } = await supabase
        .from('shop_category_positions')
        .select('category_id, position')
        .eq('shop_id', SHOP_ID)
        .order('position', { ascending: true });
      
      // If default shop has positions, copy them for the new shop
      if (defaultPositions && defaultPositions.length > 0) {
        const newPositions = defaultPositions.map(pos => ({
          shop_id: newShop.id,
          category_id: pos.category_id,
          position: pos.position,
        }));

        const { error: insertError } = await supabase
          .from('shop_category_positions')
          .insert(newPositions);
        
        if (insertError) throw insertError;
      }
      
      return newShop as Shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
}

// Delete a shop
export function useDeleteShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shopId: string) => {
      // Delete shop_category_positions (will cascade automatically via ON DELETE CASCADE)
      // Delete items for this shop
      const { error: itemsError } = await supabase
        .from('items')
        .delete()
        .eq('shop_id', shopId);
      
      if (itemsError) throw itemsError;

      // Delete the shop itself (this will cascade delete shop_category_positions)
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', shopId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// Update shop name
export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shopId, name }: { shopId: string; name: string }) => {
      const { data, error } = await supabase
        .from('shops')
        .update({ name })
        .eq('id', shopId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
}
