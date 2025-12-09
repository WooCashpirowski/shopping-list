'use client';

import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useUpdateCategoryPositions } from '@/hooks/use-shopping-list';

import type { Item, Category } from '@/types/database';
import SortableCategorySection from './sortable-category-section';

interface DraggableCategoryListProps {
  groupedItems: Record<string, Item[]>;
  categories: Category[];
  onToggleDone: (id: string, done: boolean) => void;
  onStartEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function DraggableCategoryList({
  groupedItems,
  categories,
  onToggleDone,
  onStartEdit,
  onDelete,
}: DraggableCategoryListProps) {
  const updatePositionsMutation = useUpdateCategoryPositions();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Create list of categories that have items
  const categoriesWithItems = useMemo(() => {
    const categoryNames = Object.keys(groupedItems);
    const orderedCategories: (Category & { displayName: string })[] = [];
    
    // Add categories that exist in the database
    categories.forEach(cat => {
      if (categoryNames.includes(cat.name)) {
        orderedCategories.push({ ...cat, displayName: cat.name });
      }
    });
    
    // Add "Inne" if it exists
    if (categoryNames.includes('')) {
      orderedCategories.push({
        id: 'uncategorized',
        name: '',
        displayName: 'Inne',
        shop_id: null,
        keywords: [],
        position: 999,
        created_at: new Date().toISOString(),
      });
    }
    
    return orderedCategories;
  }, [groupedItems, categories]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categoriesWithItems.findIndex(cat => cat.id === active.id);
      const newIndex = categoriesWithItems.findIndex(cat => cat.id === over.id);

      const reorderedCategories = arrayMove(categoriesWithItems, oldIndex, newIndex);
      
      // Update positions in database (excluding "Inne" which has no DB entry)
      const updates = reorderedCategories
        .filter(cat => cat.id !== 'uncategorized')
        .map((cat, index) => ({
          id: cat.id,
          position: index,
        }));

      updatePositionsMutation.mutate(updates);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={categoriesWithItems.map(cat => cat.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {categoriesWithItems.map((category) => (
            <SortableCategorySection
              key={category.id}
              category={category}
              items={groupedItems[category.name] || []}
              onToggleDone={onToggleDone}
              onStartEdit={onStartEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
