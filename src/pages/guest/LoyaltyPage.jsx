import { Gift, Star, Award, Sparkles } from 'lucide-react'
import { useRole } from '../../context/RoleContext'
import { censorName } from '../../components/crm/KanbanBoard'

const rewards = [
  { points: 500,  emoji: '🧴', name: 'Serum Vitamin C 30ml',       stock: 'Tersedia' },
  { points: 1000, emoji: '💊', name: 'Suplemen Collagen 30 tablet', stock: 'Tersedia' },
  { points: 1500, emoji: '✨', name: 'Voucher Facial Glow',          stock: 'Tersedia' },
  { points: 3000, emoji: '💎', name: 'Paket Skincare Premium',        stock: 'Terbatas' },
  { points: 5000, emoji: '👑', name: 'Free Treatment Anti Aging',     stock: 'Terbatas' },
]

const LoyaltyPage = () => {
  const { customers } = useRole()
  const patient = customers?.[0]

  // Simulasi poin — dalam produksi dari auth session
  const userPoints = 1250

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--warning-soft)' }}
        >
          <Gift className="w-7 h-7" style={{ color: 'var(--warning)' }} />
        </div>
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-heading)' }}>
          Dompet Poin Reward
        </h1>
        <p style={{ color: 'var(--text)' }}>Tukarkan poin Anda dengan produk skincare gratis</p>
      </div>

      {/* Balance card */}
      <div
        className="rounded-2xl p-6 mb-6 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--warning-soft), var(--accent-soft))',
          border: '1px solid var(--warning)',
        }}
      >
        <p className="text-sm mb-1" style={{ color: 'var(--text)' }}>
          Total Poin {patient ? censorName(patient.name) : 'Anda'}
        </p>
        <p className="text-5xl font-black mb-1" style={{ color: 'var(--warning)' }}>
          {userPoints.toLocaleString('id-ID')}
        </p>
        <p className="text-sm" style={{ color: 'var(--text)' }}>poin aktif</p>
        <div
          className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'var(--warning)', color: '#fff' }}
        >
          <Star className="w-3.5 h-3.5 fill-white" />
          {patient?.status === 'vip' ? 'Member VIP' : patient?.status === 'active' ? 'Member Aktif' : 'Member'}
        </div>
      </div>

      {/* Cara mendapat poin */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
      >
        <p className="font-bold mb-2 text-sm" style={{ color: 'var(--text-heading)' }}>
          💡 Cara Mendapat Poin
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text)' }}>
          <div className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Setiap treatment = 10 poin/100rb</div>
          <div className="flex items-center gap-2"><Award className="w-3.5 h-3.5" style={{ color: 'var(--warning)' }} /> Ulang tahun = bonus 500 poin</div>
          <div className="flex items-center gap-2"><Star className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} /> Referral teman = 200 poin</div>
          <div className="flex items-center gap-2"><Gift className="w-3.5 h-3.5" style={{ color: 'var(--info)' }} /> Review Google = 100 poin</div>
        </div>
      </div>

      {/* Katalog reward */}
      <h2 className="font-black text-lg mb-4" style={{ color: 'var(--text-heading)' }}>
        Katalog Hadiah
      </h2>
      <div className="space-y-3">
        {rewards.map((r) => {
          const canRedeem = userPoints >= r.points
          return (
            <div
              key={r.name}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${canRedeem ? 'var(--success)' : 'var(--border)'}`,
                opacity: canRedeem ? 1 : 0.7,
              }}
            >
              <span className="text-3xl flex-shrink-0">{r.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>{r.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold" style={{ color: 'var(--warning)' }}>
                    ⭐ {r.points.toLocaleString('id-ID')} poin
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: r.stock === 'Tersedia' ? 'var(--success-soft)' : 'var(--warning-soft)',
                      color: r.stock === 'Tersedia' ? 'var(--success)' : 'var(--warning)',
                    }}
                  >
                    {r.stock}
                  </span>
                </div>
              </div>
              <button
                disabled={!canRedeem}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all disabled:opacity-40"
                style={{ background: canRedeem ? 'var(--success)' : 'var(--border-strong)' }}
              >
                Tukar
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LoyaltyPage