'use client';

interface AddItemFormProps {
  itemName: string;
  itemQty: string;
  itemCount: number;
  isAdding: boolean;
  isDeleting: boolean;
  onItemNameChange: (value: string) => void;
  onItemQtyChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteAll: () => void;
}

export default function AddItemForm({
  itemName,
  itemQty,
  itemCount,
  isAdding,
  isDeleting,
  onItemNameChange,
  onItemQtyChange,
  onSubmit,
  onDeleteAll,
}: AddItemFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-4 rounded-sm shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Dodaj nowy produkt</h2>
        {itemCount > 0 && (
          <button
            type="button"
            onClick={onDeleteAll}
            disabled={isDeleting}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
          >
            Wyczyść ({itemCount})
          </button>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Nazwa produktu"
          value={itemName}
          onChange={(e) => onItemNameChange(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Ilość"
          value={itemQty}
          onChange={(e) => onItemQtyChange(e.target.value)}
          className="w-24 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isAdding}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
          title="Dodaj produkt"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </form>
  );
}
