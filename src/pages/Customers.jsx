import { useState } from 'react'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import InputField from '../components/ui/InputField'
import { customersData } from '../data/mockCustomers'
import { useRole } from '../context/RoleContext'

const Customers = () => {
  const { can } = useRole()
  const [customers, setCustomers] = useState(customersData)
  const [search, setSearch] = useState('')
  const [filterSegment, setFilterSegment] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const canEdit   = can('view:customers:edit')
  const canDelete = can('view:customers:delete')

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchSegment = filterSegment === 'all' || c.segment === filterSegment
    return matchSearch && matchSegment
  })

  const handleView = (customer) => {
    setSelectedCustomer(customer)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Hapus pelanggan ini?')) {
      setCustomers(prev => prev.filter(c => c.id !== id))
    }
  }

  const segments = [
    { key: 'all',    label: 'Semua' },
    { key: 'loyal',  label: '⭐ Loyal' },
    { key: 'new',    label: '🌱 Baru' },
    { key: 'at-risk',label: '⚠️ At-Risk' },
  ]

  return (
    <div>
      <PageHeader title="Pelanggan" subtitle="Kelola dan segmentasi data pasien klinik">
        {canEdit && (
          <Button variant="primary" size="sm" icon={Plus}>Tambah Pelanggan</Button>
        )}
      </PageHeader>

      {/* Filter + Search */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text)' }} />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {segments.map(s => (
              <button key={s.key}
                onClick={() => setFilterSegment(s.key)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={filterSegment === s.key
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { background: 'var(--bg-raised)', color: 'var(--text)', border: '1px solid var(--border)' }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabel Customers */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Pelanggan', 'Kontak', 'Treatment Terakhir', 'Kunjungan', 'Total Spent', 'Segmen', 'Aksi'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold"
                    style={{ color: 'var(--text)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer, i) => (
                <tr key={customer.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={customer.avatar} size="sm" index={i} />
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-heading)' }}>{customer.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text)' }}>Bergabung: {customer.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-xs" style={{ color: 'var(--text)' }}>{customer.email}</p>
                    <p className="text-xs" style={{ color: 'var(--text)' }}>{customer.phone}</p>
                  </td>
                  <td className="py-3 px-3 text-xs" style={{ color: 'var(--text)' }}>{customer.lastTreatment}</td>
                  <td className="py-3 px-3 text-center font-semibold" style={{ color: 'var(--text-strong)' }}>
                    {customer.totalVisits}x
                  </td>
                  <td className="py-3 px-3 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    {customer.totalSpent}
                  </td>
                  <td className="py-3 px-3">
                    <Badge status={customer.segment}>
                      {customer.segment === 'loyal' ? 'Loyal'
                        : customer.segment === 'new' ? 'Baru'
                        : 'At-Risk'}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleView(customer)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--text)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                        title="Lihat detail">
                        <Eye className="w-4 h-4" />
                      </button>
                      {canEdit && (
                        <button className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--text)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--info)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                          title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDelete(customer.id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--text)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                          title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-sm" style={{ color: 'var(--text)' }}>Tidak ada pelanggan yang sesuai filter.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal Detail Pelanggan */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Detail Pelanggan">
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar initials={selectedCustomer.avatar} size="lg" index={0} />
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>
                  {selectedCustomer.name}
                </h3>
                <div className="flex gap-2 mt-1">
                  <Badge status={selectedCustomer.status}>{selectedCustomer.status}</Badge>
                  <Badge status={selectedCustomer.segment}>
                    {selectedCustomer.segment}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email',          value: selectedCustomer.email },
                { label: 'Telepon',        value: selectedCustomer.phone },
                { label: 'Bergabung',      value: selectedCustomer.joinDate },
                { label: 'Total Kunjungan',value: `${selectedCustomer.totalVisits}x` },
                { label: 'Total Spent',    value: selectedCustomer.totalSpent },
                { label: 'Treatment Terakhir', value: selectedCustomer.lastTreatment },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-raised)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text)' }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Customers