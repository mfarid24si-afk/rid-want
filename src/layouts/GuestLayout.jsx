import { Outlet } from 'react-router-dom'
import GuestNavbar from '../components/guest/GuestNavbar'
import GuestFooter from '../components/guest/GuestFooter'
import BirthdayOverlay from '../components/guest/BirthdayOverlay'
import ScrollToTopButton from '../components/ui/Scrolltotopbutton'

const GuestLayout = () => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Navbar murni pasien — tanpa elemen admin */}
      <GuestNavbar />

      {/* Konten halaman */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <GuestFooter />

      {/* Overlay ulang tahun CRM otomatis */}
      <BirthdayOverlay />

      {/* Tombol kembali ke atas */}
      <ScrollToTopButton />
    </div>
  )
}

export default GuestLayout