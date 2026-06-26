import { Info, ListOrdered, Sparkles, ClipboardPen, RefreshCw, Shield, CheckCircle2, Clock, Ticket } from 'lucide-react'
import { useState } from 'react'
import KanbanBoard from '../../components/crm/KanbanBoard'
import { useRole } from '../../context/RoleContext'
import Modal from '../../components/ui/Modal'
import InputField from '../../components/ui/InputField'
import Button from '../../components/ui/Button'

// Form pendaftaran mandiri (disalin dari LeadsPipeline Guest panel)
function QuickRegisterForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', service: '', preferredTime: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const serviceOptions = [
    'Konsultasi Kulit (Gratis)',
    'Facial Glow Treatment',
    'Laser Rejuvenation',
    'Botox Treatment',
    'Chemical Peeling',
    'Microblading Alis',
    'Hair Spa Premium',
    'Anti Aging Package',
    'Acne Treatment',
  ]

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama lengkap wajib diisi'
    if (!form.phone.trim()) e.phone = 'Nomor WhatsApp wajib diisi'
    if (!form.service) e.service = 'Pilih layanan yang diminati'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSubmit(form)
    setSubmitted(true)
  }

  const change = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--success-soft)' }}
        >
          <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--success)' }} />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          Pendaftaran Berhasil! 🎉
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
          Tim kami akan menghubungi <strong>{form.name}</strong> via WhatsApp dalam 5–10 menit.
        </p>
        <Button variant="primary" onClick={onClose}>Tutup & Lihat Antrean</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className="flex items-start gap-3 p-3 rounded-xl text-xs"
        style={{ background: 'var(--info-soft)', border: '1px solid var(--info)', color: 'var(--info)' }}
      >
        <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>Data Anda <strong>aman & terlindungi</strong>. Hanya digunakan untuk penjadwalan.</p>
      </div>
      <InputField label="Nama Lengkap *" placeholder="cth. Siti Rahayu" value={form.name}
        error={errors.name} onChange={(e) => change('name', e.target.value)} />
      <InputField label="Nomor WhatsApp Aktif *" placeholder="cth. 0812-3456-7890" value={form.phone}
        error={errors.phone} onChange={(e) => change('phone', e.target.value)} />
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>
          Layanan yang Diminati *
        </label>
        <select
          value={form.service}
          onChange={(e) => change('service', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: 'var(--bg-raised)',
            border: `1px solid ${errors.service ? 'var(--danger)' : 'var(--border)'}`,
            color: form.service ? 'var(--text-strong)' : 'var(--text)',
          }}
        >
          <option value="" disabled>-- Pilih layanan --</option>
          {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.service && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.service}</p>}
      </div>
      <Button variant="primary" onClick={handleSubmit} className="w-full" icon={ClipboardPen}>
        Kirim Pendaftaran Gratis
      </Button>
    </div>
  )
}

const TrackingPage = () => {
  const { leads, setLeads, customers } = useRole()
  const [showModal, setShowModal] = useState(false)
  const [lastRefresh] = useState(new Date().toLocaleTimeString('id-ID'))

  const patient = customers?.[0]

  // Cari antrean aktif milik pasien ini di seluruh tahapan Kanban
  const activeLead = Object.entries(leads).reduce((found, [stage, list]) => {
    if (found) return found
    const item = list.find(l => l.name.toLowerCase() === (patient?.name || '').toLowerCase())
    if (item) return { ...item, stage }
    return null
  }, null)

  const totalAktif =
    (leads.konsultasi?.length ?? 0) +
    (leads.jadwal?.length ?? 0) +
    (leads.pembayaran?.length ?? 0)

  const handleGuestRegister = (formData) => {
    const initials = formData.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    const nextNum = String((leads.konsultasi?.length ?? 0) + 1).padStart(2, '0')

    const lead = {
      id: `G${Date.now()}`,
      name: formData.name.trim(),
      service: formData.service,
      value: 'Rp 0',
      phone: formData.phone.trim(),
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      avatar: initials,
      queueNumber: `A-${nextNum}`,
      estimatedTime: formData.preferredTime ? formData.preferredTime.split('–')[0].trim() : '—',
      status: 'waiting',
    }

    // Real-time update ke shared state — Admin langsung melihat
    setLeads((prev) => ({ ...prev, konsultasi: [lead, ...prev.konsultasi] }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
      {/* Hero header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--accent-soft)' }}
          >
            <ListOrdered className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-heading)' }}>
              Live Tracker Antrean
            </h1>
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              Status diperbarui otomatis · Terakhir: {lastRefresh}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            title="Data diperbarui real-time"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:block">Real-time</span>
          </button>
          <Button variant="primary" icon={ClipboardPen} onClick={() => setShowModal(true)}>
            Daftar Konsultasi Gratis
          </Button>
        </div>
      </div>

      {/* Banner klinik */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4 flex-wrap"
        style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold mb-1" style={{ color: 'var(--accent)' }}>
            Aura Clinic — Klinik Kecantikan &amp; Estetika
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
            Tracker antrean digital kami. Identitas setiap pasien{' '}
            <strong>dilindungi penuh</strong> — hanya nomor antrean dan jenis
            layanan yang ditampilkan untuk menjaga privasi Anda.
          </p>
        </div>
      </div>

      {/* Tiket Antrean Anda (Menonjol di atas antrean umum) */}
      {activeLead && (
        <div 
          className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg border transition-all duration-300 hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #443E38 50%, #1C1917 100%)',
            borderColor: 'rgba(201, 169, 110, 0.4)',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Radial light aura */}
          <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'var(--accent)' }} />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-900" style={{ backgroundColor: 'var(--accent)' }}>
                Tiket Antrean Anda
              </span>
              <h3 className="text-xl font-black mt-2 text-stone-100">
                {patient ? patient.name : 'Pasien Tamu'}
              </h3>
              <p className="text-xs text-stone-400 mt-1">Layanan: {activeLead.service}</p>
            </div>
            
            <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:gap-1">
              <span className="text-xs text-stone-400">Nomor Antrean</span>
              <span className="text-4xl font-mono font-black" style={{ color: 'var(--accent)' }}>
                {activeLead.queueNumber}
              </span>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:gap-1">
              <span className="text-xs text-stone-400">Tahapan</span>
              <span className="text-sm font-bold uppercase tracking-wide flex items-center gap-1.5" style={{ color: 'var(--success)' }}>
                <CheckCircle2 className="w-4 h-4" />
                {activeLead.stage === 'konsultasi' ? 'Menunggu Konsultasi' : 
                 activeLead.stage === 'jadwal' ? 'Jadwal Ditetapkan' :
                 activeLead.stage === 'pembayaran' ? 'Sedang Ditangani' : 'Tindakan Selesai'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Statistik ringkas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sedang Ditangani', value: leads.pembayaran?.length ?? 0, color: 'var(--accent)', bg: 'var(--accent-soft)' },
          { label: 'Masih Menunggu',   value: totalAktif,                    color: 'var(--warning)', bg: 'var(--warning-soft)' },
          { label: 'Selesai Hari Ini', value: leads.selesai?.length ?? 0,   color: 'var(--success)', bg: 'var(--success-soft)' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center border"
            style={{ background: s.bg, borderColor: `${s.color}25` }}
          >
            <p className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Banner privasi */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl text-xs"
        style={{ background: 'var(--info-soft)', border: '1px solid var(--info)', color: 'var(--info)' }}
      >
        <Info className="w-4 h-4 flex-shrink-0" />
        <p>
          <strong>Perlindungan Privasi Aktif:</strong> Nama ditampilkan dalam format
          tersensor otomatis (cth: <span className="font-mono">A**** P****</span>) untuk
          melindungi kerahasiaan seluruh pasien.
        </p>
      </div>

      {/* Kanban Board Container with neon glow ornaments */}
      <div 
        className="p-3 rounded-3xl transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.12), transparent)',
          boxShadow: '0 0 30px rgba(201, 169, 110, 0.08), inset 0 0 12px rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(201, 169, 110, 0.15)',
        }}
      >
        <KanbanBoard />
      </div>

      {/* CTA bawah */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
      >
        <p className="text-lg font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
          Belum terdaftar? 🌸
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
          Daftarkan diri untuk konsultasi kulit <strong>gratis</strong> bersama
          dokter spesialis — tanpa perlu membuat akun.
        </p>
        <Button variant="primary" icon={ClipboardPen} onClick={() => setShowModal(true)}>
          Daftar Konsultasi Gratis Sekarang
        </Button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Pendaftaran Konsultasi Gratis"
        maxWidth="max-w-lg"
      >
        <QuickRegisterForm
          onSubmit={handleGuestRegister}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}

export default TrackingPage