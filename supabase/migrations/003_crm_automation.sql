-- ============================================================
-- SKINOVA — Sistem Informasi Klinik Kecantikan
-- Migration 003: CRM Automation — Support, Email, Notifikasi
-- ============================================================

-- ============================================================
-- 1. NOTIFICATION LOG — Catatan semua notifikasi yang dikirim
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notification_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.users ON DELETE SET NULL,
  channel         TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'in_app')),
  type            TEXT NOT NULL CHECK (type IN ('reminder', 'marketing', 'support', 'complaint', 'promotion', 'voucher', 'system', 'follow_up')),
  title           TEXT,
  message         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  reference_type  TEXT,
  reference_id    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON public.notification_log (user_id);
CREATE INDEX IF NOT EXISTS idx_notif_status ON public.notification_log (status);
CREATE INDEX IF NOT EXISTS idx_notif_created ON public.notification_log (created_at DESC);

ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY notif_admin_all ON public.notification_log
  FOR ALL USING (public.is_admin());
CREATE POLICY notif_user_read ON public.notification_log
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- 2. SUPPORT TICKETS — Tiket layanan pelanggan
-- ============================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.users ON DELETE SET NULL,
  subject         TEXT NOT NULL,
  description     TEXT,
  category        TEXT DEFAULT 'general' CHECK (category IN ('general', 'complaint', 'technical', 'billing', 'feedback', 'other')),
  priority        TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status          TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
  assigned_to     UUID REFERENCES public.users ON DELETE SET NULL,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.support_tickets (priority);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY tickets_admin_all ON public.support_tickets
  FOR ALL USING (public.is_admin());
CREATE POLICY tickets_user_read ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY tickets_user_insert ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- ============================================================
-- 3. TICKET MESSAGES — Percakapan dalam tiket
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id       UUID NOT NULL REFERENCES public.support_tickets ON DELETE CASCADE,
  user_id         UUID REFERENCES public.users ON DELETE SET NULL,
  message         TEXT NOT NULL,
  is_staff        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_msg ON public.ticket_messages (ticket_id, created_at);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY msgs_admin_all ON public.ticket_messages
  FOR ALL USING (public.is_admin());
CREATE POLICY msgs_user_read ON public.ticket_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR public.is_admin()))
  );
CREATE POLICY msgs_user_insert ON public.ticket_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR public.is_admin()))
  );

-- ============================================================
-- 4. COMPLAINTS — Penanganan komplain terstruktur
-- ============================================================
CREATE TABLE IF NOT EXISTS public.complaints (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id       UUID REFERENCES public.support_tickets ON DELETE SET NULL,
  user_id         UUID REFERENCES public.users ON DELETE SET NULL,
  appointment_id  UUID REFERENCES public.appointments ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  severity        TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status          TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution      TEXT,
  compensation    TEXT,
  resolved_by     UUID REFERENCES public.users ON DELETE SET NULL,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_complaints_user ON public.complaints (user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints (status);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY complaints_admin_all ON public.complaints
  FOR ALL USING (public.is_admin());
CREATE POLICY complaints_user_read ON public.complaints
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY complaints_user_insert ON public.complaints
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- ============================================================
-- 5. EMAIL CAMPAIGNS — Campaign marketing via email
-- ============================================================
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  subject         TEXT NOT NULL,
  content         TEXT NOT NULL,
  target_segment  TEXT DEFAULT 'all' CHECK (target_segment IN ('all', 'loyal', 'new', 'at_risk', 'gold', 'silver', 'bronze')),
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  sent_count      INTEGER DEFAULT 0,
  total_count     INTEGER DEFAULT 0,
  scheduled_at    TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  created_by      UUID REFERENCES public.users ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.email_campaigns (status);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY campaigns_admin_all ON public.email_campaigns
  FOR ALL USING (public.is_admin());

-- ============================================================
-- 6. APPOINTMENT REMINDER SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reminder_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID NOT NULL REFERENCES public.appointments ON DELETE CASCADE,
  reminder_email  BOOLEAN NOT NULL DEFAULT true,
  reminder_whatsapp BOOLEAN NOT NULL DEFAULT true,
  reminder_time   INTERVAL DEFAULT '1 hour' CHECK (reminder_time IN ('15 minutes', '30 minutes', '1 hour', '2 hours', '1 day')),
  is_sent         BOOLEAN NOT NULL DEFAULT false,
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (appointment_id)
);

ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY reminders_admin_all ON public.reminder_settings
  FOR ALL USING (public.is_admin());
CREATE POLICY reminders_user_read ON public.reminder_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND (a.user_id = auth.uid() OR public.is_admin()))
  );

-- ============================================================
-- 7. FUNCTION: Get notifications for user (with unread count)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_notifications(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  channel TEXT,
  type TEXT,
  title TEXT,
  message TEXT,
  status TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.channel,
    n.type,
    n.title,
    n.message,
    n.status,
    n.status = 'read' AS is_read,
    n.created_at
  FROM public.notification_log n
  WHERE n.user_id = p_user_id
  ORDER BY n.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- 8. FUNCTION: Get unread notification count
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_unread_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  count_val INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_val
  FROM public.notification_log
  WHERE user_id = p_user_id AND status = 'sent';
  RETURN count_val;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- 9. FUNCTION: Mark notification as read
-- ============================================================
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notif_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.notification_log
  SET status = 'read'
  WHERE id = p_notif_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 10. FUNCTION: Get upcoming appointments for reminder
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_upcoming_appointments()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  treatment_name TEXT,
  doctor_name TEXT,
  appointment_date DATE,
  appointment_time TIME
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.user_id,
    COALESCE(u.name, a.guest_name, 'Unknown')::TEXT,
    u.email,
    COALESCE(u.phone, a.guest_phone)::TEXT,
    COALESCE(t.name, 'Treatment')::TEXT,
    COALESCE(d.name, 'Doctor')::TEXT,
    a.appointment_date,
    a.appointment_time
  FROM public.appointments a
  LEFT JOIN public.users u ON u.id = a.user_id
  LEFT JOIN public.treatments t ON t.id = a.treatment_id
  LEFT JOIN public.doctors d ON d.id = a.doctor_id
  WHERE a.status IN ('waiting', 'confirmed')
    AND a.appointment_date >= CURRENT_DATE
    AND a.appointment_date <= CURRENT_DATE + INTERVAL '7 days'
  ORDER BY a.appointment_date, a.appointment_time;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
