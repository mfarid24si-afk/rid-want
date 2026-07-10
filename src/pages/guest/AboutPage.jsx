import { useState, useEffect } from 'react'
import { Award, Star, Users, Sparkles } from "lucide-react"
import { doctorService } from '../../services/doctorService'

const awards = [
  { year: "2024", title: "Best Aesthetic Clinic – Indonesia Beauty Awards" },
  { year: "2023", title: "Top 10 Aesthetic Clinic Jakarta – Female Daily" },
  { year: "2023", title: "ISO 9001:2015 Certified – Pelayanan Kesehatan" },
  { year: "2022", title: "Most Trusted Clinic – Health & Beauty Expo" },
]

const AboutPage = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getActive()
        setDoctors(data)
      } catch (err) {
        console.error('Gagal memuat dokter:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--text-heading)" }}>
          Tentang Skinova
        </h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--text)" }}>
          Lebih dari 8 tahun kami berkomitmen menghadirkan perawatan kecantikan
          berstandar internasional dengan sentuhan personal care terbaik.
        </p>
      </div>

      {/* Visi misi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        <div className="rounded-2xl p-6" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}>
          <Sparkles className="w-8 h-8 mb-3" style={{ color: "var(--accent)" }} />
          <h3 className="font-black text-lg mb-2" style={{ color: "var(--accent)" }}>Visi Kami</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            Menjadi klinik kecantikan & estetika pilihan utama di Indonesia yang
            mengedepankan keamanan medis, hasil nyata, dan pengalaman pasien yang bermartabat.
          </p>
        </div>
        <div className="rounded-2xl p-6" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
          <Users className="w-8 h-8 mb-3" style={{ color: "var(--info)" }} />
          <h3 className="font-black text-lg mb-2" style={{ color: "var(--text-heading)" }}>Misi Kami</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            Memberikan layanan estetika yang aman, terpersonalisasi, dan berbasis bukti ilmiah —
            didukung tim dokter bersertifikat dan teknologi terkini yang diperbarui setiap tahun.
          </p>
        </div>
      </div>

      {/* Tim dokter */}
      <h2 className="text-2xl font-black mb-6 text-center" style={{ color: "var(--text-heading)" }}>
        Tim Dokter Kami
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <p style={{ color: 'var(--text)' }}>Memuat data dokter...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl p-6"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              {doc.image_url ? (
                <img
                  src={doc.image_url}
                  alt={doc.name}
                  className="w-16 h-16 rounded-full object-cover mb-4"
                  style={{ border: "2px solid var(--accent)" }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-xl font-bold text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  {doc.name?.charAt(0)}
                </div>
              )}
              <h3 className="font-bold mb-0.5" style={{ color: "var(--text-heading)" }}>{doc.name}</h3>
              {doc.title && (
                <p className="text-xs mb-1" style={{ color: "var(--accent)", fontWeight: 600 }}>{doc.title}</p>
              )}
              <p className="text-xs mb-3" style={{ color: "var(--text)" }}>
                🎓 {doc.specialty} &nbsp;·&nbsp; {doc.experience_yr} tahun pengalaman
              </p>
              {doc.bio && (
                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text)' }}>{doc.bio}</p>
              )}
            </div>
          ))}
          {doctors.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p style={{ color: 'var(--text)' }}>Belum ada data dokter.</p>
            </div>
          )}
        </div>
      )}

      {/* Penghargaan */}
      <h2 className="text-2xl font-black mb-6 text-center" style={{ color: "var(--text-heading)" }}>
        Penghargaan & Sertifikasi
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {awards.map((a) => (
          <div
            key={a.title}
            className="flex items-center gap-4 rounded-2xl p-4"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <Star className="w-6 h-6 flex-shrink-0 fill-current" style={{ color: "var(--warning)" }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>{a.year}</p>
              <p className="text-sm font-medium" style={{ color: "var(--text-strong)" }}>{a.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Galeri Foto Klinik */}
      <h2 className="text-2xl font-black mb-5 text-center" style={{ color: "var(--text-heading)" }}>
        Galeri Klinik
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Ruang Perawatan", img: "/img/ruang-perawatan.jpg" },
          { label: "Area Konsultasi", img: "/img/konsultasi.jpg" },
          { label: "Lobby Utama", img: "/img/lobby.jpg" },
          { label: "Treatment Room", img: "/img/treatment.jpg" },
          { label: "Peralatan Laser", img: "/img/laser.jpg" },
          { label: "Tim Dokter", img: "/img/tim-dokter.jpg" },
        ].map((item) => (
          <div
            key={item.label}
            className="relative rounded-2xl overflow-hidden aspect-video flex items-center justify-center text-sm font-medium group"
            style={{ border: "1px solid var(--border)" }}
          >
            <img
              src={item.img}
              alt={item.label}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold z-10">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AboutPage
