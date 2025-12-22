'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ItemRow from './item-row';
import type { Item, Category } from '@/types/database';
import { DragHandleIcon } from '@/components/icons';

interface SortableCategorySectionProps {
  category: Category & { displayName: string };
  items: Item[];
  onToggleDone: (id: string, done: boolean) => void;
  onStartEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function SortableCategorySection({
  category,
  items,
  onToggleDone,
  onStartEdit,
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
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg shadow-md flex overflow-hidden">
      {/* Draggable anchor */}
      <div className="cursor-grab active:cursor-grabbing touch-none select-none flex justify-center items-center px-1 bg-linear-to-b from-sky-300 to-indigo-100 rounded-tl-sm" {...attributes} {...listeners}>
        <DragHandleIcon />
      </div>
      <div className='flex-1'>
        {/* Header */}
        <div
          className="flex items-center gap-3 bg-linear-to-r from-sky-500 to-indigo-500 text-white p-2 rounded-tr-sm"
        >
          <h2 className="text-md font-semibold flex-1">{category.displayName}</h2>
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
              onToggleDone={onToggleDone}
              onStartEdit={onStartEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
