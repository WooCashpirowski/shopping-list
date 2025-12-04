'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import Link from 'next/link';
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

const USER_NAME = 'Użytkownik'; // W produkcji pobrać z autoryzacji

export default function ShoppingList() {
  const [state, dispatch] = useShoppingListState();
  const queryClient = useQueryClient();

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
          console.log('Realtime update:', payload);
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

  const handleUpdateItem = async (id: string) => {
    if (!state.editName.trim()) return;

    const { category } = await updateItemWithLearning(
      state.editName,
      state.editCategory,
      categories,
      (categoryId, keywords) => updateKeywordsMutation.mutate({ categoryId, keywords })
    );

    updateItemMutation.mutate({
      id,
      update: {
        name: state.editName.trim(),
        qty: state.editQty.trim() || null,
        category,
      },
    });

    dispatch({ type: 'CANCEL_EDITING' });
  };

  const handleStartEditing = (item: any) => {
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
    return <div className="text-center py-8">Ładowanie...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header with link to categories management */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lista zakupów</h1>
        <Link
          href="/categories"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Zarządzaj kategoriami
        </Link>
      </div>

      <AddItemForm
        itemName={state.newItemName}
        itemQty={state.newItemQty}
        itemCount={items.length}
        isAdding={addItemMutation.isPending}
        isDeleting={deleteAllItemsMutation.isPending}
        onItemNameChange={(value) => dispatch({ type: 'SET_NEW_ITEM_NAME', payload: value })}
        onItemQtyChange={(value) => dispatch({ type: 'SET_NEW_ITEM_QTY', payload: value })}
        onSubmit={handleAddItem}
        onDeleteAll={handleDeleteAllItems}
      />

      {items.length > 0 ? (
        <DraggableCategoryList
          groupedItems={groupedItems}
          editingId={state.editingId}
          editName={state.editName}
          editQty={state.editQty}
          editCategory={state.editCategory}
          categories={categories}
          onToggleDone={(id, done) => toggleDoneMutation.mutate({ id, done })}
          onStartEdit={handleStartEditing}
          onEditNameChange={(value) => dispatch({ type: 'SET_EDIT_NAME', payload: value })}
          onEditQtyChange={(value) => dispatch({ type: 'SET_EDIT_QTY', payload: value })}
          onEditCategoryChange={(value) => dispatch({ type: 'SET_EDIT_CATEGORY', payload: value })}
          onSaveEdit={handleUpdateItem}
          onCancelEdit={() => dispatch({ type: 'CANCEL_EDITING' })}
          onDelete={(id) => deleteItemMutation.mutate(id)}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          Brak produktów. Dodaj pierwszy produkt powyżej!
        </div>
      )}

      <CategoryModal
        isOpen={state.showCategoryModal}
        itemName={state.pendingItem?.name || null}
        categories={categories}
        onSelectCategory={handleCategorySelection}
        onClose={() => dispatch({ type: 'HIDE_CATEGORY_MODAL' })}
      />
    </div>
  );
}
