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
    // Latar belakang kontainer dashboard diubah ke abu-abu gelap arang
    <div className="min-h-screen bg-[#1C1C1C] text-zinc-100 p-1">
      <PageHeader 
        title="Dashboard"
        subtitle="Selamat datang kembali! Berikut ringkasan bisnis klinik Anda hari ini."
        // Catatan: Pastikan di dalam komponen <PageHeader /> Anda mengadopsi warna teks text-zinc-100 & text-zinc-400
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          // Mengubah class .card menjadi bg-[#252525] dengan border zinc tipis tanpa drop shadow putih
          <div key={index} className="bg-[#252525] border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-zinc-100">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {stat.isPositive ? (
                    // Menggunakan warna aksen hijau emerald terang untuk dark mode
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  ) : (
                    // Menggunakan warna aksen merah rose terang untuk dark mode
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  )}
                  <span className={`text-sm font-medium ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-zinc-500">vs bulan lalu</span>
                </div>
              </div>
              {/* Box Ikon menggunakan modifikasi background gelap transparan */}
              <div className={`w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-zinc-300" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#252525] border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Pendapatan Bulanan</h3>
              <p className="text-sm text-zinc-400">Trend pendapatan 7 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-2 text-sky-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">+23% dari tahun lalu</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  {/* Gradien grafik diubah dari Rose ke Sky Blue transparan khas ByeWind */}
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                {/* Garis grid diubah menjadi sangat tipis gelap agar menyatu */}
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12}
                  tickFormatter={(value) => `${value / 1000000}jt`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Pendapatan']}
                  // Mengubah style tooltip menjadi kotak pop-up gelap pekat
                  contentStyle={{ 
                    backgroundColor: '#1c1c1c', 
                    border: '1px solid #3f3f46',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
                  }}
                  itemStyle={{ color: '#f4f4f5' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#38bdf8" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-[#252525] border border-zinc-800/80 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Janji Temu Hari Ini</h3>
          <div className="space-y-4">
            {upcomingAppointments.map((apt, index) => (
              // Mengubah kontainer list janji temu dari bg-slate-50 ke bg-zinc-800/50
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-2 text-sky-400 min-w-[60px]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">{apt.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{apt.customer}</p>
                  <p className="text-xs text-zinc-400 truncate">{apt.service}</p>
                  <p className="text-xs text-sky-400/80 mt-1">{apt.therapist}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Mengubah tombol aksi sekunder bawah */}
          <button className="w-full mt-4 text-center text-sm text-sky-400 hover:text-sky-300 font-medium py-2 rounded-xl hover:bg-zinc-800 transition-colors">
            Lihat Semua Janji Temu
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#252525] border border-zinc-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Transaksi Terakhir</h3>
            <p className="text-sm text-zinc-400">5 transaksi terbaru di klinik Anda</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {/* Border head table disesuaikan */}
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Invoice</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Pelanggan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Layanan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Jumlah</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                // Mengubah border baris tabel dan warna hover
                <tr key={tx.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-zinc-200">{tx.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-zinc-300">{tx.customer}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-zinc-400">{tx.service}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-zinc-200">{tx.amount}</span>
                  </td>
                  <td className="py-3 px-4">
                    {/* Logika badge status dengan pewarnaan semantik kontras rendah untuk dark mode */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      tx.status === 'success' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/30' : 
                      tx.status === 'pending' ? 'bg-amber-950/40 text-amber-400 border border-amber-800/30' : 
                      'bg-rose-950/40 text-rose-400 border border-rose-800/30'
                    }`}>
                      {tx.status === 'success' ? 'Sukses' : tx.status === 'pending' ? 'Pending' : 'Gagal'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-zinc-500">{tx.time}</span>
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
