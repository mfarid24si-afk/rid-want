import { useState } from 'react'
import {
  Plus,
  ClipboardPen,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Shield,
} from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import InputField from '../components/ui/InputField'
import KanbanBoard from '../components/crm/KanbanBoard'
import { columnConfig } from '../data/mockLeads'
import { useRole } from '../context/RoleContext'

// ─────────────────────────────────────────────────────────────
// HELPER: Format nilai rupiah total pipeline (Admin only)
// ─────────────────────────────────────────────────────────────
const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)

// ─────────────────────────────────────────────────────────────
// SUB-KOMPONEN: PANEL PENDAFTARAN MANDIRI (Guest Only)
// Form ramah pasien untuk daftar konsultasi — tanpa istilah CRM
// ─────────────────────────────────────────────────────────────
function GuestRegistrationPanel({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: '',
    preferredTime: '',
    note: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

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
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    onSubmit(form)
    setSubmitted(true)
  }

  const change = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--success-soft)' }}
        >
          <CheckCircle2
            className="w-8 h-8"
            style={{ color: 'var(--success)' }}
          />
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Pendaftaran Berhasil! 🎉
        </h3>
        <p className="text-sm mb-1" style={{ color: 'var(--text)' }}>
          Terima kasih, <strong style={{ color: 'var(--text-strong)' }}>{form.name}</strong>!
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
          Tim kami akan menghubungi Anda melalui WhatsApp dalam 5–10 menit
          untuk konfirmasi jadwal konsultasi.
        </p>
        <div
          className="rounded-xl p-4 text-left text-sm"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
          }}
        >
          <p className="font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
            📋 Ringkasan Pendaftaran:
          </p>
          <p style={{ color: 'var(--text)' }}>
            Layanan: <strong>{form.service}</strong>
          </p>
          {form.preferredTime && (
            <p style={{ color: 'var(--text)' }}>
              Waktu Pilihan: <strong>{form.preferredTime}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setSubmitted(false)
            setForm({ name: '', phone: '', service: '', preferredTime: '', note: '' })
          }}
          className="mt-4 text-sm font-medium underline"
          style={{ color: 'var(--accent)' }}
        >
          Daftar lagi untuk orang lain
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Info banner privasi */}
      <div
        className="flex items-start gap-3 p-3 rounded-xl text-xs"
        style={{
          background: 'var(--info-soft)',
          border: '1px solid var(--info)',
          color: 'var(--info)',
        }}
      >
        <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Data Anda <strong>aman & terlindungi</strong>. Informasi hanya
          digunakan untuk keperluan penjadwalan dan tidak akan dibagikan ke
          pihak lain.
        </p>
      </div>

      <InputField
        label="Nama Lengkap Anda *"
        placeholder="cth. Siti Rahayu"
        value={form.name}
        error={errors.name}
        onChange={(e) => change('name', e.target.value)}
      />

      <InputField
        label="Nomor WhatsApp Aktif *"
        placeholder="cth. 0812-3456-7890"
        value={form.phone}
        error={errors.phone}
        onChange={(e) => change('phone', e.target.value)}
      />

      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: 'var(--text-strong)' }}
        >
          Layanan yang Diminati *
        </label>
        <select
          value={form.service}
          onChange={(e) => change('service', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{
            background: 'var(--bg-raised)',
            border: `1px solid ${errors.service ? 'var(--danger)' : 'var(--border)'}`,
            color: form.service ? 'var(--text-strong)' : 'var(--text)',
          }}
        >
          <option value="" disabled>
            -- Pilih layanan --
          </option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.service && (
          <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>
            {errors.service}
          </p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: 'var(--text-strong)' }}
        >
          Waktu Kunjungan yang Diinginkan
          <span className="font-normal ml-1" style={{ color: 'var(--text)' }}>
            (opsional)
          </span>
        </label>
        <select
          value={form.preferredTime}
          onChange={(e) => change('preferredTime', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            color: form.preferredTime ? 'var(--text-strong)' : 'var(--text)',
          }}
        >
          <option value="">-- Pilih waktu --</option>
          {['09:00 – 10:00', '10:00 – 11:00', '11:00 – 12:00',
            '13:00 – 14:00', '14:00 – 15:00', '15:00 – 16:00',
            '16:00 – 17:00'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: 'var(--text-strong)' }}
        >
          Keluhan atau Catatan Tambahan
          <span className="font-normal ml-1" style={{ color: 'var(--text)' }}>
            (opsional)
          </span>
        </label>
        <textarea
          value={form.note}
          onChange={(e) => change('note', e.target.value)}
          placeholder="cth. Kulit kering dan kusam, sudah 2 bulan..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            color: 'var(--text-strong)',
          }}
        />
      </div>

      <Button
        variant="primary"
        onClick={handleSubmit}
        className="w-full"
        size="lg"
        icon={ClipboardPen}
      >
        Kirim Pendaftaran Konsultasi Gratis
      </Button>

      <p className="text-center text-xs" style={{ color: 'var(--text)' }}>
        Tidak perlu membuat akun. Tim kami merespons dalam{' '}
        <strong>5–10 menit</strong> di jam operasional.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// KOMPONEN UTAMA: LeadsPipeline
// Satu halaman, dua tampilan:
//   — Admin → Sales Pipeline CRM penuh
//   — Guest → Live Tracker Antrean Skinova
// ─────────────────────────────────────────────────────────────
const LeadsPipeline = () => {
  const { can, role, leads, setLeads } = useRole()
  const isGuest = role === 'guest'
  const canEdit = can('view:leads:edit')

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // Form state untuk Admin "Tambah Lead"
  const [newLead, setNewLead] = useState({
    name: '',
    service: '',
    value: '',
    phone: '',
  })
  const [formError, setFormError] = useState({})

  // ── Statistik ringkasan (dihitung dari shared leads) ──
  const totalLeads = Object.values(leads).flat().length
  const totalSelesai = leads.selesai?.length ?? 0
  const totalAktif = totalLeads - totalSelesai
  const totalPipelineValue = Object.values(leads)
    .flat()
    .reduce((sum, l) => {
      const num = parseInt((l.value || '0').replace(/\D/g, ''), 10)
      return sum + (isNaN(num) ? 0 : num)
    }, 0)

  // ── Handler tambah lead baru (Admin) ──
  const handleAddLead = () => {
    const e = {}
    if (!newLead.name.trim()) e.name = 'Nama wajib diisi'
    if (!newLead.service.trim()) e.service = 'Layanan wajib diisi'
    if (Object.keys(e).length > 0) {
      setFormError(e)
      return
    }

    const initials = newLead.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    // Hitung nomor antrean berikutnya
    const existingKonsultasi = leads.konsultasi?.length ?? 0
    const nextNum = String(existingKonsultasi + 1).padStart(2, '0')

    const lead = {
      id: `L${Date.now()}`,
      name: newLead.name.trim(),
      service: newLead.service.trim(),
      value: newLead.value.trim() || 'Rp 0',
      phone: newLead.phone.trim() || '-',
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
      }),
      avatar: initials,
      queueNumber: `A-${nextNum}`,
      estimatedTime: '—',
      status: 'waiting',
    }

    // Update shared state → langsung terlihat di Guest view
    setLeads((prev) => ({
      ...prev,
      konsultasi: [lead, ...prev.konsultasi],
    }))

    // Reset form
    setNewLead({ name: '', service: '', value: '', phone: '' })
    setFormError({})
    setShowAddModal(false)
  }

  // ── Handler pendaftaran Guest ──
  const handleGuestRegister = (formData) => {
    // Buat lead dari pendaftaran Guest dan masukkan ke kolom konsultasi
    const initials = formData.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const existingKonsultasi = leads.konsultasi?.length ?? 0
    const nextNum = String(existingKonsultasi + 1).padStart(2, '0')

    const lead = {
      id: `G${Date.now()}`,
      name: formData.name.trim(),
      service: formData.service,
      value: 'Rp 0',
      phone: formData.phone.trim(),
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
      }),
      avatar: initials,
      queueNumber: `A-${nextNum}`,
      estimatedTime: formData.preferredTime
        ? formData.preferredTime.split('–')[0].trim()
        : '—',
      status: 'waiting',
      note: formData.note,
    }

    // ──────────────────────────────────────────────────────────
    // SINKRONISASI REAL-TIME:
    // Lead yang dibuat Guest langsung masuk ke shared state
    // yang sama dengan yang dilihat Admin. Admin akan melihat
    // pasien baru ini muncul di Kanban Board mereka secara
    // instan tanpa reload.
    // ──────────────────────────────────────────────────────────
    setLeads((prev) => ({
      ...prev,
      konsultasi: [lead, ...prev.konsultasi],
    }))
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: GUEST — Live Tracker Antrean Skinova
  // Tampilan kiosk publik, zero elemen internal bisnis
  // ─────────────────────────────────────────────────────────────
  if (isGuest) {
    const guestTotalAktif = (leads.konsultasi?.length ?? 0) +
      (leads.jadwal?.length ?? 0) +
      (leads.pembayaran?.length ?? 0)

    return (
      <div>
        {/* Header publik — tanpa istilah CRM */}
        <PageHeader
          title="Live Tracker Antrean Tindakan"
          subtitle="Pantau status antrean secara langsung — diperbarui otomatis"
        >
          <Button
            variant="primary"
            size="sm"
            icon={ClipboardPen}
            onClick={() => setShowRegisterModal(true)}
          >
            Daftar Konsultasi Gratis
          </Button>
        </PageHeader>

        {/* Banner informasi klinik */}
        <Card
          className="mb-5"
          style={{
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent)',
          }}
        >
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className="font-bold mb-1"
                style={{ color: 'var(--accent)' }}
              >
                Skinova — Klinik Kecantikan &amp; Estetika
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
                Selamat datang di tracker antrean digital kami. Identitas setiap
                pasien <strong>dilindungi penuh</strong> — hanya nomor antrean
                dan jenis layanan yang ditampilkan untuk menjaga privasi Anda.
              </p>
            </div>
          </div>
        </Card>

        {/* Statistik ringkasan Guest */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              label: 'Sedang Ditangani',
              value: leads.pembayaran?.length ?? 0,
              color: 'var(--accent)',
              bg: 'var(--accent-soft)',
            },
            {
              label: 'Masih Menunggu',
              value: guestTotalAktif,
              color: 'var(--warning)',
              bg: 'var(--warning-soft)',
            },
            {
              label: 'Selesai Hari Ini',
              value: leads.selesai?.length ?? 0,
              color: 'var(--success)',
              bg: 'var(--success-soft)',
            },
          ].map((s) => (
            <Card key={s.label} className="text-center !py-4">
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                {s.label}
              </p>
            </Card>
          ))}
        </div>

        {/* Banner privasi */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-5 text-xs"
          style={{
            background: 'var(--info-soft)',
            border: '1px solid var(--info)',
            color: 'var(--info)',
          }}
        >
          <Info className="w-4 h-4 flex-shrink-0" />
          <p>
            <strong>Perlindungan Privasi Aktif:</strong> Nama pasien ditampilkan
            dalam format tersensor otomatis (cth:{' '}
            <span className="font-mono">A**** P****</span>) untuk melindungi
            kerahasiaan identitas seluruh pasien.
          </p>
        </div>

        {/* Board tracker antrean — data real-time dari shared state */}
        <KanbanBoard />

        {/* CTA daftar ulang di bawah */}
        <Card className="mt-5 text-center">
          <p
            className="text-base font-bold mb-1"
            style={{ color: 'var(--text-heading)' }}
          >
            Belum terdaftar? 🌸
          </p>
          <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
            Daftarkan diri Anda sekarang untuk konsultasi kulit <strong>gratis</strong>
            {' '}bersama dokter spesialis kami — tanpa perlu membuat akun.
          </p>
          <Button
            variant="primary"
            icon={ClipboardPen}
            onClick={() => setShowRegisterModal(true)}
          >
            Daftar Konsultasi Gratis Sekarang
          </Button>
        </Card>

        {/* Modal pendaftaran mandiri */}
        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Pendaftaran Konsultasi Gratis"
          maxWidth="max-w-lg"
        >
          <GuestRegistrationPanel
            onSubmit={(data) => {
              handleGuestRegister(data)
              // Modal tetap terbuka agar tampil layar sukses
            }}
          />
        </Modal>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: ADMIN — Sales Pipeline CRM
  // Tampilan penuh dengan terminologi bisnis & fitur edit
  // ─────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Sales Pipeline"
        subtitle="Kelola alur leads & konversi pasien klinik"
      >
        {/* Total nilai pipeline — hanya terlihat Admin */}
        <div
          className="text-sm px-4 py-2 rounded-xl font-semibold hidden md:block"
          style={{
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
            border: '1px solid var(--border)',
          }}
        >
          Pipeline: {formatIDR(totalPipelineValue)}
        </div>

        {canEdit && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Tambah Lead
          </Button>
        )}
      </PageHeader>

      {/* Statistik Admin */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {Object.entries(columnConfig).map(([key, cfg]) => (
          <Card key={key} className="text-center !py-4">
            <p
              className="text-2xl font-bold mb-1"
              style={{ color: cfg.color }}
            >
              {leads[key]?.length ?? 0}
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>
              {cfg.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Kanban Board — mode Admin dengan drag-drop */}
      <KanbanBoard />

      {/* Banner Marketing Automation */}
      <Card
        className="mt-4"
        style={{
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent)',
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3
              className="text-sm font-bold mb-1"
              style={{ color: 'var(--accent)' }}
            >
              🤖 Marketing Automation Aktif
            </h3>
            <p className="text-xs" style={{ color: 'var(--text)' }}>
              Trigger:{' '}
              <strong>Ulang Tahun Pasien</strong> → Voucher 15% via WhatsApp
              &nbsp;|&nbsp;
              <strong>3 Bulan Tidak Kunjung</strong> → Reminder Email otomatis
            </p>
          </div>
          {canEdit && (
            <Button variant="secondary" size="sm">
              Kelola Trigger
            </Button>
          )}
        </div>
      </Card>

      {/* Notifikasi untuk Admin: data Guest masuk real-time */}
      <div
        className="flex items-start gap-3 p-3 rounded-xl mt-3 text-xs"
        style={{
          background: 'var(--info-soft)',
          border: '1px solid var(--info)',
          color: 'var(--info)',
        }}
      >
        <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Sinkronisasi Real-time:</strong> Pendaftaran mandiri dari
          pasien (mode Guest) akan langsung muncul di kolom{' '}
          <strong>Konsultasi</strong> tanpa perlu refresh halaman.
        </p>
      </div>

      {/* ── Modal Tambah Lead (Admin) ── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setFormError({})
        }}
        title="Tambah Lead Baru"
      >
        <div className="space-y-4">
          <InputField
            label="Nama Pasien / Prospek *"
            placeholder="cth. Anisa Rahman"
            value={newLead.name}
            error={formError.name}
            onChange={(e) => {
              setNewLead((p) => ({ ...p, name: e.target.value }))
              if (formError.name) setFormError((p) => ({ ...p, name: '' }))
            }}
          />
          <InputField
            label="Treatment yang Diminati *"
            placeholder="cth. Laser Rejuvenation"
            value={newLead.service}
            error={formError.service}
            onChange={(e) => {
              setNewLead((p) => ({ ...p, service: e.target.value }))
              if (formError.service) setFormError((p) => ({ ...p, service: '' }))
            }}
          />
          <InputField
            label="Estimasi Nilai Deal"
            placeholder="cth. Rp 4.500.000"
            value={newLead.value}
            onChange={(e) => setNewLead((p) => ({ ...p, value: e.target.value }))}
          />
          <InputField
            label="No. Telepon / WhatsApp"
            placeholder="cth. 0812-xxxx-xxxx"
            value={newLead.phone}
            onChange={(e) => setNewLead((p) => ({ ...p, phone: e.target.value }))}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false)
                setFormError({})
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button variant="primary" onClick={handleAddLead} className="flex-1">
              Tambah Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LeadsPipeline