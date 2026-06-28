import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import GuestLayout from './layouts/GuestLayout'
import AuthLayout from './layouts/AuthLayout'
import Loading from './components/ui/Loading'
import FABRoleSwitcher from './components/guest/FABRoleSwitcher'
import { useRole } from './context/RoleContext'

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

// ── Root router: memilih layout berdasarkan role ─────────────
function AppRoutes() {
  const { role } = useRole()
  const isGuest = role === 'guest'

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Guest Landing Page — sebelum login, visible to ALL */}
          <Route path="/" element={<GuestLandingPage />} />

          {/* Auth — independen dari role */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login"    element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot"   element={<Forgot />} />
          </Route>

          {/* ── ADMIN AREA ── */}
          {!isGuest && (
            // Mengirimkan AdminHeader sebagai properti agar MainLayout merender header yang tepat
            <Route element={<MainLayout header={<AdminHeader />} />}>
              <Route path="/dashboard"                 element={<Dashboard />} />
              <Route path="/dashboard/orders"          element={<Orders />} />
              <Route path="/dashboard/customers"       element={<Customers />} />
              <Route path="/dashboard/leads"           element={<LeadsPipeline />} />
              <Route path="/dashboard/analytics"       element={<Analytics />} />
              <Route path="/dashboard/collaboration"   element={<Collaboration />} />
              <Route path="/error/400" element={<ErrorPage code="400" description="Bad Request" />} />
              <Route path="/error/401" element={<ErrorPage code="401" description="Unauthorized" />} />
              <Route path="/error/403" element={<ErrorPage code="403" description="Forbidden" />} />
            </Route>
          )}

          {/* ── GUEST / PATIENT PORTAL ── */}
          {isGuest && (
            // Mengirimkan GuestHeader sebagai properti agar GuestLayout merender header yang tepat
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

          {/* ── Role-based redirects ── */}
          <Route
            path="/dashboard"
            element={
              isGuest ? <Navigate to="/portal" replace /> : null
            }
          />
          <Route
            path="/portal"
            element={
              !isGuest ? <Navigate to="/dashboard" replace /> : null
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* FAB Role Switcher — melayang di luar semua layout, selalu terlihat */}
      <FABRoleSwitcher />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
