import { 
  DollarSign, 
  Users, 
  Calendar, 
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import PageHeader from '../components/PageHeader'

// Mock Data
const stats = [
  {
    title: 'Total Pendapatan',
    value: 'Rp 45.250.000',
    change: '+12.5%',
    isPositive: true,
    icon: DollarSign,
    color: 'bg-emerald-500'
  },
  {
    title: 'Janji Temu',
    value: '128',
    change: '+8.2%',
    isPositive: true,
    icon: Calendar,
    color: 'bg-blue-500'
  },
  {
    title: 'Pelanggan Baru',
    value: '32',
    change: '+15.3%',
    isPositive: true,
    icon: Users,
    color: 'bg-primary-500'
  },
  {
    title: 'Produk Terjual',
    value: '256',
    change: '-2.4%',
    isPositive: false,
    icon: Package,
    color: 'bg-amber-500'
  }
]

const revenueData = [
  { name: 'Jan', revenue: 28000000 },
  { name: 'Feb', revenue: 32000000 },
  { name: 'Mar', revenue: 35000000 },
  { name: 'Apr', revenue: 29000000 },
  { name: 'Mei', revenue: 42000000 },
  { name: 'Jun', revenue: 38000000 },
  { name: 'Jul', revenue: 45000000 },
]

const recentTransactions = [
  { id: 'INV-001', customer: 'Sarah Wijaya', service: 'Facial Treatment', amount: 'Rp 850.000', status: 'success', time: '2 jam lalu' },
  { id: 'INV-002', customer: 'Maya Putri', service: 'Hair Spa + Coloring', amount: 'Rp 1.200.000', status: 'success', time: '3 jam lalu' },
  { id: 'INV-003', customer: 'Diana Sari', service: 'Botox Treatment', amount: 'Rp 3.500.000', status: 'pending', time: '5 jam lalu' },
  { id: 'INV-004', customer: 'Lisa Anggraini', service: 'Microblading', amount: 'Rp 2.800.000', status: 'success', time: '6 jam lalu' },
  { id: 'INV-005', customer: 'Rina Kusuma', service: 'Chemical Peeling', amount: 'Rp 1.500.000', status: 'failed', time: '1 hari lalu' },
]

const upcomingAppointments = [
  { time: '09:00', customer: 'Dewi Lestari', service: 'Facial Glow', therapist: 'Dr. Sarah' },
  { time: '10:30', customer: 'Putri Amanda', service: 'Laser Hair Removal', therapist: 'Dr. Maya' },
  { time: '13:00', customer: 'Sinta Maharani', service: 'Anti Aging Treatment', therapist: 'Dr. Sarah' },
  { time: '15:00', customer: 'Nina Rahma', service: 'Acne Treatment', therapist: 'Dr. Lina' },
]

const Dashboard = () => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div>
      <PageHeader 
        title="Dashboard"
        subtitle="Selamat datang kembali! Berikut ringkasan bisnis klinik Anda hari ini."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-400">vs bulan lalu</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Pendapatan Bulanan</h3>
              <p className="text-sm text-slate-500">Trend pendapatan 7 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">+23% dari tahun lalu</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e54d6d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e54d6d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickFormatter={(value) => `${value / 1000000}jt`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Pendapatan']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#e54d6d" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Janji Temu Hari Ini</h3>
          <div className="space-y-4">
            {upcomingAppointments.map((apt, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2 text-primary-600 min-w-[60px]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">{apt.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{apt.customer}</p>
                  <p className="text-xs text-slate-500 truncate">{apt.service}</p>
                  <p className="text-xs text-primary-500 mt-1">{apt.therapist}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2 rounded-xl hover:bg-primary-50 transition-colors">
            Lihat Semua Janji Temu
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Transaksi Terakhir</h3>
            <p className="text-sm text-slate-500">5 transaksi terbaru di klinik Anda</p>
          </div>
          <button className="btn-secondary text-sm">
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Invoice</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Pelanggan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Layanan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Jumlah</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-slate-800">{tx.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-600">{tx.customer}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-600">{tx.service}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-slate-800">{tx.amount}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${
                      tx.status === 'success' ? 'badge-success' : 
                      tx.status === 'pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {tx.status === 'success' ? 'Sukses' : tx.status === 'pending' ? 'Pending' : 'Gagal'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-400">{tx.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
