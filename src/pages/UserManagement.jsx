import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { loginAPI } from '../services/LoginAPI'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import { useAuth } from '../context/AuthContext'

const UserManagement = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await loginAPI.fetchLogin()
      const data = Array.isArray(res) ? res : (res?.data || [])
      setUsers(data)
    } catch (err) {
      console.error('Gagal memuat data user:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreate = () => {
    setModalMode('create')
    setSelectedUser(null)
    setFormData({ name: '', email: '', password: '' })
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (u) => {
    setModalMode('edit')
    setSelectedUser(u)
    setFormData({ name: u.name || '', email: u.email || '', password: '' })
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')

    try {
      if (modalMode === 'create') {
        if (!formData.password || formData.password.length < 3) {
          setFormError('Password minimal 3 karakter')
          setSaving(false)
          return
        }
        await loginAPI.createLogin({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      } else {
        const updateData = { name: formData.name, email: formData.email }
        if (formData.password) updateData.password = formData.password
        await loginAPI.updateLogin(selectedUser.id, updateData)
      }
      setModalOpen(false)
      await fetchUsers()
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await loginAPI.deleteLogin(id)
      setDeleteConfirm(null)
      await fetchUsers()
    } catch (err) {
      console.error('Gagal menghapus:', err)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-heading)' }}>Manajemen Pengguna</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
            Total {users.length} akun terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:shadow-lg cursor-pointer"
          style={{ background: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text)' }} />
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: 'var(--text)' }}>Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: 'var(--text)' }}>
            {search ? 'Tidak ada hasil pencarian' : 'Belum ada pengguna'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text)' }}>Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text)' }}>Email</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text)' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'var(--accent)' }}>
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-semibold" style={{ color: 'var(--text-strong)' }}>{u.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text)' }}>{u.email}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          disabled={u.id === currentUser?.id}
                          className="p-2 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                          style={{ color: 'var(--text)' }}
                          title={u.id === currentUser?.id ? 'Tidak bisa edit akun sendiri' : 'Edit'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(u)}
                          disabled={u.id === currentUser?.id}
                          className="p-2 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-500 disabled:opacity-30 cursor-pointer"
                          style={{ color: 'var(--text)' }}
                          title={u.id === currentUser?.id ? 'Tidak bisa hapus akun sendiri' : 'Hapus'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}>
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs text-center font-bold">
              {formError}
            </div>
          )}
          <InputField label="Nama Lengkap" id="uname" type="text" placeholder="Nama pengguna" value={formData.name}
            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
          <InputField label="Email" id="uemail" type="email" placeholder="email@example.com" value={formData.email}
            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} required />
          <InputField label={modalMode === 'create' ? 'Password' : 'Password (kosongkan jika tidak diubah)'} id="upass" type="password" placeholder="Minimal 3 karakter" value={formData.password}
            onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} required={modalMode === 'create'} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)} className="flex-1">Batal</Button>
            <Button variant="primary" type="submit" disabled={saving} className="flex-1">
              {saving ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Konfirmasi Hapus" maxWidth="max-w-sm">
        {deleteConfirm && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>Hapus akun ini?</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text)' }}>
                  {deleteConfirm.name} ({deleteConfirm.email}) akan dihapus permanen.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" type="button" onClick={() => setDeleteConfirm(null)} className="flex-1">Batal</Button>
              <Button variant="primary" type="button" disabled={deleting} onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}>
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default UserManagement
