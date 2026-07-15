import { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, Eye, FileText, Download, Calendar, CreditCard, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/layout/PageHeader'
import { useTheme } from '../context/ThemeContext'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import InputField from '../components/ui/InputField'
import Pagination from '../components/Pagination'
import OrderDetailDrawer from '../components/OrderDetailDrawer'
import { paymentService } from '../services/paymentService'
import { appointmentService } from '../services/appointmentService'
import { treatmentService } from '../services/treatmentService'
import { supabase } from '../services/supabase'

const fallbackOrders = [
  { id: 'INV-2024-001', customer: 'Sarah Wijaya',      service: 'Facial Glow Treatment + Serum Vitamin C', date: '14 Mei 2024', time: '10:30', total: 'Rp 1.250.000', payment: 'Transfer Bank', status: 'paid' },
  { id: 'INV-2024-002', customer: 'Maya Putri Andini',  service: 'Hair Spa Premium + Hair Coloring',        date: '14 Mei 2024', time: '13:00', total: 'Rp 1.800.000', payment: 'Kartu Kredit', status: 'paid' },
  { id: 'INV-2024-003', customer: 'Diana Sari Kusuma',  service: 'Botox Treatment (Full Face)',              date: '14 Mei 2024', time: '15:30', total: 'Rp 5.500.000', payment: 'Cash', status: 'pending' },
  { id: 'INV-2024-004', customer: 'Lisa Anggraini',    service: 'Microblading Alis + Touch Up',             date: '13 Mei 2024', time: '09:00', total: 'Rp 3.200.000', payment: 'Transfer Bank', status: 'paid' },
  { id: 'INV-2024-005', customer: 'Rina Kusuma Dewi',  service: 'Chemical Peeling Medium',                  date: '13 Mei 2024', time: '11:00', total: 'Rp 1.500.000', payment: 'QRIS', status: 'cancelled' },
  { id: 'INV-2024-006', customer: 'Dewi Lestari',      service: 'Laser Rejuvenation + Facial',              date: '13 Mei 2024', time: '14:00', total: 'Rp 4.200.000', payment: 'Kartu Debit', status: 'paid' },
  { id: 'INV-2024-007', customer: 'Putri Amanda',      service: 'Acne Treatment Package (5x)',               date: '12 Mei 2024', time: '10:00', total: 'Rp 2.750.000', payment: 'Transfer Bank', status: 'paid' },
  { id: 'INV-2024-008', customer: 'Sinta Maharani',    service: 'Anti Aging Premium Package',               date: '12 Mei 2024', time: '13:30', total: 'Rp 8.500.000', payment: 'Kartu Kredit', status: 'pending' },
  { id: 'INV-2024-009', customer: 'Nina Rahma',        service: 'Whitening Treatment + Body Spa',           date: '11 Mei 2024', time: '09:30', total: 'Rp 2.100.000', payment: 'QRIS', status: 'paid' },
  { id: 'INV-2024-010', customer: 'Anisa Fitri',       service: 'Derma Filler Lips',                        date: '11 Mei 2024', time: '16:00', total: 'Rp 3.800.000', payment: 'Cash', status: 'refunded' },
]

const Orders = () => {
  const { theme } = useTheme()
  const [ordersData, setOrdersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showActionMenu, setShowActionMenu] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({ customer: '', service: '', total: '', payment: 'cash', status: 'pending' })
  const [creating, setCreating] = useState(false)
  const [treatments, setTreatments] = useState([])
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [payments, appointments, txData, userData] = await Promise.all([
          supabase.from('payments').select('*, appointments:appointment_id(*)').order('created_at', { ascending: false }),
          supabase.from('appointments').select('*, treatments:treatment_id(*), users:user_id(*)').order('created_at', { ascending: false }).limit(2000),
          treatmentService.getAll(),
          supabase.from('users').select('id, name').order('name'),
        ])
        setTreatments(txData || [])
        setUsers(userData?.data || [])

        // Combine payments with appointment info
        const combined = (payments || []).map(p => {
          const apt = p.appointments || {}
          return {
            id: `INV-${p.id?.slice(0, 8).toUpperCase() || '000'}`,
            customer: apt.guest_name || apt.users?.name || 'Pasien',
            service: apt.treatments?.name || 'Treatment',
            date: apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
            time: apt.appointment_time || '-',
            total: `Rp ${(p.amount || 0).toLocaleString('id-ID')}`,
            payment: p.payment_method === 'cash' ? 'Cash' : p.payment_method === 'transfer' ? 'Transfer Bank' : p.payment_method === 'debit' ? 'Kartu Debit' : p.payment_method === 'qris' ? 'QRIS' : 'Transfer Bank',
            status: p.status === 'paid' ? 'paid' : p.status === 'pending' ? 'pending' : p.status === 'cancelled' ? 'cancelled' : 'refunded',
          }
        })

        // Get appointments as orders
        const fromAppointments = (appointments || []).map(a => ({
          id: `APT-${a.id?.slice(0, 8).toUpperCase() || '000'}`,
          customer: a.guest_name || a.users?.name || 'Pasien',
          service: a.treatments?.name || 'Treatment',
          date: a.appointment_date ? new Date(a.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
          time: a.appointment_time || '-',
          total: `Rp ${a.treatments?.price?.toLocaleString('id-ID') || '0'}`,
          payment: '-',
          status: a.status === 'completed' ? 'paid' : a.status === 'cancelled' ? 'cancelled' : 'pending',
        }))

        // Gabungkan payments + appointments, urutkan berdasarkan waktu
        const allOrders = [...combined, ...fromAppointments]
        setOrdersData(allOrders.length > 0 ? allOrders : fallbackOrders)
      } catch (err) {
        console.error('Gagal memuat pesanan:', err)
        setOrdersData(fallbackOrders)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreateOrder = async () => {
    if (!createForm.customer.trim() || !createForm.service.trim()) {
      toast.error('Nama pelanggan dan layanan wajib diisi')
      return
    }
    setCreating(true)
    try {
      const amount = parseInt(createForm.total.replace(/\D/g, '')) || 0
      // Insert dummy appointment as reference
      const { data: apt } = await supabase
        .from('appointments')
        .insert([{
          guest_name: createForm.customer.trim(),
          treatment_id: null,
          appointment_date: new Date().toISOString().split('T')[0],
          appointment_time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: createForm.status === 'paid' ? 'completed' : 'confirmed',
        }])
        .select()
        .single()

      if (apt) {
        await paymentService.create({
          appointment_id: apt.id,
          amount: amount || 100000,
          payment_method: createForm.payment,
          status: createForm.status,
        })
      }

      toast.success('Pesanan berhasil dibuat!')
      setShowCreateModal(false)
      setCreateForm({ customer: '', service: '', total: '', payment: 'cash', status: 'pending' })
      // Refresh
      const payments = await paymentService.getAll()
      const appointments = await appointmentService.getAll()
      const combined = (payments || []).map(p => ({
        id: `INV-${p.id?.slice(0, 8).toUpperCase() || '000'}`,
        customer: p.appointments?.guest_name || p.appointments?.users?.name || 'Pasien',
        service: p.appointments?.treatments?.name || 'Treatment',
        date: p.appointments?.appointment_date ? new Date(p.appointments.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
        time: p.appointments?.appointment_time || '-',
        total: `Rp ${(p.amount || 0).toLocaleString('id-ID')}`,
        payment: p.payment_method === 'cash' ? 'Cash' : p.payment_method === 'transfer' ? 'Transfer Bank' : p.payment_method === 'debit' ? 'Kartu Debit' : p.payment_method === 'qris' ? 'QRIS' : 'Transfer Bank',
        status: p.status === 'paid' ? 'paid' : p.status === 'pending' ? 'pending' : p.status === 'cancelled' ? 'cancelled' : 'refunded',
      }))
      const fromAppts = (appointments || []).map(a => ({
        id: `APT-${a.id?.slice(0, 8).toUpperCase() || '000'}`,
        customer: a.guest_name || a.users?.name || 'Pasien',
        service: a.treatments?.name || 'Treatment',
        date: a.appointment_date ? new Date(a.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
        time: a.appointment_time || '-',
        total: `Rp ${a.treatments?.price?.toLocaleString('id-ID') || '0'}`,
        payment: '-',
        status: a.status === 'completed' ? 'paid' : a.status === 'cancelled' ? 'cancelled' : 'pending',
      }))
      setOrdersData([...combined, ...fromAppts])
    } catch (err) {
      toast.error(err.message || 'Gagal membuat pesanan')
    } finally {
      setCreating(false)
    }
  }

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const safePage = Math.min(page, Math.max(totalPages, 1))
  const paginatedOrders = filteredOrders.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
      >
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)}>
          Buat Pesanan
        </Button>
      </PageHeader>

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
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
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
                  onClick={() => { setSelectedFilter(filter); setPage(1) }}
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
              {paginatedOrders.map((order) => (
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
                            onClick={() => { setSelectedOrder(order); setShowActionMenu(null) }}
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
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Empty state ketika loading selesai dan data kosong */}
      {!loading && ordersData.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📦</p>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-heading)' }}>Belum ada pesanan</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
              Pesanan dari member akan muncul di sini. Admin juga bisa menambahkan pesanan manual.
            </p>
            <Button variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)}>
              Buat Pesanan Baru
            </Button>
          </div>
        </Card>
      )}

      {/* Click outside handler */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionMenu(null)}
        />
      )}

      {/* Modal Buat Pesanan */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Buat Pesanan Baru" maxWidth="max-w-md">
        <div className="space-y-4">
          <InputField label="Nama Pelanggan *" placeholder="Nama pasien" value={createForm.customer}
            onChange={(e) => setCreateForm(p => ({ ...p, customer: e.target.value }))} />
          <InputField label="Layanan *" placeholder="cth. Facial Glow" value={createForm.service}
            onChange={(e) => setCreateForm(p => ({ ...p, service: e.target.value }))} />
          <InputField label="Total (Rp)" type="number" placeholder="cth. 450000" value={createForm.total}
            onChange={(e) => setCreateForm(p => ({ ...p, total: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Metode Bayar</label>
              <select value={createForm.payment} onChange={(e) => setCreateForm(p => ({ ...p, payment: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer Bank</option>
                <option value="debit">Kartu Debit</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Status</label>
              <select value={createForm.status} onChange={(e) => setCreateForm(p => ({ ...p, status: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
                <option value="pending">Pending</option>
                <option value="paid">Lunas</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">Batal</Button>
            <Button variant="primary" onClick={handleCreateOrder} disabled={creating} className="flex-1">
              {creating ? 'Menyimpan...' : 'Buat Pesanan'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  )
}

export default Orders