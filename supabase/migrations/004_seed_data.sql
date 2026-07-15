-- ============================================================
-- SKINOVA — Seed Data: 1000+ Customers, Appointments & Payments
-- Data realistis untuk klinik kecantikan di Indonesia
-- ============================================================

-- Extension untuk generate UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- HELPER: Generate nama Indonesia random
-- ============================================================
CREATE OR REPLACE FUNCTION random_indonesian_name() RETURNS TEXT AS $$
DECLARE
  first_names TEXT[] := ARRAY[
    'Sarah','Maya','Diana','Rina','Dewi','Sinta','Putri','Lisa','Anisa','Nina',
    'Fitri','Ratna','Wulan','Indah','Citra','Ayu','Dian','Ranti','Mira','Nadia',
    'Farah','Gita','Hana','Ika','Jihan','Kartika','Laras','Nurul','Oktavia','Puspita',
    'Rahma','Sari','Tari','Utami','Vina','Winda','Yuli','Zahra','Amanda','Bella',
    'Cindy','Dinda','Elsa','Fika','Indri','Jessica','Kiki','Linda','Mona','Nabila',
    'Olivia','Pricilia','Queen','Resti','Silvia','Tiara','Ulfah','Vania','Wahyuni','Yunita',
    'Alya','Bunga','Chika','Dania','Erni','Fani','Gina','Hesty','Irma','Jenny',
    'Kinanti','Leni','Mega','Nadia','Okta','Puri','Rani','Shela','Tasya','Uci',
    'Via','Weni','Xena','Yeni','Zaskia','Ani','Boni','Caca','Dona','Eka',
    'Feni','Geby','Hilda','Indana','Jasmine','Kezia','Lala','Mimin','Naya','Opik'
  ];
  last_names TEXT[] := ARRAY[
    'Wijaya','Putri','Kusuma','Dewi','Lestari','Maharani','Anggraini','Sari','Rahayu','Hidayat',
    'Ningsih','Pertiwi','Utami','Handayani','Mulyani','Susanti','Wulandari','Yuliana','Fitriani','Novianti',
    'Puspitasari','Hartati','Kurniawati','Setiawati','Andriani','Mardiyanti','Permatasari','Safitri','Wahyuni','Astuti',
    'Rachmawati','Sukmawati','Haryanti','Lestari','Widiastuti','Budiyanti','Cahyani','Damayanti','Fauziah','Hasanah',
    'Indriani','Kusumawati','Maryati','Nurhayati','Oktaviani','Palupi','Ratnasari','Susilowati','Triana','Wardhani',
    'Agustina','Chasanah','Ernawati','Farida','Gunarti','Haryati','Istiqomah','Juwita','Kartini','Lutfiyah',
    'Maftuhah','Nashiroh','Oviyanti','Pangestuti','Qomariyah','Rofiah','Saadah','Tamara','Umayah','Vionita',
    'Wafiroh','Xanana','Yamamoto','Zulaikha','Amaliyah','Bariroh','Choiriyah','Dzakiyah','Elliya','Faizah',
    'Ghaniyah','Husniyah','Ilmiyah','Jamilah','Kamilah','Latifah','Muthiah','Nafisah','Olyvia','Pujiastuti'
  ];
  phone_providers TEXT[] := ARRAY['0812','0813','0814','0815','0816','0817','0818','0819','0856','0857','0858','0877','0878','0895','0896','0897','0898'];
BEGIN
  RETURN first_names[ceil(random() * array_length(first_names, 1))] || ' ' || last_names[ceil(random() * array_length(last_names, 1))];
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_status() RETURNS TEXT AS $$
BEGIN
  CASE floor(random() * 6)::int
    WHEN 0 THEN RETURN 'waiting';
    WHEN 1 THEN RETURN 'confirmed';
    WHEN 2 THEN RETURN 'in_progress';
    WHEN 3 THEN RETURN 'completed';
    WHEN 4 THEN RETURN 'cancelled';
    ELSE RETURN 'completed';
  END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_payment_status() RETURNS TEXT AS $$
BEGIN
  CASE floor(random() * 5)::int
    WHEN 0 THEN RETURN 'pending';
    WHEN 1 THEN RETURN 'paid';
    WHEN 2 THEN RETURN 'cancelled';
    WHEN 3 THEN RETURN 'paid';
    WHEN 4 THEN RETURN 'paid';
    ELSE RETURN 'paid';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SEED TREATMENTS (jika belum ada)
-- ============================================================
INSERT INTO public.treatments (name, category, description, price, duration_min) SELECT * FROM (VALUES
  ('Facial Glow Premium',   'Perawatan Kulit', 'Membersihkan, mencerahkan, dan melembabkan kulit wajah', 450000, 75),
  ('Botox Treatment',       'Anti Aging', 'Injeksi presisi untuk menghaluskan kerutan wajah', 2500000, 45),
  ('Laser Rejuvenation',    'Teknologi Laser', 'Memperbaiki tekstur kulit dan bekas jerawat', 1800000, 60),
  ('Chemical Peeling',      'Perawatan Kulit', 'Eksfoliasi kimiawi untuk mengangkat sel kulit mati', 750000, 45),
  ('Microblading Alis',     'Perawatan Wajah', 'Teknik semi-permanen untuk membentuk alis natural', 2800000, 120),
  ('Hair Spa Premium',      'Perawatan Rambut', 'Perawatan intensif rambut rusak dan kering', 350000, 60),
  ('Body Slimming',         'Perawatan Tubuh', 'Kombinasi kavitasi ultrasound dan radiofrequency', 1200000, 75),
  ('Acne Treatment',        'Kulit Berjerawat', 'Perawatan komprehensif kulit berjerawat', 550000, 45)
) AS v(name, category, description, price, duration_min)
WHERE NOT EXISTS (SELECT 1 FROM public.treatments LIMIT 1);

-- ============================================================
-- SEED DOCTORS (jika belum ada)
-- ============================================================
INSERT INTO public.doctors (name, specialty, title, experience_yr) SELECT * FROM (VALUES
  ('dr. Ayu Maharani, SpKK',   'Dermatologi Estetika', 'Dokter Kepala', 12),
  ('dr. Raihan Ghafari, SpBP', 'Bedah Plastik', 'Spesialis Bedah Plastik', 9),
  ('dr. Ari Sanjaya, SpKK',    'Kulit & Kelamin', 'Spesialis Kulit', 7),
  ('dr. Maya Sari, SpKK',      'Estetika & Laser', 'Dermatologis', 6),
  ('dr. Rina Permatasari',     'Perawatan Kulit', 'Dokter Estetika', 4)
) AS v(name, specialty, title, experience_yr)
WHERE NOT EXISTS (SELECT 1 FROM public.doctors LIMIT 1);

-- ============================================================
-- SEED: 1000 USERS (Customers)
-- ============================================================
DO $$
DECLARE
  i INT;
  v_name TEXT;
  v_email TEXT;
  v_phone TEXT;
  v_points INT;
  v_birth_date DATE;
  v_created_at TIMESTAMPTZ;
  v_id UUID;
  existing_count INT;
BEGIN
  SELECT COUNT(*) INTO existing_count FROM public.users WHERE role = 'member';
  
  IF existing_count >= 1000 THEN
    RAISE NOTICE 'Sudah ada % member, skip seed users.', existing_count;
    RETURN;
  END IF;

  FOR i IN 1..1000 LOOP
    v_name := random_indonesian_name();
    v_email := lower(replace(v_name, ' ', '.')) || i || '@email.com';
    v_phone := '08' || floor(random() * 100000000 + 8000000000)::TEXT;
    v_points := floor(random() * 5000)::int;
    v_birth_date := CURRENT_DATE - (floor(random() * 20000 + 7000)::int);
    v_created_at := NOW() - (random() * INTERVAL '365 days');
    v_id := gen_random_uuid();

    INSERT INTO public.users (id, name, email, phone, role, points, birth_date, created_at, updated_at)
    VALUES (v_id, v_name, v_email, v_phone, 'member', v_points, v_birth_date, v_created_at, v_created_at);
  END LOOP;
  
  RAISE NOTICE '✅ 1000 member berhasil dibuat!';
END $$;

-- ============================================================
-- SEED: 2000 APPOINTMENTS + PAYMENTS
-- ============================================================
DO $$
DECLARE
  i INT;
  v_user_id UUID;
  v_treatment_id UUID;
  v_doctor_id UUID;
  v_status TEXT;
  v_date DATE;
  v_time TIME;
  v_complaint TEXT;
  v_id UUID;
  v_pay_status TEXT;
  v_amount BIGINT;
  existing_count INT;
  v_user_cursor CURSOR FOR SELECT id FROM public.users WHERE role = 'member' ORDER BY RANDOM() LIMIT 800;
  v_user_rec RECORD;
  v_treatments TEXT[] := ARRAY[
    'Facial Glow Premium','Botox Treatment','Laser Rejuvenation','Chemical Peeling',
    'Microblading Alis','Hair Spa Premium','Body Slimming','Acne Treatment'
  ];
  v_complaints TEXT[] := ARRAY[
    'Kulit kemerahan setelah facial','Bengkak ringan di area suntik','Kulit terasa kering','Gatal ringan',
    'Hasil kurang maksimal','Nyeri ringan','Bekas hitam','Breakout setelah treatment',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
  ];
BEGIN
  SELECT COUNT(*) INTO existing_count FROM public.appointments;
  
  IF existing_count >= 2000 THEN
    RAISE NOTICE 'Sudah ada % appointments, skip seed.', existing_count;
    RETURN;
  END IF;

  -- Dapatkan treatment & doctor IDs
  SELECT id INTO v_treatment_id FROM public.treatments ORDER BY RANDOM() LIMIT 1;
  SELECT id INTO v_doctor_id FROM public.doctors ORDER BY RANDOM() LIMIT 1;

  FOR i IN 1..2000 LOOP
    -- Random user (80% dari users, biar ada yg punya banyak appointment)
    SELECT id INTO v_user_id FROM public.users WHERE role = 'member' ORDER BY RANDOM() LIMIT 1;
    
    -- Random treatment
    SELECT id INTO v_treatment_id FROM public.treatments ORDER BY RANDOM() LIMIT 1;
    
    -- Random doctor
    SELECT id INTO v_doctor_id FROM public.doctors ORDER BY RANDOM() LIMIT 1;
    
    v_status := random_status();
    v_date := CURRENT_DATE - (floor(random() * 365)::int);
    v_time := make_time(8 + floor(random() * 10)::int, floor(random() * 4)::int * 15, 0);
    v_complaint := v_complaints[ceil(random() * array_length(v_complaints, 1))];
    v_id := gen_random_uuid();

    INSERT INTO public.appointments (id, user_id, treatment_id, doctor_id, appointment_date, appointment_time, status, complaint, created_at, updated_at)
    VALUES (v_id, v_user_id, v_treatment_id, v_doctor_id, v_date, v_time, v_status, v_complaint, v_date::TIMESTAMPTZ + v_time, NOW());

    -- Buat payment untuk completed/confirmed appointments
    IF v_status IN ('completed', 'confirmed') AND random() > 0.2 THEN
      v_pay_status := random_payment_status();
      SELECT price INTO v_amount FROM public.treatments WHERE id = v_treatment_id;
      
      INSERT INTO public.payments (appointment_id, amount, payment_method, status, paid_at, created_at)
      VALUES (
        v_id,
        v_amount + floor(random() * 500000)::int,
        CASE floor(random() * 4)::int
          WHEN 0 THEN 'cash'
          WHEN 1 THEN 'transfer'
          WHEN 2 THEN 'debit'
          WHEN 3 THEN 'qris'
        END,
        v_pay_status,
        CASE WHEN v_pay_status = 'paid' THEN v_date::TIMESTAMPTZ + v_time + INTERVAL '1 hour' ELSE NULL END,
        v_date::TIMESTAMPTZ + v_time
      );
    END IF;
  END LOOP;
  
  RAISE NOTICE '✅ 2000 appointments + payments berhasil dibuat!';
END $$;

-- Update membership_tier berdasarkan poin untuk semua member
UPDATE public.users
SET membership_tier = 
  CASE 
    WHEN points >= 2000 THEN 'gold'
    WHEN points >= 500 THEN 'silver'
    ELSE 'bronze'
  END
WHERE role = 'member';

-- Update real statistik
SELECT 
  (SELECT COUNT(*) FROM public.users WHERE role = 'member') AS total_member,
  (SELECT COUNT(*) FROM public.appointments) AS total_appointments,
  (SELECT COUNT(*) FROM public.payments WHERE status = 'paid') AS total_pembayaran,
  (SELECT SUM(amount) FROM public.payments WHERE status = 'paid') AS total_revenue;
