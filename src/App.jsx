import React, { Suspense } from "react";
// 1. PASTIKAN IMPOR UTAMA SUDAH MEMILIKI BrowserRouter
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Loading from "./components/Loading";

// Penerapan React.lazy persis seperti pola proyek lama Anda
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Customers = React.lazy(() => import("./pages/Customers"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));   
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Menyesuaikan dengan nama file baru Anda yang diawali huruf kapital (Login, Register, Forgot)
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

function App() {
  return (
    // 2. TAMBAHKAN PEMBUNGKUS BrowserRouter DI SINI SEBAGAI AKAR UTAMA ROUTER
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Kelompok Alur Autentikasi */}
          <Route element={<AuthLayout />}>
            {/* Mengarahkan halaman utama pertama kali langsung ke login */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot" element={<Forgot />} />
          </Route>

          {/* Kelompok Panel Utama Admin */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/customers" element={<Customers />} />
            
            {/* Halaman simulasi error */}
            <Route path="/error/400" element={<ErrorPage code="400" description="Bad Request: Permintaan admin tidak dipahami sistem." />} />
            <Route path="/error/401" element={<ErrorPage code="401" description="Unauthorized: Sesi masuk habis, silakan login kembali." />} />
            <Route path="/error/403" element={<ErrorPage code="403" description="Forbidden: Area rahasia manajemen klinik!" />} />
          </Route>

          {/* Jaring Pengaman Error 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
