'use client';

import type { Item, Category } from '@/types/database';

interface ItemRowProps {
  item: Item;
  isEditing: boolean;
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

export default function ItemRow({
  item,
  isEditing,
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
        className="w-5 h-5 cursor-pointer"
      />
      
      {isEditing ? (
        <>
          <input
            type="text"
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
          />
          <input
            type="text"
            value={editQty}
            onChange={(e) => onEditQtyChange(e.target.value)}
            className="w-20 px-2 py-1 border rounded"
            placeholder="Ilość"
          />
          <select
            value={editCategory}
            onChange={(e) => onEditCategoryChange(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="">Auto</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onSaveEdit(item.id)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Zapisz
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
          >
            Anuluj
          </button>
        </>
      ) : (
        <>
          <span
            className={`flex-1 ${
              item.done ? 'line-through text-gray-500' : ''
            }`}
          >
            {item.name}
          </span>
          {item.qty && (
            <span className="text-sm text-gray-600">({item.qty})</span>
          )}
          <button
            type="button"
            onClick={() => onStartEdit(item)}
            className="w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"
            title="Edytuj"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
            title="Usuń"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </>
      )}
    </li>
  );
}
