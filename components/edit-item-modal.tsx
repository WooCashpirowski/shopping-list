'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import type { Item, Category } from '@/types/database';
import Button from '@/components/ui/button';

interface EditItemModalProps {
  item: Item;
  categories: Category[];
  onSave: (id: string, name: string, qty: string, category: string) => void;
  onClose: () => void;
}

export default function EditItemModal({
  item,
  categories,
  onSave,
  onClose,
}: EditItemModalProps) {
  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(item.qty || '');
  const [category, setCategory] = useState(item.category || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(item.id, name.trim(), qty.trim(), category);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edytuj produkt"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            Anuluj
          </button>
          <Button type="submit" form="edit-item-form" className="flex-1">
            Zapisz
          </Button>
        </>
      }
    >
      <form id="edit-item-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-item-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nazwa produktu
          </label>
          <input
            id="edit-item-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="edit-item-qty" className="block text-sm font-medium text-gray-700 mb-1">
            Ilość
          </label>
          <input
            id="edit-item-qty"
            type="text"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="np. 2kg, 500g, 3szt"
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="edit-item-category" className="block text-sm font-medium text-gray-700 mb-1">
            Kategoria
          </label>
          <select
            id="edit-item-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Auto (automatyczna klasyfikacja)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="">Inne</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Wybierz "Auto" aby system sam przypisał kategorię na podstawie nazwy produktu.
          </p>
        </div>
      </form>
    </Modal>
  );
}
