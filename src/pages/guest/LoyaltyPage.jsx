import { useState, useEffect } from 'react'
import { Gift, Star, Award, Sparkles } from 'lucide-react'
import { useRole } from '../../context/RoleContext'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import { censorName } from '../../components/crm/KanbanBoard'
import { motion } from 'framer-motion'
import { supabase } from '../../services/supabase'

const rewards = [
  { points: 500,  emoji: '🧴', name: 'Serum Vitamin C 30ml',       stock: 'Tersedia' },
  { points: 1000, emoji: '💊', name: 'Suplemen Collagen 30 tablet', stock: 'Tersedia' },
  { points: 1500, emoji: '✨', name: 'Voucher Facial Glow',          stock: 'Tersedia' },
  { points: 3000, emoji: '💎', name: 'Paket Skincare Premium',        stock: 'Terbatas' },
  { points: 5000, emoji: '👑', name: 'Free Treatment Anti Aging',     stock: 'Terbatas' },
]

const tierGradients = {
  bronze: { bg: 'linear-gradient(135deg, #2D1B10 0%, #5C4033 50%, #2D1B10 100%)', border: 'rgba(205, 127, 50, 0.4)', accent: '#CD7F32' },
  silver: { bg: 'linear-gradient(135deg, #1C1917 0%, #443E38 50%, #1C1917 100%)', border: 'rgba(192, 192, 192, 0.4)', accent: '#C0C0C0' },
  gold:   { bg: 'linear-gradient(135deg, #2D1B10 0%, #4A3728 50%, #1A0D07 100%)', border: 'rgba(255, 215, 0, 0.4)', accent: '#FFD700' },
}

const LoyaltyPage = () => {
  const { user: authUser } = useAuth()
  const [userPoints, setUserPoints] = useState(0)
  const [membershipTier, setMembershipTier] = useState('bronze')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPoints = async () => {
      if (!authUser?.id) {
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('users')
          .select('points, name')
          .eq('id', authUser.id)
          .single()
        if (error) throw error
        if (data) {
          const pts = data.points || 0
          setUserPoints(pts)
          setMembershipTier(pts >= 2000 ? 'gold' : pts >= 500 ? 'silver' : 'bronze')
        }
      } catch (err) {
        console.error('Gagal memuat poin:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPoints()
  }, [authUser])

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-slow"
          style={{ background: 'var(--warning-soft)' }}
        >
          <Gift className="w-7 h-7" style={{ color: 'var(--warning)' }} />
        </div>
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-heading)' }}>
          Dompet Poin Reward
        </h1>
        <p style={{ color: 'var(--text)' }}>Tukarkan poin Anda dengan produk skincare gratis & treatment premium</p>
      </div>

      {/* Balance card — Metallic Luxury Member Card */}        <div
          className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-500 hover:shadow-2xl"
          style={{
            background: tierGradients[membershipTier].bg,
            border: `1px solid ${tierGradients[membershipTier].border}`,
            boxShadow: `0 20px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.15)`,
          }}
      >
        {/* Radial highlight overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(201, 169, 110, 0.4) 0%, transparent 60%)'
          }}
        />

        <div className="space-y-3 z-10 text-center md:text-left">
          <p className="text-xs font-semibold tracking-wider text-stone-400 uppercase">
            Total Poin {authUser ? censorName(authUser.name) : 'Anda'}
          </p>
          <h2 className="text-5xl font-black tracking-tight" style={{ color: 'var(--warning)' }}>
            {userPoints.toLocaleString('id-ID')}
          </h2>
          <p className="text-xs text-stone-400 font-medium">poin aktif & siap ditukarkan</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 z-10">
          <div className="flex items-center gap-2">
            <Badge status={membershipTier}>
              {membershipTier === 'gold' ? '🥇 GOLD MEMBER' : membershipTier === 'silver' ? '🥈 SILVER MEMBER' : '🥉 BRONZE MEMBER'}
            </Badge>
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Berlaku s.d. 31 Des 2026</span>
        </div>
      </div>

      {/* Cara mendapat poin */}
      <div
        className="rounded-3xl p-6 transition-all duration-300"
        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
      >
        <p className="font-bold mb-4 text-sm flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          💡 Cara Mengumpulkan Poin
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text)' }}>
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border)]">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} /> 
            <span>Setiap treatment = 10 poin / Rp 100.000 spent</span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border)]">
            <Award className="w-4 h-4" style={{ color: 'var(--warning)' }} /> 
            <span>Ulang tahun = Bonus instan 500 poin</span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border)]">
            <Star className="w-4 h-4" style={{ color: 'var(--success)' }} /> 
            <span>Referral teman baru = Bonus 200 poin</span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border)]">
            <Gift className="w-4 h-4" style={{ color: 'var(--info)' }} /> 
            <span>Review Google Maps & media sosial = 100 poin</span>
          </div>
        </div>
      </div>

      {/* Katalog reward */}
      <div>
        <h2 className="font-black text-lg mb-4" style={{ color: 'var(--text-heading)' }}>
          Katalog Hadiah
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewards.map((r) => {
            const canRedeem = userPoints >= r.points
            return (
              <motion.div
                key={r.name}
                whileHover={canRedeem ? { scale: 1.02 } : {}}
                className="rounded-3xl p-5 flex flex-col justify-between gap-4 border transition-all duration-300 relative overflow-hidden"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: canRedeem ? 'var(--success)' : 'var(--border)',
                  boxShadow: canRedeem ? '0 10px 20px rgba(107, 158, 122, 0.08)' : 'none',
                  opacity: canRedeem ? 1 : 0.65,
                }}
              >
                {/* Glowing neon shadow top border when redeemable */}
                {canRedeem && (
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--success)] to-transparent" />
                )}

                <div className="flex items-start gap-4">
                  <span className="text-4xl shrink-0 p-3 rounded-2xl bg-[var(--bg-raised)] flex items-center justify-center">
                    {r.emoji}
                  </span>
                  <div className="space-y-1">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>{r.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--warning)' }}>
                        ⭐ {r.points.toLocaleString('id-ID')} poin
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                        style={{
                          background: r.stock === 'Tersedia' ? 'var(--success-soft)' : 'var(--warning-soft)',
                          color: r.stock === 'Tersedia' ? 'var(--success)' : 'var(--warning)',
                        }}
                      >
                        {r.stock}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!canRedeem}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                  style={{ 
                    background: canRedeem ? 'var(--success)' : 'var(--border-strong)',
                    boxShadow: canRedeem ? '0 4px 12px rgba(107, 158, 122, 0.2)' : 'none'
                  }}
                  onClick={() => alert(`Penukaran ${r.name} berhasil diajukan!`)}
                >
                  {canRedeem ? 'Tukar Poin Sekarang' : 'Poin Kurang'}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LoyaltyPage