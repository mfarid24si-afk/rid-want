const variants = {
  // Status transaksi
  success:   { background: 'var(--success-soft)', color: 'var(--success)' },
  pending:   { background: 'var(--warning-soft)', color: 'var(--warning)' },
  failed:    { background: 'var(--danger-soft)',  color: 'var(--danger)' },
  cancelled: { background: 'var(--danger-soft)',  color: 'var(--danger)' },
  paid:      { background: 'var(--success-soft)', color: 'var(--success)' },

  // Status pelanggan
  active:    { background: 'var(--success-soft)', color: 'var(--success)' },
  inactive:  { background: 'var(--warning-soft)', color: 'var(--warning)' },
  vip:       { background: 'var(--accent-soft)',  color: 'var(--accent)' },

  // Segmentasi CRM
  loyal:     { background: 'var(--accent-soft)',  color: 'var(--accent)' },
  new:       { background: 'var(--info-soft)',     color: 'var(--info)' },
  'at-risk': { background: 'var(--danger-soft)',  color: 'var(--danger)' },

  // Membership Tier
  bronze:    { background: '#CD7F3222', color: '#CD7F32' },
  silver:    { background: '#C0C0C022', color: '#9CA3AF' },
  gold:      { background: '#FFD70022', color: '#FFD700' },

  // Kanban
  konsultasi:  { background: 'var(--info-soft)',    color: 'var(--info)' },
  jadwal:      { background: 'var(--warning-soft)', color: 'var(--warning)' },
  pembayaran:  { background: 'var(--accent-soft)',  color: 'var(--accent)' },
  selesai:     { background: 'var(--success-soft)', color: 'var(--success)' },
}

const Badge = ({ status, children, className = '' }) => {
  const style = variants[status] || variants.pending
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}

export default Badge