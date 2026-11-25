-- ==============================================================================
-- SKEMA BASIS DATA MODUL 4: TUKANG ON-DEMAND (BOOKING & ROW LEVEL SECURITY)
-- Jalankan query ini di Dashboard Supabase > SQL Editor > New query
-- ==============================================================================

-- 1. Buat tabel bookings (Pemesanan Jasa Tukang)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  worker_id TEXT NOT NULL,
  worker_name TEXT NOT NULL,
  paket TEXT NOT NULL DEFAULT 'Harian',
  address TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Keamanan Tingkat Baris (RLS Policies)
-- Pelanggan HANYA dapat melihat data pemesanan miliknya sendiri
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT USING (auth.uid() = user_id);

-- Pelanggan HANYA dapat membuat pemesanan atas akunnya sendiri
DROP POLICY IF EXISTS "Users can insert their own bookings" ON bookings;
CREATE POLICY "Users can insert their own bookings"
ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pelanggan HANYA dapat memperbarui status pesanannya sendiri (misal: membatalkan pesanan)
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- Pelanggan HANYA dapat menghapus pesanannya sendiri
DROP POLICY IF EXISTS "Users can delete their own bookings" ON bookings;
CREATE POLICY "Users can delete their own bookings"
ON bookings FOR DELETE USING (auth.uid() = user_id);
