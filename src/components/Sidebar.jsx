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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg">BeautyClinic</h1>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
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
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-600'
                      }`} 
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Pengaturan
          </p>
          <ul className="space-y-1.5">
            <li>
              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                <span>Pengaturan</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
