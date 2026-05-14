import { Link } from 'react-router-dom'
import { Home, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react'

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary-200">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* Error Icon */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          Terjadi Kesalahan
        </h1>
        
        <p className="text-slate-500 mb-8">
          Maaf, terjadi kesalahan pada sistem kami. 
          Silakan coba muat ulang halaman atau kembali ke dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Muat Ulang
          </button>
          <Link
            to="/dashboard"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ke Dashboard
          </Link>
        </div>

        {/* Support Info */}
        <p className="text-sm text-slate-400 mt-8">
          Jika masalah terus berlanjut, hubungi{' '}
          <a href="mailto:support@beautyclinic.com" className="text-primary-600 hover:underline">
            support@beautyclinic.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default ErrorPage
