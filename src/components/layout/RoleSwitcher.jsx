import { Shield, Eye } from 'lucide-react'
import { useRole } from '../../context/RoleContext'

const RoleSwitcher = () => {
  const { role, toggleRole } = useRole()
  const isAdmin = role === 'admin'

  return (
    <button
      onClick={toggleRole}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: isAdmin ? 'var(--accent-soft)' : 'var(--info-soft)',
        color: isAdmin ? 'var(--accent)' : 'var(--info)',
        border: `1px solid ${isAdmin ? 'var(--accent)' : 'var(--info)'}`,
      }}
      title="Klik untuk beralih role (Admin / Guest)"
    >
      {isAdmin ? <Shield className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      <span className="hidden sm:block">{isAdmin ? 'Admin' : 'Guest'}</span>
    </button>
  )
}

export default RoleSwitcher