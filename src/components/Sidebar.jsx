import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Calendar, 
  Package, 
  Settings, 
  Sparkles,
  LogOut
} from 'lucide-react'

const menuItems = [
  { 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Dashboard',
    exact: true 
  },
  { 
    path: '/dashboard/customers', 
    icon: Users, 
    label: 'Pelanggan' 
  },
  { 
    path: '/dashboard/orders', 
    icon: ShoppingBag, 
    label: 'Pesanan' 
  },
  { 
    path: '/dashboard/appointments', 
    icon: Calendar, 
    label: 'Janji Temu' 
  },
  { 
    path: '/dashboard/products', 
    icon: Package, 
    label: 'Produk' 
  },
]

const Sidebar = () => {
  return (
    // 1. Mengubah background aside menjadi warna hitam matte (#1C1C1C) dengan border zinc gelap
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1C1C1C] border-r border-zinc-800 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          {/* Mengubah warna aksen logo gradient dari pink ke abu-abu gelap metalik yang elegan */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center shadow-md shadow-black/50">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-zinc-100 text-lg">BeautyClinic</h1>
            <p className="text-xs text-zinc-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">
          Menu Utama
        </p>
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      // 2. Menu aktif menggunakan abu-abu arang (#282828) dengan teks putih terang
                      ? 'bg-zinc-800 text-white'
                      // Menu tidak aktif menggunakan abu-abu redup, hover berubah menjadi agak terang
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      className={`w-5 h-5 transition-colors ${
                        // 3. Ikon aktif berwarna putih, ikon tidak aktif berwarna abu-abu redup
                        isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`} 
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      // 4. Dot penanda aktif menggunakan aksen warna biru langit khas ByeWind
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">
            Pengaturan
          </p>
          <ul className="space-y-1.5">
            <li>
              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Settings className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`} />
                    <span>Pengaturan</span>
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Logout Button */}
      {/* 5. Mengubah pembatas bawah dan efek hover tombol keluar ke warna merah gelap transparan */}
      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-zinc-400 hover:bg-red-950/30 hover:text-red-400 transition-all duration-200 group">
          <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-400" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
