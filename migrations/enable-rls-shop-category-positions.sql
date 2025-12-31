ALTER TABLE shop_category_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shop category positions"
  ON shop_category_positions
  FOR SELECT
  USING (true);  -- All authenticated users can view positions

CREATE POLICY "Users can insert shop category positions"
  ON shop_category_positions
  FOR INSERT
  WITH CHECK (true);  -- All authenticated users can insert positions

CREATE POLICY "Users can update shop category positions"
  ON shop_category_positions
  FOR UPDATE
  USING (true);  -- All authenticated users can update positions

CREATE POLICY "Users can delete shop category positions"
  ON shop_category_positions
  FOR DELETE
  USING (true);  -- All authenticated users can delete positions
