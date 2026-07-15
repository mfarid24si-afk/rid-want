import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import InputField from '../components/ui/InputField'
import Pagination from '../components/Pagination'
import { useRole } from '../context/RoleContext'
import { supabase } from '../services/supabase'

const Customers = () => {
  const { can } = useRole()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSegment, setFilterSegment] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [createModal, setCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [creating, setCreating] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editCustomer, setEditCustomer] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', segment: 'new', status: 'active', membership_tier: 'bronze', points: 0 })
  const [filterTier, setFilterTier] = useState('all')
  const [editing, setEditing] = useState(false)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  // ========== SEGMENT / STATUS OVERRIDE (via localStorage) ==========
  const OVERRIDE_KEY = 'skinova_customer_overrides'

  const loadOverrides = () => {
    try { return JSON.parse(localStorage.getItem(OVERRIDE_KEY) || '{}') }
    catch { return {} }
  }

  const saveOverride = (userId, data) => {
    const all = loadOverrides()
    all[userId] = { ...(all[userId] || {}), ...data }
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(all))
  }

  const clearOverride = (userId, key) => {
    const all = loadOverrides()
    if (all[userId]) {
      delete all[userId][key]
      if (Object.keys(all[userId]).length === 0) delete all[userId]
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(all))
    }
  }
  // =====================================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, appointments] = await Promise.all([
          supabase.from('users').select('*').order('created_at', { ascending: false }),
          supabase.from('appointments').select('user_id, status, treatment_id, treatments:treatment_id(name, price), created_at').order('created_at', { ascending: false }).limit(500),
        ])
        if (users.error) throw users.error

        // Hitung kunjungan per user (dari 500 appointment terbaru — cukup akurat)
        const visitCount = {}
        const lastTreatment = {}
        let totalSpentMap = {};
        (appointments.data || []).forEach(a => {
          const uid = a.user_id || 'guest'
          visitCount[uid] = (visitCount[uid] || 0) + 1
          if (a.status === 'completed' || a.status === 'confirmed') {
            lastTreatment[uid] = a.treatments?.name || 'Treatment'
            totalSpentMap[uid] = (totalSpentMap[uid] || 0) + (a.treatments?.price || 0)
          }
        })

        // Filter admin + terapkan override segment/status dari localStorage
        const overrides = loadOverrides()

        const mapped = (users.data || [])
          .filter(u => u.role !== 'admin') // 🚫 Admin tidak masuk daftar pelanggan
          .map((u) => {
            const visits = visitCount[u.id] || 0
            const spent = totalSpentMap[u.id] || 0
            const points = u.points || 0

            // Auto-calculate segment & status
            let autoSegment = 'new'
            if (visits >= 10) autoSegment = 'loyal'
            else if (visits >= 3) autoSegment = 'loyal'
            autoSegment = visits === 0 ? 'new' : autoSegment

            let autoStatus = 'active'
            if (visits >= 10) autoStatus = 'vip'
            else if (visits === 0) autoStatus = 'inactive'

            // Auto-calculate membership tier berdasarkan POIN
            let autoTier = 'bronze'
            if (points >= 2000) autoTier = 'gold'
            else if (points >= 500) autoTier = 'silver'

            // Cek override dari localStorage (admin bisa timpa segment/status)
            const userOvr = overrides[u.id] || {}
            const segment = userOvr.segment || autoSegment
            const status = userOvr.status || autoStatus

            // membership_tier: cek localStorage override dulu, fallback auto dari poin
            const membership_tier = userOvr.membership_tier || autoTier

            return {
              id: u.id,
              name: u.name || '-',
              email: u.email || '-',
              phone: u.phone || '-',
              lastTreatment: lastTreatment[u.id] || '-',
              totalVisits: visits,
              points,
              totalSpent: `Rp ${spent.toLocaleString('id-ID')}`,
              status,
              segment,
              membership_tier,
              _autoSegment: autoSegment, // disimpan untuk referensi di modal edit
              _autoStatus: autoStatus,
              _autoTier: autoTier,
              joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
              avatar: (u.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
            }
          })

        setCustomers(mapped)
      } catch (err) {
        console.error('Gagal memuat pelanggan:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const canEdit   = can('view:customers:edit')
  const canDelete = can('view:customers:delete')

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchSegment = filterSegment === 'all' || c.segment === filterSegment
    const matchTier = filterTier === 'all' || c.membership_tier === filterTier
    return matchSearch && matchSegment && matchTier
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const safePage = Math.min(page, Math.max(totalPages, 1))
  const paginatedCustomers = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleView = (customer) => {
    setSelectedCustomer(customer)
    setShowModal(true)
  }

  const handleCreateCustomer = async () => {
    if (!createForm.name.trim()) {
      toast.error('Nama wajib diisi')
      return
    }
    if (!createForm.email.trim()) {
      toast.error('Email wajib diisi untuk membuat akun')
      return
    }
    setCreating(true)
    try {
      // Step 1: Buat user via Supabase Auth
      const password = createForm.password.trim() || 'skinova123'
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: createForm.email.trim(),
        password,
        options: {
          data: {
            name: createForm.name.trim(),
            role: 'member',
          },
        },
      })
      if (authError) throw authError

      if (!authData?.user?.id) {
        throw new Error('Gagal membuat akun, coba lagi')
      }

      // Step 2: Upsert profile ke public.users
      // NOTE: membership_tier tidak dikirim dulu karena kolom belum ada di DB.
      // Jalankan migration SQL untuk menambahkan kolom (lihat file migration).
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          name: createForm.name.trim(),
          email: createForm.email.trim(),
          role: 'member',
          points: 0,
          phone: createForm.phone.trim() || null,
        }, { onConflict: 'id' })
        .select()
        .single()

      if (upsertError) throw upsertError

      // Step 3: Fetch profil untuk ditambahkan ke state
      const { data: profile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (fetchError) throw fetchError

      toast.success('Pelanggan berhasil ditambahkan!')
      setCreateModal(false)
      setCreateForm({ name: '', email: '', phone: '', password: '' })

      if (profile) {
        setCustomers(prev => [{
          id: profile.id,
          name: profile.name,
          email: profile.email || '-',
          phone: profile.phone || '-',
          lastTreatment: '-',
          totalVisits: 0,
          totalSpent: 'Rp 0',
          status: 'active',
          segment: 'new',
          membership_tier: 'bronze',
          points: 0,
          joinDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          avatar: profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        }, ...prev])
      }
    } catch (err) {
      toast.error(err.message || 'Gagal menambah pelanggan')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus pelanggan "${name}"?`)) return
    try {
      await supabase.from('users').delete().eq('id', id)
      toast.success('Pelanggan berhasil dihapus')
      setCustomers(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  const handleEditClick = (customer) => {
    setEditCustomer(customer)
    setEditForm({
      name: customer.name === '-' ? '' : customer.name,
      email: customer.email === '-' ? '' : customer.email,
      phone: customer.phone === '-' ? '' : customer.phone,
      segment: customer.segment,
      status: customer.status,
      membership_tier: customer.membership_tier,
      points: customer.points || 0,
    })
    setEditModal(true)
  }

  const handleEditSave = async () => {
    if (!editForm.name.trim()) {
      toast.error('Nama wajib diisi')
      return
    }
    setEditing(true)
    try {
      // Simpan nama, email, phone & points ke Supabase
      // NOTE: membership_tier disimpan di localStorage dulu karena kolom belum ada di DB.
      // Jalankan migration SQL untuk menambahkan kolom (lihat file migration).
      const { error } = await supabase
        .from('users')
        .update({
          name: editForm.name.trim(),
          email: editForm.email.trim() || null,
          phone: editForm.phone.trim() || null,
          points: parseInt(editForm.points) || 0,
        })
        .eq('id', editCustomer.id)
      if (error) throw error

      // Simpan override segment, status & membership_tier ke localStorage
      const userOvr = {}
      if (editForm.segment !== editCustomer._autoSegment) userOvr.segment = editForm.segment
      if (editForm.status !== editCustomer._autoStatus) userOvr.status = editForm.status
      if (editForm.membership_tier !== editCustomer._autoTier) userOvr.membership_tier = editForm.membership_tier

      if (Object.keys(userOvr).length > 0) {
        saveOverride(editCustomer.id, userOvr)
      } else {
        clearOverride(editCustomer.id, 'segment')
        clearOverride(editCustomer.id, 'status')
        clearOverride(editCustomer.id, 'membership_tier')
      }

      toast.success('Data pelanggan berhasil diupdate!')
      setEditModal(false)
      // Update state lokal
      setCustomers(prev => prev.map(c =>
        c.id === editCustomer.id
          ? { ...c,
              name: editForm.name.trim(),
              email: editForm.email.trim() || '-',
              phone: editForm.phone.trim() || '-',
              segment: editForm.segment,
              status: editForm.status,
              membership_tier: editForm.membership_tier,
              points: parseInt(editForm.points) || 0,
            }
          : c
      ))
    } catch (err) {
      toast.error(err.message || 'Gagal mengupdate data')
    } finally {
      setEditing(false)
    }
  }

  const segments = [
    { key: 'all',    label: 'Semua' },
    { key: 'loyal',  label: '⭐ Loyal' },
    { key: 'new',    label: '🌱 Baru' },
    { key: 'at-risk',label: '⚠️ At-Risk' },
  ]

  const tiers = [
    { key: 'all',    label: 'Semua Tier', icon: '🏷️' },
    { key: 'gold',   label: '🥇 Gold',    color: '#FFD700' },
    { key: 'silver', label: '🥈 Silver',  color: '#9CA3AF' },
    { key: 'bronze', label: '🥉 Bronze',  color: '#CD7F32' },
  ]

  return (
    <div>
      <PageHeader title="Pelanggan" subtitle="Kelola dan segmentasi data pasien klinik">
        {canEdit && (
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateModal(true)}>
            Tambah Pelanggan
          </Button>
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
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tiers.map(t => (
              <button key={t.key}
                onClick={() => { setFilterTier(t.key); setPage(1) }}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={filterTier === t.key
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { background: 'var(--bg-raised)', color: 'var(--text)', border: '1px solid var(--border)' }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {segments.map(s => (
              <button key={s.key}
                onClick={() => { setFilterSegment(s.key); setPage(1) }}
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
        {loading ? (
          <div className="py-6">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-3 py-3">
                  <div className="w-9 h-9 rounded-full" style={{ background: 'var(--border)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 rounded w-48" style={{ background: 'var(--border)' }} />
                    <div className="h-2.5 rounded w-32" style={{ background: 'var(--border)' }} />
                  </div>
                  <div className="h-3 rounded w-20" style={{ background: 'var(--border)' }} />
                  <div className="h-6 rounded-xl w-16" style={{ background: 'var(--border)' }} />
                </div>
              ))}
            </div>
            <p className="text-center text-xs mt-4" style={{ color: 'var(--text)' }}>
              Memuat 1.000+ data pelanggan...
            </p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Pelanggan', 'Kontak', 'Treatment Terakhir', 'Kunjungan', 'Poin', 'Total Spent', 'Membership', 'Segmen', 'Aksi'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold"
                    style={{ color: 'var(--text)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer, i) => (
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
                  <td className="py-3 px-3 text-center font-semibold" style={{ color: 'var(--warning)' }}>
                    {customer.points?.toLocaleString('id-ID') || 0}
                  </td>
                  <td className="py-3 px-3 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    {customer.totalSpent}
                  </td>
                  <td className="py-3 px-3">
                    <Badge status={customer.membership_tier}>
                      {customer.membership_tier === 'gold' ? '🥇 Gold'
                        : customer.membership_tier === 'silver' ? '🥈 Silver'
                        : '🥉 Bronze'}
                    </Badge>
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
                        <button onClick={() => handleEditClick(customer)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--text)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--info)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                          title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDelete(customer.id, customer.name)}
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
          </table>            {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-sm" style={{ color: 'var(--text)' }}>Tidak ada pelanggan yang sesuai filter.</p>
            </div>
          )}
        </div>
        )}
        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </Card>

      {/* Modal Tambah Pelanggan */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Tambah Pelanggan" maxWidth="max-w-sm">
        <div className="space-y-4">
          <InputField label="Nama *" placeholder="Nama lengkap" value={createForm.name}
            onChange={(e) => setCreateForm(p => ({ ...p, name: e.target.value }))} />
          <InputField label="Email *" type="email" placeholder="email@example.com" value={createForm.email}
            onChange={(e) => setCreateForm(p => ({ ...p, email: e.target.value }))} />
          <InputField label="Password" type="password" placeholder="Kosongi untuk password default" value={createForm.password}
            onChange={(e) => setCreateForm(p => ({ ...p, password: e.target.value }))} />
          <div className="text-xs px-3 py-2 rounded-xl" style={{ background: 'var(--info-soft)', color: 'var(--info)', border: '1px solid var(--info)' }}>
            💡 Password default <strong>skinova123</strong> jika dikosongkan.
          </div>
          <InputField label="No. Telepon" placeholder="0812-xxxx-xxxx" value={createForm.phone}
            onChange={(e) => setCreateForm(p => ({ ...p, phone: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModal(false)} className="flex-1">Batal</Button>
            <Button variant="primary" onClick={handleCreateCustomer} disabled={creating} className="flex-1">
              {creating ? 'Menyimpan...' : 'Tambah'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Edit Pelanggan */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Pelanggan" maxWidth="max-w-md">
        {editCustomer && (
          <div className="space-y-4">
            <InputField label="Nama *" placeholder="Nama lengkap" value={editForm.name}
              onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} />
            <InputField label="Email" type="email" placeholder="email@example.com" value={editForm.email}
              onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} />
            <InputField label="No. Telepon" placeholder="0812-xxxx-xxxx" value={editForm.phone}
              onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))} />

            {/* Info otomatis (referensi) */}
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-raised)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>
                📊 Referensi Otomatis — {editCustomer._autoSegment === editForm.segment && editCustomer._autoStatus === editForm.status
                  ? 'Sesuai kunjungan' : '⚠️ Diubah manual'}
              </p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div>
                  <span style={{ color: 'var(--text)' }}>Kunjungan: </span>
                  <strong style={{ color: 'var(--text-strong)' }}>{editCustomer.totalVisits}x</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text)' }}>Total Spent: </span>
                  <strong style={{ color: 'var(--text-strong)' }}>{editCustomer.totalSpent}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text)' }}>Poin Saat Ini: </span>
                  <strong style={{ color: 'var(--warning)' }}>{editCustomer.points?.toLocaleString('id-ID') || 0}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text)' }}>Auto Tier: </span>
                  <Badge status={editCustomer._autoTier}>{editCustomer._autoTier === 'gold' ? '🥇 Gold' : editCustomer._autoTier === 'silver' ? '🥈 Silver' : '🥉 Bronze'}</Badge>
                </div>
                <div>
                  <span style={{ color: 'var(--text)' }}>Auto Segmen: </span>
                  <Badge status={editCustomer._autoSegment}>{editCustomer._autoSegment === 'loyal' ? 'Loyal' : 'Baru'}</Badge>
                </div>
                <div>
                  <span style={{ color: 'var(--text)' }}>Auto Status: </span>
                  <Badge status={editCustomer._autoStatus}>{editCustomer._autoStatus === 'vip' ? 'VIP' : editCustomer._autoStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}</Badge>
                </div>
              </div>
            </div>

            {/* ———— MANAJEMEN POIN & MEMBERSHIP ———— */}
            <div className="p-4 rounded-xl" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
              <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                ⭐ Manajemen Poin & Membership
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Total Poin</label>
                  <input type="number" min="0" step="100"
                    value={editForm.points}
                    onChange={(e) => {
                      const pts = parseInt(e.target.value) || 0
                      setEditForm(p => ({
                        ...p,
                        points: pts,
                        // Auto-calculate tier saat poin diubah
                        membership_tier: pts >= 2000 ? 'gold' : pts >= 500 ? 'silver' : 'bronze'
                      }))
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none font-bold"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Membership Tier</label>
                  <select value={editForm.membership_tier}
                    onChange={(e) => setEditForm(p => ({ ...p, membership_tier: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
                    <option value="bronze">🥉 Bronze (0-499 poin)</option>
                    <option value="silver">🥈 Silver (500-1.999 poin)</option>
                    <option value="gold">🥇 Gold (2.000+ poin)</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text)' }}>
                💡 <strong>Poin → Tier otomatis:</strong> Saat angka poin diubah, tier di form ini otomatis menyesuaikan (Bronze: 0-499, Silver: 500-1.999, Gold: 2.000+).
              </p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text)' }}>
                🎯 <strong>Bebas override:</strong> Admin bisa ganti tier manual kapan saja via dropdown. Kombinasi poin + tier APA PUN bisa langsung disimpan.
              </p>
            </div>

            {/* Override Segmen & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Segmen (manual)</label>
                <select value={editForm.segment}
                  onChange={(e) => setEditForm(p => ({ ...p, segment: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
                  <option value="loyal">⭐ Loyal</option>
                  <option value="new">🌱 Baru</option>
                  <option value="at-risk">⚠️ At-Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Status (manual)</label>
                <select value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
                  <option value="active">✅ Aktif</option>
                  <option value="vip">💎 VIP</option>
                  <option value="inactive">⏸️ Tidak Aktif</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditModal(false)} className="flex-1">Batal</Button>
              <Button variant="primary" onClick={handleEditSave} disabled={editing} className="flex-1">
                {editing ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
                  <Badge status={selectedCustomer.membership_tier}>
                    {selectedCustomer.membership_tier === 'gold' ? '🥇 Gold'
                      : selectedCustomer.membership_tier === 'silver' ? '🥈 Silver'
                      : '🥉 Bronze'}
                  </Badge>
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
                { label: 'Total Poin',     value: (selectedCustomer.points || 0).toLocaleString('id-ID') },
                { label: 'Total Spent',    value: selectedCustomer.totalSpent },
                { label: 'Membership Tier', value: selectedCustomer.membership_tier === 'gold' ? '🥇 Gold' : selectedCustomer.membership_tier === 'silver' ? '🥈 Silver' : '🥉 Bronze' },
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