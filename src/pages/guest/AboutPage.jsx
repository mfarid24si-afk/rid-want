import { Award, Star, Users, Sparkles } from 'lucide-react'

const doctors = [
  {
    avatar: 'AM', name: 'dr. Ayu Maharani, SpKK',
    title: 'Dokter Kepala & Dermatologis Senior',
    certs: ['Board Certified – AAAM (USA)', 'BCAM Certificate – Anti Aging Medicine', 'PERDOSKI Member'],
    exp: '12 tahun pengalaman',
    specialty: 'Dermatologi Estetika & Laser',
  },
  {
    avatar: 'SP', name: 'dr. Sinta Pertiwi, SpBP-RE',
    title: 'Spesialis Bedah Plastik Rekonstruksi',
    certs: ['SpBP-RE – Universitas Indonesia', 'ISAPS International Member', 'PERAPI Certified'],
    exp: '9 tahun pengalaman',
    specialty: 'Bedah Estetika & Anti Aging',
  },
  {
    avatar: 'RK', name: 'dr. Rahma Kusuma, SpKK',
    title: 'Spesialis Kulit & Kelamin',
    certs: ['SpKK – Universitas Airlangga', 'IDI Certified Member', 'Aesthetic Medicine Cert.'],
    exp: '7 tahun pengalaman',
    specialty: 'Kulit Bermasalah & Acne',
  },
]

const awards = [
  { year: '2024', title: 'Best Aesthetic Clinic – Indonesia Beauty Awards' },
  { year: '2023', title: 'Top 10 Aesthetic Clinic Jakarta – Female Daily' },
  { year: '2023', title: 'ISO 9001:2015 Certified – Pelayanan Kesehatan' },
  { year: '2022', title: 'Most Trusted Clinic – Health & Beauty Expo' },
]

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text-heading)' }}>
          Tentang Aura Clinic
        </h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text)' }}>
          Lebih dari 8 tahun kami berkomitmen menghadirkan perawatan kecantikan
          berstandar internasional dengan sentuhan personal care terbaik.
        </p>
      </div>

      {/* Visi misi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}
        >
          <Sparkles className="w-8 h-8 mb-3" style={{ color: 'var(--accent)' }} />
          <h3 className="font-black text-lg mb-2" style={{ color: 'var(--accent)' }}>Visi Kami</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            Menjadi klinik kecantikan & estetika pilihan utama di Indonesia yang
            mengedepankan keamanan medis, hasil nyata, dan pengalaman pasien yang
            bermartabat.
          </p>
        </div>
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <Users className="w-8 h-8 mb-3" style={{ color: 'var(--info)' }} />
          <h3 className="font-black text-lg mb-2" style={{ color: 'var(--text-heading)' }}>Misi Kami</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            Memberikan layanan estetika yang aman, terpersonalisasi, dan berbasis
            bukti ilmiah — didukung tim dokter bersertifikat dan teknologi terkini
            yang diperbarui setiap tahun.
          </p>
        </div>
      </div>

      {/* Tim dokter */}
      <h2 className="text-2xl font-black mb-6 text-center" style={{ color: 'var(--text-heading)' }}>
        Tim Dokter Kami
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {doctors.map((doc) => (
          <div
            key={doc.name}
            className="rounded-2xl p-6"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white mb-4"
              style={{ background: 'var(--accent)' }}
            >
              {doc.avatar}
            </div>
            <h3 className="font-bold mb-0.5" style={{ color: 'var(--text-heading)' }}>{doc.name}</h3>
            <p className="text-xs mb-1" style={{ color: 'var(--accent)', fontWeight: 600 }}>{doc.title}</p>
            <p className="text-xs mb-3" style={{ color: 'var(--text)' }}>
              🎓 {doc.specialty} &nbsp;·&nbsp; {doc.exp}
            </p>
            <div className="space-y-1">
              {doc.certs.map((c) => (
                <div key={c} className="flex items-start gap-2">
                  <Award className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                  <p className="text-xs" style={{ color: 'var(--text)' }}>{c}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Penghargaan */}
      <h2 className="text-2xl font-black mb-6 text-center" style={{ color: 'var(--text-heading)' }}>
        Penghargaan &amp; Sertifikasi
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {awards.map((a) => (
          <div
            key={a.title}
            className="flex items-center gap-4 rounded-2xl p-4"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <Star className="w-6 h-6 flex-shrink-0 fill-current" style={{ color: 'var(--warning)' }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{a.year}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>{a.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Galeri placeholder */}
      <h2 className="text-2xl font-black mb-5 text-center" style={{ color: 'var(--text-heading)' }}>
        Galeri Klinik
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {['Ruang Perawatan', 'Area Konsultasi', 'Lobby Utama', 'Treatment Room', 'Peralatan Laser', 'Tim Dokter'].map((label) => (
          <div
            key={label}
            className="rounded-2xl overflow-hidden aspect-video flex items-center justify-center text-sm font-medium"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            📸 {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AboutPage