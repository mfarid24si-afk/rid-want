import { useState, useEffect } from 'react'
import {
  Send, Plus, Search, Eye, EyeOff, Clock, Users,
  Target, AlertCircle, CheckCircle2, Mail, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import InputField from '../../components/ui/InputField'
import { useRole } from '../../context/RoleContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'
import { TIER_THRESHOLDS } from '../../services/notificationService'

const ManageEmailCampaigns = () => {
  const { can } = useRole()
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  // Create/Edit modal
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [form, setForm] = useState({
    title: '', subject: '', content: '', target_segment: 'all', status: 'draft',
    scheduled_at: '',
  })
  const [saving, setSaving] = useState(false)

  // Preview modal
  const [previewCampaign, setPreviewCampaign] = useState(null)

  // Stats
  const [stats, setStats] = useState({
    total: 0, sent: 0, draft: 0, scheduled: 0,
  })

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setCampaigns(data || [])

      // Hitung stats
      const sc = data || []
      setStats({
        total: sc.length,
        sent: sc.filter(c => c.status === 'sent').length,
        draft: sc.filter(c => c.status === 'draft').length,
        scheduled: sc.filter(c => c.status === 'scheduled').length,
      })
    } catch (err) {
      console.error('Gagal memuat campaign:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCampaigns() }, [])

  const openCreate = () => {
    setModalMode('create')
    setForm({ title: '', subject: '', content: '', target_segment: 'all', status: 'draft', scheduled_at: '' })
    setShowModal(true)
  }

  const openEdit = (c) => {
    setModalMode('edit')
    setForm({
      title: c.title,
      subject: c.subject,
      content: c.content,
      target_segment: c.target_segment || 'all',
      status: c.status,
      scheduled_at: c.scheduled_at?.slice(0, 16) || '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Judul campaign wajib diisi'); return }
    if (!form.subject.trim()) { toast.error('Subject email wajib diisi'); return }
    if (!form.content.trim()) { toast.error('Konten email wajib diisi'); return }

    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        subject: form.subject.trim(),
        content: form.content.trim(),
        target_segment: form.target_segment,
        status: form.scheduled_at ? 'scheduled' : (form.status === 'sent' ? 'draft' : form.status),
        scheduled_at: form.scheduled_at || null,
        created_by: user?.id,
      }

      if (modalMode === 'create') {
        const { error } = await supabase.from('email_campaigns').insert([payload])
        if (error) throw error
        toast.success('Campaign berhasil dibuat!')
      } else {
        const { error } = await supabase.from('email_campaigns').update(payload).eq('id', previewCampaign?.id)
        if (error) throw error
        toast.success('Campaign berhasil diperbarui!')
      }

      setShowModal(false)
      fetchCampaigns()
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan campaign')
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async (campaign) => {
    if (!window.confirm(`Kirim campaign "${campaign.title}" sekarang? Aksi ini tidak dapat dibatalkan.`)) return

    try {
      // Update status jadi sending
      await supabase.from('email_campaigns').update({ status: 'sending' }).eq('id', campaign.id)

      // Cari target penerima
      let query = supabase.from('users').select('id, email, name, points').eq('role', 'member')
      if (campaign.target_segment !== 'all') {
        if (['gold', 'silver', 'bronze'].includes(campaign.target_segment)) {
          const thresholds = { gold: 2000, silver: 500, bronze: 0 }
          query = query.gte('points', thresholds[campaign.target_segment])
          if (campaign.target_segment === 'silver') query = query.lt('points', 2000)
          if (campaign.target_segment === 'bronze') query = query.lt('points', 500)
        }
      }

      const { data: users } = await query
      const targetUsers = users || []

      // Catat ke notification_log
      const notifications = targetUsers.map(u => ({
        user_id: u.id,
        channel: 'email',
        type: 'marketing',
        title: campaign.subject,
        message: campaign.content,
        status: 'sent',
        reference_type: 'campaign',
        reference_id: campaign.id,
      }))

      if (notifications.length > 0) {
        await supabase.from('notification_log').insert(notifications)
      }

      // Update campaign status
      await supabase.from('email_campaigns').update({
        status: 'sent',
        sent_count: targetUsers.length,
        total_count: targetUsers.length,
        sent_at: new Date().toISOString(),
      }).eq('id', campaign.id)

      toast.success(`Campaign terkirim ke ${targetUsers.length} penerima!`)
      fetchCampaigns()
    } catch (err) {
      toast.error('Gagal mengirim campaign')
      await supabase.from('email_campaigns').update({ status: 'draft' }).eq('id', campaign.id)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus campaign "${title}"?`)) return
    try {
      await supabase.from('email_campaigns').delete().eq('id', id)
      toast.success('Campaign berhasil dihapus')
      fetchCampaigns()
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  const statusColors = {
    draft: { color: 'var(--text)', bg: 'var(--bg-raised)', label: 'Draft' },
    scheduled: { color: 'var(--info)', bg: 'var(--info-soft)', label: 'Terjadwal' },
    sending: { color: 'var(--warning)', bg: 'var(--warning-soft)', label: 'Mengirim...' },
    sent: { color: 'var(--success)', bg: 'var(--success-soft)', label: 'Terkirim' },
    cancelled: { color: 'var(--danger)', bg: 'var(--danger-soft)', label: 'Dibatalkan' },
  }

  const segmentLabels = {
    all: 'Semua Member',
    loyal: 'Member Loyal',
    new: 'Member Baru',
    at_risk: 'At Risk',
    gold: '🥇 Gold',
    silver: '🥈 Silver',
    bronze: '🥉 Bronze',
  }

  return (
    <div>
      <PageHeader title="Email Marketing" subtitle="Buat dan kirim campaign email ke pelanggan">
        <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>
          Campaign Baru
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Campaign', value: stats.total, color: 'var(--accent)', icon: Mail },
          { label: 'Terkirim', value: stats.sent, color: 'var(--success)', icon: CheckCircle2 },
          { label: 'Draft', value: stats.draft, color: 'var(--text)', icon: EyeOff },
          { label: 'Terjadwal', value: stats.scheduled, color: 'var(--info)', icon: Clock },
        ].map(s => (
          <Card key={s.label} className="text-center !py-4">
            <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Campaign List */}
      <Card>
        {loading ? (
          <div className="text-center py-8"><p style={{ color: 'var(--text)' }}>Memuat campaign...</p></div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">📧</p>
            <p className="text-sm mb-2" style={{ color: 'var(--text)' }}>Belum ada campaign email</p>
            <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>
              Buat Campaign Pertama
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Campaign', 'Target', 'Status', 'Terkirim', 'Dibuat', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const st = statusColors[c.status] || statusColors.draft
                  return (
                    <tr key={c.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3 px-3">
                        <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>{c.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text)' }}>{c.subject}</p>
                      </td>
                      <td className="py-3 px-3">
                        <Badge status="pending">{segmentLabels[c.target_segment] || 'Semua'}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                        {c.scheduled_at && c.status === 'scheduled' && (
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text)' }}>
                            {new Date(c.scheduled_at).toLocaleDateString('id-ID')}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-xs" style={{ color: 'var(--text)' }}>
                        {c.sent_count || 0} / {c.total_count || '-'}
                      </td>
                      <td className="py-3 px-3 text-xs" style={{ color: 'var(--text)' }}>
                        {new Date(c.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setPreviewCampaign(c); setShowModal(true); setModalMode('edit'); setForm({
                            title: c.title, subject: c.subject, content: c.content,
                            target_segment: c.target_segment, status: c.status,
                            scheduled_at: c.scheduled_at?.slice(0, 16) || '',
                          }) }}
                            className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text)' }}
                            title="Edit">
                            <Eye className="w-4 h-4" />
                          </button>
                          {c.status === 'draft' || c.status === 'scheduled' ? (
                            <button onClick={() => handleSend(c)}
                              className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--success)' }}
                              title="Kirim sekarang">
                              <Send className="w-4 h-4" />
                            </button>
                          ) : null}
                          <button onClick={() => handleDelete(c.id, c.title)}
                            className="p-1.5 rounded-lg transition-colors hover:text-red-500" style={{ color: 'var(--text)' }}
                            title="Hapus">
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Create/Edit Modal ── */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Buat Campaign Baru' : 'Edit Campaign'} maxWidth="max-w-lg">
        <div className="space-y-4">
          <InputField label="Judul Campaign *" placeholder="cth. Promo Akhir Bulan" value={form.title}
            onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
          <InputField label="Subject Email *" placeholder="cth. Diskon 30% untuk Kamu!" value={form.subject}
            onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))} />

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>
              Target Penerima
            </label>
            <select value={form.target_segment}
              onChange={(e) => setForm(p => ({ ...p, target_segment: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
              {Object.entries(segmentLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>
              Konten Email * (HTML supported)
            </label>
            <textarea value={form.content}
              onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder={`<h1>Halo {{name}}!</h1>\n<p>Dapatkan promo spesial...</p>`}
              rows={8}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none font-mono"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
          </div>

          <InputField label="Jadwalkan (opsional)" type="datetime-local" value={form.scheduled_at}
            onChange={(e) => setForm(p => ({ ...p, scheduled_at: e.target.value }))} />

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Batal</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Menyimpan...' : modalMode === 'create' ? 'Buat Campaign' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageEmailCampaigns
