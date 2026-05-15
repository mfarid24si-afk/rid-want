import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const MainLayout = () => {
  return (
    // 1. Mengubah bg-slate-50 menjadi bg-[#1C1C1C] murni untuk mematikan bocoran putih di belakang sidebar
    <div className="min-h-screen bg-[#1C1C1C] text-zinc-100 flex flex-col">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      {/* 2. Menambahkan bg-[#1C1C1C] dan min-h-screen agar area kanan tertutup gelap secara penuh */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen bg-[#1C1C1C]">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        {/* 3. Menambahkan bg-[#1C1C1C] di tag main untuk memastikan landasan halaman anak serasi */}
        <main className="p-6 flex-1 bg-[#1C1C1C]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
