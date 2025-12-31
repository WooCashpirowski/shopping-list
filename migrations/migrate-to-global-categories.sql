-- Migration: Move from shop-specific categories to global categories with per-shop positioning

-- Step 1: Create the new shop_category_positions table
CREATE TABLE IF NOT EXISTS shop_category_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, category_id)
);

-- Step 2: Deduplicate categories - keep only unique names (we'll keep the ones from default shop)
-- First, create a temporary table with the categories we want to keep
CREATE TEMP TABLE categories_to_keep AS
SELECT DISTINCT ON (name) id, name, keywords
FROM categories
WHERE shop_id = '00000000-0000-0000-0000-000000000001'
ORDER BY name, created_at;

-- Step 3: Migrate position data to new table
-- For each shop, create position entries for their categories
INSERT INTO shop_category_positions (shop_id, category_id, position)
SELECT 
  c.shop_id,
  ctk.id as category_id,
  c.position
FROM categories c
JOIN categories_to_keep ctk ON c.name = ctk.name
WHERE c.shop_id IS NOT NULL;

-- Step 4: Delete all categories except the ones we're keeping
DELETE FROM categories
WHERE id NOT IN (SELECT id FROM categories_to_keep);

-- Step 5: Remove shop_id and position columns from categories table
ALTER TABLE categories DROP COLUMN shop_id;
ALTER TABLE categories DROP COLUMN position;

-- Step 6: Drop the old unique constraint and add new one on just name
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_shop_id_key;
ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);

-- Step 7: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_shop_category_positions_shop_id ON shop_category_positions(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_category_positions_category_id ON shop_category_positions(category_id);
