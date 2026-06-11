import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import Button from '../../components/ui/Button'
import InputField from '../../components/ui/InputField'

const Login = () => {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulasi: redirect ke dashboard
    window.location.href = '/dashboard'
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          id="email"
          type="email"
          placeholder="admin@beautyclinic.id"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        />
        <div>
          <InputField
            label="Password"
            id="password"
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text)' }}>
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link to="/auth/forgot" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            Lupa password?
          </Link>
        </div>

        <Button variant="primary" type="submit" className="w-full" size="lg">
          Masuk ke Dashboard
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text)' }}>
        Belum punya akun?{' '}
        <Link to="/auth/register" className="font-medium" style={{ color: 'var(--accent)' }}>
          Daftar Sekarang
        </Link>
      </p>

      {/* Demo hint */}
      <div className="mt-6 p-3 rounded-xl text-xs text-center"
        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
        💡 Demo: Klik "Masuk" untuk langsung ke dashboard
      </div>
    </div>
  )
}

export default Login