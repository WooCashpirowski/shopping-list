'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useShops, useCreateShop, useDeleteShop, useUpdateShop } from '@/hooks/use-shopping-list';
import { useShopContext } from '@/lib/shop-context';
import { ProtectedRoute } from '@/components/protected-route';
import CreateShopModal from '@/components/create-shop-modal';
import EditShopModal from '@/components/edit-shop-modal';
import ConfirmationModal from '@/components/confirmation-modal';
import AppMenu from '@/components/app-menu';
import { ClipboardIcon, PlusIcon, TrashIcon, EditIcon } from '@/components/icons';
import type { Shop } from '@/types/database';

export default function Home() {
  const router = useRouter();
  const { data: shops = [], isLoading } = useShops();
  const createShopMutation = useCreateShop();
  const deleteShopMutation = useDeleteShop();
  const updateShopMutation = useUpdateShop();
  const { setSelectedShop } = useShopContext();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);
  const [shopToEdit, setShopToEdit] = useState<Shop | null>(null);

  const handleCreateShop = async (name: string) => {
    const newShop = await createShopMutation.mutateAsync(name);
    setShowCreateModal(false);
    // Optionally switch to the new shop and navigate
    setSelectedShop(newShop);
    router.push('/list');
  };

  const handleSelectShop = (shop: Shop) => {
    setSelectedShop(shop);
    router.push('/list');
  };

  const handleDeleteShop = () => {
    if (shopToDelete) {
      deleteShopMutation.mutate(shopToDelete.id);
      setShopToDelete(null);
    }
  };

  const handleEditShop = async (name: string) => {
    if (shopToEdit) {
      await updateShopMutation.mutateAsync({ shopId: shopToEdit.id, name });
      setShopToEdit(null);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-lg shadow-md animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Moje listy</h1>
              <p className="text-gray-600 mt-1">Wybierz listę lub utwórz nową</p>
            </div>
            <AppMenu />
          </div>

          {/* Shop tiles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Existing shops */}
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative group"
              >
                <button
                  onClick={() => handleSelectShop(shop)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <ClipboardIcon className='w-10 h-12 text-blue-600 -ml-2'/>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(shop.updated_at || shop.created_at), "d MMM yyyy, 'godz.' HH:mm", { locale: pl })}
                  </p>
                </button>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShopToEdit(shop);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edytuj nazwę"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShopToDelete(shop);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Usuń listę"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}

            {/* Add new shop tile */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 flex flex-col items-center justify-center min-h-[140px] group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <PlusIcon className='w-6 h-6 text-blue-600'/>
              </div>
              <span className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
                Nowa lista
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateShopModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateShop}
        isLoading={createShopMutation.isPending}
      />

      <EditShopModal
        isOpen={shopToEdit !== null}
        shopName={shopToEdit?.name || ''}
        onClose={() => setShopToEdit(null)}
        onSave={handleEditShop}
        isLoading={updateShopMutation.isPending}
      />

      <ConfirmationModal
        isOpen={shopToDelete !== null}
        title="Usuń listę zakupów"
        message={`Czy na pewno chcesz usunąć listę "${shopToDelete?.name}"? Wszystkie produkty zostaną trwale usunięte.`}
        confirmText="Usuń listę"
        cancelText="Anuluj"
        variant="danger"
        onConfirm={handleDeleteShop}
        onCancel={() => setShopToDelete(null)}
        isLoading={deleteShopMutation.isPending}
      />
    </ProtectedRoute>
  );
}
