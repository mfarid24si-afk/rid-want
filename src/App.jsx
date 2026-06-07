import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Loading from './components/ui/Loading'

const Dashboard    = React.lazy(() => import('./pages/Dashboard'))
const Orders       = React.lazy(() => import('./pages/Orders'))
const Customers    = React.lazy(() => import('./pages/Customers'))
const LeadsPipeline = React.lazy(() => import('./pages/LeadsPipeline'))
const Analytics    = React.lazy(() => import('./pages/Analytics'))
const Collaboration = React.lazy(() => import('./pages/Collaboration'))
const ErrorPage    = React.lazy(() => import('./pages/ErrorPage'))
const NotFound     = React.lazy(() => import('./pages/NotFound'))
const Login        = React.lazy(() => import('./pages/auth/Login'))
const Register     = React.lazy(() => import('./pages/auth/Register'))
const Forgot       = React.lazy(() => import('./pages/auth/Forgot'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login"    element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot"   element={<Forgot />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/dashboard"                   element={<Dashboard />} />
            <Route path="/dashboard/orders"            element={<Orders />} />
            <Route path="/dashboard/customers"         element={<Customers />} />
            <Route path="/dashboard/leads"             element={<LeadsPipeline />} />
            <Route path="/dashboard/analytics"         element={<Analytics />} />
            <Route path="/dashboard/collaboration"     element={<Collaboration />} />
            <Route path="/error/400" element={<ErrorPage code="400" description="Bad Request" />} />
            <Route path="/error/401" element={<ErrorPage code="401" description="Unauthorized" />} />
            <Route path="/error/403" element={<ErrorPage code="403" description="Forbidden" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App