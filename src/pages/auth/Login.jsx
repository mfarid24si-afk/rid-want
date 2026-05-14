import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div> {/* 1. MENIKIS KELAS .card AGAR TIDAK DOUBLE BOXING */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Selamat Datang Kembali</h2>
        <p className="text-slate-500 text-sm mt-2">Masuk ke akun admin Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Email Admin
          </label>
          <div className="relative">
            {/* 2. MENGUBAH INDIKATOR POSISI KE top-3.5 AGAR SEJAJAR DENGAN INPUT-FIELD V4 */}
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@beautyclinic.com"
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Masukkan password"
              className="input-field pl-12 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            {/* 3. MENAMBAHKAN AKSEN WARNA CHECKBOX YANG SERASI DENGAN TEMA KLINIK */}
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-primary-500 accent-primary-500 focus:ring-primary-500 cursor-pointer" 
            />
            <span className="text-sm text-slate-600">Ingat saya</span>
          </label>
          <Link to="/auth/forgot" className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors">
            Lupa password?
          </Link>
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
              <span>Memproses...</span>
            </>
          ) : (
            'Masuk'
          )}
        </button>
      </form>

      {/* Register Link */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Belum punya akun?{' '}
        <Link to="/auth/register" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
          Daftar sekarang
        </Link>
      </p>
    </div>
  )
}

export default Login
