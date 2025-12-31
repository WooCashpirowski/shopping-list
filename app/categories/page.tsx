'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/use-shopping-list';
import AppMenu from '@/components/app-menu';
import CategoryList from '@/components/category-management/category-list';
import AddCategoryModal from '@/components/category-management/add-category-modal';
import EditCategoryModal from '@/components/category-management/edit-category-modal';
import { ProtectedRoute } from '@/components/protected-route';
import { PlusIcon } from '@/components/icons';
import type { Category } from '@/types/database';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
            <div className="flex items-start justify-between mb-4 animate-pulse">
              <div className="h-9 w-80 bg-gray-200 rounded"></div>
              <div className="w-12 h-10 bg-gray-200 rounded-sm"></div>
            </div>
          </div>

          {/* Add Category Form Skeleton */}
          <div className="mb-8 bg-white rounded-sm shadow p-4 animate-pulse">
            <div className="h-7 w-56 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-10 w-full bg-gray-200 rounded-sm"></div>
              </div>
              <div>
                <div className="h-4 w-48 bg-gray-200 rounded mb-1"></div>
                <div className="h-20 w-full bg-gray-200 rounded-sm"></div>
                <div className="h-3 w-96 bg-gray-100 rounded mt-1"></div>
              </div>
              <div className="h-10 w-full bg-gray-200 rounded-sm"></div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Kategorie ({categories.length})</h1>
                <AppMenu />
              </div>

            {/* Add Category Tile Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 flex flex-col items-center justify-center min-h-[140px] group w-full"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <PlusIcon className='w-6 h-6 text-blue-600'/>
                </div>
                <span className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
                  Dodaj kategorię
                </span>
              </button>
            </div>

            {/* Categories List */}
            <CategoryList
              categories={categories}
              onEdit={setEditingCategory}
            />
          </div>

          {/* Modals */}
          <AddCategoryModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
          />

          {editingCategory && (
            <EditCategoryModal
              category={editingCategory}
              onClose={() => setEditingCategory(null)}
            />
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
