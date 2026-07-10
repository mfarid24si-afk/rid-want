import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus } from 'lucide-react'
import { treatmentService } from '../../services/treatmentService'

const emojiMap = {
  'Perawatan Kulit': '✨',
  'Anti Aging': '💉',
  'Teknologi Laser': '🔬',
  'Perawatan Wajah': '🎯',
  'Perawatan Rambut': '💆',
  'Perawatan Tubuh': '🌿',
  'Kulit Berjerawat': '🩺',
}

const ServicesPage = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const data = await treatmentService.getActive()
        setServices(data)
      } catch (err) {
        console.error('Gagal memuat layanan:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTreatments()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-20 text-center">
        <p style={{ color: 'var(--text)' }}>Memuat layanan...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text-heading)' }}>
          Layanan Treatment Kami
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text)' }}>
          {services.length} jenis perawatan estetika terpilih, ditangani dokter bersertifikat
          dengan standar medis internasional.
        </p>
      </div>

      {/* Grid layanan */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Belum ada layanan tersedia saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="rounded-2xl p-6 flex flex-col transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.boxShadow = '0 4px 20px var(--accent)22'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{emojiMap[svc.category] || '✨'}</span>
                <div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    {svc.category || 'Layanan'}
                  </span>
                  <h3 className="font-bold text-base mt-1" style={{ color: 'var(--text-heading)' }}>
                    {svc.name}
                  </h3>
                </div>
              </div>

              <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text)' }}>{svc.description}</p>

              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                    Rp {svc.price?.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text)' }}>⏱ {svc.duration_min} menit</p>
                </div>
                <button
                  onClick={() => navigate('/portal/booking')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all active:scale-95"
                  style={{ background: 'var(--accent)' }}
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}
      >
        <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text-heading)' }}>
          Tidak yakin treatment mana yang tepat?
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
          Konsultasi gratis dengan dokter kami — tanpa biaya, tanpa perlu membuat akun.
        </p>
        <button
          onClick={() => navigate('/portal/booking')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white transition-all active:scale-95"
          style={{ background: 'var(--accent)' }}
        >
          <CalendarPlus className="w-4 h-4" />
          Konsultasi Gratis Sekarang
        </button>
      </div>
    </div>
  )
}

export default ServicesPage