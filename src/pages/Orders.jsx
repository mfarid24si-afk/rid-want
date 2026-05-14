import { useState } from 'react'
import { Search, Filter, MoreVertical, Eye, FileText, Download, Calendar, CreditCard } from 'lucide-react'
import PageHeader from '../components/PageHeader'

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
        return <span className="badge badge-success">Lunas</span>
      case 'pending':
        return <span className="badge badge-warning">Menunggu</span>
      case 'cancelled':
        return <span className="badge badge-danger">Dibatalkan</span>
      case 'refunded':
        return <span className="badge badge-info">Dikembalikan</span>
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
    <div>
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
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Pendapatan</p>
            <p className="text-xl font-bold text-slate-800">
              Rp {(totalRevenue / 1000000).toFixed(1)} jt
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Pesanan Lunas</p>
            <p className="text-xl font-bold text-slate-800">{paidOrders} pesanan</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Menunggu Pembayaran</p>
            <p className="text-xl font-bold text-slate-800">{pendingOrders} pesanan</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari invoice, pelanggan, atau layanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 py-2"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <div className="flex gap-2 flex-wrap">
              {['all', 'paid', 'pending', 'cancelled', 'refunded'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
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

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">No. Invoice</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Pelanggan</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Layanan/Produk</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Tanggal</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Total</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Pembayaran</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-primary-600">{order.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-800">{order.customer}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600 line-clamp-1 max-w-[200px]">{order.service}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-slate-800">{order.date}</p>
                      <p className="text-xs text-slate-400">{order.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-slate-800">{order.total}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(order.payment)}
                      <span className="text-sm text-slate-600">{order.payment}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === order.id ? null : order.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                      
                      {showActionMenu === order.id && (
                        <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-10">
                          <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-slate-50 transition-colors text-left">
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">Lihat Detail</span>
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-slate-50 transition-colors text-left">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">Lihat Invoice</span>
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-slate-50 transition-colors text-left">
                            <Download className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">Download PDF</span>
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Menampilkan {filteredOrders.length} dari {ordersData.length} pesanan
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              Sebelumnya
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-500 text-white">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
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
