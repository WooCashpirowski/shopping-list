'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { RealtimeChannel } from '@supabase/supabase-js';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { useShoppingListState } from '@/hooks/shopping-list.state';
import {
  useCategories,
  useItems,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
  useToggleDone,
  useDeleteAllItems,
  useUpdateCategoryKeywords,
  SHOP_ID_CONSTANT,
} from '@/hooks/use-shopping-list';
import { classifyItemLocally } from '@/lib/category-classifier';
import { addItemWithLearning, updateItemWithLearning, groupItemsByCategory } from '@/lib/shopping-list-helpers';
import AddItemForm from './add-item-form';
import DraggableCategoryList from './draggable-category-list';
import CategoryModal from './category-modal';
import EditItemModal from './edit-item-modal';
import type { Item } from '@/types/database';

const USER_NAME = 'Użytkownik'; // W produkcji pobrać z autoryzacji

export default function ShoppingList() {
  const [state, dispatch] = useShoppingListState();
  const queryClient = useQueryClient();
  const { signOut, user } = useAuth();

  const { data: categories = [] } = useCategories();
  const { data: items = [], isLoading } = useItems();
  const addItemMutation = useAddItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();
  const toggleDoneMutation = useToggleDone();
  const deleteAllItemsMutation = useDeleteAllItems();
  const updateKeywordsMutation = useUpdateCategoryKeywords();

  // Realtime subscription
  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `shop_id=eq.${SHOP_ID_CONSTANT}`,
        },
        (payload) => {
          console.info('Realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['items', SHOP_ID_CONSTANT] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.newItemName.trim()) return;

    const autoCategory = classifyItemLocally(state.newItemName, categories);
    
    if (autoCategory) {
      addItemMutation.mutate({
        shop_id: SHOP_ID_CONSTANT,
        name: state.newItemName.trim(),
        qty: state.newItemQty.trim() || null,
        category: autoCategory,
        created_by: USER_NAME,
      });
      dispatch({ type: 'RESET_NEW_ITEM' });
    } else {
      dispatch({
        type: 'SHOW_CATEGORY_MODAL',
        payload: { name: state.newItemName.trim(), qty: state.newItemQty.trim() },
      });
    }
  };

  const handleCategorySelection = async (selectedCategory: string) => {
    if (!state.pendingItem) return;

    const { category } = await addItemWithLearning(
      state.pendingItem.name,
      state.pendingItem.qty,
      selectedCategory,
      categories,
      (categoryId, keywords) => updateKeywordsMutation.mutate({ categoryId, keywords })
    );

    addItemMutation.mutate({
      shop_id: SHOP_ID_CONSTANT,
      name: state.pendingItem.name,
      qty: state.pendingItem.qty || null,
      category,
      created_by: USER_NAME,
    });

    dispatch({ type: 'HIDE_CATEGORY_MODAL' });
    dispatch({ type: 'RESET_NEW_ITEM' });
  };

  const handleUpdateItem = async (id: string, name: string, qty: string, category: string) => {
    if (!name.trim()) return;

    const { category: finalCategory } = await updateItemWithLearning(
      name,
      category,
      categories,
      (categoryId, keywords) => updateKeywordsMutation.mutate({ categoryId, keywords })
    );

    updateItemMutation.mutate({
      id,
      update: {
        name: name.trim(),
        qty: qty.trim() || null,
        category: finalCategory,
      },
    });

    dispatch({ type: 'CANCEL_EDITING' });
  };

  const handleStartEditing = (item: Item) => {
    dispatch({
      type: 'START_EDITING',
      payload: {
        id: item.id,
        name: item.name,
        qty: item.qty || '',
        category: item.category || '',
      },
    });
  };

  const handleDeleteAllItems = () => {
    if (items.length === 0) return;
    
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć wszystkie produkty (${items.length})? Tej operacji nie można cofnąć.`
    );
    
    if (confirmed) {
      deleteAllItemsMutation.mutate();
    }
  };

  const groupedItems = groupItemsByCategory(items);

  if (isLoading) {
    return (
      <div className="space-y-4 pb-[40px]">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-9 w-24 bg-gray-200 rounded-sm"></div>
        </div>

        {/* Form Skeleton */}
        <div className="bg-white p-4 rounded-lg shadow animate-pulse">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] h-10 bg-gray-200 rounded"></div>
            <div className="w-12 h-10 bg-gray-200 rounded"></div>
            <div className="w-12 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
              <div className="h-12 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-8 bg-gray-100 rounded"></div>
                <div className="h-8 bg-gray-100 rounded"></div>
                <div className="h-8 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-[40px]">
      {/* Header with logout and categories link */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista zakupów</h1>
          {user && <p className="text-sm text-gray-600">{user.email}</p>}
        </div>
        <div className="flex gap-2">
          <Link href="/categories">
            <Button size="md" className="py-2 text-sm rounded-sm h-full">
              Kategorie
            </Button>
          </Link>
          <button
            onClick={() => signOut()}
            className="p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>

          </button>
        </div>
      </div>

      <AddItemForm
        itemName={state.newItemName}
        itemQty={state.newItemQty}
        isAdding={addItemMutation.isPending}
        onItemNameChange={(value) => dispatch({ type: 'SET_NEW_ITEM_NAME', payload: value })}
        onItemQtyChange={(value) => dispatch({ type: 'SET_NEW_ITEM_QTY', payload: value })}
        onSubmit={handleAddItem}
      />

      {items.length > 0 ? (
        <DraggableCategoryList
          groupedItems={groupedItems}
          categories={categories}
          onToggleDone={(id, done) => toggleDoneMutation.mutate({ id, done })}
          onStartEdit={handleStartEditing}
          onDelete={(id) => deleteItemMutation.mutate(id)}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          Dodaj pierwszy produkt
        </div>
      )}

      <CategoryModal
        isOpen={state.showCategoryModal}
        itemName={state.pendingItem?.name || null}
        categories={categories}
        onSelectCategory={handleCategorySelection}
        onClose={() => dispatch({ type: 'HIDE_CATEGORY_MODAL' })}
      />

      {state.editingId && (
        <EditItemModal
          item={items.find(item => item.id === state.editingId)!}
          categories={categories}
          onSave={handleUpdateItem}
          onClose={() => dispatch({ type: 'CANCEL_EDITING' })}
        />
      )}
      {items.length > 0 && (
        <div className='fixed bottom-0 left-0 py-3 px-4 w-full flex bg-linear-0 from-sky-200 to-white'>
          <button
            type="button"
            onClick={handleDeleteAllItems}
            disabled={deleteAllItemsMutation.isPending}
            className="px-3 py-1 text-sm bg-linear-65 from-red-500 to-pink-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
          >
            Wyczyść ({items.length})
          </button>
        </div>
      )}
    </div>
  );
}
