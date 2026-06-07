import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import { Users, TrendingUp, Star, AlertTriangle } from 'lucide-react'
import { customersData } from '../data/mockCustomers'
import { useRole } from '../context/RoleContext'

const treatmentData = [
  { name: 'Facial Glow',    count: 48, revenue: 60000000 },
  { name: 'Botox',          count: 22, revenue: 121000000 },
  { name: 'Chemical Peel',  count: 35, revenue: 52500000 },
  { name: 'Laser',          count: 18, revenue: 81000000 },
  { name: 'Microblading',   count: 28, revenue: 89600000 },
  { name: 'Hair Spa',       count: 42, revenue: 50400000 },
]

const visitTrendData = [
  { month: 'Jan', visits: 65 }, { month: 'Feb', visits: 72 },
  { month: 'Mar', visits: 88 }, { month: 'Apr', visits: 79 },
  { month: 'Mei', visits: 95 }, { month: 'Jun', visits: 102 },
]

const segmentColors = {
  loyal:   'var(--accent)',
  new:     'var(--info)',
  'at-risk': 'var(--danger)',
}

const Analytics = () => {
  const { can } = useRole()

  if (!can('view:analytics')) {
    return (
      <div>
        <PageHeader title="Analitik CRM" />
        <Card>
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📊</p>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>Akses Terbatas</h3>
            <p style={{ color: 'var(--text)' }}>Dashboard analitik hanya untuk Admin.</p>
          </div>
        </Card>
      </div>
    )
  }

  // Hitung segmentasi dari data customers
  const segments = customersData.reduce((acc, c) => {
    acc[c.segment] = (acc[c.segment] || 0) + 1
    return acc
  }, {})

  const segmentPieData = Object.entries(segments).map(([name, value]) => ({
    name: name === 'loyal' ? 'Loyal/VIP' : name === 'new' ? 'Pelanggan Baru' : 'Berisiko Pergi',
    value,
    key: name,
  }))

  const loyalCustomers  = customersData.filter(c => c.segment === 'loyal')
  const atRiskCustomers = customersData.filter(c => c.segment === 'at-risk')
  const newCustomers    = customersData.filter(c => c.segment === 'new')

  const analyticsStats = [
    { title: 'Pelanggan Loyal/VIP', value: loyalCustomers.length, change: '+2', isPositive: true, key: 'loyal', icon: Star },
    { title: 'Pelanggan Baru',      value: newCustomers.length,   change: '+5', isPositive: true, key: 'new',   icon: Users },
    { title: 'Berisiko Pergi',      value: atRiskCustomers.length,change: '-1', isPositive: true, key: 'risk',  icon: AlertTriangle },
    { title: 'Retensi Rate',        value: '87%',                 change: '+3%',isPositive: true, key: 'ret',   icon: TrendingUp },
  ]

  return (
    <div>
      <PageHeader title="Analitik CRM" subtitle="Insight mendalam tentang performa & segmentasi pelanggan klinik" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsStats.map(s => (
          <StatCard key={s.key} title={s.title} value={s.value} change={s.change}
            isPositive={s.isPositive} icon={s.icon} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Treatment Terlaris */}
        <Card>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
            Treatment Terlaris
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'var(--text)' }}
                  axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  formatter={(v) => [`${v} sesi`, 'Jumlah']}
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px' }}
                />
                <Bar dataKey="count" fill="var(--accent)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tren Kunjungan */}
        <Card>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
            Tren Kunjungan Bulanan
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`${v} kunjungan`, 'Total']}
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px' }}
                />
                <Bar dataKey="visits" fill="var(--info)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Segmentasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie Chart */}
        <Card>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
            Segmentasi Pelanggan
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                  dataKey="value" paddingAngle={3}>
                  {segmentPieData.map((entry) => (
                    <Cell key={entry.key} fill={segmentColors[entry.key]} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span style={{ color: 'var(--text)', fontSize: 11 }}>{v}</span>} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* At-Risk Customers */}
        <Card className="lg:col-span-2">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>
            ⚠️ Pelanggan Berisiko Pergi
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text)' }}>
            Tidak mengunjungi klinik lebih dari 3 bulan
          </p>
          <div className="space-y-3">
            {atRiskCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)' }}>
                <Avatar initials={c.avatar} size="sm" index={i + 3} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{c.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text)' }}>
                    Terakhir: {c.lastTreatment} — Total: {c.totalSpent}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge status="at-risk">At-Risk</Badge>
                  <button className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                    Kirim Reminder
                  </button>
                </div>
              </div>
            ))}
            {atRiskCustomers.length === 0 && (
              <p className="text-center text-sm py-6" style={{ color: 'var(--text)' }}>
                Semua pelanggan aktif! 🎉
              </p>
            )}
          </div>

          {/* VIP List */}
          <h3 className="text-base font-semibold mt-5 mb-3" style={{ color: 'var(--text-heading)' }}>
            ⭐ Pelanggan VIP / Loyal
          </h3>
          <div className="flex gap-2 flex-wrap">
            {loyalCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)' }}>
                <Avatar initials={c.avatar} size="sm" index={i} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-heading)' }}>{c.name}</span>
                <Badge status={c.status}>{c.status.toUpperCase()}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Analytics