import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Phone, Clock } from 'lucide-react'

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

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-6"
      style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-heading)' }}>
            Kunjungi Klinik Kami
          </h2>
          <p style={{ color: 'var(--text)' }}>
            Lokasi strategis, mudah dijangkau dari pusat kota
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Info kontak & lokasi */}
          <div
            className="md:col-span-1 rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-soft)' }}
              >
                <MapPin className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>{CLINIC.name}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text)' }}>{CLINIC.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-soft)' }}
              >
                <Clock className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>Jam Operasional</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text)' }}>{CLINIC.hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-soft)' }}
              >
                <Phone className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>Hubungi Kami</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text)' }}>{CLINIC.phone}</p>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${CLINIC.lat},${CLINIC.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
              style={{ background: 'var(--accent)' }}
            >
              <Navigation className="w-4 h-4" />
              Buka Rute di Google Maps
            </a>
          </div>

          {/* Peta — lazy loaded saat section terlihat di viewport */}
          <div
            className="md:col-span-2 rounded-2xl overflow-hidden relative"
            style={{ border: '1px solid var(--border)', minHeight: 320, background: 'var(--bg-base)' }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-pulse">
                <MapPin className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                <p className="text-xs" style={{ color: 'var(--text)' }}>
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
                style={{ minHeight: 320, border: 0, position: 'relative' }}
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