import { Ticket, Clock, CheckCircle2, XCircle } from 'lucide-react'

const vouchers = [
  {
    code: 'BDAY25', title: 'Birthday Special 25%',
    desc: 'Diskon 25% untuk semua treatment', expiry: '10 Jun 2025',
    status: 'active', category: 'Birthday',
  },
  {
    code: 'GLOW30', title: 'Glow Bundle Package',
    desc: 'Hemat 30% untuk Facial + Chemical Peeling', expiry: '31 Jul 2025',
    status: 'active', category: 'Paket',
  },
  {
    code: 'FIRST20', title: 'First Visit',
    desc: 'Diskon 20% kunjungan pertama', expiry: '01 Jan 2025',
    status: 'used', category: 'New Member',
  },
]

const VoucherPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--info-soft)' }}
        >
          <Ticket className="w-7 h-7" style={{ color: 'var(--info)' }} />
        </div>
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-heading)' }}>
          Voucher Saya
        </h1>
        <p style={{ color: 'var(--text)' }}>Dompet voucher kecantikan digital Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Voucher Aktif',    value: vouchers.filter((v) => v.status === 'active').length, color: 'var(--success)' },
          { label: 'Sudah Dipakai',    value: vouchers.filter((v) => v.status === 'used').length,   color: 'var(--text)' },
          { label: 'Total Voucher',    value: vouchers.length,                                       color: 'var(--accent)' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--text)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Daftar voucher */}
      <div className="space-y-3">
        {vouchers.map((v) => {
          const isActive = v.status === 'active'
          return (
            <div
              key={v.code}
              className="rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                opacity: isActive ? 1 : 0.6,
              }}
            >
              {/* Strip kiri */}
              <div className="flex">
                <div
                  className="w-2 flex-shrink-0"
                  style={{ background: isActive ? 'var(--accent)' : 'var(--border-strong)' }}
                />
                <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: isActive ? 'var(--accent-soft)' : 'var(--bg-raised)',
                          color: isActive ? 'var(--accent)' : 'var(--text)',
                        }}
                      >
                        {v.category}
                      </span>
                      {isActive
                        ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />
                        : <XCircle className="w-3.5 h-3.5" style={{ color: 'var(--text)' }} />
                      }
                      <span className="text-xs" style={{ color: isActive ? 'var(--success)' : 'var(--text)' }}>
                        {isActive ? 'Aktif' : 'Sudah dipakai'}
                      </span>
                    </div>
                    <h3 className="font-bold mb-0.5" style={{ color: 'var(--text-heading)' }}>{v.title}</h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--text)' }}>{v.desc}</p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text)' }}>
                      <Clock className="w-3.5 h-3.5" />
                      Berlaku s/d {v.expiry}
                    </div>
                  </div>
                  {/* Kode voucher */}
                  <div className="flex flex-col items-end justify-between gap-2">
                    <div
                      className="px-4 py-2 rounded-xl font-mono font-black text-sm text-center"
                      style={{
                        background: isActive ? 'var(--accent-soft)' : 'var(--bg-raised)',
                        color: isActive ? 'var(--accent)' : 'var(--text)',
                        border: `1px dashed ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                    >
                      {v.code}
                    </div>
                    {isActive && (
                      <button
                        className="text-xs px-3 py-1.5 rounded-xl font-semibold text-white"
                        style={{ background: 'var(--accent)' }}
                      >
                        Gunakan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VoucherPage