-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  qty TEXT,
  done BOOLEAN DEFAULT FALSE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_items_shop_id ON items(shop_id);
CREATE INDEX IF NOT EXISTS idx_items_done ON items(done);

-- Add keywords column to categories table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'keywords'
  ) THEN
    ALTER TABLE categories ADD COLUMN keywords TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Insert default shop with specific UUID
INSERT INTO shops (id, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Domyślny sklep')
ON CONFLICT (id) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, shop_id, keywords) VALUES
  ('Pieczywo', '00000000-0000-0000-0000-000000000001', ARRAY['chleb', 'bułka', 'bagietka', 'croissant', 'rogal', 'bajgiel', 'muffin', 'pączek', 'ciasto', 'drożdżówka']),
  ('Owoce', '00000000-0000-0000-0000-000000000001', ARRAY['jabłko', 'banan', 'pomarańcza', 'winogrono', 'truskawka', 'jagoda', 'borówka', 'mango', 'gruszka', 'brzoskwinia', 'arbuz', 'cytryna', 'limonka', 'wiśnia', 'czereśnia', 'kiwi', 'ananas']),
  ('Warzywa', '00000000-0000-0000-0000-000000000001', ARRAY['pomidor', 'ziemniak', 'kartofel', 'cebula', 'marchew', 'sałata', 'szpinak', 'brokuł', 'ogórek', 'papryka', 'seler', 'kapusta', 'czosnek', 'grzyb', 'pieczarka', 'cukinia']),
  ('Mięso', '00000000-0000-0000-0000-000000000001', ARRAY['kurczak', 'wołowina', 'wieprzowina', 'jagnięcina', 'indyk', 'boczek', 'kiełbasa', 'szynka', 'stek', 'mięso mielone', 'schab', 'karkówka']),
  ('Ryby i Owoce Morza', '00000000-0000-0000-0000-000000000001', ARRAY['ryba', 'łosoś', 'tuńczyk', 'krewetka', 'krab', 'homar', 'dorsz', 'tilapia', 'owoce morza', 'śledź', 'makrela']),
  ('Nabiał', '00000000-0000-0000-0000-000000000001', ARRAY['mleko', 'ser', 'jogurt', 'masło', 'śmietana', 'kefir', 'twaróg', 'lody']),
  ('Napoje', '00000000-0000-0000-0000-000000000001', ARRAY['woda', 'sok', 'napój', 'kawa', 'herbata', 'piwo', 'wino', 'mleko']),
  ('Przekąski', '00000000-0000-0000-0000-000000000001', ARRAY['chipsy', 'ciastka', 'krakersy', 'popcorn', 'precelki', 'orzechy', 'cukierki', 'czekolada', 'batonik']),
  ('Konserwy', '00000000-0000-0000-0000-000000000001', ARRAY['konserwa', 'puszka', 'fasola', 'zupa', 'sos pomidorowy', 'kukurydza', 'groszek']),
  ('Przyprawy i Dodatki', '00000000-0000-0000-0000-000000000001', ARRAY['ketchup', 'musztarda', 'majonez', 'sos', 'dressing', 'olej', 'ocet', 'sól', 'pieprz', 'przyprawa']),
  ('Mrożonki', '00000000-0000-0000-0000-000000000001', ARRAY['mrożone', 'lody', 'pizza', 'mrożone warzywa', 'frytki']),
  ('Artykuły Gospodarstwa Domowego', '00000000-0000-0000-0000-000000000001', ARRAY['mydło', 'proszek', 'detergent', 'środek czyszczący', 'ręcznik papierowy', 'papier toaletowy', 'chusteczki', 'worek na śmieci', 'gąbka']),
  ('Higiena Osobista', '00000000-0000-0000-0000-000000000001', ARRAY['szampon', 'pasta do zębów', 'dezodorant', 'maszynka', 'żyletka', 'balsam', 'mydło', 'krem'])
ON CONFLICT (name) DO UPDATE SET keywords = EXCLUDED.keywords;

-- Enable Row Level Security (RLS)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for development)
-- In production, you should use proper authentication-based policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'shops' AND policyname = 'Allow all operations on shops'
  ) THEN
    CREATE POLICY "Allow all operations on shops" ON shops
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'items' AND policyname = 'Allow all operations on items'
  ) THEN
    CREATE POLICY "Allow all operations on items" ON items
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Allow all operations on categories'
  ) THEN
    CREATE POLICY "Allow all operations on categories" ON categories
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
