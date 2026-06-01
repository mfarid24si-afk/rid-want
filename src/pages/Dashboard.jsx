import React from 'react'
import { DollarSign, Users, Calendar, Package, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageHeader from '../components/PageHeader'

// Impor komponen modular baru kita
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import AppointmentItem from '../components/AppointmentItem'
import Table from '../components/Table'
import TableRow from '../components/TableRow'
import Button from '../components/Button'

const stats = [
  { title: 'Total Pendapatan', value: 'Rp 45.250.000', change: '+12.5%', isPositive: true, icon: DollarSign },
  { title: 'Janji Temu', value: '128', change: '+8.2%', isPositive: true, icon: Calendar },
  { title: 'Pelanggan Baru', value: '32', change: '+15.3%', isPositive: true, icon: Users },
  { title: 'Produk Terjual', value: '256', change: '-2.4%', isPositive: false, icon: Package }
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

  const tableHeaders = ["Invoice", "Pelanggan", "Layanan", "Jumlah", "Status", "Waktu"]

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-zinc-100 p-1">
      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang kembali! Berikut ringkasan bisnis klinik Anda hari ini."
      />

      {/* Grid StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Row Grafik & Janji Temu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Grafik Area Pendapatan */}
        <Card className="lg:col-span-2">
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
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} tickFormatter={(value) => `${value / 1000000}jt`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Pendapatan']}
                  contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #3f3f46', borderRadius: '12px' }}
                  itemStyle={{ color: '#f4f4f5' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Janji Temu Hari Ini */}
        <Card>
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Janji Temu Hari Ini</h3>
          <div className="space-y-4">
            {upcomingAppointments.map((apt, index) => (
              <AppointmentItem 
                key={index}
                time={apt.time}
                customer={apt.customer}
                service={apt.service}
                therapist={apt.therapist}
              />
            ))}
          </div>
          <Button type="secondary" className="w-full mt-4">
            Lihat Semua Janji Temu
          </Button>
        </Card>

      </div>

      {/* Tabel Transaksi Terakhir */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Transaksi Terakhir</h3>
            <p className="text-sm text-zinc-400">5 transaksi terbaru di klinik Anda</p>
          </div>
          <Button type="outline">Lihat Semua</Button>
        </div>
        
        <Table headers={tableHeaders}>
          {recentTransactions.map((tx) => (
            <TableRow 
              key={tx.id}
              id={tx.id}
              customer={tx.customer}
              service={tx.service}
              amount={tx.amount}
              status={tx.status}
              time={tx.time}
            />
          ))}
        </Table>
      </Card>
    </div>
  )
}

export default Dashboard
