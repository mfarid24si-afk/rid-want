import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div>
      {/* Header Judul - Diperjelas dengan text-white murni */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h2>
        <p className="text-zinc-400 text-sm mt-2">Masuk ke akun admin Anda</p>
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@beautyclinic.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Masukkan password"
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 accent-zinc-200 cursor-pointer" 
            />
            <span className="text-sm text-zinc-300">Ingat saya</span>
          </label>
          {/* Link dialihkan menggunakan warna sky cerah */}
          <Link to="/auth/forgot" className="text-sm text-sky-400 hover:text-sky-300 font-semibold transition-colors">
            Lupa password?
          </Link>
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
              <span>Memproses...</span>
            </>
          ) : (
            'Masuk'
          )}
        </button>
      </form>

      {/* Register Link */}
      <p className="text-center text-sm text-zinc-400 mt-6">
        Belum punya akun?{' '}
        <Link to="/auth/register" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
          Daftar sekarang
        </Link>
      </p>
    </div>
  )
}

export default Login
