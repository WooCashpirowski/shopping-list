'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import type { Category } from '@/types/database';
import { CloseIcon } from '@/components/icons';

interface CategoryModalProps {
  isOpen: boolean;
  itemName: string | null;
  categories: Category[];
  onSelectCategory: (category: string) => void;
  onClose: () => void;
}

export default function CategoryModal({
  isOpen,
  itemName,
  categories,
  onSelectCategory,
  onClose,
}: CategoryModalProps) {
  const handleSelect = (categoryName: string) => {
    onSelectCategory(categoryName);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* Panel */}
        <DialogPanel className="w-full max-w-md max-h-[80vh] flex flex-col bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                Wybierz kategorię
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Produkt: <span className="font-medium text-blue-600">{itemName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Scrollable Category List */}
          <div className="overflow-y-auto flex-1 p-4">
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleSelect(cat.name)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-150"
                  >
                    <span className="text-gray-900 font-medium">{cat.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleSelect('Inne')}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-150"
                >
                  <span className="text-gray-600 font-medium">Inne</span>
                </button>
              </li>
            </ul>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
