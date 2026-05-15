import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const Forgot = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  // TAMPILAN JIKA EMAIL SUDAH TERKIRIM
  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        {/* Mengubah background sukses menjadi emerald gelap transparan khas dark mode */}
        <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-800/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Email Terkirim!</h2>
        <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
          Kami telah mengirim link reset password ke <strong className="text-zinc-200">{email}</strong>. Silakan cek inbox atau folder spam Anda.
        </p>
        {/* Tombol sekunder diubah menjadi abu-abu gelap minimalis */}
        <Link
          to="/auth/login"
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Login
        </Link>
      </div>
    )
  }

  // TAMPILAN FORM UTAMA
  return (
    <div>
      <Link 
        to="/auth/login" 
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Login
      </Link>

      {/* Header Judul - Diperjelas dengan text-white murni */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Lupa Password?</h2>
        <p className="text-zinc-400 text-sm mt-2">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          {/* Label diubah menjadi text-zinc-300 agar terlihat tegas */}
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Email Admin
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            {/* Input field menggunakan background zinc gelap dengan teks putih cerah */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@beautyclinic.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Tombol Submit - Diubah menjadi Solid Putih/Terang Minimalis sesuai tema ByeWind */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors cursor-pointer text-sm"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin"></div>
              <span>Mengirim...</span>
            </>
          ) : (
            'Kirim Link Reset'
          )}
        </button>
      </form>
    </div>
  )
}

export default Forgot
