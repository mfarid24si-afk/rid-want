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
    <div> {/* 1. MENGHAPUS KELAS .card AGAR TIDAK TERJADI DOUBLE PADDING DENGAN AUTHLAYOUT */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Buat Akun Baru</h2>
        <p className="text-slate-500 text-sm mt-1">Daftarkan klinik Anda sekarang</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Nama Lengkap
          </label>
          <div className="relative">
            {/* 2. MENGUBAH INDIKATOR POSISI KE top-3.5 AGAR SEJAJAR VERTIKAL DENGAN INPUT-FIELD V4 */}
            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Dr. Sarah Wijaya"
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        {/* Clinic Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Nama Klinik
          </label>
          <div className="relative">
            <Building className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={formData.clinicName}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              placeholder="Beauty Glow Clinic"
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Email Admin
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@clinic.com"
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
              placeholder="Minimal 8 karakter"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Ulangi password"
              className="input-field pl-12 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-1 select-none">
          {/* 3. MENYELARASKAN AKSEN WARNA CHECKBOX DAN MENGAKTIFKAN KURSOR PENUNJUK */}
          <input 
            type="checkbox" 
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary-500 accent-primary-500 focus:ring-primary-500 cursor-pointer" 
            required 
          />
          <span className="text-sm text-slate-600 leading-tight">
            Saya setuju dengan{' '}
            <a href="#" className="text-primary-500 hover:text-primary-600 font-medium transition-colors">Syarat & Ketentuan</a>
            {' '}dan{' '}
            <a href="#" className="text-primary-500 hover:text-primary-600 font-medium transition-colors">Kebijakan Privasi</a>
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70 mt-4 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Memproses...</span>
            </>
          ) : (
            'Daftar Sekarang'
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Sudah punya akun?{' '}
        <Link to="/auth/login" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
          Masuk di sini
        </Link>
      </p>
    </div>
  )
}

export default Register
