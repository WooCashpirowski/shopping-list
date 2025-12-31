'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/database';
import Button from '@/components/ui/button';

interface EditCategoryModalProps {
  category: Category;
  onClose: () => void;
}

export default function EditCategoryModal({ category, onClose }: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [keywords, setKeywords] = useState(category.keywords?.join(', ') || '');
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; keywords: string[] }) => {
      const oldName = category.name;
      
      // Update the category
      const { error: categoryError } = await supabase
        .from('categories')
        .update({ name: data.name, keywords: data.keywords })
        .eq('id', category.id);
      
      if (categoryError) throw categoryError;

      // If name changed, update all items with the old category name
      if (oldName !== data.name) {
        const { error: itemsError } = await supabase
          .from('items')
          .update({ category: data.name })
          .eq('category', oldName);
        
        if (itemsError) throw itemsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const keywordArray = keywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    updateCategoryMutation.mutate({ name: name.trim(), keywords: keywordArray });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edytuj kategorię"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            Anuluj
          </button>
          <Button
            type="submit"
            form="edit-category-form"
            disabled={updateCategoryMutation.isPending}
            className="flex-1"
          >
            {updateCategoryMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
          </Button>
        </>
      }
    >
      <form id="edit-category-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-category-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nazwa kategorii
          </label>
          <input
            id="edit-category-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="edit-category-keywords" className="block text-sm font-medium text-gray-700 mb-1">
            Słowa kluczowe (oddzielone przecinkami)
          </label>
          <textarea
            id="edit-category-keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Wprowadź słowa kluczowe oddzielone przecinkami.
          </p>
        </div>

        {updateCategoryMutation.isError && (
          <p className="text-sm text-red-600">
            Błąd: {(updateCategoryMutation.error as Error).message}
          </p>
        )}
      </form>
    </Modal>
  );
}
