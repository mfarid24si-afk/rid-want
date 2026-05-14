import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Sparkles } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary-200">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-primary-500 mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="text-slate-500 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. 
          Silakan kembali ke halaman utama.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ke Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center gap-2"
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
