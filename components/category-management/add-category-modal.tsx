'use client';

import Modal from '@/components/ui/modal';
import AddCategoryForm from './add-category-form';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dodaj nową kategorię"
      size="md"
      contentStyles='pt-6 pb-0'
    >
      <AddCategoryForm onSuccess={onClose} />
    </Modal>
  );
}
