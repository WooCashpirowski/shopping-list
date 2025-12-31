-- Add updated_at column to shops table
ALTER TABLE shops ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Set initial updated_at values to match created_at for existing records
UPDATE shops SET updated_at = created_at;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before any update on shops table
CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update the parent shop's updated_at when items change
CREATE OR REPLACE FUNCTION update_shop_updated_at_on_item_change()
RETURNS TRIGGER AS $$
BEGIN
    -- For INSERT and UPDATE, use NEW.shop_id
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE shops SET updated_at = NOW() WHERE id = NEW.shop_id;
        RETURN NEW;
    -- For DELETE, use OLD.shop_id
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE shops SET updated_at = NOW() WHERE id = OLD.shop_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers on items table to update parent shop's updated_at
CREATE TRIGGER update_shop_on_item_insert
    AFTER INSERT ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_shop_updated_at_on_item_change();

CREATE TRIGGER update_shop_on_item_update
    AFTER UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_shop_updated_at_on_item_change();

CREATE TRIGGER update_shop_on_item_delete
    AFTER DELETE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_shop_updated_at_on_item_change();
