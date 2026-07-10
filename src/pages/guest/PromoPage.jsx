import { useState, useEffect } from 'react'
import { Tag, Clock, Gift, CalendarPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { promotionService } from '../../services/promotionService'

const PromoPage = () => {
  const navigate = useNavigate()
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const data = await promotionService.getActive()
        setPromos(data)
      } catch (err) {
        console.error('Gagal memuat promo:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPromos()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-20 text-center">
        <p style={{ color: 'var(--text)' }}>Memuat promo...</p>
      </div>
    )
  }

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
          Hemat lebih banyak dengan program loyalitas &amp; promo eksklusif Skinova
        </p>
      </div>

      {promos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Belum ada promo aktif saat ini.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {promos.map((promo) => {
            const badge = promo.code?.includes('BDAY') ? 'BIRTHDAY'
              : promo.code?.includes('FIRST') ? 'NEW MEMBER'
              : promo.code?.includes('GLOW') ? 'PAKET'
              : promo.code?.includes('VIP') ? 'LOYALTY' : 'PROMO'

            const badgeColor = badge === 'BIRTHDAY' ? 'var(--warning)'
              : badge === 'NEW MEMBER' ? 'var(--success)'
              : badge === 'PAKET' ? 'var(--accent)'
              : 'var(--info)'

            return (
              <div
                key={promo.id}
                className="rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              >
                <div className="text-4xl flex-shrink-0">
                  {badge === 'BIRTHDAY' ? '🎂' : badge === 'NEW MEMBER' ? '🌸' : badge === 'PAKET' ? '✨' : '💎'}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: badgeColor + '22', color: badgeColor }}
                    >
                      {badge}
                    </span>
                    <h3 className="font-bold" style={{ color: 'var(--text-heading)' }}>{promo.title}</h3>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>{promo.description}</p>
                  <div className="flex flex-wrap gap-3 items-center">
                    <div
                      className="px-4 py-2 rounded-xl font-mono font-black text-sm"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px dashed var(--accent)' }}
                    >
                      {promo.code}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text)' }}>
                      <Clock className="w-3.5 h-3.5" />
                      {promo.discount_pct}% diskon
                      {promo.valid_until && ` · s.d. ${new Date(promo.valid_until).toLocaleDateString('id-ID')}`}
                    </div>
                  </div>
                  {promo.valid_from && (
                    <p className="text-xs mt-2" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      ✓ Berlaku mulai {new Date(promo.valid_from).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigate('/portal/booking')}
                  className="self-start sm:self-center px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                  style={{ background: 'var(--accent)' }}
                >
                  Gunakan
                </button>
              </div>
            )
          })}
        </div>
      )}

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