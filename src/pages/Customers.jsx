import { useState } from 'react'
import { Search, Filter, MoreVertical, Phone, Mail, Edit, Trash2, Eye } from 'lucide-react'
import PageHeader from '../components/PageHeader'

// Mock Data
const customersData = [
  {
    id: 1,
    name: 'Sarah Wijaya',
    email: 'sarah.wijaya@email.com',
    phone: '0812-3456-7890',
    lastTreatment: 'Facial Glow Treatment',
    totalVisits: 12,
    totalSpent: 'Rp 15.800.000',
    status: 'active',
    joinDate: '15 Jan 2024',
    avatar: 'SW'
  },
  {
    id: 2,
    name: 'Maya Putri Andini',
    email: 'maya.putri@email.com',
    phone: '0813-4567-8901',
    lastTreatment: 'Hair Spa Premium',
    totalVisits: 8,
    totalSpent: 'Rp 9.500.000',
    status: 'active',
    joinDate: '22 Feb 2024',
    avatar: 'MP'
  },
  {
    id: 3,
    name: 'Diana Sari Kusuma',
    email: 'diana.sari@email.com',
    phone: '0814-5678-9012',
    lastTreatment: 'Botox Treatment',
    totalVisits: 5,
    totalSpent: 'Rp 18.500.000',
    status: 'active',
    joinDate: '10 Mar 2024',
    avatar: 'DS'
  },
  {
    id: 4,
    name: 'Lisa Anggraini',
    email: 'lisa.anggraini@email.com',
    phone: '0815-6789-0123',
    lastTreatment: 'Microblading Alis',
    totalVisits: 3,
    totalSpent: 'Rp 4.200.000',
    status: 'inactive',
    joinDate: '05 Apr 2024',
    avatar: 'LA'
  },
  {
    id: 5,
    name: 'Rina Kusuma Dewi',
    email: 'rina.kusuma@email.com',
    phone: '0816-7890-1234',
    lastTreatment: 'Chemical Peeling',
    totalVisits: 15,
    totalSpent: 'Rp 22.300.000',
    status: 'active',
    joinDate: '18 Jan 2024',
    avatar: 'RK'
  },
  {
    id: 6,
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    phone: '0817-8901-2345',
    lastTreatment: 'Laser Rejuvenation',
    totalVisits: 7,
    totalSpent: 'Rp 12.000.000',
    status: 'active',
    joinDate: '28 Feb 2024',
    avatar: 'DL'
  },
  {
    id: 7,
    name: 'Putri Amanda Salsabila',
    email: 'putri.amanda@email.com',
    phone: '0818-9012-3456',
    lastTreatment: 'Acne Treatment',
    totalVisits: 10,
    totalSpent: 'Rp 8.700.000',
    status: 'inactive',
    joinDate: '12 Mar 2024',
    avatar: 'PA'
  },
  {
    id: 8,
    name: 'Sinta Maharani',
    email: 'sinta.maharani@email.com',
    phone: '0819-0123-4567',
    lastTreatment: 'Anti Aging Premium',
    totalVisits: 20,
    totalSpent: 'Rp 45.600.000',
    status: 'vip',
    joinDate: '01 Jan 2024',
    avatar: 'SM'
  }
]

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showActionMenu, setShowActionMenu] = useState(null)

  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    
    const matchesFilter = selectedFilter === 'all' || customer.status === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Aktif</span>
      case 'inactive':
        return <span className="badge badge-warning">Tidak Aktif</span>
      case 'vip':
        return <span className="badge bg-primary-100 text-primary-700">VIP</span>
      default:
        return null
    }
  }

  return (
    <div>
      <PageHeader 
        title="Data Pelanggan"
        subtitle="Kelola informasi dan riwayat pelanggan klinik Anda"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Pelanggan' }
        ]}
        actionLabel="Tambah Pelanggan"
        onAction={() => alert('Tambah pelanggan baru')}
      />

      {/* Filters and Search */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau telepon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 py-2"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <div className="flex gap-2">
              {['all', 'active', 'inactive', 'vip'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'Semua' : filter === 'active' ? 'Aktif' : filter === 'inactive' ? 'Tidak Aktif' : 'VIP'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Pelanggan</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Kontak</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Treatment Terakhir</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Kunjungan</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Total Belanja</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">{customer.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{customer.name}</p>
                        <p className="text-xs text-slate-400">Bergabung {customer.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600">{customer.lastTreatment}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-800">{customer.totalVisits}x</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-slate-800">{customer.totalSpent}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(customer.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === customer.id ? null : customer.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                      
                      {showActionMenu === customer.id && (
                        <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-10">
                          <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-slate-50 transition-colors text-left">
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">Lihat Detail</span>
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-slate-50 transition-colors text-left">
                            <Edit className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">Edit</span>
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 transition-colors text-left group">
                            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                            <span className="text-sm text-slate-700 group-hover:text-red-600">Hapus</span>
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
            Menampilkan {filteredCustomers.length} dari {customersData.length} pelanggan
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

export default Customers
