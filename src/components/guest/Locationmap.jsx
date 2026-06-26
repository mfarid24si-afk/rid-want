import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Phone, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

// Lokasi dummy klinik — ganti dengan koordinat/alamat asli saat go-live
const CLINIC = {
  name: 'Aura Clinic — Cabang Pekanbaru',
  address: 'Jl. Sudirman No. 88, Pekanbaru, Riau, Indonesia',
  lat: 0.5071,
  lng: 101.4478,
  phone: '+62 812-3456-7890',
  hours: 'Sen-Sab, 09.00 – 20.00 WIB',
}

// URL embed Google Maps tanpa API key (mode "output=embed")
const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${CLINIC.lat},${CLINIC.lng}&z=15&output=embed`

const LocationMap = () => {
  const { theme } = useTheme()
  // useRef — referensi ke section container untuk dipantau IntersectionObserver
  const sectionRef = useRef(null)

  // useState — menyimpan apakah iframe peta sudah boleh dimuat (lazy load)
  const [shouldLoadMap, setShouldLoadMap] = useState(false)
  // useState — menyimpan status iframe sudah selesai load (untuk skeleton)
  const [mapLoaded, setMapLoaded] = useState(false)

  // useEffect — pasang IntersectionObserver sekali saat mount, lepas saat unmount
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    // Jika browser tidak mendukung IntersectionObserver, langsung load saja
    if (!('IntersectionObserver' in window)) {
      setShouldLoadMap(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadMap(true)
            // Cukup sekali trigger, lalu berhenti mengamati
            observer.disconnect()
          }
        })
      },
      { rootMargin: '150px', threshold: 0.1 }
    )

    observer.observe(node)

    // Cleanup — penting agar tidak ada observer menggantung saat komponen unmount
    return () => observer.disconnect()
  }, [])

  const isDark = theme === 'dark'

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 md:px-8 relative overflow-hidden bg-black/[0.01] dark:bg-black/20 border-t border-black/5 dark:border-white/5"
    >
      {/* Decorative Blur Accent */}
      <div className="absolute top-[20%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-[var(--accent)]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3 text-[var(--text-heading)]">
            Kunjungi Klinik Kami
          </h2>
          <p className="text-[var(--text)] text-sm font-normal">
            Lokasi strategis, mudah dijangkau dari pusat kota dengan fasilitas modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Info kontak & lokasi (Glassmorphic) */}
          <div
            className="md:col-span-1 rounded-3xl p-6 flex flex-col gap-6 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            style={{
              boxShadow: isDark
                ? "inset 0 0 15px rgba(255, 255, 255, 0.02)"
                : "inset 0 0 15px rgba(255, 255, 255, 0.3)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--accent-soft)] border border-[var(--border)] shadow-inner"
              >
                <MapPin className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[var(--text-heading)]">{CLINIC.name}</p>
                <p className="text-xs mt-1 text-[var(--text)] leading-relaxed font-normal">{CLINIC.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--accent-soft)] border border-[var(--border)] shadow-inner"
              >
                <Clock className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[var(--text-heading)]">Jam Operasional</p>
                <p className="text-xs mt-1 text-[var(--text)] leading-relaxed font-normal">{CLINIC.hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--accent-soft)] border border-[var(--border)] shadow-inner"
              >
                <Phone className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[var(--text-heading)]">Hubungi Kami</p>
                <p className="text-xs mt-1 text-[var(--text)] leading-relaxed font-normal">{CLINIC.phone}</p>
              </div>
            </div>

            <motion.a
              href={`https://www.google.com/maps/dir/?api=1&destination=${CLINIC.lat},${CLINIC.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.04,
                y: -2,
                boxShadow: isDark ? "0 0 20px rgba(56,189,248,0.3)" : "0 8px 16px rgba(201,169,110,0.25)"
              }}
              whileTap={{ scale: 0.98 }}
              className="mt-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all border"
              style={{
                background: "var(--accent)",
                borderColor: "var(--accent)",
              }}
            >
              <Navigation className="w-4 h-4 text-white/90" />
              Buka Rute di Google Maps
            </motion.a>
          </div>

          {/* Peta — lazy loaded saat section terlihat di viewport (Glassmorphic) */}
          <div
            className="md:col-span-2 rounded-3xl overflow-hidden relative border border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/40 shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            style={{ minHeight: 340 }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 animate-pulse">
                <MapPin className="w-8 h-8 text-[var(--accent)] filter drop-shadow-[0_0_8px_rgba(201,169,110,0.4)]" />
                <p className="text-xs text-[var(--text)]">
                  {shouldLoadMap ? 'Memuat peta…' : 'Peta akan dimuat saat terlihat'}
                </p>
              </div>
            )}

            {shouldLoadMap && (
              <iframe
                title="Lokasi Aura Clinic"
                src={MAP_EMBED_SRC}
                width="100%"
                height="100%"
                style={{
                  minHeight: 340,
                  border: 0,
                  position: 'relative',
                  filter: isDark ? 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' : 'none', // Membuat peta bernuansa gelap hanya saat dark mode
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationMap