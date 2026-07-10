import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import GuestLayout from './layouts/GuestLayout'
import AuthLayout from './layouts/AuthLayout'
import Loading from './components/ui/Loading'
import FABRoleSwitcher from './components/guest/FABRoleSwitcher'
import { AuthProvider } from './context/AuthContext'
import { RoleProvider } from './context/RoleContext'
import { useRole } from './context/RoleContext'
import { useAuth } from './context/AuthContext'

// Mengimpor 2 komponen header baru sesuai instruksi kamu
import AdminHeader from './components/layout/AdminHeader'
import GuestHeader from './components/layout/GuestHeader'

// ── Admin pages (lazy) ──────────────────────────────────────
const Dashboard     = React.lazy(() => import('./pages/Dashboard'))
const Orders        = React.lazy(() => import('./pages/Orders'))
const Customers     = React.lazy(() => import('./pages/Customers'))
const LeadsPipeline = React.lazy(() => import('./pages/LeadsPipeline'))
const Analytics     = React.lazy(() => import('./pages/Analytics'))
const Collaboration = React.lazy(() => import('./pages/Collaboration'))
const UserManage      = React.lazy(() => import('./pages/UserManagement'))
const ManageTreatments  = React.lazy(() => import('./pages/admin/ManageTreatments'))
const ManageDoctors     = React.lazy(() => import('./pages/admin/ManageDoctors'))
const ManagePromotions  = React.lazy(() => import('./pages/admin/ManagePromotions'))
const ErrorPage     = React.lazy(() => import('./pages/ErrorPage'))
const NotFound      = React.lazy(() => import('./pages/NotFound'))
const Login         = React.lazy(() => import('./pages/auth/Login'))
const Register      = React.lazy(() => import('./pages/auth/Register'))
const Forgot        = React.lazy(() => import('./pages/auth/Forgot'))

// ── Guest / Patient Portal pages (lazy) ─────────────────────
const LandingPage        = React.lazy(() => import('./pages/guest/LandingPage'))
const GuestLandingPage   = React.lazy(() => import('./pages/guest/GuestLandingPage'))
const AboutPage          = React.lazy(() => import('./pages/guest/AboutPage'))
const ServicesPage       = React.lazy(() => import('./pages/guest/ServicesPage'))
const PromoPage          = React.lazy(() => import('./pages/guest/PromoPage'))
const BookingPage        = React.lazy(() => import('./pages/guest/BookingPage'))
const TrackingPage       = React.lazy(() => import('./pages/guest/TrackingPage'))
const LoyaltyPage        = React.lazy(() => import('./pages/guest/LoyaltyPage'))
const VoucherPage        = React.lazy(() => import('./pages/guest/VoucherPage'))
const ServiceHistoryPage = React.lazy(() => import('./pages/guest/ServiceHistoryPage'))
const CustomerDashboard  = React.lazy(() => import('./pages/guest/CustomerDashboard'))

// ── Loading screen untuk auth ──
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 animate-pulse" style={{ background: 'var(--accent)' }} />
        <p className="text-sm" style={{ color: 'var(--text)' }}>Memuat...</p>
      </div>
    </div>
  )
}

// ── Root router: memilih layout berdasarkan role ─────────────
function AppRoutes() {
  const { role, synced } = useRole()
  const { loading: authLoading, isAuthenticated } = useAuth()
  const isGuest = role === 'guest'
  const isMember = role === 'member'
  const isAdmin = role === 'admin'

  // Tampilkan loading screen saat auth masih diproses
  // ATAU role belum sinkron dari database (mencegah redirect ke halaman salah)
  if (authLoading || !synced) {
    return <AuthLoadingScreen />
  }

  // Safety: jika user sudah login tapi role masih 'guest'
  // (belum sync dari database), tunggu sampai role benar
  if (isAuthenticated && role === 'guest') {
    return <AuthLoadingScreen />
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Guest Landing Page — visible to ALL */}
          <Route path="/" element={<GuestLandingPage />} />

          {/* Auth — independen dari role */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login"    element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot"   element={<Forgot />} />
          </Route>

          {/* ── ADMIN AREA (hanya untuk admin) ── */}
          {isAdmin && (
            <Route element={<MainLayout header={<AdminHeader />} />}>
              <Route path="/dashboard"                 element={<Dashboard />} />
              <Route path="/dashboard/orders"          element={<Orders />} />
              <Route path="/dashboard/customers"       element={<Customers />} />
              <Route path="/dashboard/leads"           element={<LeadsPipeline />} />
              <Route path="/dashboard/analytics"       element={<Analytics />} />
              <Route path="/dashboard/collaboration"   element={<Collaboration />} />
              <Route path="/dashboard/users"           element={<UserManage />} />
              <Route path="/dashboard/treatments"     element={<ManageTreatments />} />
              <Route path="/dashboard/doctors"        element={<ManageDoctors />} />
              <Route path="/dashboard/promotions"     element={<ManagePromotions />} />
              <Route path="/error/400" element={<ErrorPage code="400" description="Bad Request" />} />
              <Route path="/error/401" element={<ErrorPage code="401" description="Unauthorized" />} />
              <Route path="/error/403" element={<ErrorPage code="403" description="Forbidden" />} />
            </Route>
          )}

          {/* ── MEMBER / PATIENT PORTAL (untuk member & guest) ── */}
          {(isGuest || isMember) && (
            <Route element={<GuestLayout header={<GuestHeader />} />}>
              <Route path="/portal"         element={<LandingPage />} />
              <Route path="/portal/about"   element={<AboutPage />} />
              <Route path="/portal/services" element={<ServicesPage />} />
              <Route path="/portal/promo"   element={<PromoPage />} />
              <Route path="/portal/booking" element={<BookingPage />} />
              <Route path="/portal/tracking" element={<TrackingPage />} />
              <Route path="/portal/loyalty" element={<LoyaltyPage />} />
              <Route path="/portal/voucher" element={<VoucherPage />} />
              <Route path="/portal/history" element={<ServiceHistoryPage />} />
              <Route path="/portal/me"      element={<CustomerDashboard />} />
            </Route>
          )}

          {/* ── Redirects berdasarkan role ── */}
          <Route
            path="/dashboard"
            element={
              !isAdmin ? <Navigate to="/portal" replace /> : null
            }
          />
          <Route
            path="/portal"
            element={
              isAdmin ? <Navigate to="/dashboard" replace /> : null
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* FAB Role Switcher — untuk development/testing */}
      <FABRoleSwitcher />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>   {/* RoleProvider di sini, di dalam AuthProvider */}
          <AppRoutes />
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
