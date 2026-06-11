import { useNavigate } from 'react-router-dom'
import { CalendarPlus, CheckCircle2 } from 'lucide-react'

const services = [
  {
    emoji: '✨', category: 'Perawatan Kulit',
    title: 'Facial Glow Premium',
    desc: 'Membersihkan, mencerahkan, dan melembabkan kulit wajah secara menyeluruh dalam 60–90 menit.',
    benefits: ['Kulit lebih cerah & merata', 'Pori-pori tampak mengecil', 'Hidrasi maksimal'],
    price: 'Mulai Rp 450.000',
    duration: '60–90 menit',
  },
  {
    emoji: '💉', category: 'Anti Aging',
    title: 'Botox Treatment',
    desc: 'Injeksi presisi untuk menghaluskan kerutan wajah dengan hasil natural dan tahan hingga 6 bulan.',
    benefits: ['Hasil natural, tidak kaku', 'Efek tahan 4–6 bulan', 'Prosedur cepat & nyaman'],
    price: 'Mulai Rp 2.500.000',
    duration: '30–45 menit',
  },
  {
    emoji: '🔬', category: 'Teknologi Laser',
    title: 'Laser Rejuvenation',
    desc: 'Teknologi fraksi laser terkini untuk memperbaiki tekstur kulit, bekas jerawat, dan hiperpigmentasi.',
    benefits: ['Perbaikan tekstur kulit', 'Mengurangi bekas luka', 'Stimulasi kolagen alami'],
    price: 'Mulai Rp 1.800.000',
    duration: '45–60 menit',
  },
  {
    emoji: '🧴', category: 'Perawatan Kulit',
    title: 'Chemical Peeling',
    desc: 'Eksfoliasi kimiawi untuk mengangkat sel kulit mati dan meratakan warna kulit secara efektif.',
    benefits: ['Kulit lebih halus & merata', 'Mengurangi noda hitam', 'Efek segar instan'],
    price: 'Mulai Rp 750.000',
    duration: '30–45 menit',
  },
  {
    emoji: '🎯', category: 'Perawatan Wajah',
    title: 'Microblading Alis',
    desc: 'Teknik semi-permanen untuk membentuk alis natural yang simetris dan tahan lama hingga 2 tahun.',
    benefits: ['Alis natural & simetris', 'Tahan 1–2 tahun', 'Hasil semi-permanen'],
    price: 'Mulai Rp 2.800.000',
    duration: '90–120 menit',
  },
  {
    emoji: '💆', category: 'Perawatan Rambut',
    title: 'Hair Spa Premium',
    desc: 'Perawatan intensif untuk rambut rusak, kering, dan kulit kepala bermasalah menggunakan serum premium.',
    benefits: ['Rambut lebih kuat & bersinar', 'Kelembaban terjaga', 'Kulit kepala sehat'],
    price: 'Mulai Rp 350.000',
    duration: '45–60 menit',
  },
  {
    emoji: '🌿', category: 'Perawatan Tubuh',
    title: 'Body Slimming',
    desc: 'Kombinasi kavitasi ultrasound dan radiofrequency untuk membentuk tubuh ideal tanpa operasi.',
    benefits: ['Tanpa operasi & aman', 'Lemak terurai natural', 'Kulit lebih kencang'],
    price: 'Mulai Rp 1.200.000',
    duration: '60–75 menit',
  },
  {
    emoji: '🩺', category: 'Kulit Berjerawat',
    title: 'Acne Treatment',
    desc: 'Program perawatan komprehensif untuk kulit berjerawat aktif dengan kombinasi terapi topikal & prosedur.',
    benefits: ['Jerawat aktif teratasi', 'Mencegah bekas luka', 'Program 5 sesi terstruktur'],
    price: 'Mulai Rp 550.000',
    duration: '45 menit/sesi',
  },
]

const ServicesPage = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text-heading)' }}>
          Layanan Treatment Kami
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text)' }}>
          8 jenis perawatan estetika terpilih, ditangani dokter bersertifikat
          dengan standar medis internasional.
        </p>
      </div>

      {/* Grid layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {services.map((svc) => (
          <div
            key={svc.title}
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
              <span className="text-3xl">{svc.emoji}</span>
              <div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  {svc.category}
                </span>
                <h3 className="font-bold text-base mt-1" style={{ color: 'var(--text-heading)' }}>
                  {svc.title}
                </h3>
              </div>
            </div>

            <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text)' }}>{svc.desc}</p>

            <ul className="space-y-1.5 mb-4">
              {svc.benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                  <span style={{ color: 'var(--text-strong)' }}>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{svc.price}</p>
                <p className="text-xs" style={{ color: 'var(--text)' }}>⏱ {svc.duration}</p>
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