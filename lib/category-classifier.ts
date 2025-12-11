// Category classification using keywords from the database
export function classifyItemLocally(
  itemName: string, 
  categories?: Array<{ name: string; keywords: string[] }>
): string | null {
  const normalized = itemName.toLowerCase().trim();
  
  // Try to match against database categories with their keywords
  if (categories) {
    // First pass: try exact matches
    for (const category of categories) {
      for (const keyword of category.keywords) {
        const keywordNorm = keyword.toLowerCase();
        if (normalized === keywordNorm) {
          return category.name;
        }
      }
    }
    
    // Second pass: try word boundary matches (whole word)
    for (const category of categories) {
      for (const keyword of category.keywords) {
        const keywordNorm = keyword.toLowerCase();
        // Match as whole word using word boundaries
        const wordBoundaryRegex = new RegExp(`\\b${keywordNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
        if (wordBoundaryRegex.test(normalized)) {
          return category.name;
        }
      }
    }
    
    // Third pass: try partial matches, prioritizing longer keywords
    const matches: Array<{ category: string; keywordLength: number }> = [];
    for (const category of categories) {
      for (const keyword of category.keywords) {
        const keywordNorm = keyword.toLowerCase();
        if (normalized.includes(keywordNorm)) {
          matches.push({ category: category.name, keywordLength: keywordNorm.length });
        }
      }
    }
    
    // Return the match with the longest keyword
    if (matches.length > 0) {
      matches.sort((a, b) => b.keywordLength - a.keywordLength);
      return matches[0].category;
    }
  }
  
  return null;
}
