'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ItemRow from './item-row';
import type { Item, Category } from '@/types/database';

interface SortableCategorySectionProps {
  category: Category & { displayName: string };
  items: Item[];
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

export default function SortableCategorySection({
  category,
  items,
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
}: SortableCategorySectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg shadow-md">
      {/* Draggable Header */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-t-sm cursor-grab active:cursor-grabbing"
      >
        <svg
          className="w-5 h-5 text-white/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
        <h2 className="text-lg font-semibold flex-1">{category.displayName}</h2>
        <span className="text-sm bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">
          {items.length}
        </span>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
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
      </div>
    </div>
  );
}
