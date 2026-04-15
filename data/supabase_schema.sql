-- ============================================================
-- StockMate Database Schema
-- Personal Inventory Management
-- Prefix: sm_
-- ============================================================

-- ─── 1. KATEGORI BARANG ─────────────────────────────────────
CREATE TABLE sm_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📦',        -- emoji untuk ditampilkan di UI
  color TEXT DEFAULT '#6366f1',  -- hex color untuk UI
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. LOKASI PENYIMPANAN ──────────────────────────────────
CREATE TABLE sm_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,             -- contoh: "Kamar Tidur", "Gudang", "Lemari Dapur"
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. BARANG (Tabel Utama) ────────────────────────────────
CREATE TABLE sm_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES sm_categories(id) ON DELETE SET NULL,
  location_id UUID REFERENCES sm_locations(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  condition TEXT DEFAULT 'Baik' CHECK (condition IN ('Baik', 'Rusak', 'Perlu Perbaikan')),
  purchase_date DATE,
  purchase_price NUMERIC(15, 2),  -- harga beli (Rupiah)
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 4. FOTO BARANG (opsional, multiple foto per item) ──────
CREATE TABLE sm_item_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES sm_items(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Setiap user cuma bisa akses data miliknya sendiri
-- ============================================================

-- Enable RLS
ALTER TABLE sm_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_item_images ENABLE ROW LEVEL SECURITY;

-- ─── Policies: sm_categories ────────────────────────────────
CREATE POLICY "Users can view own categories"
  ON sm_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own categories"
  ON sm_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON sm_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON sm_categories FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Policies: sm_locations ─────────────────────────────────
CREATE POLICY "Users can view own locations"
  ON sm_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own locations"
  ON sm_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own locations"
  ON sm_locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own locations"
  ON sm_locations FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Policies: sm_items ─────────────────────────────────────
CREATE POLICY "Users can view own items"
  ON sm_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own items"
  ON sm_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON sm_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON sm_items FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Policies: sm_item_images ───────────────────────────────
CREATE POLICY "Users can view own item images"
  ON sm_item_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own item images"
  ON sm_item_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own item images"
  ON sm_item_images FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION sm_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sm_items_updated_at
  BEFORE UPDATE ON sm_items
  FOR EACH ROW
  EXECUTE FUNCTION sm_update_updated_at();

-- ============================================================
-- INDEXES (untuk performa query)
-- ============================================================
CREATE INDEX idx_sm_items_user_id ON sm_items(user_id);
CREATE INDEX idx_sm_items_category_id ON sm_items(category_id);
CREATE INDEX idx_sm_items_location_id ON sm_items(location_id);
CREATE INDEX idx_sm_categories_user_id ON sm_categories(user_id);
CREATE INDEX idx_sm_locations_user_id ON sm_locations(user_id);
CREATE INDEX idx_sm_item_images_item_id ON sm_item_images(item_id);
