-- FIX: Remove duplicate RLS policies
-- Run this in Supabase SQL Editor to clean up the duplicate policies

-- First, see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('shops', 'categories', 'items');

-- Drop ALL existing policies to start fresh (including all variations)
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

-- Now create ONLY the email-restricted policies
-- PERFORMANCE FIX: Wrap auth.jwt() in (select ...) so it's evaluated once per query, not per row
-- Replace these emails with YOUR actual email addresses!
CREATE POLICY "Allow specific users only" 
ON shops 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') IN ('your-email@example.com', 'partner-email@example.com')
) 
WITH CHECK (
  (select auth.jwt()->>'email') IN ('your-email@example.com', 'partner-email@example.com')
);

CREATE POLICY "Allow specific users only" 
ON categories 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') IN ('your-email@example.com', 'partner-email@example.com')
) 
WITH CHECK (
  (select auth.jwt()->>'email') IN ('your-email@example.com', 'partner-email@example.com')
);

CREATE POLICY "Allow specific users only" 
ON items 
FOR ALL 
TO authenticated 
USING (
  (select auth.jwt()->>'email') IN ('your-email@example.com', 'partner-email@example.com')
) 
WITH CHECK (
  (select auth.jwt()->>'email') IN ('your-email@example.com', 'partner-email@example.com')
);

-- Verify - should see only ONE policy per table now
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('shops', 'categories', 'items');
