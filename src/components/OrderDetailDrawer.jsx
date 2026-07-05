import { useState } from 'react'
import {
  Clock,
  Sparkles,
  MessageCircle,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Calendar,
  FileText,
} from 'lucide-react'
import Modal from './ui/Modal'
import Badge from './ui/Badge'
import Avatar from './ui/Avatar'
import { timelineData, tasksData } from '../data/mockTasks'

/* ── Helper: cocokkan nama customer dgn patient ── */
const matchPatient = (customerName, patientName) =>
  customerName.toLowerCase().includes(patientName.toLowerCase()) ||
  patientName.toLowerCase().includes(customerName.toLowerCase())

/* ── Icon map untuk event timeline ── */
const iconMap = {
  sparkles: Sparkles,
  message: MessageCircle,
  credit: CreditCard,
  alert: AlertCircle,
}

/* ── Style per tipe event ── */
const eventTypeStyle = {
  treatment: { color: 'var(--success)', bg: 'var(--success-soft)' },
  consultation: { color: 'var(--info)', bg: 'var(--info-soft)' },
  purchase: { color: 'var(--accent)', bg: 'var(--accent-soft)' },
  complaint: { color: 'var(--danger)', bg: 'var(--danger-soft)' },
}

/* ── Warna prioritas tugas ── */
const priorityColor = {
  high: 'var(--danger)',
  medium: 'var(--warning)',
  low: 'var(--success)',
}

const OrderDetailDrawer = ({ order, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('detail')

  if (!order) return null

  /* ── Filter data terkait customer ── */
  const patientTimeline = timelineData.filter((t) =>
    matchPatient(order.customer, t.patient)
  )

  const relatedTasks = tasksData.filter(
    (t) =>
      t.patient !== '-' &&
      matchPatient(order.customer, t.patient)
  )

  const statusLabel = {
    paid: 'Lunas',
    pending: 'Menunggu',
    cancelled: 'Dibatalkan',
    refunded: 'Dikembalikan',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-3xl">
      {/* ── Header Order ── */}
      <div className="mb-5">
        <p
          className="text-sm font-mono font-semibold mb-1"
          style={{ color: 'var(--accent)' }}
        >
          {order.id}
        </p>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
            {order.customer}
          </h2>
          {order.status === 'paid' && <Badge status="success">Lunas</Badge>}
          {order.status === 'pending' && <Badge status="pending">Menunggu</Badge>}
          {order.status === 'cancelled' && <Badge status="cancelled">Dibatalkan</Badge>}
          {order.status === 'refunded' && <Badge status="new">Dikembalikan</Badge>}
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'detail', label: '📄 Detail Pesanan' },
          { key: 'timeline', label: '📋 Riwayat Pasien' },
          { key: 'tasks', label: '✅ Tugas Terkait' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              activeTab === tab.key
                ? { background: 'var(--accent)', color: '#fff' }
                : {
                    background: 'var(--bg-raised)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 1 — DETAIL PESANAN */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'detail' && (
        <div className="space-y-4">
          {/* Layanan */}
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Layanan
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
              {order.service}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                  Tanggal
                </p>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                {order.date}
              </p>
              <p className="text-xs" style={{ color: 'var(--text)' }}>
                {order.time}
              </p>
            </div>

            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                  Pembayaran
                </p>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                {order.payment}
              </p>
              <p className="text-xs" style={{ color: 'var(--text)' }}>
                {statusLabel[order.status] || order.status}
              </p>
            </div>
          </div>

          {/* Total */}
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Total
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: 'var(--text-heading)' }}
            >
              {order.total}
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 2 — RIWAYAT PASIEN */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'timeline' && (
        <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1">
          {patientTimeline.length === 0 && (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: 'var(--bg-raised)' }}
            >
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                Belum ada riwayat untuk pasien ini.
              </p>
            </div>
          )}

          {patientTimeline.map((patient) => (
            <div key={patient.id}>
              {/* Timeline events */}
              <div className="relative">
                <div
                  className="absolute left-4 top-0 bottom-0 w-px"
                  style={{ background: 'var(--border)' }}
                />

                <div className="space-y-4">
                  {patient.events.map((event, ei) => {
                    const style = eventTypeStyle[event.type] || eventTypeStyle.consultation
                    const IconComp = iconMap[event.icon] || Sparkles

                    return (
                      <div key={ei} className="flex gap-4 pl-2">
                        {/* Dot + Icon */}
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center z-10 relative"
                            style={{
                              background: style.bg,
                              border: `2px solid ${style.color}`,
                            }}
                          >
                            <IconComp className="w-4 h-4" style={{ color: style.color }} />
                          </div>
                        </div>

                        {/* Content */}
                        <div
                          className="flex-1 pb-4"
                          style={{ borderBottom: '1px solid var(--border)' }}
                        >
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-xs font-mono"
                              style={{ color: 'var(--text)' }}
                            >
                              {event.date}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: style.bg, color: style.color }}
                            >
                              {event.type}
                            </span>
                          </div>
                          <h4
                            className="text-sm font-semibold mb-1"
                            style={{ color: 'var(--text-heading)' }}
                          >
                            {event.title}
                          </h4>
                          <p
                            className="text-xs leading-relaxed mb-1"
                            style={{ color: 'var(--text)' }}
                          >
                            {event.note}
                          </p>
                          <p
                            className="text-xs font-medium"
                            style={{ color: 'var(--accent)' }}
                          >
                            👤 {event.staff}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 3 — TUGAS TERKAIT */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'tasks' && (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {relatedTasks.length === 0 && (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: 'var(--bg-raised)' }}
            >
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                Tidak ada tugas terkait pasien ini.
              </p>
            </div>
          )}

          {relatedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-xl transition-all"
              style={{
                background: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                opacity: task.status === 'done' ? 0.6 : 1,
              }}
            >
              {/* Checkbox */}
              <div
                className="w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center"
                style={
                  task.status === 'done'
                    ? { background: 'var(--success)', border: '2px solid var(--success)' }
                    : {
                        border: '2px solid var(--border-strong)',
                        background: 'transparent',
                      }
                }
              >
                {task.status === 'done' && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: 'var(--text-heading)',
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>
                  👤 {task.assignee}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Clock className="w-3 h-3" style={{ color: 'var(--text)' }} />
                  <span className="text-xs" style={{ color: 'var(--text)' }}>
                    {task.dueTime}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: 'transparent',
                      color: priorityColor[task.priority],
                      border: `1px solid ${priorityColor[task.priority]}`,
                    }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>

              <Avatar initials={task.avatar} size="sm" index={task.id.charCodeAt(1) % 7} />
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default OrderDetailDrawer
