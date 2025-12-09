'use client';

import type { Item, Category } from '@/types/database';

interface ItemRowProps {
  item: Item;
  onToggleDone: (id: string, done: boolean) => void;
  onStartEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function ItemRow({
  item,
  onToggleDone,
  onStartEdit,
  onDelete,
}: ItemRowProps) {
  return (
    <li
      className={`flex items-center gap-2 p-2 rounded ${
        item.done ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggleDone(item.id, !item.done)}
        className="w-5 h-5 cursor-pointer ml-1"
      />
      
      <span
        className={`flex-1 ${
          item.done ? 'line-through text-gray-500' : ''
        }`}
      >
        {item.name}
        {item.qty && (
          <span className="flex-1 text-sm text-gray-600"> x {item.qty}</span>
        )}
      </span>
      <div className='flex items-center justify-center -my-2 -mr-2'>
        <button
          type="button"
          onClick={() => onStartEdit(item)}
          className="bg-linear-to-t from-sky-500 to-indigo-500 text-white hover:bg-blue-600 flex items-center justify-center p-3 mr-0.25"
          title="Edytuj"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="bg-linear-65 from-red-500 to-pink-500 text-white hover:bg-red-600 flex items-center justify-center p-3"
          title="Usuń"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}
