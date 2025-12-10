-- STEP 1: Drop all existing policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON shops;
DROP POLICY IF EXISTS "Allow all operations on shops" ON shops;
DROP POLICY IF EXISTS "Allow all operations on items" ON shops;
DROP POLICY IF EXISTS "Allow specific users only" ON shops;

DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON categories;
DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;
DROP POLICY IF EXISTS "Allow all operations on items" ON categories;
DROP POLICY IF EXISTS "Allow specific users only" ON categories;

DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON items;
DROP POLICY IF EXISTS "Allow all operations on items" ON items;
DROP POLICY IF EXISTS "Allow all operations on categories" ON items;
DROP POLICY IF EXISTS "Allow specific users only" ON items;

-- STEP 2: Verify all policies are gone (should return 0 rows)
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('shops', 'categories', 'items');

-- STEP 3: Create optimized policies
-- Wrapping in subquery forces Postgres to evaluate once (initPlan) instead of per-row
CREATE POLICY "Allow specific users only" 
ON shops 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') = ANY('{user-1@example.com,user-2@example.com}')
) 
WITH CHECK (
  (select auth.jwt()->>'email') = ANY('{user-1@example.com,user-2@example.com}')
);

CREATE POLICY "Allow specific users only" 
ON categories 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') = ANY('{user-1@example.com,user-2@example.com}')
) 
WITH CHECK (
  (select auth.jwt()->>'email') = ANY('{user-1@example.com,user-2@example.com}')
);

CREATE POLICY "Allow specific users only" 
ON items 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') = ANY('{user-1@example.com,user-2@example.com}')
) 
WITH CHECK (
  (select auth.jwt()->>'email') = ANY('{user-1@example.com,user-2@example.com}')
);

-- STEP 4: Verify new policies are created (should return 3 rows)
SELECT tablename, policyname, cmd as actions
FROM pg_policies 
WHERE tablename IN ('shops', 'categories', 'items');
