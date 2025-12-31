'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj nazwę listy"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            disabled={isLoading}
          >
            Anuluj
          </button>
          <Button
            type="submit"
            form="edit-shop-form"
            className="flex-1"
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? 'Zapisywanie...' : 'Zapisz'}
          </Button>
        </>
      }
    >
      <form id="edit-shop-form" onSubmit={handleSubmit}>
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
      </form>
    </Modal>
  );
}
