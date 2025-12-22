'use client';

import type { Item } from '@/types/database';
import { TrashIcon } from '@/components/icons';

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
        item.done ? 'bg-gray-100' : 'bg-linear-to-r from-white to-sky-200'
      }`}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggleDone(item.id, !item.done)}
        className="w-5 h-5 cursor-pointer ml-1"
      />
      
      <button
        type="button"
        className={`flex-1 text-left py-2 -my-2 ${
          item.done ? 'line-through text-gray-500' : ''
        }`}
        onClick={() => onStartEdit(item)}
        title='Edytuj'
      >
        {item.name}
        {item.qty && (
          <span className="flex-1 text-sm text-gray-600">, {item.qty}{!isNaN(+item.qty) && ' szt.'}</span>
        )}
      </button>
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="bg-linear-65 from-red-500 to-pink-500 text-white hover:bg-red-600 flex items-center justify-center p-3 -my-2 -mr-2"
        title="Usuń"
      >
        <TrashIcon />
      </button>
    </li>
  );
}
