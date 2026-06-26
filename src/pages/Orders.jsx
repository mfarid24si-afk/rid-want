import { useState } from 'react'
import { Search, Filter, MoreVertical, Eye, FileText, Download, Calendar, CreditCard } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { useTheme } from '../context/ThemeContext'
import Badge from '../components/ui/Badge'

// Mock Data
const ordersData = [
  {
    id: 'INV-2024-001',
    customer: 'Sarah Wijaya',
    service: 'Facial Glow Treatment + Serum Vitamin C',
    date: '14 Mei 2024',
    time: '10:30',
    total: 'Rp 1.250.000',
    payment: 'Transfer Bank',
    status: 'paid'
  },
  {
    id: 'INV-2024-002',
    customer: 'Maya Putri Andini',
    service: 'Hair Spa Premium + Hair Coloring',
    date: '14 Mei 2024',
    time: '13:00',
    total: 'Rp 1.800.000',
    payment: 'Kartu Kredit',
    status: 'paid'
  },
  {
    id: 'INV-2024-003',
    customer: 'Diana Sari Kusuma',
    service: 'Botox Treatment (Full Face)',
    date: '14 Mei 2024',
    time: '15:30',
    total: 'Rp 5.500.000',
    payment: 'Cash',
    status: 'pending'
  },
  {
    id: 'INV-2024-004',
    customer: 'Lisa Anggraini',
    service: 'Microblading Alis + Touch Up',
    date: '13 Mei 2024',
    time: '09:00',
    total: 'Rp 3.200.000',
    payment: 'Transfer Bank',
    status: 'paid'
  },
  {
    id: 'INV-2024-005',
    customer: 'Rina Kusuma Dewi',
    service: 'Chemical Peeling Medium',
    date: '13 Mei 2024',
    time: '11:00',
    total: 'Rp 1.500.000',
    payment: 'QRIS',
    status: 'cancelled'
  },
  {
    id: 'INV-2024-006',
    customer: 'Dewi Lestari',
    service: 'Laser Rejuvenation + Facial',
    date: '13 Mei 2024',
    time: '14:00',
    total: 'Rp 4.200.000',
    payment: 'Kartu Debit',
    status: 'paid'
  },
  {
    id: 'INV-2024-007',
    customer: 'Putri Amanda Salsabila',
    service: 'Acne Treatment Package (5x)',
    date: '12 Mei 2024',
    time: '10:00',
    total: 'Rp 2.750.000',
    payment: 'Transfer Bank',
    status: 'paid'
  },
  {
    id: 'INV-2024-008',
    customer: 'Sinta Maharani',
    service: 'Anti Aging Premium Package',
    date: '12 Mei 2024',
    time: '13:30',
    total: 'Rp 8.500.000',
    payment: 'Kartu Kredit',
    status: 'pending'
  },
  {
    id: 'INV-2024-009',
    customer: 'Nina Rahma',
    service: 'Whitening Treatment + Body Spa',
    date: '11 Mei 2024',
    time: '09:30',
    total: 'Rp 2.100.000',
    payment: 'QRIS',
    status: 'paid'
  },
  {
    id: 'INV-2024-010',
    customer: 'Anisa Fitri',
    service: 'Derma Filler Lips',
    date: '11 Mei 2024',
    time: '16:00',
    total: 'Rp 3.800.000',
    payment: 'Cash',
    status: 'refunded'
  }
]

const Orders = () => {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showActionMenu, setShowActionMenu] = useState(null)

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge status="success">Lunas</Badge>
      case 'pending':
        return <Badge status="pending">Menunggu</Badge>
      case 'cancelled':
        return <Badge status="cancelled">Dibatalkan</Badge>
      case 'refunded':
        return <Badge status="new">Dikembalikan</Badge>
      default:
        return null
    }
  }

  const getPaymentIcon = (payment) => {
    switch (payment) {
      case 'Transfer Bank':
        return <CreditCard className="w-4 h-4 text-blue-500" />
      case 'Kartu Kredit':
      case 'Kartu Debit':
        return <CreditCard className="w-4 h-4 text-purple-500" />
      case 'Cash':
        return <CreditCard className="w-4 h-4 text-emerald-500" />
      case 'QRIS':
        return <CreditCard className="w-4 h-4 text-orange-500" />
      default:
        return <CreditCard className="w-4 h-4 text-slate-400" />
    }
  }

  // Calculate stats
  const totalRevenue = ordersData
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + parseInt(o.total.replace(/[^\d]/g, '')), 0)
  
  const paidOrders = ordersData.filter(o => o.status === 'paid').length
  const pendingOrders = ordersData.filter(o => o.status === 'pending').length

  return (
    <div 
      className="min-h-screen p-4 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-strong)' }}
    >
      <PageHeader 
        title="Manajemen Pesanan"
        subtitle="Kelola semua transaksi dan invoice klinik Anda"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Pesanan' }
        ]}
        actionLabel="Buat Pesanan"
        onAction={() => alert('Buat pesanan baru')}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className="border rounded-2xl p-4 flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text)' }}>Total Pendapatan</p>
            <p className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
              Rp {(totalRevenue / 1000000).toFixed(1)} jt
            </p>
          </div>
        </div>

        <div 
          className="border rounded-2xl p-4 flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text)' }}>Pesanan Lunas</p>
            <p className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>{paidOrders} pesanan</p>
          </div>
        </div>

        <div 
          className="border rounded-2xl p-4 flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text)' }}>Menunggu Pembayaran</p>
            <p className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>{pendingOrders} pesanan</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div 
        className="border rounded-2xl p-4 mb-6 transition-all duration-300"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input Field */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text)' }} />
            <input
              type="text"
              placeholder="Cari invoice, pelanggan, atau layanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl outline-none text-sm transition-all"
              style={{
                backgroundColor: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                color: 'var(--text-strong)',
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'var(--text)' }} />
            <div className="flex gap-2 flex-wrap">
              {['all', 'paid', 'pending', 'cancelled', 'refunded'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    backgroundColor: selectedFilter === filter ? 'var(--accent)' : 'var(--bg-raised)',
                    color: selectedFilter === filter ? '#ffffff' : 'var(--text)',
                    border: `1px solid ${selectedFilter === filter ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {filter === 'all' ? 'Semua' : 
                   filter === 'paid' ? 'Lunas' : 
                   filter === 'pending' ? 'Menunggu' : 
                   filter === 'cancelled' ? 'Dibatalkan' : 'Dikembalikan'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div 
        className="border rounded-2xl overflow-hidden transition-all duration-300"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--bg-raised)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--text)' }}>No. Invoice</th>
                <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--text)' }}>Pelanggan</th>
                <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--text)' }}>Layanan/Produk</th>
                <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--text)' }}>Tanggal</th>
                <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--text)' }}>Total</th>
                <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--text)' }}>Pembayaran</th>
                <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--text)' }}>Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--text)' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="transition-colors border-b"
                  style={{ 
                    borderColor: 'var(--border)', 
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-overlay)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{order.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>{order.customer}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm line-clamp-1 max-w-[200px]" style={{ color: 'var(--text)' }}>{order.service}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>{order.date}</p>
                      <p className="text-xs" style={{ color: 'var(--text)' }}>{order.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-strong)' }}>{order.total}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                      {getPaymentIcon(order.payment)}
                      <span className="text-sm">{order.payment}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === order.id ? null : order.id)}
                        className="p-2 rounded-lg transition-colors cursor-pointer"
                        style={{ color: 'var(--text)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-raised)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {showActionMenu === order.id && (
                        <div 
                          className="absolute right-0 top-10 w-44 rounded-xl shadow-2xl border py-2 z-10"
                          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                        >
                          <button 
                            className="flex items-center gap-2 px-4 py-2 w-full transition-colors text-left cursor-pointer"
                            style={{ color: 'var(--text-strong)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-raised)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            <Eye className="w-4 h-4" style={{ color: 'var(--text)' }} />
                            <span className="text-sm">Lihat Detail</span>
                          </button>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 w-full transition-colors text-left cursor-pointer"
                            style={{ color: 'var(--text-strong)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-raised)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            <FileText className="w-4 h-4" style={{ color: 'var(--text)' }} />
                            <span className="text-sm">Lihat Invoice</span>
                          </button>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 w-full transition-colors text-left cursor-pointer"
                            style={{ color: 'var(--text-strong)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-raised)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            <Download className="w-4 h-4" style={{ color: 'var(--text)' }} />
                            <span className="text-sm">Download PDF</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-t transition-all duration-300"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text)' }}>
            Menampilkan {filteredOrders.length} dari {ordersData.length} pesanan
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-heading)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)' }}
            >
              Sebelumnya
            </button>
            <button 
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-white cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              1
            </button>
            <button 
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-heading)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)' }}
            >
              2
            </button>
            <button 
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-heading)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)' }}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  )
}

export default Orders