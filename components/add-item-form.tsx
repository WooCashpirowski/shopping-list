'use client';

import Button from '@/components/ui/button';

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
      <div className="flex gap-2 flex-wrap">
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
          disabled={isAdding}
          className="px-3 py-2 rounded flex items-center justify-center"
          title="Dodaj produkt"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
