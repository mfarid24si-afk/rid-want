import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import InputField from '../../components/ui/InputField'
import { doctorService } from '../../services/doctorService'

const emptyForm = {
  name: '',
  specialty: '',
  title: '',
  experience_yr: 0,
  bio: '',
  image_url: '',
  is_active: true,
}

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  // Schedule modal
  const [scheduleModal, setScheduleModal] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [scheduleForm, setScheduleForm] = useState({ day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true })

  const fetchData = async () => {
    try {
      const data = await doctorService.getAll()
      setDoctors(data || [])
    } catch (err) {
      console.error('Gagal memuat dokter:', err)
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

  const openEdit = (d) => {
    setModalMode('edit')
    setSelectedId(d.id)
    setForm({
      name: d.name || '',
      specialty: d.specialty || '',
      title: d.title || '',
      experience_yr: d.experience_yr || 0,
      bio: d.bio || '',
      image_url: d.image_url || '',
      is_active: d.is_active ?? true,
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Nama dokter wajib diisi')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        specialty: form.specialty.trim() || null,
        title: form.title.trim() || null,
        experience_yr: parseInt(form.experience_yr) || 0,
        bio: form.bio.trim() || null,
        image_url: form.image_url.trim() || null,
        is_active: form.is_active,
      }
      if (modalMode === 'create') {
        await doctorService.create(payload)
        toast.success('Dokter berhasil ditambahkan!')
      } else {
        await doctorService.update(selectedId, payload)
        toast.success('Dokter berhasil diperbarui!')
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
    if (!window.confirm(`Hapus dokter "${name}"?`)) return
    try {
      await doctorService.remove(id)
      toast.success('Dokter berhasil dihapus')
      await fetchData()
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  const handleToggleActive = async (d) => {
    try {
      await doctorService.update(d.id, { is_active: !d.is_active })
      toast.success(d.is_active ? 'Dokter dinonaktifkan' : 'Dokter diaktifkan')
      await fetchData()
    } catch (err) {
      toast.error('Gagal mengubah status')
    }
  }

  // Schedule management
  const openSchedule = async (doctor) => {
    setScheduleModal(doctor)
    setScheduleForm({ day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true })
    try {
      const data = await doctorService.getSchedules(doctor.id)
      setSchedules(data || [])
    } catch (err) {
      console.error('Gagal memuat jadwal:', err)
      setSchedules([])
    }
  }

  const addSchedule = async () => {
    if (!scheduleModal) return
    try {
      await doctorService.upsertSchedule({
        doctor_id: scheduleModal.id,
        ...scheduleForm,
      })
      toast.success('Jadwal ditambahkan')
      const data = await doctorService.getSchedules(scheduleModal.id)
      setSchedules(data || [])
    } catch (err) {
      toast.error('Gagal menambah jadwal')
    }
  }

  const removeSchedule = async (id) => {
    try {
      await doctorService.deleteSchedule(id)
      toast.success('Jadwal dihapus')
      setSchedules(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      toast.error('Gagal menghapus jadwal')
    }
  }

  const filtered = doctors.filter(d =>
    !search || d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Kelola Dokter" subtitle="Tambah, edit, dan kelola data dokter klinik">
        <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>Tambah Dokter</Button>
      </PageHeader>

      <Card className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text)' }} />
          <input type="text" placeholder="Cari dokter..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="text-center py-8"><p style={{ color: 'var(--text)' }}>Memuat data...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🩺</p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{search ? 'Tidak ada hasil' : 'Belum ada dokter'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Nama', 'Spesialisasi', 'Pengalaman', 'Status', 'Jadwal', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 px-3">
                      <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>{d.name}</p>
                      {d.title && <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>{d.title}</p>}
                    </td>
                    <td className="py-3 px-3 text-xs" style={{ color: 'var(--text)' }}>{d.specialty || '-'}</td>
                    <td className="py-3 px-3 text-xs" style={{ color: 'var(--text)' }}>{d.experience_yr} tahun</td>
                    <td className="py-3 px-3">
                      <button onClick={() => handleToggleActive(d)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        style={{
                          background: d.is_active ? 'var(--success-soft)' : 'var(--bg-raised)',
                          color: d.is_active ? 'var(--success)' : 'var(--text)',
                        }}>
                        {d.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {d.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={() => openSchedule(d)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        style={{ background: 'var(--info-soft)', color: 'var(--info)' }}>
                        Atur Jadwal
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text)' }} title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(d.id, d.name)} className="p-1.5 rounded-lg transition-colors hover:text-red-500" style={{ color: 'var(--text)' }} title="Hapus">
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

      {/* Modal Create/Edit Doctor */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Tambah Dokter' : 'Edit Dokter'} maxWidth="max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          <InputField label="Nama Dokter *" placeholder="cth. dr. Ayu Maharani, SpKK" value={form.name}
            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />
          <InputField label="Gelar / Title" placeholder="cth. Dokter Kepala & Dermatologis Senior" value={form.title}
            onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Spesialisasi" placeholder="cth. Dermatologi Estetika" value={form.specialty}
              onChange={(e) => setForm(p => ({ ...p, specialty: e.target.value }))} />
            <InputField label="Pengalaman (tahun)" type="number" min={0} value={form.experience_yr}
              onChange={(e) => setForm(p => ({ ...p, experience_yr: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
              placeholder="Latar belakang dan keahlian dokter..." rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
          </div>
          <InputField label="URL Foto (opsional)" placeholder="https://..." value={form.image_url}
            onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))} />
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

      {/* Modal Schedule */}
      <Modal isOpen={!!scheduleModal} onClose={() => setScheduleModal(null)} title={`Jadwal: ${scheduleModal?.name || ''}`} maxWidth="max-w-md">
        <div className="space-y-4">
          {/* Existing schedules */}
          {schedules.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Jadwal Saat Ini</p>
              {schedules.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>{dayNames[s.day_of_week]}</p>
                    <p className="text-xs" style={{ color: 'var(--text)' }}>{s.start_time?.slice(0,5)} - {s.end_time?.slice(0,5)}</p>
                  </div>
                  <button onClick={() => removeSchedule(s.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>Tambah Jadwal Baru</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-strong)' }}>Hari</label>
                <select value={scheduleForm.day_of_week} onChange={(e) => setScheduleForm(p => ({ ...p, day_of_week: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
                  {dayNames.map((name, i) => <option key={i} value={i}>{name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-strong)' }}>Jam Mulai</label>
                  <input type="time" value={scheduleForm.start_time} onChange={(e) => setScheduleForm(p => ({ ...p, start_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-strong)' }}>Jam Selesai</label>
                  <input type="time" value={scheduleForm.end_time} onChange={(e) => setScheduleForm(p => ({ ...p, end_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
                </div>
              </div>
              <Button variant="primary" onClick={addSchedule} className="w-full">Tambah Jadwal</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageDoctors
