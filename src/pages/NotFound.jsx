import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Sparkles } from 'lucide-react'

const NotFound = () => {
  return (
    // Latar belakang diubah menjadi hitam arang pekat (#1C1C1C)
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-6 text-zinc-100">
      <div className="text-center max-w-md">
        {/* Logo - Gradien disesuaikan menjadi abu-abu gelap metalik */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center mx-auto mb-8 shadow-md shadow-black/50">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* 404 Text - Menggunakan aksen warna biru langit cerah khas ByeWind */}
        <h1 className="text-8xl font-black text-sky-400 mb-4 tracking-tight">404</h1>
        
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="text-zinc-400 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. 
          Silakan kembali ke halaman utama.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Tombol Ke Dashboard menggunakan warna solid minimalis putih/terang */}
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-200 text-zinc-900 hover:bg-zinc-300 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ke Dashboard
          </Link>
          {/* Tombol Kembali menggunakan gaya warna sekunder abu-abu gelap */}
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
