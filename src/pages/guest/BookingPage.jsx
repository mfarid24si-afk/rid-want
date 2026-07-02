import { useState } from 'react'
import toast from 'react-hot-toast'
import { CalendarPlus, CheckCircle2, Shield, Clock } from 'lucide-react'
import InputField from '../../components/ui/InputField'
import Button from '../../components/ui/Button'
import { useRole } from '../../context/RoleContext'
import { motion, AnimatePresence } from 'framer-motion'

const doctors = [
  { id: 'dr-ayu',    name: 'dr. Ayu Maharani, SpKK', spec: 'Dermatologi & Estetika', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
  { id: 'dr-sinta',  name: 'dr. Sinta Pertiwi, SpBP', spec: 'Bedah Plastik & Anti-Aging', slots: ['10:00', '13:00', '16:00'] },
  { id: 'dr-rahma',  name: 'dr. Rahma Kusuma, SpKK',  spec: 'Kulit & Kelamin', slots: ['09:30', '11:30', '14:30', '15:30'] },
]

const serviceOptions = [
  'Konsultasi Kulit (Gratis)',
  'Facial Glow Treatment',
  'Laser Rejuvenation',
  'Botox Treatment',
  'Chemical Peeling',
  'Microblading Alis',
  'Hair Spa Premium',
  'Anti Aging Package',
  'Body Slimming',
  'Acne Treatment (Program 5x)',
]

const BookingPage = () => {
  const { setLeads } = useRole()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service: '', doctor: '', date: '', time: '', complaint: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const selectedDoctor = doctors.find((d) => d.id === form.doctor)

  const change = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
    // Reset time saat ganti dokter
    if (field === 'doctor') setForm((p) => ({ ...p, doctor: val, time: '' }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama lengkap wajib diisi'
    if (!form.phone.trim()) e.phone = 'Nomor WhatsApp wajib diisi'
    if (!form.service) e.service = 'Pilih layanan yang diinginkan'
    return e
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.doctor) e.doctor = 'Pilih dokter terlebih dahulu'
    if (!form.date) e.date = 'Pilih tanggal kunjungan'
    if (!form.time) e.time = 'Pilih waktu konsultasi'
    return e
  }

  const handleNext = () => {
    const e = validateStep1()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      toast.error('Lengkapi data wajib sebelum lanjut ke jadwal')
      return
    }
    setStep(2)
  }

  const handleSubmit = () => {
    const e = validateStep2()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      toast.error('Pilih dokter, tanggal, dan waktu konsultasi')
      return
    }

    // Daftarkan ke shared state (real-time sync ke Admin KanbanBoard)
    const initials = form.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    setLeads((prev) => {
      const nextNum = String((prev.konsultasi?.length ?? 0) + 1).padStart(2, '0')
      const lead = {
        id: `B${Date.now()}`,
        name: form.name.trim(),
        service: form.service,
        value: 'Rp 0',
        phone: form.phone.trim(),
        date: new Date(form.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        avatar: initials,
        queueNumber: `A-${nextNum}`,
        estimatedTime: form.time,
        status: 'waiting',
        note: form.complaint,
      }
      return { ...prev, konsultasi: [lead, ...prev.konsultasi] }
    })
    setSubmitted(true)
    toast.success('Booking berhasil dikonfirmasi! 🎉')
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'var(--success-soft)' }}
        >
          <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--success)' }} />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-heading)' }}>
          Booking Berhasil! 🎉
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text)' }}>
          Terima kasih <strong>{form.name}</strong>! Konfirmasi akan dikirim ke{' '}
          <strong>{form.phone}</strong> via WhatsApp dalam 5–10 menit.
        </p>
        
        {/* Luxury E-Receipt Card */}
        <div
          className="relative rounded-3xl p-6 text-left text-sm mb-6 shadow-md border overflow-hidden"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--border)',
          }}
        >
          {/* Ticket Cutout circles on receipt card */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border z-10" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border)' }} />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border z-10" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border)' }} />
          
          <div className="text-center pb-4 border-b border-dashed" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-black text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>E-Receipt Booking</h4>
            <p className="text-[10px] text-stone-400 mt-0.5">SKINOVA & ESTETIKA</p>
          </div>

          <div className="py-4 space-y-2 border-b border-dashed" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between">
              <span className="text-stone-400">Nama Pasien:</span>
              <span className="font-bold" style={{ color: 'var(--text-strong)' }}>{form.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Layanan:</span>
              <span className="font-bold" style={{ color: 'var(--text-strong)' }}>{form.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Dokter:</span>
              <span className="font-bold" style={{ color: 'var(--text-strong)' }}>{selectedDoctor?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Tanggal:</span>
              <span className="font-bold" style={{ color: 'var(--text-strong)' }}>{form.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Waktu:</span>
              <span className="font-bold" style={{ color: 'var(--text-strong)' }}>{form.time}</span>
            </div>
          </div>

          <div className="pt-4 text-center">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>
              ✓ TERVERIFIKASI SISTEM
            </div>
          </div>
        </div>

        <button
          onClick={() => { setSubmitted(false); setStep(1); setForm({ name: '', phone: '', email: '', service: '', doctor: '', date: '', time: '', complaint: '' }) }}
          className="text-sm font-medium underline cursor-pointer"
          style={{ color: 'var(--accent)' }}
        >
          Booking lagi untuk orang lain
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow"
          style={{ background: 'var(--accent-soft)' }}
        >
          <CalendarPlus className="w-7 h-7" style={{ color: 'var(--accent)' }} />
        </div>
        <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-heading)' }}>
          Booking Konsultasi
        </h1>
        <p className="text-sm" style={{ color: 'var(--text)' }}>
          Tidak perlu membuat akun · Konfirmasi via WhatsApp
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
              style={{
                background: step >= s ? 'var(--accent)' : 'var(--bg-raised)',
                color: step >= s ? '#fff' : 'var(--text)',
                border: step >= s ? 'none' : '1px solid var(--border)',
              }}
            >
              {s}
            </div>
            <span className="text-sm font-semibold transition-all" style={{ color: step >= s ? 'var(--text-heading)' : 'var(--text)' }}>
              {s === 1 ? 'Data Diri' : 'Pilih Jadwal'}
            </span>
            {s < 2 && <div className="w-8 h-px" style={{ background: 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {/* Form container */}
      <div
        className="rounded-3xl p-6 shadow-md"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Privasi notice */}
        <div
          className="flex items-start gap-3 p-3 rounded-xl text-xs mb-5"
          style={{ background: 'var(--info-soft)', border: '1px solid var(--info)', color: 'var(--info)' }}
        >
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>Data Anda <strong>aman & terlindungi</strong>. Hanya digunakan untuk keperluan penjadwalan.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              <InputField label="Nama Lengkap *" placeholder="cth. Siti Rahayu" value={form.name}
                error={errors.name} onChange={(e) => change('name', e.target.value)} />
              <InputField label="Nomor WhatsApp Aktif *" placeholder="cth. 0812-3456-7890" value={form.phone}
                error={errors.phone} onChange={(e) => change('phone', e.target.value)} />
              <InputField label="Email (opsional)" placeholder="cth. nama@email.com" value={form.email}
                onChange={(e) => change('email', e.target.value)} />

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

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>
                  Keluhan atau Catatan <span style={{ color: 'var(--text)', fontWeight: 400 }}>(opsional)</span>
                </label>
                <textarea
                  value={form.complaint}
                  onChange={(e) => change('complaint', e.target.value)}
                  placeholder="Ceritakan kondisi kulit atau keluhan Anda..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
                />
              </div>

              <Button variant="primary" onClick={handleNext} className="w-full">
                Lanjut ke Pilih Jadwal →
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {/* Pilih dokter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-strong)' }}>
                  Pilih Dokter *
                </label>
                <div className="space-y-2">
                  {doctors.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => change('doctor', doc.id)}
                      className="w-full text-left p-4 rounded-xl transition-all cursor-pointer"
                      style={{
                        background: form.doctor === doc.id ? 'var(--accent-soft)' : 'var(--bg-raised)',
                        border: `1px solid ${form.doctor === doc.id ? 'var(--accent)' : 'var(--border)'}`,
                        boxShadow: form.doctor === doc.id ? '0 0 10px rgba(201, 169, 110, 0.25)' : 'none',
                      }}
                    >
                      <p className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>{doc.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text)' }}>{doc.spec}</p>
                    </button>
                  ))}
                </div>
                {errors.doctor && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.doctor}</p>}
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>
                  Tanggal Kunjungan *
                </label>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => change('date', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--bg-raised)',
                    border: `1px solid ${errors.date ? 'var(--danger)' : 'var(--border)'}`,
                    color: 'var(--text-strong)',
                  }}
                />
                {errors.date && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.date}</p>}
              </div>

              {/* Slot waktu */}
              {selectedDoctor && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-strong)' }}>
                    Pilih Waktu *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedDoctor.slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => change('time', slot)}
                        className="py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        style={{
                          background: form.time === slot ? 'var(--accent)' : 'var(--bg-raised)',
                          color: form.time === slot ? '#fff' : 'var(--text-strong)',
                          border: `1px solid ${form.time === slot ? 'var(--accent)' : 'var(--border)'}`,
                          boxShadow: form.time === slot ? '0 0 10px rgba(201, 169, 110, 0.3)' : 'none',
                        }}
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.time && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.time}</p>}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">← Kembali</Button>
                <Button variant="primary" onClick={handleSubmit} className="flex-1">Konfirmasi Booking ✓</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BookingPage