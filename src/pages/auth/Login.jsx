import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import Button from '../../components/ui/Button'
import InputField from '../../components/ui/InputField'
import { loginAPI } from '../../services/LoginAPI'

const Login = () => {
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

  return (
    <div>
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--accent)' }}>
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>BeautyClinic</span>
      </div>

      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
        Selamat Datang
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text)' }}>
        Masuk ke panel manajemen klinik Anda
      </p>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          id="email"
          type="email"
          placeholder="admin@beautyclinic.id"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        />
        <div className="relative">
          <InputField
            label="Password"
            id="password"
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ color: 'var(--text)' }}>
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link to="/auth/forgot" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            Lupa password?
          </Link>
        </div>

        <Button variant="primary" type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Memvalidasi...' : 'Masuk ke Dashboard'}
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text)' }}>
        Belum punya akun?{' '}
        <Link to="/auth/register" className="font-medium" style={{ color: 'var(--accent)' }}>
          Daftar Sekarang
        </Link>
      </p>

      <div className="mt-6 p-3 rounded-xl text-xs text-center"
        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
        💡 Silakan masuk menggunakan akun terdaftar di Supabase Anda.
      </div>
    </div>
  )
}

export default Login
