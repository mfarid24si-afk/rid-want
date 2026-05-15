import { Link } from 'react-router-dom'
import { Home, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react'

const ErrorPage = () => {
  return (
    // Latar belakang diubah menjadi hitam arang pekat (#1C1C1C)
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-6 text-zinc-100">
      <div className="text-center max-w-md">
        {/* Logo - Gradien disesuaikan menjadi abu-abu gelap metalik */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center mx-auto mb-8 shadow-md shadow-black/50">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* Error Icon - Menggunakan warna latar merah gelap transparan kontras rendah */}
        <div className="w-20 h-20 rounded-full bg-rose-950/40 border border-rose-800/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-100 mb-4">
          Terjadi Kesalahan
        </h1>
        
        <p className="text-zinc-400 mb-8">
          Maaf, terjadi kesalahan pada sistem kami. 
          Silakan coba muat ulang halaman atau kembali ke dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Tombol Muat Ulang menggunakan warna solid minimalis putih/terang */}
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-200 text-zinc-900 hover:bg-zinc-300 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Muat Ulang
          </button>
          
          {/* Tombol Ke Dashboard menggunakan gaya warna sekunder abu-abu gelap */}
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ke Dashboard
          </Link>
        </div>

        {/* Support Info - Tautan diubah menggunakan warna aksen biru langit cerah */}
        <p className="text-sm text-zinc-500 mt-8">
          Jika masalah terus berlanjut, hubungi{' '}
          <a href="mailto:support@beautyclinic.com" className="text-sky-400 hover:text-sky-300 hover:underline transition-colors">
            support@beautyclinic.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default ErrorPage
