import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Award,
  ChevronRight,
  CalendarPlus,
  ListOrdered,
} from "lucide-react";
import LocationMap from "../../components/guest/LocationMap";

const services = [
  {
    emoji: "✨",
    title: "Facial Glow",
    desc: "Kulit cerah & bersih dalam 60 menit",
    price: "Mulai Rp 450.000",
  },
  {
    emoji: "💉",
    title: "Botox Treatment",
    desc: "Anti-aging premium hasil instan",
    price: "Mulai Rp 2.500.000",
  },
  {
    emoji: "🔬",
    title: "Laser Rejuv.",
    desc: "Teknologi laser terbaru untuk kulit muda",
    price: "Mulai Rp 1.800.000",
  },
  {
    emoji: "🧴",
    title: "Chemical Peeling",
    desc: "Eksfoliasi mendalam & pori bersih",
    price: "Mulai Rp 750.000",
  },
];

const stats = [
  { value: "5.000+", label: "Pasien Puas" },
  { value: "15+", label: "Dokter Bersertifikat" },
  { value: "98%", label: "Tingkat Kepuasan" },
  { value: "8+", label: "Tahun Berpengalaman" },
];

const testimonials = [
  {
    name: "S**** W****",
    rating: 5,
    text: "Hasilnya luar biasa! Kulit saya jauh lebih cerah setelah Facial Glow. Dokternya ramah dan profesional.",
  },
  {
    name: "M**** P****",
    rating: 5,
    text: 'Botox di Aura Clinic sangat natural. Tidak terlihat "kaku" sama sekali. Sangat direkomendasikan!',
  },
  {
    name: "R**** K****",
    rating: 5,
    text: "Pelayanannya premium, suasana nyaman, dan hasilnya memuaskan. Sudah 15x kunjungan dan selalu puas.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative py-20 px-4 md:px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-base) 60%)",
        }}
      >
        {/* Dekorasi background */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"
          style={{ background: "var(--accent)" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Klinik Kecantikan Berstandar Internasional
          </div>

          <h1
            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
            style={{ color: "var(--text-heading)" }}
          >
            Tampil <span style={{ color: "var(--accent)" }}>Percaya Diri</span>{" "}
            dengan Perawatan Terbaik
          </h1>

          <p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: "var(--text)" }}
          >
            Didukung dokter bersertifikat internasional dan teknologi estetika
            terkini, Aura Clinic hadir untuk membantu Anda tampil terbaik setiap
            hari.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/portal/booking")}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
              style={{
                background: "var(--accent)",
                boxShadow: "0 4px 20px var(--accent)44",
              }}
            >
              <CalendarPlus className="w-5 h-5" />
              Booking Konsultasi Gratis
            </button>
            <button
              onClick={() => navigate("/portal/tracking")}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                color: "var(--text-strong)",
              }}
            >
              <ListOrdered className="w-5 h-5" />
              Cek Antrean Saya
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section
        className="py-10 px-4 md:px-6"
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p
                className="text-3xl font-black mb-1"
                style={{ color: "var(--accent)" }}
              >
                {s.value}
              </p>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LAYANAN UNGGULAN ─────────────────────────────── */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-black mb-3"
              style={{ color: "var(--text-heading)" }}
            >
              Layanan Unggulan Kami
            </h2>
            <p style={{ color: "var(--text)" }}>
              Treatment premium dengan hasil terukur dan dokter berpengalaman
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="rounded-2xl p-5 transition-all cursor-pointer group"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px var(--accent)22";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
                onClick={() => navigate("/portal/services")}
              >
                <div className="text-3xl mb-3">{svc.emoji}</div>
                <h3
                  className="font-bold mb-1"
                  style={{ color: "var(--text-heading)" }}
                >
                  {svc.title}
                </h3>
                <p className="text-xs mb-3" style={{ color: "var(--text)" }}>
                  {svc.desc}
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {svc.price}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/portal/services")}
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Lihat semua layanan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── KEUNGGULAN ───────────────────────────────────── */}
      <section
        className="py-16 px-4 md:px-6"
        style={{ background: "var(--bg-raised)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-black text-center mb-10"
            style={{ color: "var(--text-heading)" }}
          >
            Mengapa Memilih Aura Clinic?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Dokter Tersertifikasi",
                desc: "Seluruh dokter kami memiliki sertifikasi estetika internasional (AAAM, BCAM).",
              },
              {
                icon: Award,
                title: "Teknologi Terkini",
                desc: "Peralatan laser dan perawatan terbaru diupdate setiap tahun.",
              },
              {
                icon: Clock,
                title: "Layanan Cepat",
                desc: "Sistem antrean digital — tidak perlu menunggu lama di klinik.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--accent-soft)" }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: "var(--accent)" }}
                  />
                </div>
                <h3
                  className="font-bold mb-2"
                  style={{ color: "var(--text-heading)" }}
                >
                  {title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────── */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-black text-center mb-2"
            style={{ color: "var(--text-heading)" }}
          >
            Kata Pasien Kami
          </h2>
          <p
            className="text-center text-sm mb-8"
            style={{ color: "var(--text)" }}
          >
            Identitas pasien dilindungi sesuai standar privasi medis
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-current"
                      style={{ color: "var(--warning)" }}
                    />
                  ))}
                </div>
                <p className="text-sm mb-3" style={{ color: "var(--text)" }}>
                  "{t.text}"
                </p>
                <p
                  className="text-xs font-bold font-mono"
                  style={{ color: "var(--accent)" }}
                >
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="maps-section">
        <LocationMap />
      </section>

      <section
        className="py-16 px-4 md:px-6 text-center"
        style={{
          background: "var(--accent-soft)",
          borderTop: "1px solid var(--accent)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <Sparkles
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: "var(--accent)" }}
          />
          <h2
            className="text-3xl font-black mb-3"
            style={{ color: "var(--text-heading)" }}
          >
            Mulai Perjalanan Kecantikan Anda
          </h2>
          <p className="mb-6" style={{ color: "var(--text)" }}>
            Konsultasi pertama gratis. Tidak perlu membuat akun.
          </p>
          <button
            onClick={() => navigate("/portal/booking")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
            style={{ background: "var(--accent)" }}
          >
            Booking Sekarang — Gratis
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
