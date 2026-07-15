import { useState, useEffect } from 'react'
import { DollarSign, Users, Calendar, Package, TrendingUp, Medal } from 'lucide-react'
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
import { appointmentService } from '../services/appointmentService'
import { paymentService } from '../services/paymentService'
import { supabase } from '../services/supabase'

const iconMap = { revenue: DollarSign, appointments: Calendar, newCustomers: Users, products: Package }

const formatCurrency = (val) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

const Dashboard = () => {
  const { can } = useRole()
  const [realStats, setRealStats] = useState(null)
  const [realAppointments, setRealAppointments] = useState([])
  const [realTransactions, setRealTransactions] = useState([])
  const [realRevenue, setRealRevenue] = useState([])
  const [membershipSummary, setMembershipSummary] = useState({ bronze: 0, silver: 0, gold: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointments, payments, { count: userCount }, users] = await Promise.all([
          appointmentService.getAll(),
          paymentService.getAll(),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('points').eq('role', 'member'),
        ])

        // Hitung membership summary dari points (kolom membership_tier belum ada di DB)
        const tierCount = { bronze: 0, silver: 0, gold: 0 }
        ;(users?.data || []).forEach(u => {
          const pts = u.points || 0
          const tier = pts >= 2000 ? 'gold' : pts >= 500 ? 'silver' : 'bronze'
          if (tierCount[tier] !== undefined) tierCount[tier]++
        })
        setMembershipSummary(tierCount)

        // Stats
        const totalRevenue = (payments || []).filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0)
        const todayAppts = (appointments || []).filter(a => {
          const today = new Date().toISOString().split('T')[0]
          return a.appointment_date === today
        })
        const newUsers = userCount || 0

        setRealStats({
          revenue: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
          appointments: String(appointments?.length || 0),
          newCustomers: String(newUsers),
        })

        // Today's appointments
        setRealAppointments((todayAppts || []).slice(0, 4).map(a => ({
          time: a.appointment_time?.slice(0, 5) || '-',
          customer: a.guest_name || a.users?.name || 'Pasien',
          service: a.treatments?.name || 'Treatment',
          avatar: (a.guest_name || 'P').charAt(0),
        })))

        // Recent transactions
        setRealTransactions((payments || []).slice(0, 5).map(p => ({
          id: p.id?.slice(0, 8).toUpperCase() || 'INV',
          customer: p.appointments?.guest_name || 'Pasien',
          service: p.appointments?.treatments?.name || 'Treatment',
          amount: `Rp ${(p.amount || 0).toLocaleString('id-ID')}`,
          status: p.status === 'paid' ? 'success' : p.status === 'pending' ? 'pending' : p.status === 'cancelled' ? 'failed' : 'pending',
          time: new Date(p.created_at).toLocaleDateString('id-ID'),
        })))

        // Monthly revenue (from all payments grouped by month)
        const monthlyMap = {}
        ;(payments || []).filter(p => p.status === 'paid').forEach(p => {
          const month = new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID', { month: 'short' })
          monthlyMap[month] = (monthlyMap[month] || 0) + (p.amount || 0)
        })
        setRealRevenue(Object.entries(monthlyMap).map(([name, revenue]) => ({ name, revenue })))
      } catch (err) {
        console.error('Gagal memuat data dashboard:', err)
      }
    }
    fetchData()
  }, [])

  const tierColors = { bronze: '#CD7F32', silver: '#9CA3AF', gold: '#FFD700' }

  const displayStats = realStats ? [
    { title: 'Total Pendapatan', value: realStats.revenue, change: '-', isPositive: true, key: 'revenue' },
    { title: 'Total Janji Temu', value: realStats.appointments, change: '-', isPositive: true, key: 'appointments' },
    { title: 'Pelanggan Terdaftar', value: realStats.newCustomers, change: '-', isPositive: true, key: 'newCustomers' },
    { title: 'Aktif Hari Ini', value: String(realAppointments.length), change: '-', isPositive: true, key: 'products' },
  ] : statsData

  const displayAppointments = realAppointments.length > 0 ? realAppointments : upcomingAppointments
  const displayTransactions = realTransactions.length > 0 ? realTransactions : recentTransactions
  const displayRevenue = realRevenue.length > 0 ? realRevenue : revenueData

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang kembali! Berikut ringkasan bisnis klinik Anda hari ini."
      />

      {/* Stat Cards — hanya Admin */}
      {can('view:dashboard') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {displayStats.map((stat) => (
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
                <AreaChart data={displayRevenue}>
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
              {displayAppointments.map((apt, i) => (
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
                {displayTransactions.map((tx) => (
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

      {/* Membership Summary */}
      {can('view:dashboard') && (
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-heading)' }}>
              Ringkasan Membership
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'gold', label: '🥇 Gold', count: membershipSummary.gold, color: tierColors.gold },
              { key: 'silver', label: '🥈 Silver', count: membershipSummary.silver, color: tierColors.silver },
              { key: 'bronze', label: '🥉 Bronze', count: membershipSummary.bronze, color: tierColors.bronze },
            ].map(t => (
              <div key={t.key} className="rounded-xl p-4 text-center" style={{ background: `${t.color}12`, border: `1px solid ${t.color}30` }}>
                <p className="text-3xl font-black" style={{ color: t.color }}>{t.count}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: t.color }}>{t.label}</p>
              </div>
            ))}
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