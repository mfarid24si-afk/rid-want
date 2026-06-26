import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import Button from '../../components/ui/Button'
import InputField from '../../components/ui/InputField'
import { loginAPI } from '../../services/LoginAPI'

const Login = () => {
  const { theme } = useTheme()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      // Membuat format query filter manual untuk Supabase REST API
      const queryFilter = `?email=eq.${encodeURIComponent(form.email)}&password=eq.${encodeURIComponent(form.password)}`
      
      // Memanggil fungsi fetchLogin dari services
      const res = await loginAPI.fetchLogin(queryFilter)
      const dataUser = res.data || res

      // Validasi ketat: dataUser wajib berupa Array dan panjangnya harus lebih dari 0
      if (Array.isArray(dataUser) && dataUser.length > 0) {
        setIsLoading(false)
        
        // Simpan sesi user ke localStorage (opsional)
        localStorage.setItem('user_session', JSON.stringify(dataUser[0]))
        
        // Alihkan halaman ke dashboard secara mutlak
        window.location.href = '/dashboard'
      } else {
        // Jika array kosong [], login ditahan di halaman ini
        setIsLoading(false)
        setErrorMessage('Email atau password tidak terdaftar!')
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Login error detail:", error)
      setErrorMessage('Terjadi kesalahan koneksi atau database.')
    }
  }

  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative"
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

      <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-heading)' }}>
        Selamat Datang
      </h2>
      <p className="text-xs sm:text-sm text-[var(--text)] mb-8 font-normal leading-relaxed">
        Masuk ke panel manajemen klinik kecantikan Anda
      </p>

      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs text-center font-bold"
        >
          {errorMessage}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Email"
          id="email"
          type="email"
          placeholder="admin@beautyclinic.id"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          required
        />
        <div className="relative">
          <InputField
            label="Password"
            id="password"
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            required
          />
          <button 
            type="button" 
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-[38px] cursor-pointer z-10 p-1 text-[var(--text)] hover:text-[var(--text-strong)] transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link 
            to="/auth/forgot" 
            className="text-xs font-semibold hover:opacity-80 transition-opacity" 
            style={{ color: 'var(--accent)' }}
          >
            Lupa password?
          </Link>
        </div>

        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="primary" 
            type="submit" 
            className="w-full font-bold cursor-pointer border"
            style={{ borderColor: 'var(--accent)' }}
            size="lg" 
            disabled={isLoading}
          >
            {isLoading ? 'Memvalidasi...' : 'Masuk ke Dashboard'}
          </Button>
        </motion.div>
      </form>

      <p className="text-center text-sm mt-6 text-[var(--text)] font-normal">
        Belum punya akun?{' '}
        <Link 
          to="/auth/register" 
          className="font-bold text-[var(--accent)] hover:opacity-80 transition-opacity"
        >
          Daftar Sekarang
        </Link>
      </p>

      <div 
        className="mt-6 p-3 rounded-xl text-xs text-center border font-semibold"
        style={{ 
          background: 'var(--accent-soft)', 
          color: 'var(--accent)',
          borderColor: 'rgba(201, 169, 110, 0.1)'
        }}
      >
        💡 Masuk menggunakan akun admin terdaftar di database.
      </div>
    </motion.div>
  )
}

export default Login
