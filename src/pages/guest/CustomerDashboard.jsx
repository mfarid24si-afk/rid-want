import React, { useState, useEffect } from 'react'
import { useRole } from '../../context/RoleContext'
import { useAuth } from '../../context/AuthContext'
import { User, ListOrdered, Gift, Ticket, History, CalendarPlus, Sparkles, CheckCircle2, Moon, Sun, ArrowRight, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { censorName } from '../../components/crm/KanbanBoard'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

const CustomerDashboard = () => {
  const { leads, customers } = useRole()
  const { user, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Simulasi: tampilkan data pasien pertama sebagai "yang sedang login"
  const patient = customers?.[0]

  // Cari antrean aktif milik pasien ini di seluruh tahapan Kanban
  const activeLead = Object.entries(leads).reduce((found, [stage, list]) => {
    if (found) return found
    const item = list.find(l => l.name.toLowerCase() === (patient?.name || '').toLowerCase())
    if (item) return { ...item, stage }
    return null
  }, null)

  const getStepIndex = (stage) => {
    switch (stage) {
      case 'konsultasi': return 1
      case 'jadwal': return 2
      case 'pembayaran': return 3
      case 'selesai': return 4
      default: return 0
    }
  }

  const activeStep = activeLead ? getStepIndex(activeLead.stage) : 0

  // State untuk checklist skincare routine harian
  const [checkedRoutines, setCheckedRoutines] = useState(() => {
    const saved = localStorage.getItem('skincare-routine-checked')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('skincare-routine-checked', JSON.stringify(checkedRoutines))
  }, [checkedRoutines])

  const toggleRoutine = (id) => {
    setCheckedRoutines(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const totalAktif =
    (leads.konsultasi?.length ?? 0) +
    (leads.jadwal?.length ?? 0) +
    (leads.pembayaran?.length ?? 0)

  const quickLinks = [
    { icon: ListOrdered, label: 'Cek Antrean',       path: '/portal/tracking', color: 'var(--accent)' },
    { icon: CalendarPlus, label: 'Booking Baru',     path: '/portal/booking',  color: 'var(--info)' },
    { icon: Gift,          label: 'Poin Reward',     path: '/portal/loyalty',  color: 'var(--warning)' },
    { icon: Ticket,        label: 'Voucher Saya',    path: '/portal/voucher',  color: 'var(--success)' },
    { icon: History,       label: 'Riwayat',         path: '/portal/history',  color: 'var(--accent)' },
  ]

  const routines = {
    morning: [
      { id: 'm1', time: '07:00', name: 'Gentle Cleanser', desc: 'Bersihkan sisa skincare malam' },
      { id: 'm2', time: '07:10', name: 'Hydrating Toner', desc: 'Menghidrasi & menyeimbangkan pH' },
      { id: 'm3', time: '07:15', name: 'Serum Vitamin C', desc: 'Antioksidan & mencerahkan kulit' },
      { id: 'm4', time: '07:25', name: 'Moisturizer Gel', desc: 'Kunci kelembapan ringan' },
      { id: 'm5', time: '07:30', name: 'Sunscreen SPF 50', desc: 'Perlindungan UV wajib harian' },
    ],
    night: [
      { id: 'n1', time: '20:00', name: 'Micellar Water', desc: 'Double cleansing angkat kotoran/makeup' },
      { id: 'n2', time: '20:10', name: 'Facial Wash Acne', desc: 'Pembersihan mendalam pori-pori' },
      { id: 'n3', time: '20:15', name: 'Retinol Serum (3x/wk)', desc: 'Anti-aging & regenerasi sel kulit' },
      { id: 'n4', time: '20:30', name: 'Ceramide Barrier Cream', desc: 'Memperbaiki skin barrier saat tidur' },
    ]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
      
      {/* ── PREMIUM MEMBER CARD ── */}
      <div 
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6 transition-all duration-500 hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #2D1B10 0%, #4A3728 50%, #1A0D07 100%)',
          border: '1px solid rgba(201, 169, 110, 0.4)',
        }}
      >
        {/* Ornamen Kilauan Radial */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute -left-10 -bottom-20 w-60 h-60 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
        />

        {/* Info Member & Tier */}
        <div className="flex-1 space-y-4 z-10">
          <div className="flex items-center gap-2">
            <span 
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#2D1B10]"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Skinova Prestige Card
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#E8D5C4] via-[#FFFFFF] to-[#D4B99A]">
              {patient ? censorName(patient.name) : 'Pasien Tamu'}
            </h3>
            <p className="text-xs text-stone-400 mt-1">ID Pelanggan: AP-00{patient?.id ?? '0'}</p>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs text-stone-300 font-semibold mb-1.5">
              <span>Progress Gold VIP</span>
              <span>75% (3.750 / 5.000 Poin)</span>
            </div>
            {/* Custom Progress Bar */}
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden border border-stone-700/50">
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: '75%', 
                  background: 'linear-gradient(90deg, var(--accent) 0%, #FFFFFF 100%)',
                  boxShadow: '0 0 8px var(--accent)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Tier Bag & Card Design */}
        <div className="flex flex-col justify-between items-end text-right z-10 min-w-[150px]">
          <div className="flex flex-col items-end">
            <span className="text-xs text-stone-400">Status Keanggotaan</span>
            <span 
              className="text-lg font-black tracking-wider flex items-center gap-1.5 mt-0.5" 
              style={{ color: 'var(--accent)' }}
            >
              <Sparkles className="w-4 h-4 fill-current animate-pulse" />
              {patient?.status === 'vip' ? 'GOLD VIP MEMBER' : 'SILVER MEMBER'}
            </span>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <span className="text-xs text-stone-400">Total Reward Poin</span>
            <span className="text-3xl font-black text-white">
              3.750
            </span>
            <span className="text-[10px] text-stone-500 font-medium">poin aktif</span>
          </div>
        </div>
      </div>

      {/* ── LIVE APPOINTMENT STEPPER (Jika Ada Antrean Aktif) ── */}
      {activeLead ? (
        <div 
          className="rounded-3xl p-6 shadow-md border transition-all duration-300 relative overflow-hidden"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {/* Neon Glow Accent */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--accent)' }}></span>
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'var(--accent)' }}></span>
              </span>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-heading)' }}>
                Janji Temu Hari Ini (Nomor Antrean: {activeLead.queueNumber})
              </h3>
            </div>
            <span className="text-xs font-semibold text-stone-400">Estimasi Pelayanan: {activeLead.estimatedTime}</span>
          </div>

          {/* Steps Horizontal */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-2 relative">
            
            {/* Step Line (Desktop) */}
            <div className="hidden md:block absolute top-5 left-[12%] right-[12%] h-[2px] bg-stone-200 dark:bg-stone-800 z-0">
              <div 
                className="h-full bg-[var(--accent)] transition-all duration-500" 
                style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
              />
            </div>

            {[
              { idx: 1, label: 'Pendaftaran', desc: 'Antrean Terdaftar', stageKey: 'konsultasi' },
              { idx: 2, label: 'Jadwal', desc: 'Waktu Ditetapkan', stageKey: 'jadwal' },
              { idx: 3, label: 'Tindakan', desc: 'Sedang Dilayani', stageKey: 'pembayaran' },
              { idx: 4, label: 'Selesai', desc: 'Kembali Sehat', stageKey: 'selesai' },
            ].map((step) => {
              const isDone = activeStep > step.idx
              const isCurrent = activeStep === step.idx
              const isFuture = activeStep < step.idx

              return (
                <div key={step.idx} className="flex-1 flex flex-col items-center text-center z-10 w-full relative">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={{
                      backgroundColor: isDone || isCurrent ? 'var(--accent)' : 'var(--bg-raised)',
                      color: isDone || isCurrent ? '#FFFFFF' : 'var(--text)',
                      border: isCurrent ? '2px solid #FFFFFF' : isFuture ? '1px solid var(--border)' : 'none',
                      boxShadow: isCurrent ? '0 0 12px var(--accent)' : 'none',
                    }}
                  >
                    {isDone ? '✓' : step.idx}
                  </div>
                  <h4 className="text-xs font-bold mt-2" style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-heading)' }}>
                    {step.label}
                  </h4>
                  <p className="text-[10px]" style={{ color: 'var(--text)' }}>
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => navigate('/portal/tracking')}
              className="text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
              style={{ color: 'var(--accent)' }}
            >
              Lihat di Live Tracker <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="rounded-3xl p-6 shadow-md border text-center transition-all duration-300"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            Anda tidak memiliki antrean aktif hari ini.
          </p>
          <button 
            onClick={() => navigate('/portal/booking')}
            className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:shadow-md"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Mulai Booking Baru
          </button>
        </div>
      )}

      {/* ── DAILY SKINCARE ROUTINE WIDGET ── */}
      <div 
        className="rounded-3xl p-6 shadow-md border transition-all duration-300"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-4 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
          <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <div>
            <h3 className="font-bold text-base" style={{ color: 'var(--text-heading)' }}>Rekomendasi Skincare Dokter</h3>
            <p className="text-xs" style={{ color: 'var(--text)' }}>Rekomendasi harian pagi & malam oleh dr. Ayu Maharani, SpKK</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pagi */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <Sun className="w-4 h-4" />
              <span>Rutinitas Pagi (Morning Routine)</span>
            </div>
            
            <div className="space-y-2">
              {routines.morning.map((r) => (
                <div 
                  key={r.id} 
                  onClick={() => toggleRoutine(r.id)}
                  className="p-3 rounded-2xl flex items-center justify-between border transition-all duration-200 cursor-pointer"
                  style={{ 
                    backgroundColor: checkedRoutines[r.id] ? 'var(--accent-soft)' : 'var(--bg-raised)', 
                    borderColor: checkedRoutines[r.id] ? 'var(--accent)' : 'var(--border)',
                    opacity: checkedRoutines[r.id] ? 0.7 : 1
                  }}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800" style={{ color: 'var(--text)' }}>
                        {r.time}
                      </span>
                      <p className="text-xs font-bold line-through-checked" style={{ color: 'var(--text-heading)', decoration: checkedRoutines[r.id] ? 'line-through' : 'none' }}>
                        {checkedRoutines[r.id] ? <del>{r.name}</del> : r.name}
                      </p>
                    </div>
                    <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text)' }}>{r.desc}</p>
                  </div>
                  <div 
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                    style={{ 
                      borderColor: checkedRoutines[r.id] ? 'var(--accent)' : 'var(--border-strong)',
                      backgroundColor: checkedRoutines[r.id] ? 'var(--accent)' : 'transparent'
                    }}
                  >
                    {checkedRoutines[r.id] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Malam */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm">
              <Moon className="w-4 h-4" />
              <span>Rutinitas Malam (Night Routine)</span>
            </div>

            <div className="space-y-2">
              {routines.night.map((r) => (
                <div 
                  key={r.id} 
                  onClick={() => toggleRoutine(r.id)}
                  className="p-3 rounded-2xl flex items-center justify-between border transition-all duration-200 cursor-pointer"
                  style={{ 
                    backgroundColor: checkedRoutines[r.id] ? 'var(--accent-soft)' : 'var(--bg-raised)', 
                    borderColor: checkedRoutines[r.id] ? 'var(--accent)' : 'var(--border)',
                    opacity: checkedRoutines[r.id] ? 0.7 : 1
                  }}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800" style={{ color: 'var(--text)' }}>
                        {r.time}
                      </span>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-heading)' }}>
                        {checkedRoutines[r.id] ? <del>{r.name}</del> : r.name}
                      </p>
                    </div>
                    <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text)' }}>{r.desc}</p>
                  </div>
                  <div 
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                    style={{ 
                      borderColor: checkedRoutines[r.id] ? 'var(--accent)' : 'var(--border-strong)',
                      backgroundColor: checkedRoutines[r.id] ? 'var(--accent)' : 'transparent'
                    }}
                  >
                    {checkedRoutines[r.id] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ACCESS QUICK LINKS ── */}
      <h3 className="font-black text-lg mb-0" style={{ color: 'var(--text-heading)' }}>Akses Cepat Layanan</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {quickLinks.map(({ icon: Icon, label, path, color }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="rounded-3xl p-5 text-center transition-all duration-300 cursor-pointer active:scale-95 flex flex-col items-center justify-center border"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.borderColor = color; 
              e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.borderColor = 'var(--border)'; 
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)' 
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: color + '15' }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-heading)' }}>{label}</p>
          </button>
        ))}
      </div>

      {/* ── LAST TREATMENT DETAILS ── */}
      {patient && (
        <div
          className="rounded-3xl p-6 shadow-md border transition-all duration-300"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 animate-spin-slow" style={{ color: 'var(--accent)' }} />
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>Riwayat Kunjungan Terakhir</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-strong)' }}>{patient.lastTreatment}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text)' }}>
                Bergabung sejak {patient.joinDate} &nbsp;·&nbsp; Total Kunjungan: {patient.totalVisits} kali
              </p>
            </div>
            <span
              className="text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-center"
              style={{
                background: patient.status === 'vip' ? 'var(--warning-soft)' : 'var(--accent-soft)',
                color: patient.status === 'vip' ? 'var(--warning)' : 'var(--accent)',
                border: `1px solid ${patient.status === 'vip' ? 'var(--warning)' : 'var(--accent)'}33`
              }}
            >
              {patient.status === 'vip' ? '⭐ Gold VIP Member' : patient.status}
            </span>
          </div>
        </div>
      )}

      {/* ── DELETE ACCOUNT SECTION ── */}
      <div
        className="rounded-3xl p-6 shadow-md border transition-all duration-300"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 border border-red-500/20">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>Hapus Akun</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>
              Setelah dihapus, semua data akun Anda akan hilang permanen.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:shadow-md"
            style={{ background: 'var(--danger)' }}
          >
            Hapus Akun
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError('') }} title="Hapus Akun" maxWidth="max-w-sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>Anda yakin ingin menghapus akun?</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text)' }}>
                Tindakan ini <strong>tidak dapat dibatalkan</strong>. Seluruh data Anda, termasuk riwayat kunjungan dan poin reward, akan dihapus permanen.
              </p>
            </div>
          </div>

          {deleteError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs text-center font-bold">
              {deleteError}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-strong)' }}>
              Ketik <strong style={{ color: 'var(--accent)' }}>HAPUS</strong> untuk konfirmasi:
            </p>
            <input
              type="text"
              placeholder="Ketik HAPUS"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" type="button" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError('') }} className="flex-1">
              Batal
            </Button>
            <Button
              variant="primary"
              type="button"
              disabled={deleteConfirmText !== 'HAPUS' || deleting}
              onClick={async () => {
                setDeleting(true)
                setDeleteError('')
                try {
                  await deleteAccount()
                  navigate('/', { replace: true })
                } catch (err) {
                  setDeleteError(err.message || 'Gagal menghapus akun')
                } finally {
                  setDeleting(false)
                }
              }}
              className="flex-1"
              style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              {deleting ? 'Menghapus...' : 'Ya, Hapus Akun Saya'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CustomerDashboard