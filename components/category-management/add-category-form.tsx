'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/button';

interface AddCategoryFormProps {
  onSuccess?: () => void;
}

export default function AddCategoryForm({ onSuccess }: AddCategoryFormProps = {}) {
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; keywords: string[] }) => {
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({ name: data.name, keywords: data.keywords })
        .select()
        .single();
      
      if (categoryError) throw categoryError;

      // Get all existing shops
      const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('id');
      
      if (shopsError) throw shopsError;

      // Create position entries for all shops
      if (shops && shops.length > 0 && newCategory) {
        // Get the max position for each shop to append the new category at the end
        const positionPromises = shops.map(async (shop) => {
          const { data: positions } = await supabase
            .from('shop_category_positions')
            .select('position')
            .eq('shop_id', shop.id)
            .order('position', { ascending: false })
            .limit(1);
          
          const maxPosition = positions && positions.length > 0 ? positions[0].position : -1;
          
          return {
            shop_id: shop.id,
            category_id: newCategory.id,
            position: maxPosition + 1,
          };
        });

        const positionsToInsert = await Promise.all(positionPromises);

        const { error: positionsError } = await supabase
          .from('shop_category_positions')
          .insert(positionsToInsert);
        
        if (positionsError) throw positionsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      setKeywords('');
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const keywordArray = keywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    addCategoryMutation.mutate({ name: name.trim(), keywords: keywordArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
          Nazwa kategorii
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="np. Owoce"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label htmlFor="category-keywords" className="block text-sm font-medium text-gray-700 mb-1">
          Słowa kluczowe (oddzielone przecinkami)
        </label>
        <textarea
          id="category-keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="np. jabłko, gruszka, banan, pomarańcza"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          Wprowadź słowa kluczowe oddzielone przecinkami. Produkty zawierające te słowa będą automatycznie przypisywane do tej kategorii.
        </p>
      </div>

      <Button type="submit" disabled={addCategoryMutation.isPending} fullWidth>
        {addCategoryMutation.isPending ? 'Dodawanie...' : 'Dodaj kategorię'}
      </Button>

      {addCategoryMutation.isError && (
        <p className="text-sm text-red-600">
          Błąd: {(addCategoryMutation.error as Error).message}
        </p>
      )}
    </form>
  );
}
