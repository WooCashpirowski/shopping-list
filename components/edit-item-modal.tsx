'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import type { Item, Category } from '@/types/database';

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
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-lg shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Edytuj produkt
              </DialogTitle>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-item-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa produktu
                </label>
                <input
                  id="edit-item-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-linear-to-t from-sky-500 to-indigo-500 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Zapisz
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
