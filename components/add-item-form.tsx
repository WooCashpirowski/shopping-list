'use client';

import Button from '@/components/ui/button';
import { PlusIcon } from '@/components/icons';

interface AddItemFormProps {
  itemName: string;
  itemQty: string;
  isAdding: boolean;
  onItemNameChange: (value: string) => void;
  onItemQtyChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddItemForm({
  itemName,
  itemQty,
  isAdding,
  onItemNameChange,
  onItemQtyChange,
  onSubmit,
}: AddItemFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-lg shadow-lg/20">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nazwa produktu"
          value={itemName}
          onChange={(e) => onItemNameChange(e.target.value)}
          className="flex-1 min-w-[200px] px-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="ilość"
          value={itemQty}
          onChange={(e) => onItemQtyChange(e.target.value)}
          className="size-11 px-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
        />
        <Button
          type="submit"
          className='rounded-sm'
          disabled={isAdding}
          title="Dodaj produkt"
        >
          <PlusIcon />
        </Button>
      </div>
    </form>
  );
}
