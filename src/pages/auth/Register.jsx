import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import Button from '../../components/ui/Button'
import InputField from '../../components/ui/InputField'
import { loginAPI } from '../../services/LoginAPI'

const Register = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('') 
    
    // Validasi kecocokan kata sandi
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok!')
      setIsLoading(false)
      return
    }

    try {
      // Payload disesuaikan hanya dengan kolom yang ada di database tabel login
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }

      // Menembak fungsi POST (createLogin) ke Supabase
      await loginAPI.createLogin(payload)
      
      setIsLoading(false)
      navigate('/auth/login')
    } catch (error) {
      setIsLoading(false)
      console.error("Registrasi gagal:", error)
      setErrorMessage(
        error.response?.data?.message || 'Gagal mendaftar. Periksa koneksi atau database Anda.'
      )
    }
  }

  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative text-left"
      style={{
        boxShadow: isDark 
          ? "inset 0 0 15px rgba(255, 255, 255, 0.02)" 
          : "inset 0 0 15px rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-md"
          style={{ 
            background: 'var(--accent)', 
            borderColor: 'rgba(255,255,255,0.1)',
            boxShadow: isDark ? '0 0 15px rgba(56, 189, 248, 0.3)' : '0 4px 12px rgba(201, 169, 110, 0.2)'
          }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-heading)] to-[var(--accent)]">
          Aura Clinic
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--text-heading)' }}>Buat Akun Baru</h2>
        <p className="text-xs sm:text-sm text-[var(--text)] mt-1 font-normal leading-relaxed">Daftarkan akun administrator klinik kecantikan Anda</p>
      </div>

      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs text-center font-bold"
        >
          {errorMessage}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <InputField
          label="Nama Lengkap"
          id="name"
          type="text"
          placeholder="Nama Lengkap Anda"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        {/* Email */}
        <InputField
          label="Email Admin"
          id="email"
          type="email"
          placeholder="admin@clinic.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Password */}
        <div className="relative">
          <InputField
            label="Kata Sandi"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 8 karakter"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-[38px] cursor-pointer z-10 p-1 text-[var(--text)] hover:text-[var(--text-strong)] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <InputField
            label="Konfirmasi Kata Sandi"
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Ulangi password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-[38px] cursor-pointer z-10 p-1 text-[var(--text)] hover:text-[var(--text-strong)] transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5 pt-2 select-none">
          <input 
            type="checkbox" 
            id="terms"
            className="w-4 h-4 mt-0.5 rounded border-[var(--border)] bg-[var(--bg-raised)] accent-[var(--accent)] cursor-pointer" 
            required 
          />
          <label htmlFor="terms" className="text-xs text-[var(--text)] leading-tight font-normal">
            Saya setuju dengan{' '}
            <a href="#" className="font-bold hover:underline" style={{ color: 'var(--accent)' }}>Syarat & Ketentuan</a>
            {' '}dan{' '}
            <a href="#" className="font-bold hover:underline" style={{ color: 'var(--accent)' }}>Kebijakan Privasi</a>
          </label>
        </div>

        {/* Tombol Submit */}
        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="primary" 
            type="submit" 
            className="w-full font-bold cursor-pointer mt-2 border"
            style={{ borderColor: 'var(--accent)' }}
            size="lg" 
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>
        </motion.div>
      </form>

      <p className="text-center text-sm mt-6 text-[var(--text)] font-normal">
        Sudah punya akun?{' '}
        <Link 
          to="/auth/login" 
          className="font-bold text-[var(--accent)] hover:opacity-80 transition-opacity"
        >
          Masuk di sini
        </Link>
      </p>
    </motion.div>
  )
}

export default Register
