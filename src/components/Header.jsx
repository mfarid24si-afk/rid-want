import { useState } from 'react'
import { Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: 'Janji temu baru', message: 'Sarah booking Facial Treatment', time: '5 menit lalu', unread: true },
    { id: 2, title: 'Pembayaran diterima', message: 'Invoice #INV-001 telah dibayar', time: '1 jam lalu', unread: true },
    { id: 3, title: 'Stok menipis', message: 'Serum Vitamin C tersisa 5 unit', time: '2 jam lalu', unread: false },
  ]

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pelanggan, pesanan, atau produk..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all duration-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Notifikasi</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      notif.unread ? 'bg-primary-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-primary-500' : 'bg-slate-300'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Lihat semua notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">A</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-800">Admin Klinik</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
              <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-slate-50 transition-colors text-left">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">Profil Saya</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-slate-50 transition-colors text-left">
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">Pengaturan</span>
              </button>
              <hr className="my-2 border-slate-100" />
              <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-50 transition-colors text-left group">
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                <span className="text-sm text-slate-700 group-hover:text-red-600">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false)
            setShowProfileMenu(false)
          }}
        />
      )}
    </header>
  )
}

export default Header
