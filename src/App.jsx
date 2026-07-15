import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import GuestLayout from './layouts/GuestLayout'
import AuthLayout from './layouts/AuthLayout'
import Loading from './components/ui/Loading'
import FABRoleSwitcher from './components/guest/FABRoleSwitcher'
import FloatingWhatsApp from './components/guest/FloatingWhatsApp'
import { AuthProvider } from './context/AuthContext'
import { RoleProvider } from './context/RoleContext'
import { useRole } from './context/RoleContext'
import { useAuth } from './context/AuthContext'

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
const ManageSupportTickets = React.lazy(() => import('./pages/admin/ManageSupportTickets'))
const ManageEmailCampaigns  = React.lazy(() => import('./pages/admin/ManageEmailCampaigns'))
const SupabaseSetup        = React.lazy(() => import('./pages/admin/SupabaseSetup'))
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
const MyTicketsPage      = React.lazy(() => import('./pages/guest/MyTicketsPage'))

// ── Loading screen untuk auth ──
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center">
        {/* Logo Skinova */}
        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--accent), #C9A96E)',
            boxShadow: '0 8px 32px rgba(201, 169, 110, 0.3)',
          }}>
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
        {/* Nama brand */}
        <h1 className="text-xl font-black mb-1" style={{ color: 'var(--text-heading)' }}>Skinova</h1>
        <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Klinik Kecantikan</p>
        {/* Loading bar */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i}
                className="w-2.5 h-2.5 rounded-full animate-bounce"
                style={{
                  background: 'var(--accent)',
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.8s',
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--text)' }}>Memuat...</p>
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
  // (belum sync dari database), tunggu max 3 detik lalu redirect ke landing
  if (isAuthenticated && role === 'guest' && !synced) {
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
              <Route path="/dashboard/support"        element={<ManageSupportTickets />} />
              <Route path="/dashboard/email-marketing" element={<ManageEmailCampaigns />} />
              <Route path="/dashboard/setup"            element={<SupabaseSetup />} />
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
              <Route path="/portal/tickets" element={<MyTicketsPage />} />
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

      {/* Floating WhatsApp — hanya untuk non-admin */}
      {!isAdmin && <FloatingWhatsApp />}

      {/* FAB Role Switcher — untuk development/testing */}
      {/* <FABRoleSwitcher /> */}
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
