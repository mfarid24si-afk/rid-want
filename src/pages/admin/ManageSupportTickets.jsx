import { useState, useEffect } from 'react'
import {
  Ticket, MessageCircle, AlertCircle, CheckCircle2, Clock,
  Search, Plus, Filter, Send, ArrowUp, User, Phone, Mail,
  AlertTriangle, ThumbsUp, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Avatar from '../../components/ui/Avatar'
import InputField from '../../components/ui/InputField'
import { useRole } from '../../context/RoleContext'
import { useAuth } from '../../context/AuthContext'
import { supportService } from '../../services/supportService'
import { sendTicketNotification, sendComplaintNotification } from '../../services/notificationService'

const statusConfig = {
  open:            { label: 'Open',         color: 'var(--info)',     bg: 'var(--info-soft)' },
  in_progress:     { label: 'In Progress',  color: 'var(--warning)',  bg: 'var(--warning-soft)' },
  waiting_customer:{ label: 'Waiting',      color: 'var(--accent)',   bg: 'var(--accent-soft)' },
  resolved:        { label: 'Resolved',     color: 'var(--success)',  bg: 'var(--success-soft)' },
  closed:          { label: 'Closed',       color: 'var(--text)',     bg: 'var(--bg-raised)' },
}

const priorityConfig = {
  low:    { label: 'Low',    color: 'var(--success)' },
  medium: { label: 'Medium', color: 'var(--warning)' },
  high:   { label: 'High',   color: 'var(--danger)'  },
  urgent: { label: 'Urgent', color: '#DC2626' },
}

const categoryConfig = {
  general:   { label: 'Umum',        icon: MessageCircle },
  complaint: { label: 'Komplain',    icon: AlertTriangle },
  technical: { label: 'Teknis',      icon: AlertCircle },
  billing:   { label: 'Pembayaran',  icon: Clock },
  feedback:  { label: 'Feedback',    icon: ThumbsUp },
  other:     { label: 'Lainnya',     icon: Ticket },
}

const ManageSupportTickets = () => {
  const { can } = useRole()
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  // Modal
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketDetail, setTicketDetail] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  // Create ticket modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    subject: '', description: '', category: 'general', priority: 'medium',
  })
  const [creating, setCreating] = useState(false)

  // Complaint modal
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [complaintForm, setComplaintForm] = useState({
    title: '', description: '', severity: 'medium', appointment_id: '',
  })
  const [creatingComplaint, setCreatingComplaint] = useState(false)

  const fetchTickets = async () => {
    try {
      const data = await supportService.getTickets({
        status: filterStatus,
        priority: filterPriority,
      })
      setTickets(data || [])
    } catch (err) {
      console.error('Gagal memuat tiket:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTickets() }, [filterStatus, filterPriority])

  const openDetail = async (ticket) => {
    setSelectedTicket(ticket)
    setDetailLoading(true)
    try {
      const [detail, msgs] = await Promise.all([
        supportService.getTicketById(ticket.id),
        supportService.getMessages(ticket.id),
      ])
      setTicketDetail(detail)
      setMessages(msgs || [])
    } catch (err) {
      console.error('Gagal memuat detail tiket:', err)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    setSendingMsg(true)
    try {
      await supportService.addMessage({
        ticketId: selectedTicket.id,
        userId: user?.id,
        message: newMessage.trim(),
        isStaff: true,
      })
      setNewMessage('')
      // Reload messages
      const msgs = await supportService.getMessages(selectedTicket.id)
      setMessages(msgs || [])
    } catch (err) {
      toast.error('Gagal mengirim pesan')
    } finally {
      setSendingMsg(false)
    }
  }

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const updated = await supportService.updateTicket(ticketId, { status: newStatus })
      setTicketDetail(updated)
      await sendTicketNotification(ticketId, updated.user_id, updated.subject, newStatus)
      toast.success(`Status tiket diubah ke ${statusConfig[newStatus]?.label}`)
      fetchTickets()
    } catch (err) {
      toast.error('Gagal mengubah status')
    }
  }

  const handleCreateTicket = async () => {
    if (!createForm.subject.trim()) {
      toast.error('Judul tiket wajib diisi')
      return
    }
    setCreating(true)
    try {
      const ticket = await supportService.createTicket({
        subject: createForm.subject.trim(),
        description: createForm.description.trim(),
        category: createForm.category,
        priority: createForm.priority,
        user_id: user?.id,
      })
      await sendTicketNotification(ticket.id, ticket.user_id, ticket.subject, 'open')
      toast.success('Tiket support berhasil dibuat!')
      setShowCreateModal(false)
      setCreateForm({ subject: '', description: '', category: 'general', priority: 'medium' })
      fetchTickets()
    } catch (err) {
      toast.error('Gagal membuat tiket')
    } finally {
      setCreating(false)
    }
  }

  const handleCreateComplaint = async () => {
    if (!complaintForm.title.trim()) {
      toast.error('Judul komplain wajib diisi')
      return
    }
    setCreatingComplaint(true)
    try {
      // Buat tiket dulu
      const ticket = await supportService.createTicket({
        subject: `[Komplain] ${complaintForm.title.trim()}`,
        description: complaintForm.description.trim(),
        category: 'complaint',
        priority: complaintForm.severity === 'critical' ? 'urgent' : complaintForm.severity,
        user_id: user?.id,
      })
      // Buat complaint record
      await supportService.createComplaint({
        ticket_id: ticket.id,
        title: complaintForm.title.trim(),
        description: complaintForm.description.trim(),
        severity: complaintForm.severity,
        status: 'open',
        user_id: user?.id,
        appointment_id: complaintForm.appointment_id || null,
      })
      await sendComplaintNotification(user?.id, complaintForm.title, 'open')
      toast.success('Komplain berhasil dilaporkan! Tim kami akan menanganinya.')
      setShowComplaintModal(false)
      setComplaintForm({ title: '', description: '', severity: 'medium', appointment_id: '' })
      fetchTickets()
    } catch (err) {
      toast.error('Gagal membuat komplain')
    } finally {
      setCreatingComplaint(false)
    }
  }

  const filtered = tickets.filter(t =>
    !search ||
    t.subject?.toLowerCase().includes(search.toLowerCase()) ||
    t.users?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  }

  return (
    <div>
      <PageHeader title="Customer Support" subtitle="Kelola tiket layanan, komplain, dan feedback pelanggan">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={AlertTriangle} onClick={() => setShowComplaintModal(true)}>
            Laporkan Komplain
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)}>
            Tiket Baru
          </Button>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Tiket Open', value: stats.open, color: 'var(--info)', bg: 'var(--info-soft)' },
          { label: 'In Progress', value: stats.in_progress, color: 'var(--warning)', bg: 'var(--warning-soft)' },
          { label: 'Resolved', value: stats.resolved, color: 'var(--success)', bg: 'var(--success-soft)' },
        ].map(s => (
          <Card key={s.label} className="text-center !py-4">
            <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text)' }} />
            <input
              type="text" placeholder="Cari tiket atau pelanggan..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
              <button key={s}
                onClick={() => setFilterStatus(s)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize"
                style={filterStatus === s
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { background: 'var(--bg-raised)', color: 'var(--text)', border: '1px solid var(--border)' }
                }>
                {s === 'all' ? 'Semua' : statusConfig[s]?.label || s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Ticket List */}
      <Card>
        {loading ? (
          <div className="text-center py-8"><p style={{ color: 'var(--text)' }}>Memuat tiket...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🎫</p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>Belum ada tiket support</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((ticket) => {
              const st = statusConfig[ticket.status] || statusConfig.open
              const pr = priorityConfig[ticket.priority] || priorityConfig.medium
              const cat = categoryConfig[ticket.category] || categoryConfig.general
              const CatIcon = cat.icon

              return (
                <div key={ticket.id}
                  onClick={() => openDetail(ticket)}
                  className="p-4 rounded-xl transition-all cursor-pointer flex items-start gap-4"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: st.bg }}>
                    <CatIcon className="w-5 h-5" style={{ color: st.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>
                        {ticket.subject}
                      </h4>
                      <Badge status={ticket.status === 'open' ? 'pending' : ticket.status === 'resolved' ? 'success' : 'paid'}>
                        {st.label}
                      </Badge>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                        style={{ background: `${pr.color}15`, color: pr.color }}>
                        {pr.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--text)' }}>
                      <span>{ticket.users?.name || 'Unknown'}</span>
                      {ticket.users?.email && (
                        <>
                          <span>·</span>
                          <span>{ticket.users.email}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {ticket.assigned_to && (
                      <Avatar initials={ticket.assignee?.name?.charAt(0) || 'S'} size="sm" index={0} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* ── DETAIL MODAL ── */}
      <Modal isOpen={!!selectedTicket} onClose={() => { setSelectedTicket(null); setTicketDetail(null); setMessages([]) }}
        title="Detail Tiket Support" maxWidth="max-w-2xl">
        {detailLoading ? (
          <div className="text-center py-8"><p style={{ color: 'var(--text)' }}>Memuat detail...</p></div>
        ) : ticketDetail && (
          <div className="space-y-4">
            {/* Status actions */}
            <div className="flex gap-2 flex-wrap">
              {['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'].map(s => (
                <button key={s}
                  onClick={() => handleUpdateStatus(ticketDetail.id, s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={ticketDetail.status === s
                    ? { background: statusConfig[s]?.bg || 'var(--bg-raised)', color: statusConfig[s]?.color || 'var(--text)', border: `1px solid ${statusConfig[s]?.color || 'var(--border)'}` }
                    : { background: 'var(--bg-raised)', color: 'var(--text)', border: '1px solid var(--border)' }
                  }>
                  {statusConfig[s]?.label || s}
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-raised)' }}>
                <p style={{ color: 'var(--text)' }}>Pelanggan</p>
                <p className="font-semibold mt-1" style={{ color: 'var(--text-strong)' }}>
                  {ticketDetail.users?.name || '-'}
                </p>
                {ticketDetail.users?.email && (
                  <p className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--text)' }}>
                    <Mail className="w-3 h-3" /> {ticketDetail.users.email}
                  </p>
                )}
                {ticketDetail.users?.phone && (
                  <p className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--text)' }}>
                    <Phone className="w-3 h-3" /> {ticketDetail.users.phone}
                  </p>
                )}
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-raised)' }}>
                <p style={{ color: 'var(--text)' }}>Informasi Tiket</p>
                <p className="font-semibold mt-1" style={{ color: 'var(--text-strong)' }}>
                  Kategori: {categoryConfig[ticketDetail.category]?.label || ticketDetail.category}
                </p>
                <p style={{ color: 'var(--text)' }}>
                  Priority: {priorityConfig[ticketDetail.priority]?.label || ticketDetail.priority}
                </p>
                <p style={{ color: 'var(--text)' }}>
                  Dibuat: {new Date(ticketDetail.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Description */}
            {ticketDetail.description && (
              <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ background: 'var(--bg-raised)', color: 'var(--text)' }}>
                <strong style={{ color: 'var(--text-strong)' }}>Deskripsi:</strong>
                <p className="mt-1">{ticketDetail.description}</p>
              </div>
            )}

            {/* Messages */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                <MessageCircle className="w-4 h-4" /> Percakapan ({messages.length})
              </h4>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-3 pr-2">
                {messages.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text)' }}>
                    Belum ada percakapan. Kirim pesan pertama untuk merespon tiket ini.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id}
                      className={`flex ${msg.is_staff ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.is_staff ? 'rounded-br-md' : 'rounded-bl-md'}`}
                        style={{
                          background: msg.is_staff ? 'var(--accent-soft)' : 'var(--bg-raised)',
                          border: `1px solid ${msg.is_staff ? 'var(--accent)' : 'var(--border)'}`,
                        }}>
                        <p className="font-semibold mb-1" style={{ color: msg.is_staff ? 'var(--accent)' : 'var(--text-strong)' }}>
                          {msg.is_staff ? 'Staff' : msg.users?.name || 'Pelanggan'}
                        </p>
                        <p style={{ color: 'var(--text)' }}>{msg.message}</p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text)' }}>
                          {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Send message */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik pesan balasan..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
                />
                <button onClick={handleSendMessage} disabled={sendingMsg || !newMessage.trim()}
                  className="p-2.5 rounded-xl transition-all"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── CREATE TICKET MODAL ── */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Buat Tiket Baru" maxWidth="max-w-md">
        <div className="space-y-4">
          <InputField label="Judul *" placeholder="Ringkasan masalah..." value={createForm.subject}
            onChange={(e) => setCreateForm(p => ({ ...p, subject: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Kategori</label>
            <select value={createForm.category}
              onChange={(e) => setCreateForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
              {Object.entries(categoryConfig).map(([key, cat]) => (
                <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Prioritas</label>
            <select value={createForm.priority}
              onChange={(e) => setCreateForm(p => ({ ...p, priority: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
              {Object.entries(priorityConfig).map(([key, pr]) => (
                <option key={key} value={key}>{pr.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Deskripsi</label>
            <textarea value={createForm.description}
              onChange={(e) => setCreateForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Jelaskan masalah yang dialami..." rows={4}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">Batal</Button>
            <Button variant="primary" onClick={handleCreateTicket} disabled={creating} className="flex-1">
              {creating ? 'Membuat...' : 'Buat Tiket'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── COMPLAINT MODAL ── */}
      <Modal isOpen={showComplaintModal} onClose={() => setShowComplaintModal(false)}
        title="Laporkan Komplain" maxWidth="max-w-md">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)' }}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>Komplain akan segera ditangani</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>
                Tim support kami akan merespon dalam 1×24 jam. Pastikan data Anda benar.
              </p>
            </div>
          </div>

          <InputField label="Judul Komplain *" placeholder="Ringkasan masalah..." value={complaintForm.title}
            onChange={(e) => setComplaintForm(p => ({ ...p, title: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Tingkat Keparahan</label>
            <select value={complaintForm.severity}
              onChange={(e) => setComplaintForm(p => ({ ...p, severity: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
              <option value="low">Rendah — Masalah kecil</option>
              <option value="medium">Sedang — Mengganggu kenyamanan</option>
              <option value="high">Tinggi — Memerlukan tindakan segera</option>
              <option value="critical">Kritis — Darurat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Deskripsi Detail</label>
            <textarea value={complaintForm.description}
              onChange={(e) => setComplaintForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Jelaskan kronologi kejadian secara detail..." rows={5}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowComplaintModal(false)} className="flex-1">Batal</Button>
            <Button variant="primary" onClick={handleCreateComplaint} disabled={creatingComplaint}
              className="flex-1" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}>
              {creatingComplaint ? 'Mengirim...' : 'Laporkan Komplain'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageSupportTickets
