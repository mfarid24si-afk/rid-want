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
    // 1. Mengubah background header ke Hitam Charcoal (#1C1C1C / #202020) sesuai landasan dashboard
    <header className="h-16 bg-[#1C1C1C] border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari pelanggan, pesanan, atau produk..."
            // 2. Mengubah warna input field menjadi abu-abu gelap transparan/solid (#282828) dengan teks putih/terang
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-800/60 border border-transparent focus:bg-zinc-800 focus:border-zinc-700 outline-none text-sm transition-all duration-200 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            // 3. Mengubah efek hover tombol kontrol agar menyatu dengan mode gelap
            className="relative p-2 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <Bell className="w-5 h-5 text-zinc-300" />
            {/* Indikator unread disesuaikan dengan warna aksen biru muda grafik */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full"></span>
          </button>

          {showNotifications && (
            // 4. Panel dropdown menggunakan warna hitam pekat kontras tinggi (#252525) dengan border halus
            <div className="absolute right-0 top-12 w-80 bg-[#252525] rounded-2xl shadow-2xl border border-zinc-800 py-2 z-50">
              <div className="px-4 py-2 border-b border-zinc-800">
                <h3 className="font-semibold text-zinc-100">Notifikasi</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    // 5. Mengubah warna baris notifikasi aktif (unread) dan normal
                    className={`px-4 py-3 hover:bg-zinc-800/80 cursor-pointer transition-colors ${
                      notif.unread ? 'bg-sky-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-sky-400' : 'bg-zinc-600'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-200">{notif.title}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-zinc-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-zinc-800">
                <button className="text-sm text-sky-400 hover:text-sky-300 font-medium">
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
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            {/* 6. Mengubah warna background avatar inisial agar kontras dengan warna teks putih */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-zinc-100">A</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-zinc-200">Admin Klinik</p>
              <p className="text-xs text-zinc-500">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>

          {showProfileMenu && (
            // 7. Mengubah panel profil menu ke skema warna gelap yang senada
            <div className="absolute right-0 top-12 w-48 bg-[#252525] rounded-xl shadow-2xl border border-zinc-800 py-2 z-50">
              <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-zinc-800 transition-colors text-left">
                <User className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-300">Profil Saya</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-zinc-800 transition-colors text-left">
                <Settings className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-300">Pengaturan</span>
              </button>
              <hr className="my-2 border-zinc-800" />
              <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-950/30 transition-colors text-left group">
                <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
                <span className="text-sm text-zinc-300 group-hover:text-red-400">Keluar</span>
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
