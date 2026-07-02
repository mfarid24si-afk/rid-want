import { useEffect, useState } from 'react'
import { X, Gift, Sparkles } from 'lucide-react'
import { useRole } from '../../context/RoleContext'

// Cek apakah tanggal lahir pasien cocok dengan hari ini
function isBirthdayToday(dobString) {
  if (!dobString) return false
  try {
    const today = new Date()
    const dob = new Date(dobString)
    return (
      dob.getDate() === today.getDate() &&
      dob.getMonth() === today.getMonth()
    )
  } catch {
    return false
  }
}

// Sensor nama untuk tampilan publik
function censorName(name) {
  if (!name) return '****'
  const parts = name.split(' ')
  return parts[0] + (parts.length > 1 ? ' ' + parts[1][0] + '.' : '')
}

const BirthdayOverlay = () => {
  const { customers, role } = useRole()
  const [birthdayPatient, setBirthdayPatient] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (role !== 'guest') return

    // Cari pasien pertama yang berulang tahun hari ini
    // (dalam produksi nyata: filter berdasarkan ID pasien yang login)
    const found = customers?.find((c) => isBirthdayToday(c.dob))
    if (found) setBirthdayPatient(found)
  }, [customers, role])

  // Hanya tampil di mode guest, ada pasien ulang tahun, belum di-dismiss
  if (role !== 'guest' || !birthdayPatient || dismissed) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
        onClick={() => setDismissed(true)}
      />

      {/* Panel */}
      <div
        className="fixed z-[9995] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm p-6 rounded-3xl text-center"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Tutup */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-1.5 rounded-xl"
          style={{ color: 'var(--text)', background: 'var(--bg-raised)' }}
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ikon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl"
          style={{ background: 'var(--accent-soft)' }}
        >
          🎂
        </div>

        {/* Judul */}
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Selamat Ulang Tahun! 🎉
        </h2>

        {/* Nama tersensor */}
        <p className="text-sm mb-1" style={{ color: 'var(--text)' }}>
          Hei,{' '}
          <span className="font-bold" style={{ color: 'var(--accent)' }}>
            {censorName(birthdayPatient.name)}
          </span>
          !
        </p>
        <p className="text-sm mb-5" style={{ color: 'var(--text)' }}>
          Skinova memberikan kejutan spesial untuk hari istimewa Anda ✨
        </p>

        {/* Voucher hadiah */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{
            background: 'linear-gradient(135deg, var(--accent-soft), var(--bg-raised))',
            border: '1px dashed var(--accent)',
          }}
        >
          <div className="flex items-center gap-3 justify-center mb-2">
            <Gift className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span
              className="font-black text-2xl tracking-widest font-mono"
              style={{ color: 'var(--accent)' }}
            >
              BDAY25
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text)' }}>
            Diskon <strong>25%</strong> untuk treatment favorit Anda — berlaku
            hari ini sampai 3 hari ke depan
          </p>
        </div>

        {/* CTA */}
        <button
          className="w-full py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ background: 'var(--accent)' }}
          onClick={() => setDismissed(true)}
        >
          <Sparkles className="w-4 h-4" />
          Gunakan Hadiah Sekarang
        </button>

        <p className="text-xs mt-3" style={{ color: 'var(--text)' }}>
          Voucher juga dikirim via WhatsApp terdaftar Anda
        </p>
      </div>
    </>
  )
}

export default BirthdayOverlay