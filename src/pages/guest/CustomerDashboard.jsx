import { useRole } from '../../context/RoleContext'
import { User, ListOrdered, Gift, Ticket, History, CalendarPlus, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { censorName } from '../../components/crm/KanbanBoard'

const CustomerDashboard = () => {
  const { leads, customers } = useRole()
  const navigate = useNavigate()

  // Simulasi: tampilkan data pasien pertama sebagai "yang sedang login"
  // Dalam produksi, ini diganti dengan session/auth state
  const patient = customers?.[0]

  const totalAktif =
    (leads.konsultasi?.length ?? 0) +
    (leads.jadwal?.length ?? 0) +
    (leads.pembayaran?.length ?? 0)

  const quickLinks = [
    { icon: ListOrdered, label: 'Cek Antrean',       path: '/portal/tracking', color: 'var(--accent)' },
    { icon: CalendarPlus, label: 'Booking Baru',     path: '/portal/booking',  color: 'var(--info)' },
    { icon: Gift,          label: 'Poin Reward',     path: '/portal/loyalty',  color: 'var(--warning)' },
    { icon: Ticket,        label: 'Voucher Saya',    path: '/portal/voucher',  color: 'var(--success)' },
    { icon: History,       label: 'Riwayat',         path: '/portal/history',  color: 'var(--accent)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Profil pasien tersensor */}
      <div
        className="rounded-2xl p-6 mb-6 flex items-center gap-5"
        style={{
          background: 'linear-gradient(135deg, var(--accent-soft), var(--bg-raised))',
          border: '1px solid var(--accent)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          {patient?.avatar ?? 'P'}
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--accent)' }}>Selamat datang kembali 👋</p>
          <h2 className="text-xl font-black mb-0.5" style={{ color: 'var(--text-heading)' }}>
            {patient ? censorName(patient.name) : 'Pasien Tamu'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text)' }}>
            Member sejak {patient?.joinDate ?? '—'} &nbsp;·&nbsp;
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              {patient?.status?.toUpperCase() ?? 'GUEST'}
            </span>
          </p>
        </div>
      </div>

      {/* Status ringkas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Antrean Aktif',   value: totalAktif,                  color: 'var(--warning)' },
          { label: 'Total Kunjungan', value: patient?.totalVisits ?? 0,  color: 'var(--accent)' },
          { label: 'Selesai Hari Ini', value: leads.selesai?.length ?? 0, color: 'var(--success)' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--text)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h3 className="font-bold mb-3" style={{ color: 'var(--text-heading)' }}>Akses Cepat</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {quickLinks.map(({ icon: Icon, label, path, color }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="rounded-2xl p-5 text-left transition-all active:scale-95"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${color}22` }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: color + '22' }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>{label}</p>
          </button>
        ))}
      </div>

      {/* Treatment terakhir */}
      {patient && (
        <div
          className="rounded-2xl p-5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <h3 className="font-bold" style={{ color: 'var(--text-heading)' }}>Treatment Terakhir</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-strong)' }}>{patient.lastTreatment}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>
                Bergabung: {patient.joinDate}
              </p>
            </div>
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
              style={{
                background: patient.status === 'vip' ? 'var(--warning-soft)' : 'var(--accent-soft)',
                color: patient.status === 'vip' ? 'var(--warning)' : 'var(--accent)',
              }}
            >
              {patient.status === 'vip' ? '⭐ VIP' : patient.status}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerDashboard