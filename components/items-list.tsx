'use client';

import type { Item, Category } from '@/types/database';
import ItemRow from './item-row';

interface ItemsListProps {
  groupedItems: Record<string, Item[]>;
  editingId: string | null;
  editName: string;
  editQty: string;
  editCategory: string;
  categories: Category[];
  onToggleDone: (id: string, done: boolean) => void;
  onStartEdit: (item: Item) => void;
  onEditNameChange: (value: string) => void;
  onEditQtyChange: (value: string) => void;
  onEditCategoryChange: (value: string) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
}

export default function ItemsList({
  groupedItems,
  editingId,
  editName,
  editQty,
  editCategory,
  categories,
  onToggleDone,
  onStartEdit,
  onEditNameChange,
  onEditQtyChange,
  onEditCategoryChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: ItemsListProps) {
  return (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
            {category}
          </h3>
          <ul className="space-y-2">
            {categoryItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                editName={editName}
                editQty={editQty}
                editCategory={editCategory}
                categories={categories}
                onToggleDone={onToggleDone}
                onStartEdit={onStartEdit}
                onEditNameChange={onEditNameChange}
                onEditQtyChange={onEditQtyChange}
                onEditCategoryChange={onEditCategoryChange}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
