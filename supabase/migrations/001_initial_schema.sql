-- ============================================================
-- SKINOVA — Sistem Informasi Klinik Kecantikan
-- Migration 001: Initial Schema
-- Execute this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TABEL PROFIL PENGGUNA (terkait dengan Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  points      INTEGER NOT NULL DEFAULT 0,
  birth_date  DATE,
  avatar      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: otomatis update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. TABEL TREATMENT / LAYANAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.treatments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        TEXT,
  description     TEXT,
  price           BIGINT NOT NULL DEFAULT 0,
  duration_min    INTEGER NOT NULL DEFAULT 60,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  image_url       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER treatments_updated_at
  BEFORE UPDATE ON public.treatments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. TABEL DOKTER
-- ============================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  specialty       TEXT,
  title           TEXT,
  experience_yr   INTEGER DEFAULT 0,
  bio             TEXT,
  image_url       TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. TABEL JADWAL DOKTER (slot waktu)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.doctor_schedules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id     UUID NOT NULL REFERENCES public.doctors ON DELETE CASCADE,
  day_of_week   SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  is_available  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (doctor_id, day_of_week, start_time)
);

-- ============================================================
-- 5. TABEL BOOKING / APPOINTMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.users ON DELETE SET NULL,
  guest_name      TEXT,                          -- untuk booking tanpa akun
  guest_phone     TEXT,                          -- untuk booking tanpa akun
  treatment_id    UUID REFERENCES public.treatments ON DELETE SET NULL,
  doctor_id       UUID REFERENCES public.doctors ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status          TEXT NOT NULL DEFAULT 'waiting'
                    CHECK (status IN ('waiting','confirmed','in_progress','completed','cancelled')),
  complaint       TEXT,
  queue_number    TEXT,
  notes           TEXT,                          -- catatan admin / dokter
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index untuk mempercepat pencarian jadwal
CREATE INDEX IF NOT EXISTS idx_appointments_date
  ON public.appointments (appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date
  ON public.appointments (doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_user
  ON public.appointments (user_id);

-- ============================================================
-- 6. TABEL PEMBAYARAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID NOT NULL REFERENCES public.appointments ON DELETE CASCADE,
  amount          BIGINT NOT NULL DEFAULT 0,
  payment_method  TEXT CHECK (payment_method IN ('cash','transfer','debit','qris')),
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','paid','cancelled','refunded')),
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 7. TABEL PROMOSI
-- ============================================================
CREATE TABLE IF NOT EXISTS public.promotions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  discount_pct    SMALLINT CHECK (discount_pct BETWEEN 0 AND 100),
  valid_from      DATE,
  valid_until     DATE,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 8. TABEL VOUCHER PENGGUNA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_vouchers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  promotion_id  UUID NOT NULL REFERENCES public.promotions ON DELETE CASCADE,
  is_used       BOOLEAN NOT NULL DEFAULT false,
  used_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. AUTO-CREATE USER PROFILE setelah signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hapus trigger lama jika ada, lalu buat ulang
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Fungsi helper: cek apakah user saat ini admin
-- SECURITY DEFINER -> jalan dengan privilege pembuat fungsi, bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Aktifkan RLS di semua tabel
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vouchers ENABLE ROW LEVEL SECURITY;

-- Users: admin bisa lihat semua, user biasa hanya dirinya sendiri
CREATE POLICY users_admin_all ON public.users
  FOR ALL USING (public.is_admin());
CREATE POLICY users_self_read ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_self_update ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Treatments: public read, admin write
CREATE POLICY treatments_read_all ON public.treatments
  FOR SELECT USING (true);
CREATE POLICY treatments_admin_all ON public.treatments
  FOR ALL USING (public.is_admin());

-- Doctors: public read, admin write
CREATE POLICY doctors_read_all ON public.doctors
  FOR SELECT USING (true);
CREATE POLICY doctors_admin_all ON public.doctors
  FOR ALL USING (public.is_admin());

-- Doctor Schedules: public read, admin write
CREATE POLICY schedules_read_all ON public.doctor_schedules
  FOR SELECT USING (true);
CREATE POLICY schedules_admin_all ON public.doctor_schedules
  FOR ALL USING (public.is_admin());

-- Appointments: admin all, user own, guest bisa insert
CREATE POLICY appointments_admin_all ON public.appointments
  FOR ALL USING (public.is_admin());
CREATE POLICY appointments_user_read ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY appointments_user_insert ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Payments: admin all, user read own
CREATE POLICY payments_admin_all ON public.payments
  FOR ALL USING (public.is_admin());
CREATE POLICY payments_user_read ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_id AND a.user_id = auth.uid()
    )
  );

-- Promotions: public read, admin write
CREATE POLICY promos_read_all ON public.promotions
  FOR SELECT USING (true);
CREATE POLICY promos_admin_all ON public.promotions
  FOR ALL USING (public.is_admin());

-- User Vouchers: admin all, user own
CREATE POLICY vouchers_admin_all ON public.user_vouchers
  FOR ALL USING (public.is_admin());
CREATE POLICY vouchers_user_read ON public.user_vouchers
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- 11. FUNCTION: CEK OVERBOOKING
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_overbooking(
  p_doctor_id UUID,
  p_date DATE,
  p_time TIME
) RETURNS BOOLEAN AS $$
DECLARE
  existing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO existing_count
  FROM public.appointments
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND appointment_time = p_time
    AND status NOT IN ('cancelled');

  RETURN existing_count = 0; -- true jika tidak ada bentrok
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- 12. SEED DATA AWAL (opsional)
-- ============================================================

-- Insert sample treatments
INSERT INTO public.treatments (name, category, description, price, duration_min) VALUES
  ('Facial Glow Premium',   'Perawatan Kulit', 'Membersihkan, mencerahkan, dan melembabkan kulit wajah secara menyeluruh.', 450000, 75),
  ('Botox Treatment',       'Anti Aging', 'Injeksi presisi untuk menghaluskan kerutan wajah dengan hasil natural.', 2500000, 45),
  ('Laser Rejuvenation',    'Teknologi Laser', 'Teknologi fraksi laser untuk memperbaiki tekstur kulit dan bekas jerawat.', 1800000, 60),
  ('Chemical Peeling',      'Perawatan Kulit', 'Eksfoliasi kimiawi untuk mengangkat sel kulit mati.', 750000, 45),
  ('Microblading Alis',     'Perawatan Wajah', 'Teknik semi-permanen untuk membentuk alis natural.', 2800000, 120),
  ('Hair Spa Premium',      'Perawatan Rambut', 'Perawatan intensif untuk rambut rusak dan kering.', 350000, 60),
  ('Body Slimming',         'Perawatan Tubuh', 'Kombinasi kavitasi ultrasound dan radiofrequency.', 1200000, 75),
  ('Acne Treatment',        'Kulit Berjerawat', 'Program perawatan komprehensif untuk kulit berjerawat aktif.', 550000, 45)
ON CONFLICT DO NOTHING;

-- Insert sample doctors
INSERT INTO public.doctors (name, specialty, title, experience_yr) VALUES
  ('dr. Ayu Maharani, SpKK',   'Dermatologi Estetika & Laser',     'Dokter Kepala & Dermatologis Senior', 12),
  ('dr. Raihan Ghafari, SpBP-RE', 'Bedah Plastik Rekonstruksi',    'Spesialis Bedah Plastik Rekonstruksi', 9),
  ('dr. Ari Sanjaya, SpKK',    'Kulit Bermasalah & Acne',          'Spesialis Kulit & Kelamin', 7)
ON CONFLICT DO NOTHING;

-- Insert sample promotions
INSERT INTO public.promotions (code, title, description, discount_pct, valid_from, valid_until) VALUES
  ('BDAY25',   'Birthday Special 25%', 'Diskon 25% untuk semua treatment di hari ulang tahun.', 25, NOW(), NOW() + INTERVAL '1 year'),
  ('FIRST20',  'First Visit Discount', 'Diskon 20% untuk kunjungan pertama.', 20, NOW(), NOW() + INTERVAL '1 year'),
  ('GLOW30',   'Paket Glow Bundle', 'Facial Glow + Chemical Peeling hemat 30%.', 30, NOW(), NOW() + INTERVAL '6 months'),
  ('VIP10',    'Member VIP Exclusive', 'Harga khusus VIP untuk pasien dengan 10+ kunjungan.', 10, NOW(), NOW() + INTERVAL '1 year')
ON CONFLICT (code) DO NOTHING;
