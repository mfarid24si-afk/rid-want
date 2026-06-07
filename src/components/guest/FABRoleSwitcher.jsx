import { useState } from 'react'
import { Shield, Eye, ChevronUp, X } from 'lucide-react'
import { useRole } from '../../context/RoleContext'
import { useNavigate } from 'react-router-dom'

const FABRoleSwitcher = () => {
  const { role, toggleRole } = useRole()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [tooltip, setTooltip] = useState(false)

  const isAdmin = role === 'admin'

  const handleToggle = () => {
    toggleRole()
    // Redirect otomatis ke home masing-masing role
    if (isAdmin) {
      navigate('/portal')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div
      className="fixed z-[9999]"
      style={{ bottom: '24px', right: '24px' }}
    >
      {/* Tooltip info */}
      {tooltip && !expanded && (
        <div
          className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            color: 'var(--text-strong)',
          }}
        >
          🔧 Alat QA / Presentasi
        </div>
      )}

      {/* Panel expanded */}
      {expanded && (
        <div
          className="absolute bottom-full right-0 mb-3 p-3 rounded-2xl w-52"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header panel */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold" style={{ color: 'var(--text-heading)' }}>
              🔧 QA Role Switcher
            </p>
            <button
              onClick={() => setExpanded(false)}
              style={{ color: 'var(--text)' }}
              className="p-0.5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs mb-3" style={{ color: 'var(--text)' }}>
            Alat bantu presentasi & QA testing. Tidak terlihat di produksi.
          </p>

          {/* Indikator role aktif */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold mb-2"
            style={
              isAdmin
                ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }
                : { background: 'var(--info-soft)', color: 'var(--info)', border: '1px solid var(--info)' }
            }
          >
            {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Mode: {isAdmin ? 'Administrator' : 'Pasien / Guest'}</span>
          </div>

          {/* Tombol switch */}
          <button
            onClick={handleToggle}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: isAdmin ? 'var(--info-soft)' : 'var(--accent-soft)',
              color: isAdmin ? 'var(--info)' : 'var(--accent)',
              border: `1px solid ${isAdmin ? 'var(--info)' : 'var(--accent)'}`,
            }}
          >
            {isAdmin ? '👁️ Lihat sebagai Pasien' : '🛡️ Lihat sebagai Admin'}
          </button>
        </div>
      )}

      {/* FAB Button utama */}
      <button
        onClick={() => setExpanded((p) => !p)}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95"
        style={{
          background: isAdmin ? 'var(--accent)' : 'var(--info)',
          boxShadow: `0 4px 20px ${isAdmin ? 'var(--accent)' : 'var(--info)'}44`,
        }}
        aria-label="Buka panel role switcher"
        title="QA Role Switcher"
      >
        {expanded
          ? <ChevronUp className="w-5 h-5 text-white" />
          : isAdmin
            ? <Shield className="w-5 h-5 text-white" />
            : <Eye className="w-5 h-5 text-white" />
        }
      </button>
    </div>
  )
}

export default FABRoleSwitcher