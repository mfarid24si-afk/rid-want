import React, { useState } from 'react'
import { Search, Bell, ChevronDown, LogOut, User, Settings, Menu, Sun, Moon, Shield } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: 'Janji temu baru', message: 'Sarah booking Facial Treatment', time: '5 menit lalu', unread: true },
    { id: 2, title: 'Pembayaran diterima', message: 'Invoice #INV-001 telah dibayar', time: '1 jam lalu', unread: true },
    { id: 3, title: 'Stok menipis', message: 'Serum Vitamin C tersisa 5 unit', time: '2 jam lalu', unread: false },
  ]

  const dropdownStyle = {
    background: 'var(--bg-raised)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-lg)',
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 gap-3"
      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>

      {/* Hamburger (mobile only) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl transition-colors"
        style={{ color: 'var(--text-strong)' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xs md:max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text)' }} />
          <input
            type="text"
            placeholder="Cari pelanggan, pesanan..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              color: 'var(--text-strong)',
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        
        {/* Tombol Admin Biru (RoleSwitcher) telah dihapus dari sini agar navigasi bersih */}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-all"
          style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            : <Moon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          }
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false) }}
            className="relative p-2 rounded-xl transition-colors"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
          >
            <Bell className="w-4 h-4" style={{ color: 'var(--text-strong)' }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: 'var(--danger)' }} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 py-2 z-50" style={dropdownStyle}>
              <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>Notifikasi</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id}
                    className="px-4 py-3 cursor-pointer transition-colors"
                    style={{ background: notif.unread ? 'var(--accent-soft)' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                    onMouseLeave={e => e.currentTarget.style.background = notif.unread ? 'var(--accent-soft)' : 'transparent'}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: notif.unread ? 'var(--accent)' : 'var(--border-strong)' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>{notif.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>{notif.message}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text)' }}>{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)' }}>
                <button className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  Lihat semua notifikasi
                </button>
              </div>
            </div>
          )}
        </div>          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false) }}
              className="flex items-center gap-2 p-1.5 pr-2 rounded-xl transition-all"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'var(--accent)' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-strong)' }}>
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[9px] mt-0.5 font-medium" style={{ color: 'var(--text)' }}>
                  Administrator
                </p>
              </div>
              <ChevronDown className="w-3 h-3" style={{ color: 'var(--text)' }} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-56 py-2 z-50" style={dropdownStyle}>
                {/* User info header */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>{user?.name || 'Admin'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>{user?.email || '-'}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Shield className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                      Administrator
                    </span>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setShowProfileMenu(false); navigate('/dashboard/settings') }}
                    className="flex items-center gap-3 px-4 py-2 w-full text-sm transition-colors"
                    style={{ color: 'var(--text-strong)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Settings className="w-4 h-4" style={{ color: 'var(--text)' }} />
                    Pengaturan
                  </button>
                </div>
                <hr style={{ borderColor: 'var(--border)', margin: '4px 0' }} />
                <button
                  onClick={() => { logout(); navigate('/', { replace: true }) }}
                  className="flex items-center gap-3 px-4 py-2 w-full text-sm transition-colors"
                  style={{ color: 'var(--danger)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
      </div>

      {/* Click outside overlay */}
      {(showNotifications || showProfileMenu) && (
        <div className="fixed inset-0 z-30"
          onClick={() => { setShowNotifications(false); setShowProfileMenu(false) }} />
      )}
    </header>
  )
}

export default Header
