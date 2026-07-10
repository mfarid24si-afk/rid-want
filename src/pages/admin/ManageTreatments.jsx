import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import InputField from '../../components/ui/InputField'
import { treatmentService } from '../../services/treatmentService'

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  duration_min: 60,
  is_active: true,
  image_url: '',
}

const ManageTreatments = () => {
  const [treatments, setTreatments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      const data = await treatmentService.getAll()
      setTreatments(data || [])
    } catch (err) {
      console.error('Gagal memuat treatments:', err)
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

  const openEdit = (t) => {
    setModalMode('edit')
    setSelectedId(t.id)
    setForm({
      name: t.name || '',
      category: t.category || '',
      description: t.description || '',
      price: t.price?.toString() || '',
      duration_min: t.duration_min || 60,
      is_active: t.is_active ?? true,
      image_url: t.image_url || '',
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Nama treatment wajib diisi')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim() || null,
        description: form.description.trim() || null,
        price: parseInt(form.price) || 0,
        duration_min: parseInt(form.duration_min) || 60,
        is_active: form.is_active,
        image_url: form.image_url.trim() || null,
      }

      if (modalMode === 'create') {
        await treatmentService.create(payload)
        toast.success('Treatment berhasil ditambahkan!')
      } else {
        await treatmentService.update(selectedId, payload)
        toast.success('Treatment berhasil diperbarui!')
      }
      setModalOpen(false)
      await fetchData()
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus treatment "${name}"?`)) return
    try {
      await treatmentService.remove(id)
      toast.success('Treatment berhasil dihapus')
      await fetchData()
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  const handleToggleActive = async (t) => {
    try {
      await treatmentService.update(t.id, { is_active: !t.is_active })
      toast.success(t.is_active ? 'Treatment dinonaktifkan' : 'Treatment diaktifkan')
      await fetchData()
    } catch (err) {
      toast.error('Gagal mengubah status')
    }
  }

  const filtered = treatments.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Kelola Treatment"
        subtitle="Tambah, edit, dan kelola layanan perawatan klinik"
      >
        <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>
          Tambah Treatment
        </Button>
      </PageHeader>

      {/* Search */}
      <Card className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text)' }} />
          <input
            type="text"
            placeholder="Cari treatment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="text-center py-8"><p style={{ color: 'var(--text)' }}>Memuat data...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">💆</p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{search ? 'Tidak ada hasil' : 'Belum ada treatment'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Nama', 'Kategori', 'Harga', 'Durasi', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 px-3">
                      <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>{t.name}</p>
                      {t.description && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text)' }}>{t.description}</p>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        {t.category || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold" style={{ color: 'var(--text-heading)' }}>
                      Rp {t.price?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-xs" style={{ color: 'var(--text)' }}>{t.duration_min} menit</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleActive(t)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        style={{
                          background: t.is_active ? 'var(--success-soft)' : 'var(--bg-raised)',
                          color: t.is_active ? 'var(--success)' : 'var(--text)',
                        }}
                      >
                        {t.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {t.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text)' }} title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(t.id, t.name)} className="p-1.5 rounded-lg transition-colors hover:text-red-500" style={{ color: 'var(--text)' }} title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Create/Edit */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Tambah Treatment' : 'Edit Treatment'} maxWidth="max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          <InputField label="Nama Treatment *" placeholder="cth. Facial Glow Premium" value={form.name}
            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />

          <div className="grid grid-cols-2 gap-3">
            <InputField label="Kategori" placeholder="cth. Perawatan Kulit" value={form.category}
              onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} />
            <InputField label="Durasi (menit)" type="number" min={15} value={form.duration_min}
              onChange={(e) => setForm(p => ({ ...p, duration_min: parseInt(e.target.value) || 60 }))} />
          </div>

          <InputField label="Harga (Rp)" type="number" min={0} placeholder="cth. 450000" value={form.price}
            onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))} />

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Deskripsi treatment..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
            />
          </div>

          <InputField label="URL Gambar (opsional)" placeholder="https://..." value={form.image_url}
            onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))} />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))}
                className="w-4 h-4 rounded accent-[var(--accent)]"
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>Active</span>
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

export default ManageTreatments
