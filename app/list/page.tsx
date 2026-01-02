'use client'

import { useEffect } from 'react';
import ShoppingList from '@/components/shopping-list';
import { ProtectedRoute } from '@/components/protected-route';
import { useShopContext } from '@/lib/shop-context';
import { useRouter } from 'next/navigation';

export default function ListPage() {
  const { selectedShop, isLoading } = useShopContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !selectedShop) {
      router.push('/');
    }
  }, [selectedShop, isLoading, router]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-8 text-gray-500">Ładowanie...</div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (!selectedShop) {
    return null;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <ShoppingList />
        </div>
      </main>
    </ProtectedRoute>
  );
}
