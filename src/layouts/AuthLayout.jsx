import { Outlet } from 'react-router-dom'
import { Sparkles, Heart, Star } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const AuthLayout = () => {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Left Branding Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: theme === 'light'
            ? 'linear-gradient(135deg, #FDF0E8 0%, #F0D5C0 50%, #E8C4A8 100%)'
            : 'linear-gradient(135deg, #1C1C1C 0%, #252525 50%, #1a1a2e 100%)',
          borderRight: '1px solid var(--border)'
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-16 -left-8 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'var(--accent)' }} />
        <div className="absolute bottom-24 -right-12 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'var(--accent)' }} />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-lg)' }}>
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-3 tracking-tight"
            style={{ color: 'var(--text-heading)' }}>
            BeautyClinic
          </h1>
          <p className="text-lg text-center mb-10 max-w-sm"
            style={{ color: 'var(--text)' }}>
            Sistem Manajemen Klinik Kecantikan Modern
          </p>

          <div className="space-y-3 w-full max-w-sm">
            {[
              { icon: Heart,    title: 'Manajemen Pelanggan',   desc: 'Kelola data pasien dengan mudah' },
              { icon: Star,     title: 'Penjadwalan Otomatis',  desc: 'Atur janji temu dengan efisien' },
              { icon: Sparkles, title: 'Laporan & Analitik',    desc: 'Insight bisnis yang mendalam' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl p-4"
                style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-soft)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>{title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12"
        style={{ background: 'var(--bg-surface)' }}>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout