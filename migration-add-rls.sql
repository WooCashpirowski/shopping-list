-- Enable Row Level Security on all tables
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON shops;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON categories;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON items;
DROP POLICY IF EXISTS "Allow all operations on shops" ON shops;
DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;
DROP POLICY IF EXISTS "Allow all operations on items" ON items;
DROP POLICY IF EXISTS "Allow specific users only" ON shops;
DROP POLICY IF EXISTS "Allow specific users only" ON categories;
DROP POLICY IF EXISTS "Allow specific users only" ON items;

-- Option 1: Allow ANY authenticated user (current simple approach)
-- Uncomment these if you want to allow any authenticated user:
/*
CREATE POLICY "Allow all operations for authenticated users"
ON shops FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" 
ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" 
ON items FOR ALL TO authenticated USING (true) WITH CHECK (true);
*/

-- Option 2: Restrict to specific email addresses (MORE SECURE + OPTIMIZED)
-- Replace 'user1@example.com' and 'user2@example.com' with your actual emails
-- PERFORMANCE: Wrapped in (select ...) so auth.jwt() is evaluated once per query, not per row
CREATE POLICY "Allow specific users only" 
ON shops 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') IN ('user1@example.com', 'user2@example.com')
) 
WITH CHECK (
  (select auth.jwt()->>'email') IN ('user1@example.com', 'user2@example.com')
);

CREATE POLICY "Allow specific users only" 
ON categories 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') IN ('user1@example.com', 'user2@example.com')
) 
WITH CHECK (
  (select auth.jwt()->>'email') IN ('user1@example.com', 'user2@example.com')
);

CREATE POLICY "Allow specific users only" 
ON items 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') IN ('user1@example.com', 'user2@example.com')
) 
WITH CHECK (
  (select auth.jwt()->>'email') IN ('user1@example.com', 'user2@example.com')
);