'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/database';

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
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-lg shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Edytuj kategorię
              </DialogTitle>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-category-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa kategorii
                </label>
                <input
                  id="edit-category-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={updateCategoryMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {updateCategoryMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
