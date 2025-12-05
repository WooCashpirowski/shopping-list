'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/use-shopping-list';
import Link from 'next/link';
import CategoryList from '@/components/category-management/category-list';
import AddCategoryForm from '@/components/category-management/add-category-form';
import EditCategoryModal from '@/components/category-management/edit-category-modal';
import type { Category } from '@/types/database';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Ładowanie...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Zarządzanie kategoriami</h1>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>

            </Link>
          </div>
        </div>

        {/* Add Category Form */}
        <div className="mb-8 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dodaj nową kategorię</h2>
          <AddCategoryForm />
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Kategorie ({categories.length})
          </h2>
          <CategoryList
            categories={categories}
            onEdit={setEditingCategory}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}
