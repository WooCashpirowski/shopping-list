'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ItemRow from './item-row';
import type { Item, Category } from '@/types/database';

interface SortableCategorySectionProps {
  category: Category & { displayName: string };
  items: Item[];
  categories: Category[];
  onToggleDone: (id: string, done: boolean) => void;
  onStartEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function SortableCategorySection({
  category,
  items,
  categories,
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
      <div className="cursor-grab active:cursor-grabbing touch-none select-none flex justify-center items-center px-1 bg-linear-to-b from-sky-500 to-indigo-100 rounded-tl-sm" {...attributes} {...listeners}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8.75 6.75C8.33579 6.75 8 6.41421 8 6C8 5.58579 8.33579 5.25 8.75 5.25C9.16421 5.25 9.5 5.58579 9.5 6C9.5 6.41421 9.16421 6.75 8.75 6.75Z" stroke="#565b64ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.75 12.75C8.33579 12.75 8 12.4142 8 12C8 11.5858 8.33579 11.25 8.75 11.25C9.16421 11.25 9.5 11.5858 9.5 12C9.5 12.4142 9.16421 12.75 8.75 12.75Z" stroke="#565b64ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.75 18.75C8.33579 18.75 8 18.4142 8 18C8 17.5858 8.33579 17.25 8.75 17.25C9.16421 17.25 9.5 17.5858 9.5 18C9.5 18.4142 9.16421 18.75 8.75 18.75Z" stroke="#565b64ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 6.75C14.0858 6.75 13.75 6.41421 13.75 6C13.75 5.58579 14.0858 5.25 14.5 5.25C14.9142 5.25 15.25 5.58579 15.25 6C15.25 6.41421 14.9142 6.75 14.5 6.75Z" stroke="#565b64ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 12.75C14.0858 12.75 13.75 12.4142 13.75 12C13.75 11.5858 14.0858 11.25 14.5 11.25C14.9142 11.25 15.25 11.5858 15.25 12C15.25 12.4142 14.9142 12.75 14.5 12.75Z" stroke="#565b64ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 18.75C14.0858 18.75 13.75 18.4142 13.75 18C13.75 17.5858 14.0858 17.25 14.5 17.25C14.9142 17.25 15.25 17.5858 15.25 18C15.25 18.4142 14.9142 18.75 14.5 18.75Z" stroke="#565b64ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
              categories={categories}
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
