import { useState, useEffect } from 'react'
import {
  GripVertical,
  Phone,
  Clock,
  Hash,
  Eye,
  EyeOff,
  Ticket,
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { columnConfig } from '../../data/mockLeads'
import { useRole } from '../../context/RoleContext'
import { appointmentService } from '../../services/appointmentService'

// ─────────────────────────────────────────────────────────────
// UTILITAS SENSOR PRIVASI
// Mengubah nama asli menjadi format bintang.
// Contoh: "Amanda Putri Andini" → "A**** P**** A****"
// Hanya aktif di layer render Guest — data asli tidak dirusak.
// ─────────────────────────────────────────────────────────────
export function censorName(name) {
  if (!name || typeof name !== 'string') return '****'
  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 1) return word
      // Tampilkan huruf pertama, sensor sisanya dengan bintang
      return word[0] + '*'.repeat(word.length - 1)
    })
    .join(' ')
}

// Sensor nomor antrean: tampilkan hanya 2 karakter terakhir
// cth: "A-03" → "**03"
export function censorQueue(qNum) {
  if (!qNum) return '****'
  const str = String(qNum)
  if (str.length <= 2) return str
  return '*'.repeat(str.length - 2) + str.slice(-2)
}

// ─────────────────────────────────────────────────────────────
// KARTU LEADS — ADMIN VIEW
// Fitur penuh: nama asli, nilai uang, telepon, drag handle
// ─────────────────────────────────────────────────────────────
function AdminLeadCard({ lead, colKey, onDragStart, onDragOver, onDrop }) {
  return (
    <div
      className="rounded-xl p-4 mb-3 cursor-grab active:cursor-grabbing transition-all"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
      draggable
      onDragStart={(e) => onDragStart(e, lead.id, colKey)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, colKey)}
    >
      {/* Header kartu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar
            initials={lead.avatar}
            size="sm"
            index={parseInt(lead.id.replace(/\D/g, ''), 10) % 7}
          />
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text-heading)' }}
            >
              {lead.name}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text)' }}>
              {lead.service}
            </p>
          </div>
        </div>
        {/* Drag handle — hanya Admin */}
        <GripVertical
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: 'var(--border-strong)' }}
        />
      </div>

      {/* Info bawah */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {lead.value}
        </span>
        <span className="text-xs" style={{ color: 'var(--text)' }}>
          {lead.date}
        </span>
      </div>

      {/* Nomor antrean */}
      <div className="flex items-center gap-1 mt-2">
        <Hash className="w-3 h-3" style={{ color: 'var(--text)' }} />
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: 'var(--accent)' }}
        >
          {lead.queueNumber}
        </span>
      </div>

      {/* Telepon */}
      <div className="flex items-center gap-1 mt-1">
        <Phone className="w-3 h-3" style={{ color: 'var(--text)' }} />
        <span className="text-xs" style={{ color: 'var(--text)' }}>
          {lead.phone}
        </span>
      </div>

      <div className="mt-2">
        <Badge status={colKey}>{columnConfig[colKey].label}</Badge>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// KARTU ANTREAN — GUEST VIEW
// Privasi penuh: nama disensor, tanpa uang, tanpa telepon,
// tanpa drag handle, tanpa draggable.
// Identitas pasien dilindungi — hanya nomor antrean & layanan.
// ─────────────────────────────────────────────────────────────
function GuestQueueCard({ lead, colKey }) {
  const config = columnConfig[colKey]

  // Warna status card berdasarkan kolom
  const cardAccent = {
    konsultasi: { dot: 'var(--info)',    pulse: true },
    jadwal:     { dot: 'var(--warning)', pulse: false },
    pembayaran: { dot: 'var(--accent)',  pulse: true },
    selesai:    { dot: 'var(--success)', pulse: false },
  }[colKey] || { dot: 'var(--text)', pulse: false }

  return (
    <div
      className="rounded-xl p-4 mb-3 transition-all select-none"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid var(--border)`,
        boxShadow: 'var(--shadow-sm)',
        // Cursor default — tidak ada drag
        cursor: 'default',
      }}
      // draggable TIDAK dipasang — kartu tidak bisa digeser Guest
    >
      {/* Baris atas: nomor antrean + indikator status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Dot pulsating untuk status aktif */}
          <span className="relative flex h-2.5 w-2.5">
            {cardAccent.pulse && (
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: cardAccent.dot }}
              />
            )}
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ background: cardAccent.dot }}
            />
          </span>
          {/* Nomor antrean — tidak disensor, ini informasi publik
              yang diperlukan pasien untuk mengenali giliran mereka */}
          <span
            className="text-base font-bold font-mono tracking-wider"
            style={{ color: 'var(--text-heading)' }}
          >
            {lead.queueNumber}
          </span>
        </div>

        {/* Ikon EyeOff sebagai penanda privasi dilindungi */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: 'var(--bg-raised)' }}
          title="Data identitas dilindungi privasi"
        >
          <EyeOff className="w-3 h-3" style={{ color: 'var(--text)' }} />
          <span className="text-xs" style={{ color: 'var(--text)' }}>
            Privasi
          </span>
        </div>
      </div>

      {/* Nama TERSENSOR — huruf pertama setiap kata + bintang */}
      <p
        className="text-sm font-semibold mb-1 font-mono tracking-wide"
        style={{ color: 'var(--text-strong)' }}
      >
        {censorName(lead.name)}
      </p>

      {/* Jenis layanan — ini informasi publik, tidak disensor */}
      <p className="text-xs mb-3" style={{ color: 'var(--text)' }}>
        {lead.service}
      </p>

      {/* Estimasi waktu */}
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" style={{ color: 'var(--text)' }} />
        <span className="text-xs" style={{ color: 'var(--text)' }}>
          Estimasi:{' '}
          <span className="font-semibold" style={{ color: 'var(--text-strong)' }}>
            {lead.estimatedTime}
          </span>
        </span>
      </div>

      {/* Badge status ramah publik */}
      <div className="mt-2.5">
        <Badge status={colKey}>{config.guestLabel}</Badge>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// KOLOM KANBAN — ADMIN
// ─────────────────────────────────────────────────────────────
function AdminColumn({ colKey, leads, canEdit, onDragStart, onDragOver, onDrop, onDropColumn }) {
  const config = columnConfig[colKey]

  return (
    <div className="flex-1 min-w-[240px] max-w-[300px]">
      {/* Header kolom */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: config.color }}
          />
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--text-heading)' }}
          >
            {config.label}
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: 'var(--bg-raised)',
              color: 'var(--text)',
            }}
          >
            {leads.length}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className="rounded-xl p-2 min-h-[200px] transition-colors"
        style={{
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
        }}
        onDragOver={onDragOver}
        onDrop={(e) => onDropColumn(e, colKey)}
      >
        {leads.map((lead) => (
          <AdminLeadCard
            key={lead.id}
            lead={lead}
            colKey={colKey}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
        {leads.length === 0 && (
          <div
            className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text)' }}>
              Drop kartu di sini
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// KOLOM TRACKER ANTREAN — GUEST
// Tanpa drag-drop, tanpa nilai uang, tampilan kiosk publik
// ─────────────────────────────────────────────────────────────
function GuestQueueColumn({ colKey, leads }) {
  const config = columnConfig[colKey]

  return (
    <div className="flex-1 min-w-[220px] max-w-[280px]">
      {/* Header kolom — menggunakan guestLabel */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-base">{config.icon}</span>
        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--text-heading)' }}
        >
          {config.guestLabel}
        </h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-bold"
          style={{
            background: config.color + '22',
            color: config.color,
          }}
        >
          {leads.length}
        </span>
      </div>

      {/* Daftar kartu antrean */}
      <div
        className="rounded-xl p-2 min-h-[180px]"
        style={{
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
        }}
      >
        {leads.map((lead) => (
          <GuestQueueCard key={lead.id} lead={lead} colKey={colKey} />
        ))}
        {leads.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 gap-1">
            <Ticket className="w-5 h-5" style={{ color: 'var(--border-strong)' }} />
            <p className="text-xs" style={{ color: 'var(--text)' }}>
              Tidak ada antrean
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// KANBAN BOARD — KOMPONEN UTAMA YANG DIEKSPOR
// Menentukan Admin/Guest board berdasarkan role context
// ─────────────────────────────────────────────────────────────
const statusMap = {
  konsultasi: 'waiting',
  jadwal: 'confirmed',
  pembayaran: 'in_progress',
  selesai: 'completed',
}

const reverseStatusMap = {
  waiting: 'konsultasi',
  confirmed: 'jadwal',
  in_progress: 'pembayaran',
  completed: 'selesai',
}

// Fetch appointments from DB and map to leads format
async function fetchAppointmentsAsLeads(setLeads, role) {
  try {
    const appointments = await appointmentService.getAll()
    const grouped = { konsultasi: [], jadwal: [], pembayaran: [], selesai: [] }
    
    ;(appointments || []).forEach(a => {
      const stage = reverseStatusMap[a.status] || 'konsultasi'
      // Prevent duplicate entries (check if already in leads)
      const lead = {
        id: a.id || `apt-${Date.now()}`,
        name: a.guest_name || a.users?.name || 'Pasien',
        service: a.treatments?.name || 'Treatment',
        value: a.treatments ? `Rp ${a.treatments.price?.toLocaleString('id-ID')}` : 'Rp 0',
        phone: a.guest_phone || '-',
        date: a.appointment_date ? new Date(a.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '-',
        avatar: (a.guest_name || 'P').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        queueNumber: a.queue_number || '-',
        estimatedTime: a.appointment_time?.slice(0, 5) || '—',
        status: a.status,
        dbSynced: true,
      }
      grouped[stage].push(lead)
    })

    // Merge with existing in-memory leads (keep unsynced ones)
    setLeads(prev => {
      const merged = { ...grouped }
      Object.keys(prev).forEach(stage => {
        prev[stage].forEach(lead => {
          // Keep leads that don't have a DB ID (just created in-memory)
          if (!lead.id?.startsWith('apt-') && !grouped[stage].find(g => g.id === lead.id)) {
            merged[stage].push(lead)
          }
        })
      })
      return merged
    })
  } catch (err) {
    console.error('Gagal memuat appointments:', err)
  }
}

const KanbanBoard = ({ onAddLead }) => {
  const { role, leads, setLeads, can } = useRole()
  const isGuest = role === 'guest'
  const canEdit = can('view:leads:edit')

  // Fetch appointments from DB on mount (Admin only)
  useEffect(() => {
    if (!isGuest) {
      fetchAppointmentsAsLeads(setLeads, role)
    }
  }, [isGuest, setLeads, role])

  // State untuk drag-and-drop (hanya relevan untuk Admin)
  const [draggingId, setDraggingId] = useState(null)
  const [draggingFrom, setDraggingFrom] = useState(null)

  // ── Drag handlers (Admin only) ──
  const handleDragStart = (e, leadId, fromCol) => {
    setDraggingId(leadId)
    setDraggingFrom(fromCol)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDropColumn = (e, toCol) => {
    e.preventDefault()
    if (!draggingId || !draggingFrom || draggingFrom === toCol) {
      setDraggingId(null)
      setDraggingFrom(null)
      return
    }

    // Update DB
    const movingCard = leads[draggingFrom]?.find((l) => l.id === draggingId)
    if (movingCard?.dbSynced) {
      const newStatus = statusMap[toCol] || 'waiting'
      appointmentService.update(movingCard.id, { status: newStatus })
        .catch(err => console.error('Gagal update status:', err))
    }

    setLeads((prev) => {
      const movingCard = prev[draggingFrom]?.find((l) => l.id === draggingId)
      if (!movingCard) return prev

      return {
        ...prev,
        [draggingFrom]: prev[draggingFrom].filter((l) => l.id !== draggingId),
        [toCol]: [movingCard, ...prev[toCol]],
      }
    })

    setDraggingId(null)
    setDraggingFrom(null)
  }

  // ─── RENDER GUEST: Tracker Antrean ───
  if (isGuest) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(leads).map(([colKey, colLeads]) => (
          <GuestQueueColumn
            key={colKey}
            colKey={colKey}
            // Data real-time dari shared state — identik dengan yang dilihat Admin,
            // tetapi privasi diterapkan di layer render GuestQueueCard
            leads={colLeads}
          />
        ))}
      </div>
    )
  }

  // ─── RENDER ADMIN: Kanban Board ───
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Object.entries(leads).map(([colKey, colLeads]) => (
        <AdminColumn
          key={colKey}
          colKey={colKey}
          leads={colLeads}
          canEdit={canEdit}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDragOver}
          onDropColumn={handleDropColumn}
        />
      ))}
    </div>
  )
}

export default KanbanBoard