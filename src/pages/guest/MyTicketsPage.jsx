import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ticket, MessageCircle, AlertTriangle, CheckCircle2, Clock, Plus,
  ChevronRight, Mail, Phone, Send, ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { supportService } from '../../services/supportService'
import Button from '../../components/ui/Button'
import InputField from '../../components/ui/InputField'
import Modal from '../../components/ui/Modal'

const statusConfig = {
  open:            { label: 'Open',         color: 'var(--info)',     icon: '🟢' },
  in_progress:     { label: 'Diproses',    color: 'var(--warning)',  icon: '🔄' },
  waiting_customer:{ label: 'Menunggu Anda',color: 'var(--accent)',   icon: '⏳' },
  resolved:        { label: 'Selesai',     color: 'var(--success)',  icon: '✅' },
  closed:          { label: 'Ditutup',     color: 'var(--text)',     icon: '🔒' },
}

const MyTicketsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // Detail modal
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketDetail, setTicketDetail] = useState(null)
  const [messages, setMessages] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)

  // Create ticket modal
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ subject: '', description: '', category: 'general' })
  const [creating, setCreating] = useState(false)

  const fetchTickets = async () => {
    if (!user?.id) return
    try {
      const data = await supportService.getUserTickets(user.id)
      setTickets(data || [])
    } catch (err) {
      console.error('Gagal memuat tiket:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTickets() }, [user])

  const openDetail = async (ticket) => {
    setSelectedTicket(ticket)
    setDetailLoading(true)
    setNewMessage('')
    try {
      const [detail, msgs] = await Promise.all([
        supportService.getTicketById(ticket.id),
        supportService.getMessages(ticket.id),
      ])
      setTicketDetail(detail)
      setMessages(msgs || [])
    } catch (err) {
      console.error(err)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return
    setSendingMsg(true)
    try {
      await supportService.addMessage({
        ticketId: selectedTicket.id,
        userId: user.id,
        message: newMessage.trim(),
        isStaff: false,
      })
      setNewMessage('')
      const msgs = await supportService.getMessages(selectedTicket.id)
      setMessages(msgs || [])
    } catch (err) {
      toast.error('Gagal mengirim pesan')
    } finally {
      setSendingMsg(false)
    }
  }

  const handleCreate = async () => {
    if (!createForm.subject.trim()) {
      toast.error('Judul tiket wajib diisi')
      return
    }
    setCreating(true)
    try {
      await supportService.createTicket({
        subject: createForm.subject.trim(),
        description: createForm.description.trim(),
        category: createForm.category,
        user_id: user.id,
      })
      toast.success('Tiket berhasil dibuat! Tim kami akan merespon segera.')
      setShowCreate(false)
      setCreateForm({ subject: '', description: '', category: 'general' })
      fetchTickets()
    } catch (err) {
      toast.error('Gagal membuat tiket')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--info-soft)' }}>
            <MessageCircle className="w-6 h-6" style={{ color: 'var(--info)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-heading)' }}>Tiket Support Saya</h1>
            <p className="text-sm" style={{ color: 'var(--text)' }}>Pantau status bantuan & komplain Anda</p>
          </div>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreate(true)}>
          Tiket Baru
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Open', value: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length, color: 'var(--warning)' },
          { label: 'Selesai', value: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length, color: 'var(--success)' },
          { label: 'Total', value: tickets.length, color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center border"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <p className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* List Tiket */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8"><p style={{ color: 'var(--text)' }}>Memuat tiket...</p></div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl p-8 text-center border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <p className="text-4xl mb-3">🎫</p>
            <p className="font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Belum ada tiket support</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
              Jika ada masalah, jangan ragu untuk menghubungi kami melalui tiket support.
            </p>
            <Button variant="primary" icon={Plus} onClick={() => setShowCreate(true)}>
              Buat Tiket Baru
            </Button>
          </div>
        ) : (
          tickets.map(ticket => {
            const st = statusConfig[ticket.status] || statusConfig.open
            return (
              <div key={ticket.id}
                onClick={() => openDetail(ticket)}
                className="rounded-2xl p-5 border transition-all cursor-pointer"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{st.icon}</span>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>{ticket.subject}</h3>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text)' }}>
                      {ticket.description?.slice(0, 100)}...
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text)' }}>
                      <span style={{ color: st.color, fontWeight: 600 }}>{st.label}</span>
                      <span>·</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {ticket.resolved_at && (
                        <>
                          <span>·</span>
                          <span style={{ color: 'var(--success)' }}>Selesai: {new Date(ticket.resolved_at).toLocaleDateString('id-ID')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--text)' }} />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Detail Tiket Modal ── */}
      <Modal isOpen={!!selectedTicket} onClose={() => { setSelectedTicket(null); setTicketDetail(null); setMessages([]) }}
        title="Detail Tiket" maxWidth="max-w-lg">
        {detailLoading ? (
          <div className="text-center py-8"><p style={{ color: 'var(--text)' }}>Memuat detail...</p></div>
        ) : ticketDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{(statusConfig[ticketDetail.status] || statusConfig.open).icon}</span>
              <span className="text-sm font-semibold" style={{ color: (statusConfig[ticketDetail.status] || statusConfig.open).color }}>
                {(statusConfig[ticketDetail.status] || statusConfig.open).label}
              </span>
            </div>
            <h3 className="font-bold text-base" style={{ color: 'var(--text-heading)' }}>{ticketDetail.subject}</h3>
            {ticketDetail.description && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'var(--bg-raised)', color: 'var(--text)' }}>
                {ticketDetail.description}
              </div>
            )}

            {/* Messages */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>Percakapan ({messages.length})</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-3 pr-2">
                {messages.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text)' }}>
                    Belum ada percakapan. Tim kami akan merespon segera.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.is_staff ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.is_staff ? 'rounded-bl-md' : 'rounded-br-md'}`}
                        style={{
                          background: msg.is_staff ? 'var(--bg-raised)' : 'var(--accent-soft)',
                          border: `1px solid ${msg.is_staff ? 'var(--border)' : 'var(--accent)'}`,
                        }}>
                        <p className="font-semibold mb-1" style={{ color: msg.is_staff ? 'var(--text-strong)' : 'var(--accent)' }}>
                          {msg.is_staff ? 'Staff Skinova' : 'Anda'}
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
              {ticketDetail.status !== 'closed' && ticketDetail.status !== 'resolved' && (
                <div className="flex gap-2">
                  <input type="text" placeholder="Ketik pesan..." value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
                  <button onClick={handleSendMessage} disabled={sendingMsg || !newMessage.trim()}
                    className="p-2.5 rounded-xl transition-all"
                    style={{ background: 'var(--accent)', color: '#fff' }}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
              {(ticketDetail.status === 'closed' || ticketDetail.status === 'resolved') && (
                <p className="text-xs text-center py-2" style={{ color: 'var(--text)' }}>
                  Tiket ini sudah {(ticketDetail.status === 'closed' ? 'ditutup' : 'selesai')}.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Create Ticket Modal ── */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Buat Tiket Baru" maxWidth="max-w-md">
        <div className="space-y-4">
          <InputField label="Judul *" placeholder="Ringkasan masalah Anda..." value={createForm.subject}
            onChange={(e) => setCreateForm(p => ({ ...p, subject: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Kategori</label>
            <select value={createForm.category}
              onChange={(e) => setCreateForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
              <option value="general">Umum</option>
              <option value="complaint">Komplain</option>
              <option value="technical">Teknis</option>
              <option value="billing">Pembayaran</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-strong)' }}>Deskripsi</label>
            <textarea value={createForm.description}
              onChange={(e) => setCreateForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Jelaskan masalah Anda secara detail..." rows={4}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowCreate(false)} className="flex-1">Batal</Button>
            <Button variant="primary" onClick={handleCreate} disabled={creating} className="flex-1">
              {creating ? 'Membuat...' : 'Kirim'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MyTicketsPage
