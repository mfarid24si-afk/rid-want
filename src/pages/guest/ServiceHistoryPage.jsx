import { History, Stethoscope, CalendarPlus } from 'lucide-react'
import { useRole } from '../../context/RoleContext'
import { censorName } from '../../components/crm/KanbanBoard'
import { useNavigate } from 'react-router-dom'

// Riwayat treatment mock — dalam produksi dari API per pasien
const historyData = [
  {
    date: '05 Jun 2025', treatment: 'Facial Glow Premium',
    doctor: 'dr. Ayu Maharani, SpKK', duration: '75 menit',
    recommendation: 'Lanjutkan serum Vitamin C pagi & sore. Hindari paparan matahari langsung.',
    status: 'done',
  },
  {
    date: '15 Apr 2025', treatment: 'Chemical Peeling',
    doctor: 'dr. Rahma Kusuma, SpKK', duration: '40 menit',
    recommendation: 'Gunakan sunscreen SPF 50+ setiap hari. Jangan exfoliasi berlebihan selama 2 minggu.',
    status: 'done',
  },
  {
    date: '02 Mar 2025', treatment: 'Konsultasi Kulit',
    doctor: 'dr. Ayu Maharani, SpKK', duration: '30 menit',
    recommendation: 'Disarankan program Chemical Peeling 3x untuk mengatasi hiperpigmentasi.',
    status: 'done',
  },
]

const ServiceHistoryPage = () => {
  const { customers } = useRole()
  const navigate = useNavigate()
  const patient = customers?.[0]

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--accent-soft)' }}
        >
          <History className="w-7 h-7" style={{ color: 'var(--accent)' }} />
        </div>
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-heading)' }}>
          Riwayat Treatment
        </h1>
        <p style={{ color: 'var(--text)' }}>
          Catatan konsultasi &amp; treatment {patient ? censorName(patient.name) : 'Anda'}
        </p>
      </div>

      {/* Ringkasan */}
      <div
        className="rounded-2xl p-4 mb-6 grid grid-cols-3 gap-4 text-center"
        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{historyData.length}</p>
          <p className="text-xs" style={{ color: 'var(--text)' }}>Total Kunjungan</p>
        </div>
        <div>
          <p className="text-2xl font-black" style={{ color: 'var(--success)' }}>
            {historyData.filter((h) => h.status === 'done').length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text)' }}>Selesai</p>
        </div>
        <div>
          <p className="text-2xl font-black" style={{ color: 'var(--warning)' }}>
            {patient?.totalVisits ?? historyData.length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text)' }}>Total Semua</p>
        </div>
      </div>

      {/* Timeline riwayat */}
      <div className="space-y-4 mb-8">
        {historyData.map((h, i) => (
          <div
            key={i}
            className="rounded-2xl p-5"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'var(--text)' }}>📅 {h.date}</p>
                <h3 className="font-bold" style={{ color: 'var(--text-heading)' }}>{h.treatment}</h3>
                <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: 'var(--text)' }}>
                  <Stethoscope className="w-3.5 h-3.5" />
                  {h.doctor} &nbsp;·&nbsp; ⏱ {h.duration}
                </div>
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0"
                style={{ background: 'var(--success-soft)', color: 'var(--success)' }}
              >
                ✓ Selesai
              </span>
            </div>

            {/* Rekomendasi dokter */}
            <div
              className="rounded-xl p-3"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>
                📋 Rekomendasi Dokter:
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
                {h.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}
      >
        <p className="font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          Waktunya treatment berikutnya? ✨
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
          Jadwalkan kunjungan selanjutnya dan lanjutkan perjalanan kecantikan Anda.
        </p>
        <button
          onClick={() => navigate('/portal/booking')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white"
          style={{ background: 'var(--accent)' }}
        >
          <CalendarPlus className="w-4 h-4" />
          Booking Sekarang
        </button>
      </div>
    </div>
  )
}

export default ServiceHistoryPage