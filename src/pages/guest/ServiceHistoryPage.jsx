import { useState, useEffect } from "react"
import { History, Stethoscope, CalendarPlus, Clock } from "lucide-react"
import { useRole } from "../../context/RoleContext"
import { useAuth } from "../../context/AuthContext"
import { censorName } from "../../components/crm/KanbanBoard"
import { useNavigate } from "react-router-dom"
import { appointmentService } from "../../services/appointmentService"
import Badge from "../../components/ui/Badge"

const ServiceHistoryPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }
      try {
        const appointments = await appointmentService.getByUserId(user.id)
        const mapped = (appointments || [])
          .filter(a => a.status === 'completed' || a.status === 'confirmed' || a.status === 'cancelled')
          .map(a => ({
            id: a.id,
            date: a.appointment_date
              ? new Date(a.appointment_date).toLocaleDateString('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric'
                })
              : '-',
            treatment: a.treatments?.name || 'Treatment',
            doctor: a.doctors?.name || '—',
            duration: a.treatments?.duration_min
              ? `${a.treatments.duration_min} menit`
              : '-',
            time: a.appointment_time?.slice(0, 5) || '-',
            status: a.status,
            complaint: a.complaint || '',
            notes: a.notes || '',
          }))
        setHistoryData(mapped.length > 0 ? mapped : [])
      } catch (err) {
        console.error('Gagal memuat riwayat:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user])

  const statusBadge = (status) => {
    switch (status) {
      case 'completed': return <Badge status="success">✓ Selesai</Badge>
      case 'confirmed': return <Badge status="pending">⏳ Terjadwal</Badge>
      case 'cancelled': return <Badge status="cancelled">✕ Dibatalkan</Badge>
      default: return <Badge status="pending">{status}</Badge>
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--accent-soft)" }}
        >
          <History className="w-7 h-7" style={{ color: "var(--accent)" }} />
        </div>
        <h1
          className="text-3xl font-black mb-1"
          style={{ color: "var(--text-heading)" }}
        >
          Riwayat Treatment
        </h1>
        <p style={{ color: "var(--text)" }}>
          Catatan konsultasi &amp; treatment{" "}
          {user ? censorName(user.name) : "Anda"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p style={{ color: 'var(--text)' }}>Memuat riwayat...</p>
        </div>
      ) : (
        <>
          {/* Ringkasan */}
          <div
            className="rounded-2xl p-4 mb-6 grid grid-cols-3 gap-4 text-center"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <p className="text-2xl font-black" style={{ color: "var(--accent)" }}>
                {historyData.length}
              </p>
              <p className="text-xs" style={{ color: "var(--text)" }}>
                Total Kunjungan
              </p>
            </div>
            <div>
              <p
                className="text-2xl font-black"
                style={{ color: "var(--success)" }}
              >
                {historyData.filter((h) => h.status === "completed").length}
              </p>
              <p className="text-xs" style={{ color: "var(--text)" }}>
                Selesai
              </p>
            </div>
            <div>
              <p
                className="text-2xl font-black"
                style={{ color: "var(--warning)" }}
              >
                {historyData.filter((h) => h.status === "confirmed").length}
              </p>
              <p className="text-xs" style={{ color: "var(--text)" }}>
              Terjadwal
              </p>
            </div>
          </div>

          {/* Timeline riwayat */}
          {historyData.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
              <p className="text-4xl mb-3">📭</p>
              <p className="font-medium mb-1" style={{ color: 'var(--text-heading)' }}>Belum ada riwayat treatment</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>Kunjungan pertama Anda akan tercatat di sini.</p>
              <button
                onClick={() => navigate('/portal/booking')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white"
                style={{ background: 'var(--accent)' }}
              >
                <CalendarPlus className="w-4 h-4" />
                Booking Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {historyData.map((h, i) => (
                <div
                  key={h.id || i}
                  className="rounded-2xl p-5"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text)" }}>
                        📅 {h.date}
                      </p>
                      <h3
                        className="font-bold"
                        style={{ color: "var(--text-heading)" }}
                      >
                        {h.treatment}
                      </h3>
                      <div
                        className="flex items-center gap-1.5 text-xs mt-0.5"
                        style={{ color: "var(--text)" }}
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        {h.doctor} &nbsp;·&nbsp; ⏱ {h.duration}
                        &nbsp;·&nbsp; <Clock className="w-3 h-3 inline" /> {h.time}
                      </div>
                    </div>
                    {statusBadge(h.status)}
                  </div>

                  {/* Keluhan / Catatan */}
                  {h.complaint && (
                    <div
                      className="rounded-xl p-3"
                      style={{
                        background: "var(--bg-raised)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: "var(--accent)" }}
                      >
                        📋 Keluhan:
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text)" }}
                      >
                        {h.complaint}
                      </p>
                    </div>
                  )}

                  {h.notes && (
                    <div
                      className="rounded-xl p-3 mt-2"
                      style={{
                        background: "var(--info-soft)",
                        border: "1px solid var(--info)",
                      }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: "var(--info)" }}
                      >
                        📝 Catatan Dokter:
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--info)" }}
                      >
                        {h.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {historyData.length > 0 && (
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: "var(--accent-soft)",
                border: "1px solid var(--accent)",
              }}
            >
              <p className="font-bold mb-2" style={{ color: "var(--text-heading)" }}>
                Waktunya treatment berikutnya? ✨
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text)" }}>
                Jadwalkan kunjungan selanjutnya dan lanjutkan perjalanan kecantikan
                Anda.
              </p>
              <button
                onClick={() => navigate("/portal/booking")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white"
                style={{ background: "var(--accent)" }}
              >
                <CalendarPlus className="w-4 h-4" />
                Booking Sekarang
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ServiceHistoryPage
