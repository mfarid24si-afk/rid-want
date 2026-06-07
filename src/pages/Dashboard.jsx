import { DollarSign, Users, Calendar, Package, TrendingUp } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import PageHeader from '../components/layout/PageHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import { statsData, revenueData, recentTransactions, upcomingAppointments } from '../data/mockDashboard'
import { useRole } from '../context/RoleContext'

const iconMap = { revenue: DollarSign, appointments: Calendar, newCustomers: Users, products: Package }

const formatCurrency = (val) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

const Dashboard = () => {
  const { can } = useRole()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang kembali! Berikut ringkasan bisnis klinik Anda hari ini."
      />

      {/* Stat Cards — hanya Admin */}
      {can('view:dashboard') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat) => (
            <StatCard
              key={stat.key}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive}
              icon={iconMap[stat.key]}
            />
          ))}
        </div>
      )}

      {/* Grafik + Janji Temu */}
      {can('view:analytics') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-heading)' }}>Pendapatan Bulanan</h3>
                <p className="text-xs" style={{ color: 'var(--text)' }}>7 bulan terakhir</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--success)' }}>
                <TrendingUp className="w-4 h-4" />
                +23% YoY
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text)' }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${v / 1000000}jt`} />
                  <Tooltip
                    formatter={(v) => [formatCurrency(v), 'Pendapatan']}
                    contentStyle={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text-strong)',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent)"
                    strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
              Janji Temu Hari Ini
            </h3>
            <div className="space-y-3">
              {upcomingAppointments.map((apt, i) => (
                <div key={i} className="flex items-center gap-3 py-2"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <Avatar initials={apt.avatar} size="sm" index={i} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-heading)' }}>
                      {apt.customer}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text)' }}>{apt.service}</p>
                  </div>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--accent)' }}>
                    {apt.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tabel Transaksi */}
      {can('view:orders') && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-heading)' }}>
              Transaksi Terakhir
            </h3>
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Invoice', 'Pelanggan', 'Layanan', 'Jumlah', 'Status', 'Waktu'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold"
                      style={{ color: 'var(--text)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    className="transition-colors">
                    <td className="py-3 px-3 font-mono text-xs" style={{ color: 'var(--text)' }}>{tx.id}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: 'var(--text-strong)' }}>{tx.customer}</td>
                    <td className="py-3 px-3" style={{ color: 'var(--text)' }}>{tx.service}</td>
                    <td className="py-3 px-3 font-semibold" style={{ color: 'var(--text-heading)' }}>{tx.amount}</td>
                    <td className="py-3 px-3">
                      <Badge status={tx.status}>{tx.status}</Badge>
                    </td>
                    <td className="py-3 px-3 text-xs" style={{ color: 'var(--text)' }}>{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Guest view */}
      {!can('view:dashboard') && (
        <Card>
          <div className="text-center py-10">
            <p className="text-3xl mb-3">👁️</p>
            <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
              Mode Guest
            </h3>
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              Anda melihat sebagai tamu. Hubungi admin untuk akses penuh ke dashboard.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Dashboard