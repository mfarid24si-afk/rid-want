import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    clinicName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      navigate('/auth/login')
    }, 1500)
  }

  return (
    <div>
      {/* Header Judul - Diperjelas dengan text-white murni */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Buat Akun Baru</h2>
        <p className="text-zinc-400 text-sm mt-1">Daftarkan klinik Anda sekarang</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Nama Lengkap
          </label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Dr. Sarah Wijaya"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Clinic Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Nama Klinik
          </label>
          <div className="relative">
            <Building className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={formData.clinicName}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              placeholder="Beauty Glow Clinic"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Email Admin
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@clinic.com"
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
              placeholder="Minimal 8 karakter"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Ulangi password"
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-1 select-none">
          <input 
            type="checkbox" 
            className="w-4 h-4 mt-0.5 rounded border-zinc-700 bg-zinc-800 accent-zinc-200 cursor-pointer" 
            required 
          />
          <span className="text-sm text-zinc-300 leading-tight">
            Saya setuju dengan{' '}
            <a href="#" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">Syarat & Ketentuan</a>
            {' '}dan{' '}
            <a href="#" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">Kebijakan Privasi</a>
          </span>
        </div>

        {/* Tombol Submit - Diubah menjadi Solid Putih/Terang Minimalis sesuai tema ByeWind */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 mt-4 transition-colors cursor-pointer text-sm"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin"></div>
              <span>Memproses...</span>
            </>
          ) : (
            'Daftar Sekarang'
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-zinc-400 mt-6">
        Sudah punya akun?{' '}
        <Link to="/auth/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
          Masuk di sini
        </Link>
      </p>
    </div>
  )
}

export default Register
