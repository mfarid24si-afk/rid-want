import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginAPI } from '../services/LoginAPI'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cek session tersimpan saat mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('auth_user')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.id && parsed.email) {
          setUser(parsed)
        } else {
          localStorage.removeItem('auth_user')
        }
      }
    } catch {
      localStorage.removeItem('auth_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    // Fetch user by email — password divalidasi di client
    const filter = `?email=eq.${encodeURIComponent(email)}`
    const res = await loginAPI.fetchLogin(filter)
    const users = Array.isArray(res) ? res : (res?.data || [])

    if (users.length === 0) {
      throw new Error('Email tidak terdaftar!')
    }

    const matched = users.find((u) => u.password === password)
    if (!matched) {
      throw new Error('Password salah!')
    }

    // Simpan session (tanpa password)
    const { password: _, ...safeUser } = matched
    setUser(safeUser)
    localStorage.setItem('auth_user', JSON.stringify(safeUser))
    return safeUser
  }, [])

  const register = useCallback(async (data) => {
    const res = await loginAPI.createLogin(data)
    const newUser = res?.data || res
    const userData = Array.isArray(newUser) ? newUser[0] : newUser
    if (userData && userData.id) {
      const { password: _, ...safeUser } = userData
      setUser(safeUser)
      localStorage.setItem('auth_user', JSON.stringify(safeUser))
      return safeUser
    }
    throw new Error('Gagal mendaftarkan akun')
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }, [])

  const deleteAccount = useCallback(async () => {
    if (!user?.id) throw new Error('Tidak ada sesi aktif')
    await loginAPI.deleteLogin(user.id)
    logout()
  }, [user, logout])

  const refreshUser = useCallback(async () => {
    if (!user?.id) return
    const filter = `?id=eq.${user.id}`
    const res = await loginAPI.fetchLogin(filter)
    const users = Array.isArray(res) ? res : (res?.data || [])
    if (users.length > 0) {
      const { password: _, ...safeUser } = users[0]
      setUser(safeUser)
      localStorage.setItem('auth_user', JSON.stringify(safeUser))
    }
  }, [user?.id])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        deleteAccount,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
