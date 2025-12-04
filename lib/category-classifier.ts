// Category classification using keywords from the database
export function classifyItemLocally(
  itemName: string, 
  categories?: Array<{ name: string; keywords: string[] }>
): string | null {
  const normalized = itemName.toLowerCase().trim();
  
  // Try to match against database categories with their keywords
  if (categories) {
    for (const category of categories) {
      for (const keyword of category.keywords) {
        if (normalized.includes(keyword.toLowerCase())) {
          return category.name;
        }
      }
    }
  }
  
  return null;
}
