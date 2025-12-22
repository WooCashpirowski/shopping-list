'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/use-shopping-list';
import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons';
import CategoryList from '@/components/category-management/category-list';
import AddCategoryForm from '@/components/category-management/add-category-form';
import EditCategoryModal from '@/components/category-management/edit-category-modal';
import { ProtectedRoute } from '@/components/protected-route';
import type { Category } from '@/types/database';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
            <div className="flex items-start justify-between mb-4 animate-pulse">
              <div className="h-9 w-80 bg-gray-200 rounded"></div>
              <div className="w-12 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Add Category Form Skeleton */}
          <div className="mb-8 bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-7 w-56 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <div className="h-4 w-48 bg-gray-200 rounded mb-1"></div>
                <div className="h-20 w-full bg-gray-200 rounded-lg"></div>
                <div className="h-3 w-96 bg-gray-100 rounded mt-1"></div>
              </div>
              <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
        </div>
      ) : (
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
                  <ArrowLeftIcon />

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
      )}
    </ProtectedRoute>
  );
}
