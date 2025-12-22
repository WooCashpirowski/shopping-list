import type { Category } from '@/types/database';
import { classifyItemLocally } from '@/lib/category-classifier';

export async function addItemWithLearning(
  itemName: string,
  selectedCategory: string,
  categories: Category[],
  updateKeywords: (categoryId: string, keywords: string[]) => void
): Promise<{ category: string; shouldLearn: boolean }> {
  const category = selectedCategory || 'Inne';
  let shouldLearn = false;

  // If user selected a category, learn from it
  if (selectedCategory && selectedCategory !== 'Inne') {
    const categoryObj = categories.find(c => c.name === selectedCategory);
    if (categoryObj) {
      const keyword = itemName.toLowerCase();
      if (!categoryObj.keywords.includes(keyword)) {
        const updatedKeywords = [...categoryObj.keywords, keyword];
        updateKeywords(categoryObj.id, updatedKeywords);
        shouldLearn = true;
      }
    }
  }

  return { category, shouldLearn };
}

export async function updateItemWithLearning(
  itemName: string,
  editCategory: string,
  categories: Category[],
  updateKeywords: (categoryId: string, keywords: string[]) => void
): Promise<{ category: string; shouldLearn: boolean }> {
  const autoCategory = classifyItemLocally(itemName, categories);
  const category = editCategory || autoCategory || 'Inne';
  let shouldLearn = false;

  // If user manually selected a category (not auto), learn from it
  if (editCategory && editCategory !== autoCategory) {
    const selectedCategory = categories.find(c => c.name === editCategory);
    if (selectedCategory) {
      const keyword = itemName.toLowerCase().trim();
      if (!selectedCategory.keywords.includes(keyword)) {
        const updatedKeywords = [...selectedCategory.keywords, keyword];
        updateKeywords(selectedCategory.id, updatedKeywords);
        shouldLearn = true;
      }
    }
  }

  return { category, shouldLearn };
}

export function groupItemsByCategory<T extends { category: string | null }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    // Normalize empty string and null to 'Inne'
    const cat = item.category && item.category.trim() !== '' ? item.category : 'Inne';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
