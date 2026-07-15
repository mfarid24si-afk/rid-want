// 1. Jika kamu pakai Next.js / Vite, kamu bisa import gambarnya di atas
// import logoBaruWA from '../assets/logo-wa-baru.png' 

const WHATSAPP_NUMBER = '081297142719'
const WHATSAPP_MESSAGE = 'Halo%20Skinova!%20Saya%20ingin%20konsultasi%20tentang%20treatment%20kecantikan.'

const FloatingWhatsApp = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #25D366, #128C7E)',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
      }}
      title="Chat via WhatsApp"
    >
      {/* GANTI DI SINI: Menggunakan tag img untuk memanggil file gambar */}
      <img 
        src="whatsapp.png" // Sesuaikan dengan jalur/path file gambar kamu
        alt="WhatsApp Logo" 
        className="w-7 h-7 object-contain z-10" 
      />

      <span className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ background: '#25D366' }} />
    </a>
  )
}

export default FloatingWhatsApp
