import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  GitBranch,
  Users2,
  Sparkles,
  LogOut,
  X,
  Settings,
  MessageCircle,
  Mail,
  // ── Icon untuk Guest menu ──
  Stethoscope,
  ListOrdered,
  ClipboardPen,
  Tag,
} from 'lucide-react'
import { useRole } from '../../context/RoleContext'
import { useAuth } from '../../context/AuthContext'

// ─────────────────────────────────────────────────────────────
// MENU ADMIN — Penuh akses, istilah teknis bisnis
// ─────────────────────────────────────────────────────────────
const adminMenuItems = [
  {
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    permission: 'view:dashboard',
    exact: true,
  },
  {
    path: '/dashboard/analytics',
    icon: BarChart3,
    label: 'Analitik CRM',
    permission: 'view:analytics',
  },
  {
    path: '/dashboard/leads',
    icon: GitBranch,
    label: 'Sales Pipeline',
    permission: 'view:leads',
  },
  {
    path: '/dashboard/customers',
    icon: Users,
    label: 'Pelanggan',
    permission: 'view:customers',
  },
  {
    path: '/dashboard/orders',
    icon: ShoppingBag,
    label: 'Pesanan',
    permission: 'view:orders',
  },
  {
    path: '/dashboard/support',
    icon: MessageCircle,
    label: 'Support Tickets',
    permission: 'view:support',
  },
  {
    path: '/dashboard/email-marketing',
    icon: Mail,
    label: 'Email Marketing',
    permission: 'view:email_marketing',
  },
  {
    path: '/dashboard/collaboration',
    icon: Users2,
    label: 'Kolaborasi Tim',
    permission: 'view:collaboration',
  },
  {
    path: '/dashboard/users',
    icon: Users,
    label: 'Manajemen Akun',
    permission: 'view:users',
  },
  {
    path: '/dashboard/treatments',
    icon: Sparkles,
    label: 'Treatment',
    permission: 'view:treatments',
  },
  {
    path: '/dashboard/doctors',
    icon: Stethoscope,
    label: 'Dokter',
    permission: 'view:doctors',
  },
  {
    path: '/dashboard/promotions',
    icon: Tag,
    label: 'Promo & Voucher',
    permission: 'view:promotions',
  },
  {
    path: '/dashboard/setup',
    icon: Settings,
    label: 'Database Setup',
    permission: 'view:setup',
  },
]

// ─────────────────────────────────────────────────────────────
// MENU GUEST — Ramah publik, zero istilah internal bisnis
// Tidak ada: omset, rekam medis, transaksi, delegasi tugas
// ─────────────────────────────────────────────────────────────
const guestMenuItems = [
  {
    path: '/dashboard/leads',
    icon: ListOrdered,
    label: 'Tracker Antrean',
    permission: 'view:queue',
    exact: false,
  },
  {
    path: '/dashboard/catalog',
    icon: Stethoscope,
    label: 'Katalog Layanan',
    permission: 'view:catalog',
  },
  {
    path: '/dashboard/register',
    icon: ClipboardPen,
    label: 'Pendaftaran Mandiri',
    permission: 'view:register',
  },
]

// ─────────────────────────────────────────────────────────────
// KOMPONEN
// ─────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose }) => {
  const { can, role } = useRole()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const isGuest = role === 'guest'

  // Pilih menu set berdasarkan role — tidak ada overlap
  const rawMenu = isGuest ? guestMenuItems : adminMenuItems

  // Filter lebih lanjut berdasarkan permission granular
  const visibleMenu = rawMenu.filter((item) => can(item.permission))

  const activeStyle = {
    background: 'var(--accent-soft)',
    color: 'var(--accent)',
  }
  const inactiveStyle = {
    color: 'var(--text)',
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-64 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="p-5 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent)' }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1
              className="font-bold text-base leading-tight truncate"
              style={{ color: 'var(--text-heading)' }}
            >
              Skinova
            </h1>
            {/* Teks sub-judul berbeda per role */}
            <p className="text-xs truncate" style={{ color: 'var(--text)' }}>
              {isGuest ? 'Portal Pasien' : 'Admin CRM'}
            </p>
          </div>
        </div>

        {/* Tombol tutup sidebar — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg flex-shrink-0 ml-2"
          style={{ color: 'var(--text)' }}
          aria-label="Tutup menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Badge status role — pengingat visual yang jelas ── */}
      <div className="px-4 pt-4 pb-0">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
          style={
            isGuest
              ? {
                  background: 'var(--info-soft)',
                  color: 'var(--info)',
                  border: '1px solid var(--info)',
                }
              : {
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                }
          }
        >
          <span>{isGuest ? '👁️' : '🛡️'}</span>
          <span>{isGuest ? 'Mode Tamu / Pasien' : 'Mode Administrator'}</span>
        </div>
      </div>

      {/* ── Navigasi utama ── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
          style={{ color: 'var(--text)' }}
        >
          {isGuest ? 'Layanan Pasien' : 'Menu CRM'}
        </p>

        <ul className="space-y-1">
          {visibleMenu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isActive ? 'var(--accent)' : 'var(--text)' }}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--accent)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Pengaturan — hanya Admin */}
        {!isGuest && (
          <div className="mt-6">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
              style={{ color: 'var(--text)' }}
            >
              Pengaturan
            </p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/dashboard/settings"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                >
                  {({ isActive }) => (
                    <>
                      <Settings
                        className="w-4 h-4"
                        style={{ color: isActive ? 'var(--accent)' : 'var(--text)' }}
                      />
                      <span>Pengaturan</span>
                    </>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {/* Panduan singkat untuk Guest */}
        {isGuest && (
          <div
            className="mt-6 mx-1 p-3 rounded-xl text-xs leading-relaxed"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            <p className="font-semibold mb-1" style={{ color: 'var(--text-strong)' }}>
              💡 Panduan Pasien
            </p>
            <p>
              Pantau status antrean Anda secara real-time, atau daftarkan diri
              untuk konsultasi gratis tanpa perlu membuat akun.
            </p>
          </div>
        )}
      </nav>

      {/* ── Tombol Keluar ── */}
      <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => {
            logout()
            navigate('/', { replace: true })
            onClose()
          }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all"
          style={{ color: 'var(--text)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--danger-soft)'
            e.currentTarget.style.color = 'var(--danger)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text)'
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>{isGuest ? 'Keluar dari Portal' : 'Keluar'}</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar