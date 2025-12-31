'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: [1] }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  if (categories.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Brak kategorii. Dodaj pierwszą kategorię powyżej.
      </div>
    );
  }

  const filteredCategories = categories.filter((category) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = category.name.toLowerCase().includes(searchLower);
    const keywordMatch = category.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchLower)
    );
    return nameMatch || keywordMatch;
  });

  return (
    <>
      <div ref={sentinelRef} className="h-px -mb-px" />
      <div className={`sticky top-0 z-10 p-4 -mx-4 transition-shadow ${isStuck ? 'bg-white shadow-md' : ''}`}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Szukaj..."
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-1">
            Znaleziono: {filteredCategories.length} {filteredCategories.length === 1 ? 'kategoria' : 'kategorii'}
          </p>
        )}
      </div>
      <div className="space-y-3">

        {/* Category list */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-2 text-gray-500">
            Nie znaleziono kategorii pasujących do "{searchTerm}"
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="flex justify-between bg-white p-4 border border-gray-200 rounded-sm hover:border-gray-300 transition-colors overflow-hidden"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                {category.keywords && category.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {category.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-xs"
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
                  className="mr-0.25 rounded-xs"
                  title='Edytuj'
                >
                  <EditIcon />
                </Button>
                <Button
                  type='button'
                  onClick={() => handleDelete(category)}
                  size="sm"
                  variant='danger'
                  disabled={deleteCategoryMutation.isPending}
                  className="rounded-xs"
                  title='Usuń'
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))
        )}

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
    </>
  );
}
