import { useState, useEffect } from 'react'
import { Ticket, Clock, CheckCircle2, XCircle, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { promotionService } from '../../services/promotionService'

const fallbackVouchers = [
  { id: 'fb1', code: 'BDAY25', title: 'Birthday Special 25%', desc: 'Diskon 25% untuk semua treatment kecantikan', expiry: '10 Jun 2025', status: 'active', category: 'Birthday' },
  { id: 'fb2', code: 'GLOW30', title: 'Glow Bundle Package', desc: 'Hemat 30% untuk Facial + Chemical Peeling', expiry: '31 Jul 2025', status: 'active', category: 'Paket' },
  { id: 'fb3', code: 'FIRST20', title: 'First Visit Discount', desc: 'Diskon 20% khusus kunjungan pertama Anda', expiry: '01 Jan 2025', status: 'used', category: 'New Member' },
]

const VoucherPage = () => {
  const { user: authUser } = useAuth()
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!authUser?.id) {
        setLoading(false)
        return
      }
      try {
        const data = await promotionService.getUserVouchers(authUser.id)
        const mapped = (data || []).map(v => ({
          id: v.id,
          code: v.promotions?.code || 'PROMO',
          title: v.promotions?.title || 'Promo',
          desc: v.promotions?.description || '',
          expiry: v.promotions?.valid_until
            ? new Date(v.promotions.valid_until).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            : '-',
          status: v.is_used ? 'used' : 'active',
          category: v.promotions?.code?.includes('BDAY') ? 'Birthday'
            : v.promotions?.code?.includes('FIRST') ? 'New Member'
            : v.promotions?.code?.includes('GLOW') ? 'Paket' : 'Promo',
        }))
        setVouchers(mapped.length > 0 ? mapped : fallbackVouchers)
      } catch (err) {
        console.error('Gagal memuat voucher:', err)
        setVouchers(fallbackVouchers)
      } finally {
        setLoading(false)
      }
    }
    fetchVouchers()
  }, [authUser])

  const displayVouchers = vouchers.length > 0 ? vouchers : fallbackVouchers

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Kode voucher ${code} berhasil disalin! 📋`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow"
          style={{ background: 'var(--info-soft)' }}
        >
          <Ticket className="w-7 h-7" style={{ color: 'var(--info)' }} />
        </div>
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-heading)' }}>
          Voucher Saya
        </h1>
        <p style={{ color: 'var(--text)' }}>Dompet voucher kecantikan digital Anda. Gunakan kode saat pembayaran.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Voucher Aktif',    value: displayVouchers.filter((v) => v.status === 'active').length, color: 'var(--success)' },
          { label: 'Sudah Dipakai',    value: displayVouchers.filter((v) => v.status === 'used').length,   color: 'var(--text)' },
          { label: 'Total Voucher',    value: displayVouchers.length,                                       color: 'var(--accent)' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-3xl p-4 text-center border transition-all"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p style={{ color: 'var(--text)' }}>Memuat voucher...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayVouchers.map((v) => {
            const isActive = v.status === 'active'
            const isCopied = copiedCode === v.code

            return (
              <div
                key={v.id || v.code}
                className="relative overflow-hidden rounded-3xl border flex flex-col md:flex-row transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                  boxShadow: isActive ? '0 10px 25px rgba(201, 169, 110, 0.08)' : 'none',
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {/* Ticket Cutouts */}
                <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border z-10" style={{ backgroundColor: 'var(--bg-base)', borderColor: isActive ? 'var(--accent)' : 'var(--border)' }} />
                <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border z-10" style={{ backgroundColor: 'var(--bg-base)', borderColor: isActive ? 'var(--accent)' : 'var(--border)' }} />

                {/* Left Stripe */}
                <div className="w-full md:w-3 h-3 md:h-auto flex-shrink-0" style={{ background: isActive ? 'var(--accent)' : 'var(--border-strong)' }} />

                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 z-0">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          background: isActive ? 'var(--accent-soft)' : 'var(--bg-raised)',
                          color: isActive ? 'var(--accent)' : 'var(--text)',
                        }}
                      >
                        {v.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {isActive
                          ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />
                          : <XCircle className="w-3.5 h-3.5" style={{ color: 'var(--text)' }} />
                        }
                        <span className="text-xs font-semibold" style={{ color: isActive ? 'var(--success)' : 'var(--text)' }}>
                          {isActive ? 'Aktif & Tersedia' : 'Sudah Digunakan'}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>{v.title}</h3>
                    <p className="text-xs" style={{ color: 'var(--text)' }}>{v.desc}</p>
                    <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: 'var(--text)' }}>
                      <Clock className="w-3.5 h-3.5" />
                      Berlaku s.d. {v.expiry}
                    </div>
                  </div>

                  <div className="hidden sm:block h-20 border-l border-dashed" style={{ borderColor: 'var(--border)' }} />

                  <div className="w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-center gap-3">
                    <div
                      onClick={() => isActive && handleCopy(v.code)}
                      className="group flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-mono font-black text-sm tracking-widest border transition-all cursor-pointer select-none"
                      style={{
                        background: isActive ? 'var(--accent-soft)' : 'var(--bg-raised)',
                        color: isActive ? 'var(--accent)' : 'var(--text)',
                        borderStyle: 'dashed',
                        borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                      }}
                    >
                      <span>{v.code}</span>
                      {isActive && (
                        isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>

                    {isActive && (
                      <button
                        onClick={() => alert(`Gunakan kode ${v.code} saat berkonsultasi di resepsionis klinik.`)}
                        className="text-xs px-4 py-2.5 rounded-xl font-bold text-white transition-all cursor-pointer hover:shadow-md"
                        style={{ background: 'var(--accent)' }}
                      >
                        Gunakan Voucher
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default VoucherPage
