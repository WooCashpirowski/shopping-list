'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/database';
import Button from '@/components/ui/button';
import { EditIcon, TrashIcon } from '@/components/icons';
import ConfirmationModal from '@/components/confirmation-modal';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export default function CategoryList({ categories, onEdit }: CategoryListProps) {
  const queryClient = useQueryClient();
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      // First, update all items with this category to have no category
      await supabase
        .from('items')
        .update({ category: '' })
        .eq('category', categories.find(c => c.id === categoryId)?.name || '');

      // Then delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Brak kategorii. Dodaj pierwszą kategorię powyżej.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
            {category.keywords && category.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {category.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Brak słów kluczowych</p>
            )}
          </div>
          
          <div className="flex -my-4 -mr-4 ml-2">
            <Button
              type='button'
              onClick={() => onEdit(category)}
              size="sm"
              className="mr-0.25 rounded-none"
              title='Edytuj'
            >
              <EditIcon />
            </Button>
            <button
              type='button'
              onClick={() => handleDelete(category)}
              disabled={deleteCategoryMutation.isPending}
              className="px-3 py-1 text-sm font-medium bg-linear-65 from-red-500 to-pink-500 text-white rounded-tr-lg rounded-br-lg disabled:opacity-50 bg-yellow-200"
              title='Usuń'
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}

      <ConfirmationModal
        isOpen={categoryToDelete !== null}
        title="Usuń kategorię"
        message={`Czy na pewno chcesz usunąć kategorię "${categoryToDelete?.name}"? Produkty z tej kategorii zostaną przeniesione do "Inne".`}
        confirmText="Usuń kategorię"
        cancelText="Anuluj"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
        isLoading={deleteCategoryMutation.isPending}
      />
    </div>
  );
}
