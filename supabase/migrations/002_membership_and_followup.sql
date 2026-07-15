-- ============================================================
-- SKINOVA — Sistem Informasi Klinik Kecantikan
-- Migration 002: Membership Tier (Point-Based) & Follow-up System
-- ============================================================

-- ============================================================
-- 1. TAMBAH KOLOM MEMBERSHIP TIER di tabel users
-- ============================================================
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS membership_tier TEXT NOT NULL DEFAULT 'bronze' 
CHECK (membership_tier IN ('bronze', 'silver', 'gold'));

-- ============================================================
-- 2. FUNCTION: Hitung Membership Tier berdasarkan POIN
--    Bronze  : 0 - 499 poin
--    Silver  : 500 - 1.999 poin
--    Gold    : 2.000+ poin
-- ============================================================
CREATE OR REPLACE FUNCTION public.calculate_tier_from_points(p_points INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF p_points >= 2000 THEN
    RETURN 'gold';
  ELSIF p_points >= 500 THEN
    RETURN 'silver';
  ELSE
    RETURN 'bronze';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- 3. (DIHAPUS) Trigger auto-update membership_tier
-- Alasan: Frontend sudah menangani auto-kalkulasi tier dari poin
-- ketika admin mengubah input points di form edit.
-- Dengan tidak ada trigger, admin bisa set kombinasi poin + tier
-- APAPUN dalam satu kali save tanpa konflik.
-- ============================================================

-- ============================================================
-- 4. TAMBAH KOLOM FOLLOW-UP di tabel appointments
-- ============================================================
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS last_contacted TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS follow_up_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS follow_up_status TEXT DEFAULT 'none'
  CHECK (follow_up_status IN ('none', 'pending', 'contacted', 'converted', 'lost')),
ADD COLUMN IF NOT EXISTS follow_up_notes TEXT;

-- ============================================================
-- 5. FUNCTION: Dapatkan leads yang perlu follow-up
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_follow_up_leads()
RETURNS TABLE (
  id UUID,
  name TEXT,
  phone TEXT,
  service TEXT,
  appointment_date DATE,
  status TEXT,
  days_since_last_contact INTEGER,
  follow_up_count INTEGER,
  follow_up_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    COALESCE(a.guest_name, u.name, 'Unknown')::TEXT,
    COALESCE(a.guest_phone, u.phone, '-')::TEXT,
    COALESCE(t.name, 'Treatment')::TEXT,
    a.appointment_date,
    a.status,
    CASE 
      WHEN a.last_contacted IS NULL THEN EXTRACT(DAY FROM NOW() - a.created_at)::INTEGER
      ELSE EXTRACT(DAY FROM NOW() - a.last_contacted)::INTEGER
    END,
    a.follow_up_count,
    a.follow_up_status
  FROM public.appointments a
  LEFT JOIN public.users u ON u.id = a.user_id
  LEFT JOIN public.treatments t ON t.id = a.treatment_id
  WHERE a.status IN ('waiting', 'confirmed')
    AND (
      a.last_contacted IS NULL 
      OR a.last_contacted < NOW() - INTERVAL '3 days'
    )
    AND a.follow_up_status != 'converted'
    AND a.follow_up_status != 'lost'
  ORDER BY 
    CASE WHEN a.last_contacted IS NULL THEN 0 ELSE 1 END,
    a.last_contacted ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- 6. VIEW: Membership summary untuk dashboard
-- ============================================================
CREATE OR REPLACE VIEW public.membership_summary AS
SELECT 
  membership_tier,
  COUNT(*) AS total_members,
  ROUND(AVG(points)) AS avg_points,
  SUM(points) AS total_points
FROM public.users
WHERE role = 'member'
GROUP BY membership_tier
ORDER BY 
  CASE membership_tier
    WHEN 'gold' THEN 1
    WHEN 'silver' THEN 2
    WHEN 'bronze' THEN 3
  END;
