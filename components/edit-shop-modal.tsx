'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Button from '@/components/ui/button';
import { CloseIcon } from '@/components/icons';

interface EditShopModalProps {
  isOpen: boolean;
  shopName: string;
  onClose: () => void;
  onSave: (name: string) => void;
  isLoading?: boolean;
}

export default function EditShopModal({
  isOpen,
  shopName,
  onClose,
  onSave,
  isLoading = false,
}: EditShopModalProps) {
  const [name, setName] = useState(shopName);

  useEffect(() => {
    setName(shopName);
  }, [shopName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-sm shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Edytuj nazwę listy
              </DialogTitle>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div>
                <label htmlFor="shop-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa listy
                </label>
                <input
                  id="shop-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Np. Sylwester 2025"
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-sm">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                disabled={isLoading}
              >
                Anuluj
              </button>
              <Button type="submit" className="flex-1" disabled={!name.trim() || isLoading}>
                {isLoading ? 'Zapisywanie...' : 'Zapisz'}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
