'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ItemRow from './item-row';
import type { Item, Category } from '@/types/database';
import { DragHandleIcon, ChevronDownIcon } from '@/components/icons';

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
  const [isExpanded, setIsExpanded] = useState(true);
  
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

  const isCategorized = category?.name !== 'Inne';

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-sm shadow-md flex overflow-hidden">
      {/* Draggable anchor */}
      <div className={`${isCategorized ? 'cursor-grab active:cursor-grabbing touch-none select-none' : 'w-8'} flex justify-center items-center px-1 bg-linear-to-b from-sky-300 to-indigo-100 rounded-tl-sm`} {...isCategorized && attributes} {...isCategorized && listeners}>
        {isCategorized && <DragHandleIcon />}
      </div>
      <div className='flex-1'>
        {/* Header */}
        <div
          className="flex items-center gap-3 bg-linear-to-r from-sky-500 to-indigo-500 text-white p-2 rounded-tr-sm cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-md font-semibold flex-1">{category.displayName}</h2>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
          />
          <span className="text-sm bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">
            {items.length}
          </span>
        </div>

        {/* Items List */}
        <div
          className="divide-y divide-gray-100 overflow-hidden transition-all duration-300"
          style={{
            maxHeight: isExpanded ? `${items.length * 800}px` : '0',
            opacity: isExpanded ? 1 : 0,
          }}
        >
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
