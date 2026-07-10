import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import InputField from '../../components/ui/InputField'
import { promotionService } from '../../services/promotionService'

const emptyForm = {
  code: '',
  title: '',
  description: '',
  discount_pct: 0,
  valid_from: '',
  valid_until: '',
  is_active: true,
}

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      const data = await promotionService.getAll()
      setPromotions(data || [])
    } catch (err) {
      console.error('Gagal memuat promo:', err)
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setModalMode('create')
    setSelectedId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setModalMode('edit')
    setSelectedId(p.id)
    setForm({
      code: p.code || '',
      title: p.title || '',
      description: p.description || '',
      discount_pct: p.discount_pct || 0,
      valid_from: p.valid_from || '',
      valid_until: p.valid_until || '',
      is_active: p.is_active ?? true,
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.code.trim()) { toast.error('Kode promo wajib diisi'); return }
    if (!form.title.trim()) { toast.error('Judul promo wajib diisi'); return }
    setSaving(true)
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        discount_pct: parseInt(form.discount_pct) || 0,
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
        is_active: form.is_active,
      }
      if (modalMode === 'create') {
        await promotionService.create(payload)
        toast.success('Promo berhasil ditambahkan!')
      } else {
        await promotionService.update(selectedId, payload)
        toast.success('Promo berhasil diperbarui!')
      }
      setModalOpen(false)
      await fetchData()
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan (mungkin kode sudah digunakan)')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus promo "${title}"?`)) return
    try {
      await promotionService.remove(id)
      toast.success('Promo berhasil dihapus')
      await fetchData()
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  const handleToggleActive = async (p) => {
    try {
      await promotionService.update(p.id, { is_active: !p.is_active })
      toast.success(p.is_active ? 'Promo dinonaktifkan' : 'Promo diaktifkan')
      await fetchData()
    } catch (err) {
      toast.error('Gagal mengubah status')
    }
  }

  const filtered = promotions.filter(p =>
    !search || p.code?.toLowerCase().includes(search.toLowerCase()) ||
    p.title?.toLowerCase().includes(search.toLowerCase())
  )


  return (
    <div>
      <PageHeader title="Kelola Promo" subtitle="Tambah, edit, dan kelola promo & voucher klinik">
        <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>Tambah Promo</Button>
      </PageHeader>

      <Card className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text)' }} />
          <input type="text" placeholder="Cari promo..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="text-center py-8"><p style={{ color: 'var(--text)' }}>Memuat data...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🏷️</p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{search ? 'Tidak ada hasil' : 'Belum ada promo'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Kode', 'Judul', 'Diskon', 'Berlaku', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isExpired = p.valid_until && new Date(p.valid_until) < new Date()
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3 px-3">
                        <span className="font-mono font-black text-sm px-2 py-1 rounded-lg"
                          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                          {p.code}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>{p.title}</p>
                        {p.description && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text)' }}>{p.description}</p>}
                      </td>
                      <td className="py-3 px-3 font-bold" style={{ color: 'var(--warning)' }}>{p.discount_pct}%</td>
                      <td className="py-3 px-3 text-xs" style={{ color: 'var(--text)' }}>
                        {p.valid_from ? `${new Date(p.valid_from).toLocaleDateString('id-ID')}` : '-'}
                        {p.valid_until ? ` → ${new Date(p.valid_until).toLocaleDateString('id-ID')}` : ''}
                        {isExpired && <span className="ml-2 text-red-500 font-semibold">(Kedaluwarsa)</span>}
                      </td>
                      <td className="py-3 px-3">
                        <button onClick={() => handleToggleActive(p)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          style={{
                            background: p.is_active && !isExpired ? 'var(--success-soft)' : 'var(--bg-raised)',
                            color: p.is_active && !isExpired ? 'var(--success)' : 'var(--text)',
                          }}>
                          {p.is_active && !isExpired ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {p.is_active && !isExpired ? 'Aktif' : isExpired ? 'Expired' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text)' }} title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 rounded-lg transition-colors hover:text-red-500" style={{ color: 'var(--text)' }} title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Create/Edit */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Tambah Promo' : 'Edit Promo'} maxWidth="max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Kode Promo *" placeholder="cth. PROMO50" value={form.code}
              onChange={(e) => setForm(p => ({ ...p, code: e.target.value }))} required />
            <InputField label="Diskon (%)" type="number" min={0} max={100} value={form.discount_pct}
              onChange={(e) => setForm(p => ({ ...p, discount_pct: parseInt(e.target.value) || 0 }))} />
          </div>

          <InputField label="Judul Promo *" placeholder="cth. Diskon Spesial Akhir Tahun" value={form.title}
            onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} required />

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Deskripsi promo..." rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField label="Berlaku Dari" type="date" value={form.valid_from}
              onChange={(e) => setForm(p => ({ ...p, valid_from: e.target.value }))} />
            <InputField label="Berlaku Sampai" type="date" value={form.valid_until}
              onChange={(e) => setForm(p => ({ ...p, valid_until: e.target.value }))} />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))}
                className="w-4 h-4 rounded accent-[var(--accent)]" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>Aktif</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)} className="flex-1">Batal</Button>
            <Button variant="primary" type="submit" disabled={saving} className="flex-1">
              {saving ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManagePromotions
