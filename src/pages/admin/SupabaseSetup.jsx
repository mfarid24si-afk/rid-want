import { useState } from 'react'
import { Database, Shield, AlertTriangle, CheckCircle2, Loader, Eye, EyeOff, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const SETUP_SQL = `-- ============================================================
-- SKINOVA — FULL SETUP: Migration 002 + 003 + Seed Data
-- ============================================================

-- 1. MEMBERSHIP TIER
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS membership_tier TEXT NOT NULL DEFAULT 'bronze'
CHECK (membership_tier IN ('bronze', 'silver', 'gold'));

CREATE OR REPLACE FUNCTION public.calculate_tier_from_points(p_points INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF p_points >= 2000 THEN RETURN 'gold';
  ELSIF p_points >= 500 THEN RETURN 'silver';
  ELSE RETURN 'bronze';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. FOLLOW-UP COLUMNS
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS last_contacted TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS follow_up_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS follow_up_status TEXT DEFAULT 'none'
  CHECK (follow_up_status IN ('none', 'pending', 'contacted', 'converted', 'lost')),
ADD COLUMN IF NOT EXISTS follow_up_notes TEXT;

CREATE OR REPLACE FUNCTION public.get_follow_up_leads()
RETURNS TABLE (id UUID, name TEXT, phone TEXT, service TEXT, appointment_date DATE, status TEXT, days_since_last_contact INTEGER, follow_up_count INTEGER, follow_up_status TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, COALESCE(a.guest_name, u.name, 'Unknown')::TEXT, COALESCE(a.guest_phone, u.phone, '-')::TEXT,
    COALESCE(t.name, 'Treatment')::TEXT, a.appointment_date, a.status,
    CASE WHEN a.last_contacted IS NULL THEN EXTRACT(DAY FROM NOW() - a.created_at)::INTEGER
      ELSE EXTRACT(DAY FROM NOW() - a.last_contacted)::INTEGER END,
    a.follow_up_count, a.follow_up_status
  FROM public.appointments a
  LEFT JOIN public.users u ON u.id = a.user_id
  LEFT JOIN public.treatments t ON t.id = a.treatment_id
  WHERE a.status IN ('waiting', 'confirmed')
    AND (a.last_contacted IS NULL OR a.last_contacted < NOW() - INTERVAL '3 days')
    AND a.follow_up_status NOT IN ('converted', 'lost')
  ORDER BY CASE WHEN a.last_contacted IS NULL THEN 0 ELSE 1 END, a.last_contacted ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE VIEW public.membership_summary AS
SELECT membership_tier, COUNT(*) AS total_members, ROUND(AVG(points)) AS avg_points, SUM(points) AS total_points
FROM public.users WHERE role = 'member'
GROUP BY membership_tier
ORDER BY CASE membership_tier WHEN 'gold' THEN 1 WHEN 'silver' THEN 2 WHEN 'bronze' THEN 3 END;

-- 3. NOTIFICATION LOG
CREATE TABLE IF NOT EXISTS public.notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'in_app')),
  type TEXT NOT NULL CHECK (type IN ('reminder', 'marketing', 'support', 'complaint', 'promotion', 'voucher', 'system', 'follow_up')),
  title TEXT, message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  reference_type TEXT, reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON public.notification_log (user_id);
CREATE INDEX IF NOT EXISTS idx_notif_status ON public.notification_log (status);
CREATE INDEX IF NOT EXISTS idx_notif_created ON public.notification_log (created_at DESC);
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY notif_admin_all ON public.notification_log FOR ALL USING (public.is_admin());
CREATE POLICY notif_user_read ON public.notification_log FOR SELECT USING (auth.uid() = user_id);

-- 4. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users ON DELETE SET NULL,
  subject TEXT NOT NULL, description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'complaint', 'technical', 'billing', 'feedback', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
  assigned_to UUID REFERENCES public.users ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER IF NOT EXISTS support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.support_tickets (priority);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY tickets_admin_all ON public.support_tickets FOR ALL USING (public.is_admin());
CREATE POLICY tickets_user_read ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY tickets_user_insert ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- 5. TICKET MESSAGES
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets ON DELETE CASCADE,
  user_id UUID REFERENCES public.users ON DELETE SET NULL,
  message TEXT NOT NULL, is_staff BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticket_msg ON public.ticket_messages (ticket_id, created_at);
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY msgs_admin_all ON public.ticket_messages FOR ALL USING (public.is_admin());
CREATE POLICY msgs_user_read ON public.ticket_messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY msgs_user_insert ON public.ticket_messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR public.is_admin())));

-- 6. COMPLAINTS
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets ON DELETE SET NULL,
  user_id UUID REFERENCES public.users ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments ON DELETE SET NULL,
  title TEXT NOT NULL, description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution TEXT, compensation TEXT,
  resolved_by UUID REFERENCES public.users ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER IF NOT EXISTS complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX IF NOT EXISTS idx_complaints_user ON public.complaints (user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints (status);
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY complaints_admin_all ON public.complaints FOR ALL USING (public.is_admin());
CREATE POLICY complaints_user_read ON public.complaints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY complaints_user_insert ON public.complaints FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- 7. EMAIL CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, subject TEXT NOT NULL, content TEXT NOT NULL,
  target_segment TEXT DEFAULT 'all' CHECK (target_segment IN ('all', 'loyal', 'new', 'at_risk', 'gold', 'silver', 'bronze')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  sent_count INTEGER DEFAULT 0, total_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMPTZ, sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER IF NOT EXISTS campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY campaigns_admin_all ON public.email_campaigns FOR ALL USING (public.is_admin());

-- 8. REMINDER SETTINGS
CREATE TABLE IF NOT EXISTS public.reminder_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments ON DELETE CASCADE,
  reminder_email BOOLEAN NOT NULL DEFAULT true,
  reminder_whatsapp BOOLEAN NOT NULL DEFAULT true,
  reminder_time INTERVAL DEFAULT '1 hour',
  is_sent BOOLEAN NOT NULL DEFAULT false, sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (appointment_id)
);
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY reminders_admin_all ON public.reminder_settings FOR ALL USING (public.is_admin());

-- 9. FUNCTIONS: Notifications
CREATE OR REPLACE FUNCTION public.get_user_notifications(p_user_id UUID)
RETURNS TABLE (id UUID, channel TEXT, type TEXT, title TEXT, message TEXT, status TEXT, is_read BOOLEAN, created_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY SELECT n.id, n.channel, n.type, n.title, n.message, n.status, n.status = 'read', n.created_at
  FROM public.notification_log n WHERE n.user_id = p_user_id ORDER BY n.created_at DESC LIMIT 50;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_unread_count(p_user_id UUID)
RETURNS INTEGER AS $$ DECLARE c INTEGER; BEGIN SELECT COUNT(*) INTO c FROM public.notification_log WHERE user_id = p_user_id AND status = 'sent'; RETURN c; END; $$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notif_id UUID)
RETURNS void AS $$ BEGIN UPDATE public.notification_log SET status = 'read' WHERE id = p_notif_id; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_upcoming_appointments()
RETURNS TABLE (id UUID, user_id UUID, user_name TEXT, user_email TEXT, user_phone TEXT, treatment_name TEXT, doctor_name TEXT, appointment_date DATE, appointment_time TIME) AS $$
BEGIN
  RETURN QUERY SELECT a.id, a.user_id, COALESCE(u.name, a.guest_name, 'Unknown')::TEXT, u.email,
    COALESCE(u.phone, a.guest_phone)::TEXT, COALESCE(t.name, 'Treatment')::TEXT, COALESCE(d.name, 'Doctor')::TEXT,
    a.appointment_date, a.appointment_time
  FROM public.appointments a
  LEFT JOIN public.users u ON u.id = a.user_id
  LEFT JOIN public.treatments t ON t.id = a.treatment_id
  LEFT JOIN public.doctors d ON d.id = a.doctor_id
  WHERE a.status IN ('waiting', 'confirmed') AND a.appointment_date >= CURRENT_DATE AND a.appointment_date <= CURRENT_DATE + INTERVAL '7 days'
  ORDER BY a.appointment_date, a.appointment_time;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 10. SEED: Treatments & Doctors
INSERT INTO public.treatments (name, category, description, price, duration_min) VALUES
  ('Facial Glow Premium', 'Perawatan Kulit', 'Membersihkan dan mencerahkan kulit wajah', 450000, 75),
  ('Botox Treatment', 'Anti Aging', 'Injeksi presisi anti-aging', 2500000, 45),
  ('Laser Rejuvenation', 'Laser', 'Memperbaiki tekstur kulit', 1800000, 60),
  ('Chemical Peeling', 'Perawatan Kulit', 'Eksfoliasi kimiawi', 750000, 45),
  ('Microblading Alis', 'Wajah', 'Membentuk alis natural semi-permanen', 2800000, 120),
  ('Hair Spa Premium', 'Rambut', 'Perawatan rambut intensif', 350000, 60),
  ('Body Slimming', 'Tubuh', 'Kavitasi dan radiofrequency', 1200000, 75),
  ('Acne Treatment', 'Jerawat', 'Perawatan kulit berjerawat', 550000, 45)
ON CONFLICT DO NOTHING;

INSERT INTO public.doctors (name, specialty, title, experience_yr) VALUES
  ('dr. Ayu Maharani, SpKK', 'Dermatologi Estetika', 'Dokter Kepala', 12),
  ('dr. Raihan Ghafari, SpBP', 'Bedah Plastik', 'Spesialis Bedah Plastik', 9),
  ('dr. Ari Sanjaya, SpKK', 'Kulit & Kelamin', 'Spesialis Kulit', 7),
  ('dr. Maya Sari, SpKK', 'Estetika & Laser', 'Dermatologis', 6),
  ('dr. Rina Permatasari', 'Perawatan Kulit', 'Dokter Estetika', 4)
ON CONFLICT DO NOTHING;

-- 11. Update membership_tier untuk semua member yang sudah ada
UPDATE public.users
SET membership_tier = CASE WHEN points >= 2000 THEN 'gold' WHEN points >= 500 THEN 'silver' ELSE 'bronze' END
WHERE role = 'member' AND (membership_tier IS NULL OR membership_tier = 'bronze');

-- 12. Verifikasi
SELECT 'SETUP COMPLETE' AS status,
  (SELECT COUNT(*) FROM public.users WHERE role = 'member') AS total_members,
  (SELECT COUNT(*) FROM public.appointments) AS total_appointments,
  (SELECT COUNT(*) FROM public.support_tickets) AS total_tickets;`

const SupabaseSetup = () => {
  const [serviceKey, setServiceKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const [copied, setCopied] = useState(false)

  const projectRef = 'uomlornefemmjqeyxvbx'

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }])
  }

  const runSetup = async () => {
    if (!serviceKey.trim()) {
      toast.error('Masukkan service_role key terlebih dahulu!')
      return
    }

    setRunning(true)
    setLogs([])
    addLog('Menghubungkan ke Supabase Management API...', 'info')
    addLog(`Project: ${projectRef}`, 'info')

    try {
      const response = await fetch(
        `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey.trim()}`,
          },
          body: JSON.stringify({ query: SETUP_SQL }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        const errMsg = result.error?.message || result.error || response.statusText || 'Unknown error'
        addLog(`❌ Error: ${errMsg}`, 'error')
        toast.error('Gagal menjalankan setup! Lihat log untuk detail.')
      } else {
        addLog('✅ Migration 002 (membership_tier, follow-up) — BERHASIL!', 'success')
        addLog('✅ Migration 003 (support_tickets, complaints, notifikasi) — BERHASIL!', 'success')
        addLog('✅ Seed data (treatments, doctors) — BERHASIL!', 'success')
        addLog('✅ Membership tier diupdate untuk semua member', 'success')
        addLog('🎉 SETUP SELESAI!', 'success')
        toast.success('Setup berhasil! Silakan reload halaman.')
      }
    } catch (err) {
      addLog(`❌ Gagal terhubung: ${err.message}`, 'error')
      toast.error('Gagal terhubung ke Supabase API')
    } finally {
      setRunning(false)
    }
  }

  const copySql = () => {
    navigator.clipboard.writeText(SETUP_SQL)
    setCopied(true)
    toast.success('SQL berhasil disalin!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <PageHeader title="Supabase Setup" subtitle="Jalankan migration database dan seed data dalam satu klik" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center py-4">
            <Database className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent)' }} />
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Migration 002</p>
            <p className="text-xs" style={{ color: 'var(--text)' }}>membership_tier, follow-up columns, functions</p>
          </div>
        </Card>
        <Card>
          <div className="text-center py-4">
            <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--info)' }} />
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Migration 003</p>
            <p className="text-xs" style={{ color: 'var(--text)' }}>support_tickets, complaints, notifikasi, email campaigns</p>
          </div>
        </Card>
        <Card>
          <div className="text-center py-4">
            <Database className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--success)' }} />
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Seed Data</p>
            <p className="text-xs" style={{ color: 'var(--text)' }}>Treatments, Doctors, Membership tier update</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* FORM */}
        <Card>
          <h3 className="text-base font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
            🔑 Masukkan Service Role Key
          </h3>
          <div className="space-y-4">
            <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--info-soft)', border: '1px solid var(--info)', color: 'var(--info)' }}>
              <strong>Langkah:</strong> Buka{' '}
              <a href="https://supabase.com/dashboard/project/uomlornefemmjqeyxvbx/settings/api"
                target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                Supabase Dashboard → Project Settings → API
              </a>
              {' '}→ Copy <strong>service_role key</strong> → Paste di bawah.
              <br/>
              <strong className="mt-1 block">⚠️ Jangan bagikan key ini ke siapapun!</strong>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={serviceKey}
                onChange={e => setServiceKey(e.target.value)}
                placeholder="sbp_xxxx... (service_role key)"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text)' }}>
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              variant="primary"
              onClick={runSetup}
              disabled={running || !serviceKey.trim()}
              className="w-full"
              icon={running ? Loader : Database}
              size="lg">
              {running ? 'Menjalankan Setup...' : '▶ Jalankan Setup Database'}
            </Button>

            <div className="text-center">
              <button onClick={copySql} className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: 'var(--text)' }}>
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin!' : 'Atau copy SQL untuk dijalankan manual di SQL Editor'}
              </button>
            </div>
          </div>
        </Card>

        {/* LOG */}
        <Card>
          <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <Loader className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            Log Setup
          </h3>
          <div className="h-80 overflow-y-auto space-y-1.5 font-mono text-xs p-3 rounded-xl"
            style={{ background: '#0A0A0A', border: '1px solid var(--border)' }}>
            {logs.length === 0 ? (
              <p className="text-gray-500">Menunggu setup dijalankan...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-600 shrink-0">[{log.time}]</span>
                  <span style={{
                    color: log.type === 'error' ? '#EF4444'
                      : log.type === 'success' ? '#22C55E'
                      : '#94A3B8'
                  }}>
                    {log.msg}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SupabaseSetup
