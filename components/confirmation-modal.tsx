'use client';

import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'primary';
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Potwierdź',
  cancelText = 'Anuluj',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'primary',
}: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      showCloseButton={false}
      footer={
        <>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={variant}
            className="flex-1"
          >
            {isLoading ? 'Ładowanie...' : confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-600">
        {message}
      </p>
    </Modal>
  );
}
