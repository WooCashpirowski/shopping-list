import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Item, InsertItem, UpdateItem, Category } from '@/types/database';

const SHOP_ID = '00000000-0000-0000-0000-000000000001';

// Fetch categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories', SHOP_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`shop_id.eq.${SHOP_ID},shop_id.is.null`)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });
}

// Fetch items
export function useItems() {
  return useQuery({
    queryKey: ['items', SHOP_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('shop_id', SHOP_ID)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Item[];
    },
  });
}

// Add item mutation
export function useAddItem() {
  const queryClient = useQueryClient();
  
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
      queryClient.invalidateQueries({ queryKey: ['items', SHOP_ID] });
    },
  });
}

// Update item mutation
export function useUpdateItem() {
  const queryClient = useQueryClient();
  
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
      queryClient.invalidateQueries({ queryKey: ['items', SHOP_ID] });
    },
  });
}

// Delete item mutation
export function useDeleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', SHOP_ID] });
    },
  });
}

// Toggle done mutation
export function useToggleDone() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const { error } = await supabase
        .from('items')
        .update({ done, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', SHOP_ID] });
    },
  });
}

// Delete all items mutation
export function useDeleteAllItems() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('shop_id', SHOP_ID);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', SHOP_ID] });
    },
  });
}

// Update category keywords
export function useUpdateCategoryKeywords() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ categoryId, keywords }: { categoryId: string; keywords: string[] }) => {
      const { error } = await supabase
        .from('categories')
        .update({ keywords })
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', SHOP_ID] });
    },
  });
}

// Update category positions
export function useUpdateCategoryPositions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: { id: string; position: number }[]) => {
      const promises = updates.map(({ id, position }) =>
        supabase
          .from('categories')
          .update({ position })
          .eq('id', id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        throw new Error('Failed to update category positions');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', SHOP_ID] });
    },
  });
}

export const SHOP_ID_CONSTANT = SHOP_ID;
