'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/button';

export default function AddCategoryForm() {
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; keywords: string[] }) => {
      const { error } = await supabase
        .from('categories')
        .insert({ name: data.name, keywords: data.keywords });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      setKeywords('');
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
