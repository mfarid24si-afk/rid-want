import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)       // user profile dari tabel public.users
  const [authUser, setAuthUser] = useState(null) // user dari Supabase Auth
  const [loading, setLoading] = useState(true)

  // Ambil profile user dari public.users jika ada
  // Profile dibuat otomatis oleh database trigger (on_auth_user_created)
  const ensureProfile = useCallback(async (authUserData) => {
    if (!authUserData?.id) return null

    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserData.id)
      .maybeSingle()

    return existing || null // Jika belum ada, trigger database akan membuatnya
  }, [])

  // Fetch atau buat user profile dari tabel public.users
  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Gagal memuat profil:', error)
      return null
    }
    return data
  }, [])

  // Setup listener auth state
  useEffect(() => {
    let cancelled = false

    // Dapatkan session saat ini — dengan timeout 8 detik
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        setLoading(false) // Force stop loading setelah 8 detik
      }
    }, 8000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeoutId)
      if (cancelled) return
      if (session?.user) {
        setAuthUser(session.user)
        let profile = await fetchProfile(session.user.id)
        if (!profile) {
          profile = await ensureProfile(session.user)
        }
        setUser(profile)
      }
      if (!cancelled) setLoading(false)
    }).catch(() => {
      clearTimeout(timeoutId)
      if (!cancelled) setLoading(false) // Error → tetap lanjut
    })

    // Listen for auth state changes — hanya proses event yang bermakna
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return

        // Abaikan event TOKEN_REFRESHED dan USER_UPDATED
        // agar tidak me-reset state user setiap token di-refresh
        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          return
        }

        if (session?.user) {
          setAuthUser(session.user)
          let profile = await fetchProfile(session.user.id)
          if (!profile) {
            profile = await ensureProfile(session.user)
          }
          setUser(profile)
        } else {
          setAuthUser(null)
          setUser(null)
        }
        // Jangan set loading=false di sini — loading hanya dari getSession
      }
    )

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [fetchProfile, ensureProfile])

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Email atau password salah!')
      }
      throw new Error(error.message || 'Gagal masuk')
    }

    // Profile dari user_metadata — INSTAN, tanpa query database
    // user_metadata sudah ada di response signIn, gak butuh RLS atau timing
    const meta = data.user?.user_metadata || {}
    const profile = {
      id: data.user.id,
      email: data.user.email,
      name: meta.name || data.user.email?.split('@')[0] || 'User',
      role: meta.role || 'member',
      phone: meta.phone || '',
      points: meta.points || 0,
      membership_tier: meta.membership_tier || null,
    }

    // Set state langsung — React akan batch render berikutnya
    setAuthUser(data.user)
    setUser(profile)

    // Background: ambil profile asli dari database (optional, async terpisah)
    // Kalau ada data lebih lengkap di database, akan update otomatis
    supabase.from('users').select('*').eq('id', data.user.id).maybeSingle()
      .then(({ data: realProfile }) => {
        if (realProfile) setUser(realProfile)
      })
      .catch(() => {
        // Gagal? Gapapa — pakai data dari metadata
      })

    return profile
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'member',
        },
      },
    })

    if (error) {
      throw new Error(error.message || 'Gagal mendaftar')
    }

    // Profil akan di-create otomatis via onAuthStateChange + ensureProfile
    return data.user
  }, [])

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Gagal logout:', error)
    // State akan di-reset otomatis via onAuthStateChange
  }, [])

  const deleteAccount = useCallback(async () => {
    if (!user?.id) throw new Error('Tidak ada sesi aktif')
    // Hapus dari tabel public.users
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)
    if (deleteError) console.error('Gagal hapus profil:', deleteError)
    // Logout — state akan di-reset via onAuthStateChange
    await logout()
  }, [user, logout])

  const refreshUser = useCallback(async () => {
    if (!authUser?.id) return
    const profile = await fetchProfile(authUser.id)
    if (profile) setUser(profile)
  }, [authUser?.id, fetchProfile])

  return (
    <AuthContext.Provider
      value={{
        user,           // Dari tabel public.users (name, email, role, points, ...)
        authUser,       // Dari Supabase Auth (id, email, ...)
        loading,
        isAuthenticated: !!authUser,
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
