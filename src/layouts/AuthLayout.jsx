import { Outlet } from 'react-router-dom'
import { Sparkles, Heart, Star } from 'lucide-react'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-primary-400 to-rose-400 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-4">
            BeautyClinic
          </h1>
          <p className="text-xl text-white/90 text-center mb-12 max-w-md">
            Sistem Manajemen Klinik Kecantikan Modern dan Elegan
          </p>

          {/* Features */}
          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Manajemen Pelanggan</h3>
                <p className="text-sm text-white/80">Kelola data pasien dengan mudah</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Penjadwalan Otomatis</h3>
                <p className="text-sm text-white/80">Atur janji temu dengan efisien</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Laporan Lengkap</h3>
                <p className="text-sm text-white/80">Analisis bisnis yang mendalam</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-xl">BeautyClinic</h1>
                <p className="text-xs text-slate-400">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
