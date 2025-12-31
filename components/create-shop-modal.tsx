'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';

interface CreateShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  isLoading?: boolean;
}

export default function CreateShopModal({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}: CreateShopModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName('');
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nowa lista zakupów"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            Anuluj
          </button>
          <Button
            type="submit"
            form="create-shop-form"
            className="flex-1"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Tworzenie...' : 'Utwórz'}
          </Button>
        </>
      }
    >
      <form id="create-shop-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="shop-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nazwa listy
          </label>
          <input
            id="shop-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Lidl, Warzywniak, Urodziny..."
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            required
            autoFocus
          />
        </div>
      </form>
    </Modal>
  );
}
