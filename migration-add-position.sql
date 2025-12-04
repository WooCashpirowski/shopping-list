-- Add position column to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Set initial positions based on creation order
WITH ranked_categories AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 AS new_position
  FROM categories
)
UPDATE categories
SET position = ranked_categories.new_position
FROM ranked_categories
WHERE categories.id = ranked_categories.id;

-- Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_categories_position ON categories(position);
