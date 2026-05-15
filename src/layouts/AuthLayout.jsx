import { Outlet } from 'react-router-dom'
import { Sparkles, Heart, Star } from 'lucide-react'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-[#1C1C1C]">
      {/* Sisi Kiri - Branding (Tetap Elegan, Kontras Sempurna) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1C1C1C] via-zinc-800 to-zinc-900 relative overflow-hidden border-r border-zinc-800/80">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-zinc-400"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-zinc-400"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-zinc-100" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-4 text-white tracking-tight">
            BeautyClinic
          </h1>
          <p className="text-xl text-zinc-300 text-center mb-12 max-w-md">
            Sistem Manajemen Klinik Kecantikan Modern dan Elegan
          </p>

          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center gap-4 bg-zinc-800/50 border border-zinc-800 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center text-sky-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Manajemen Pelanggan</h3>
                <p className="text-sm text-zinc-400">Kelola data pasien dengan mudah</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-800/50 border border-zinc-800 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center text-sky-400">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Penjadwalan Otomatis</h3>
                <p className="text-sm text-zinc-400">Atur janji temu dengan efisien</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-800/50 border border-zinc-800 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center text-sky-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Laporan Lengkap</h3>
                <p className="text-sm text-zinc-400">Analisis bisnis yang mendalam</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sisi Kanan - Kontainer Form Terang & Jelas */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#1C1C1C]">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
