import { Tag, Clock, Gift, Sparkles, CalendarPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const promos = [
  {
    badge: 'BIRTHDAY', badgeColor: 'var(--warning)',
    emoji: '🎂', title: 'Birthday Special',
    desc: 'Diskon eksklusif 25% untuk semua treatment di hari ulang tahun Anda.',
    code: 'BDAY25', expiry: 'Berlaku 3 hari sejak ulang tahun',
    tag: 'Otomatis dikirim via WhatsApp',
  },
  {
    badge: 'NEW MEMBER', badgeColor: 'var(--success)',
    emoji: '🌸', title: 'First Visit Discount',
    desc: 'Kunjungan pertama? Nikmati diskon 20% untuk treatment pilihan + konsultasi gratis.',
    code: 'FIRST20', expiry: 'Berlaku untuk kunjungan pertama',
    tag: 'Untuk pasien baru',
  },
  {
    badge: 'PAKET', badgeColor: 'var(--accent)',
    emoji: '✨', title: 'Paket Glow Bundle',
    desc: 'Facial Glow + Chemical Peeling dalam satu paket hemat, lebih murah 30%.',
    code: 'GLOW30', expiry: 'Berlaku s/d 31 Jul 2025',
    tag: 'Limited slot per bulan',
  },
  {
    badge: 'LOYALTY', badgeColor: 'var(--info)',
    emoji: '💎', title: 'Member VIP Exclusive',
    desc: 'Pasien dengan 10+ kunjungan mendapat harga khusus VIP dan prioritas jadwal.',
    code: 'VIP10', expiry: 'Permanent benefit untuk member VIP',
    tag: 'Otomatis aktif saat syarat terpenuhi',
  },
]

const PromoPage = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <div className="text-center mb-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--warning-soft)' }}
        >
          <Tag className="w-7 h-7" style={{ color: 'var(--warning)' }} />
        </div>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-heading)' }}>
          Promo &amp; Voucher Spesial
        </h1>
        <p style={{ color: 'var(--text)' }}>
          Hemat lebih banyak dengan program loyalitas &amp; promo eksklusif Aura Clinic
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {promos.map((promo) => (
          <div
            key={promo.code}
            className="rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="text-4xl flex-shrink-0">{promo.emoji}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: promo.badgeColor + '22', color: promo.badgeColor }}
                >
                  {promo.badge}
                </span>
                <h3 className="font-bold" style={{ color: 'var(--text-heading)' }}>{promo.title}</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>{promo.desc}</p>
              <div className="flex flex-wrap gap-3 items-center">
                {/* Kode voucher */}
                <div
                  className="px-4 py-2 rounded-xl font-mono font-black text-sm"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px dashed var(--accent)' }}
                >
                  {promo.code}
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text)' }}>
                  <Clock className="w-3.5 h-3.5" />
                  {promo.expiry}
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                ✓ {promo.tag}
              </p>
            </div>
            <button
              onClick={() => navigate('/portal/booking')}
              className="self-start sm:self-center px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              Gunakan
            </button>
          </div>
        ))}
      </div>

      {/* Banner birthday */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--warning-soft), var(--accent-soft))',
          border: '1px solid var(--warning)',
        }}
      >
        <Gift className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--warning)' }} />
        <h3 className="font-black text-lg mb-1" style={{ color: 'var(--text-heading)' }}>
          Voucher Ulang Tahun Otomatis 🎂
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
          Daftarkan tanggal lahir Anda dan terima diskon 25% otomatis via WhatsApp
          di hari spesial Anda — tanpa perlu kode apapun!
        </p>
        <button
          onClick={() => navigate('/portal/booking')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white"
          style={{ background: 'var(--warning)' }}
        >
          <CalendarPlus className="w-4 h-4" />
          Daftar &amp; Aktifkan
        </button>
      </div>
    </div>
  )
}

export default PromoPage