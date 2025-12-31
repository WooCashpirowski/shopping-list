INSERT INTO shop_category_positions (shop_id, category_id, position)
SELECT 
  s.id AS shop_id,
  c.id AS category_id,
  COALESCE(
    (SELECT MAX(position) + 1 
     FROM shop_category_positions 
     WHERE shop_id = s.id),
    0
  ) AS position
FROM 
  shops s
  CROSS JOIN categories c
WHERE NOT EXISTS (
  SELECT 1 
  FROM shop_category_positions scp 
  WHERE scp.shop_id = s.id 
    AND scp.category_id = c.id
);
