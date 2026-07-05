import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Info,
  Stethoscope,
  Tag,
  CalendarPlus,
  ListOrdered,
  Gift,
  Ticket,
  History,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

// Navigasi murni pasien — zero istilah CRM/bisnis internal
const navItems = [
  { path: '/portal',           label: 'Beranda',    icon: Home,          exact: true },
  { path: '/portal/services',  label: 'Layanan',    icon: Stethoscope },
  { path: '/portal/promo',     label: 'Promo',      icon: Tag },
  { path: '/portal/tracking',  label: 'Antrean',    icon: ListOrdered },
  { path: '/portal/booking',   label: 'Booking',    icon: CalendarPlus },
  { path: '/portal/about',     label: 'Tentang',    icon: Info },
]

// Navigasi akun pasien (dropdown/mobile section)
const accountItems = [
  { path: '/portal/me',       label: 'Dashboard Saya', icon: LayoutDashboard },
  { path: '/portal/loyalty',  label: 'Poin Reward',    icon: Gift },
  { path: '/portal/voucher',  label: 'Voucher Saya',   icon: Ticket },
  { path: '/portal/history',  label: 'Riwayat',        icon: History },
]

const GuestNavbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
    setAccountOpen(false)
    setMobileOpen(false)
  }

  const activeStyle = { color: 'var(--accent)', fontWeight: '600' }
  const inactiveStyle = { color: 'var(--text)' }

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <button
            onClick={() => navigate('/portal')}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent)' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p
                className="font-bold text-base leading-none"
                style={{ color: 'var(--text-heading)' }}
              >
                Skinova
              </p>
              <p className="text-xs" style={{ color: 'var(--text)' }}>
                Klinik Kecantikan &amp; Estetika
              </p>
            </div>
          </button>

          {/* ── Nav Desktop ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={({ isActive }) => isActive ? activeStyle : inactiveStyle}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all"
              style={{
                background: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                color: 'var(--text-strong)',
              }}
              aria-label="Ganti tema"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                : <Moon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              }
            </button>

            {/* Akun Pasien dropdown — desktop */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setAccountOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                }}
              >
                <LayoutDashboard className="w-4 h-4" />
                Akun Saya
              </button>

              {accountOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAccountOpen(false)}
                  />
                  <div
                    className="absolute right-0 top-12 w-52 py-2 z-50 rounded-2xl"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    {accountItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        style={({ isActive }) => ({
                          color: isActive ? 'var(--accent)' : 'var(--text-strong)',
                          background: isActive ? 'var(--accent-soft)' : 'transparent',
                          fontWeight: isActive ? '600' : '400',
                        })}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </NavLink>
                    ))}
                    <hr style={{ borderColor: 'var(--border)', margin: '4px 8px' }} />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-sm transition-colors"
                      style={{ color: 'var(--danger)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden p-2 rounded-xl"
              style={{ color: 'var(--text-strong)' }}
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Buka menu"
            >
              {mobileOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div
            className="lg:hidden pb-4 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <nav className="pt-3 space-y-1">
              <p
                className="text-xs font-semibold uppercase tracking-wider px-3 pb-1"
                style={{ color: 'var(--text)' }}
              >
                Navigasi
              </p>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={({ isActive }) => isActive ? activeStyle : inactiveStyle}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}

              <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <p
                  className="text-xs font-semibold uppercase tracking-wider px-3 pb-1 pt-2"
                  style={{ color: 'var(--text)' }}
                >
                  Akun Saya
                </p>
                {accountItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={({ isActive }) => isActive ? activeStyle : inactiveStyle}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all"
                  style={{ color: 'var(--danger)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default GuestNavbar