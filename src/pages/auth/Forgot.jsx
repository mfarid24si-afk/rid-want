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
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Terkirim!</h2>
        <p className="text-slate-500 mb-6 text-sm leading-relaxed">
          Kami telah mengirim link reset password ke <strong className="text-slate-700">{email}</strong>. Silakan cek inbox atau folder spam Anda.
        </p>
        <Link
          to="/auth/login"
          className="btn-primary inline-flex items-center gap-2 cursor-pointer"
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
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Login
      </Link>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Lupa Password?</h2>
        <p className="text-slate-500 text-sm mt-2">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Email Admin
          </label>
          <div className="relative">
            {/* Mengubah top-1/2 ke top-3.5 agar sejajar pas di tengah input-field Tailwind v4 */}
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@beautyclinic.com"
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
