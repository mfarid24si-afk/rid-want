import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Award,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Menu,
  Phone,
  Mail,
  MapPin,
  BellRing,
  BarChart3,
  Users,
  Database,
  Calendar,
} from "lucide-react";
import RisingParticles from "../../components/guest/RisingParticles";

// ==========================================
// DUMMY DATA
// ==========================================
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
  { value: "50+", label: "Klinik Mitra" },
  { value: "98%", label: "Tingkat Kepuasan" },
  { value: "8+", label: "Tahun Berpengalaman" },
];

const testimonials = [
  {
    name: "dr. Ayu Maharani",
    role: "Pemilik Klinik — Jakarta",
    rating: 5,
    text: "Sebelum pakai Skinova, booking masih lewat WhatsApp dan sering kacau. Sekarang semua terkelola rapi — pasien puas, staf tidak kewalahan. Dashboard bisnisnya sangat membantu evaluasi bulanan.",
    badge: "PEMILIK KLINIK",
  },
  {
    name: "Sari Wulandari",
    role: "Pasien Facial Glow",
    rating: 5,
    text: "Hasilnya luar biasa! Kulit saya jauh lebih cerah setelah Facial Glow. Dokternya ramah dan profesional.",
    badge: "PASIEN",
  },
  {
    name: "Mega Pratiwi",
    role: "Pasien Botox",
    rating: 5,
    text: "Botox di Skinova sangat natural. Tidak terlihat 'kaku' sama sekali. Sangat direkomendasikan!",
    badge: "PASIEN",
  },
];

const problems = [
  {
    problem: "Booking masih manual via WhatsApp?",
    solution: "Sistem booking online otomatis — pasien bisa pilih jadwal sendiri, admin tinggal konfirmasi.",
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    problem: "Jadwal treatment sering bentrok?",
    solution: "Kalender digital dengan deteksi bentrok otomatis — tidak ada lagi double booking.",
    color: "from-rose-500/20 to-rose-500/5",
  },
  {
    problem: "Data & riwayat pasien tersebar?",
    solution: "Semua data pasien, riwayat treatment, dan pembayaran tersimpan rapi dalam satu dashboard.",
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    problem: "Follow-up pasien tidak konsisten?",
    solution: "Reminder WhatsApp otomatis untuk jadwal treatment, ulang tahun, dan promo spesial.",
    color: "from-cyan-500/20 to-cyan-500/5",
  },
];

const crmFeatures = [
  {
    icon: Users,
    title: "Manajemen Pasien",
    desc: "Kelola data, riwayat treatment, dan preferensi setiap pasien dalam satu dashboard terpusat.",
  },
  {
    icon: Calendar,
    title: "Appointment Otomatis",
    desc: "Booking online dengan deteksi bentrok otomatis. Pasien pilih jadwal, admin tinggal konfirmasi.",
  },
  {
    icon: BellRing,
    title: "Reminder WhatsApp",
    desc: "Pengingat otomatis via WhatsApp untuk jadwal treatment, ulang tahun, dan promo spesial.",
  },
  {
    icon: Database,
    title: "Riwayat Treatment Digital",
    desc: "Catatan treatment lengkap dengan rekomendasi dokter — akses kapan saja, di mana saja.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Bisnis",
    desc: "Pantau pendapatan, okupansi, dan loyalitas pasien secara real-time dengan grafik interaktif.",
  },
  {
    icon: Award,
    title: "Membership & Poin Reward",
    desc: "Program loyalitas terintegrasi — poin otomatis, voucher ulang tahun, dan segmentasi pasien VIP.",
  },
];

const workflowSteps = [
  { step: "01", icon: Star, title: "Daftar Akun", desc: "Buat akun klinik Anda — gratis, tanpa biaya setup, tanpa kartu kredit." },
  { step: "02", icon: Users, title: "Import Data Pasien", desc: "Migrasi data pasien existing dengan mudah — atau mulai dari awal dengan template siap pakai." },
  { step: "03", icon: Clock, title: "Atur Jadwal & Layanan", desc: "Konfigurasi layanan, jadwal dokter, dan sistem reminder dalam satu dashboard." },
  { step: "04", icon: BarChart3, title: "Pantau & Kembangkan", desc: "Pantau performa klinik secara real-time dan tingkatkan retensi pasien dengan data akurat." },
];

// ==========================================
// ANIMASI
// ==========================================
const floatVariants = (yOffset = -12, rotation = 1) => ({
  animate: {
    y: [0, yOffset, 0],
    rotate: [0, rotation, 0],
  },
});

const floatTransition = (delay = 0, duration = 5) => ({
  y: {
    duration: duration,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
    delay: delay,
  },
  rotate: {
    duration: duration * 1.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
    delay: delay,
  },
});

const scrollFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const AnimatedCounter = ({ value }) => {
  const matches = value.match(/^([\d.,]+)(.*)$/);
  let target = 0;
  let suffix = "";
  if (matches) {
    target = parseFloat(matches[1].replace(/\./g, ""));
    suffix = matches[2];
  } else {
    target = parseFloat(value) || 0;
  }

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest);
    return new Intl.NumberFormat("id-ID").format(num) + suffix;
  });

  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const controls = animate(count, target, {
              duration: 2.5,
              ease: [0.16, 1, 0.3, 1],
            });
            return () => controls.stop();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [target, hasAnimated, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

// ==========================================
// NAVBAR BUILT-IN
// ==========================================
const GuestNavbar = ({ isDark }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Fitur", href: "crm-features" },
    { label: "Layanan", href: "services" },
    { label: "Testimoni", href: "testimonials" },
    { label: "FAQ", href: "faq" },
    { label: "Kontak", href: "contact" },
  ];

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-xl"
            aria-label="Beranda"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span
                className="font-black text-lg tracking-tight"
                style={{ color: "var(--text-heading)" }}
              >
                Skinova
              </span>
              <p className="text-[10px] hidden sm:block" style={{ color: "var(--text)" }}>
                Klinik Kecantikan & Estetika
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                style={{ color: "var(--text)" }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/auth/login")}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              style={{ color: "var(--text-strong)" }}
              aria-label="Masuk ke akun"
            >
              Masuk
            </button>
            <motion.button
              onClick={() => navigate("/auth/register")}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ background: "var(--accent)" }}
              aria-label="Coba Skinova CRM gratis"
            >
              Coba Gratis
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            style={{ color: "var(--text-strong)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-5 space-y-2 border-t pt-3"
            style={{ borderColor: "var(--border)" }}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left px-3 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ color: "var(--text)" }}
              >
                {link.label}
              </button>
            ))}
            <hr style={{ borderColor: "var(--border)", margin: "8px 0" }} />
            <button
              onClick={() => { setMobileOpen(false); navigate("/auth/login"); }}
              className="block w-full text-left px-3 py-3 rounded-xl text-sm font-semibold"
              style={{ color: "var(--text-strong)" }}
            >
              Masuk
            </button>
            <button
              onClick={() => { setMobileOpen(false); navigate("/auth/register"); }}
              className="block w-full text-center px-3 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              Coba Gratis
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

// ==========================================
// FOOTER BUILT-IN
// ==========================================
const GuestFooter = ({ isDark }) => {
  const navigate = useNavigate();

  return (
    <footer
      className="relative z-10 border-t border-black/5 dark:border-white/5"
      style={{
        background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12" id="contact">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p
                  className="font-bold text-base leading-none"
                  style={{ color: "var(--text-heading)" }}
                >
                  Skinova
                </p>
                <p className="text-xs" style={{ color: "var(--text)" }}>
                  Klinik Kecantikan & Estetika
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              CRM untuk klinik kecantikan. Kelola pasien, jadwal, pembayaran, dan
              dashboard bisnis dalam satu platform yang mudah digunakan.
            </p>
          </div>

          {/* Layanan */}
          <div>
            <p
              className="text-sm font-bold mb-4"
              style={{ color: "var(--text-heading)" }}
            >
              Layanan
            </p>
            <ul className="space-y-2.5">
              {["Facial Glow", "Botox Treatment", "Laser Rejuvenation", "Chemical Peeling"].map(
                (item) => (
                  <li key={item}>
                    <button
                      onClick={() => navigate("/portal/services")}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: "var(--text)" }}
                    >
                      {item}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <p
              className="text-sm font-bold mb-4"
              style={{ color: "var(--text-heading)" }}
            >
              Kontak
            </p>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: "Jl. Sudirman No. 88, Pekanbaru" },
                { icon: Phone, text: "+62 812-3456-7890" },
                { icon: Mail, text: "hello@skinova.id" },
                { icon: Clock, text: "Sen–Sab, 09.00–20.00 WIB" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                  <span className="text-sm" style={{ color: "var(--text)" }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Jam & Legal */}
          <div>
            <p
              className="text-sm font-bold mb-4"
              style={{ color: "var(--text-heading)" }}
            >
              Informasi
            </p>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigate("/portal/about")}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--text)" }}
                >
                  Tentang Klinik
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--text)" }}
                >
                  Coba CRM Gratis
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--text)" }}
                >
                  Portal Pasien
                </button>
              </li>
            </ul>
            <div
              className="mt-6 p-3 rounded-xl"
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                🔒 Data Terenkripsi
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text)" }}>
                Privasi & keamanan data pasien adalah prioritas kami.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-8 mt-8 text-xs"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          <p>© 2025 Skinova. Seluruh hak dilindungi.</p>
          <div className="flex gap-4">
            <button className="hover:opacity-80 transition-opacity" style={{ color: "var(--text)" }}>
              Kebijakan Privasi
            </button>
            <button className="hover:opacity-80 transition-opacity" style={{ color: "var(--text)" }}>
              Syarat & Ketentuan
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// GUEST LANDING PAGE — 100% PPT COMPLIANT
// ==========================================
const GuestLandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const { clientX, clientY } = e;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-300"
      style={{
        background: "var(--bg-base)",
        color: "var(--text-strong)",
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      }}
    >
      {/* ── BACKGROUND GLOW ────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] transition-all duration-500 ${isDark ? "bg-violet-600/10" : "bg-[#C9A96E]/8"}`} />
        <div className={`absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] transition-all duration-500 ${isDark ? "bg-cyan-600/10" : "bg-rose-300/8"}`} />
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none opacity-40"
          style={{
            background: isDark
              ? "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.12), rgba(99, 102, 241, 0.05) 50%, transparent 80%)"
              : "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(201, 169, 110, 0.15), rgba(212, 149, 106, 0.05) 50%, transparent 80%)",
          }}
        />
      </div>

      <RisingParticles theme={theme} />

      {/* ═══════════════════════════════════════════════════════
          TOP AREA: NAVBAR + HERO
         ═══════════════════════════════════════════════════════ */}
      <GuestNavbar isDark={isDark} />

      {/* ── HERO ── (Attention + Problem) */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 text-left flex flex-col justify-center"
          >
            <motion.div
              variants={floatVariants(-6, 0.5)}
              animate="animate"
              transition={floatTransition(0, 4)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-[var(--border)] bg-[var(--bg-surface)]/60 text-[var(--accent)] backdrop-blur-md self-start"
            >
              <Sparkles className="w-3.5 h-3.5" />
              CRM untuk Klinik Kecantikan
            </motion.div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight"
              style={{ color: "var(--text-heading)" }}
            >
              Kelola{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? "from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "from-[#C9A96E] via-[#D4956A] to-[#B8935A]"}`}>
                Klinik Kecantikan
              </span>{" "}
              dengan Mudah & Profesional
            </h1>

            {/* Problem-aware subheadline */}
            <p className="text-[var(--text)] text-base md:text-lg mb-8 max-w-xl leading-relaxed font-normal">
              Dari booking online, manajemen jadwal, reminder WhatsApp otomatis,
              hingga dashboard bisnis real-time — Skinova CRM membantu Anda
              mengelola klinik kecantikan lebih efisien, meningkatkan kepuasan
              pasien, dan mengembangkan bisnis dengan data yang akurat.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => navigate("/auth/register")}
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  boxShadow: isDark ? "0 0 25px rgba(56,189,248,0.4)" : "0 8px 25px rgba(201,169,110,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base cursor-pointer transition-all border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: "var(--accent)", borderColor: "var(--accent)" }}
                aria-label="Coba Skinova CRM gratis 14 hari"
              >
                <Sparkles className="w-5 h-5 text-white/80" />
                Coba Gratis 14 Hari
              </motion.button>

              <motion.button
                onClick={() => {
                  const el = document.getElementById("crm-features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                style={{ color: "var(--text-strong)" }}
                aria-label="Lihat fitur CRM Skinova"
              >
                <ArrowRight className="w-5 h-5" style={{ color: "var(--text)" }} />
                Lihat Fitur CRM
              </motion.button>
            </div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[420px]"
          >
            <div className="absolute w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-[70px] animate-pulse z-0" />

            {/* Main Image Card */}
            <motion.div
              variants={floatVariants(-12, 1)}
              animate="animate"
              transition={floatTransition(0, 6)}
              className="relative w-[280px] h-[360px] rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-lg z-10"
              style={{
                boxShadow: isDark
                  ? "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)"
                  : "0 15px 30px rgba(74, 55, 40, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.2)",
              }}
            >
              <img
                src="img/facial.webp"
                alt="Suasana perawatan premium Skinova CRM — tampilan klinik kecantikan modern dan mewah"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t dark:from-black/90 dark:via-black/45 dark:to-transparent from-[#4A3728]/80 via-[#4A3728]/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-left text-white">
                <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] font-bold uppercase">
                  Skinova Facial Assessment
                </span>
                <h4 className="text-lg font-bold mt-1 text-white leading-snug">
                  Sensasi Perawatan Mewah & Menenangkan
                </h4>
              </div>
            </motion.div>

            {/* Floating Badges */}
            <motion.div
              variants={floatVariants(-22, -2)}
              animate="animate"
              transition={floatTransition(0.5, 5)}
              className="absolute top-8 -left-4 w-[150px] p-4 rounded-2xl bg-white/80 dark:bg-[#1C1C1C]/80 border border-black/5 dark:border-white/10 backdrop-blur-xl shadow-md z-20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                <span className="text-[9px] font-bold font-mono text-[var(--accent)] tracking-wider">GLOW REPORT</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[var(--text-heading)]">98.4%</span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">Radiant</span>
              </div>
              <p className="text-[10px] text-[var(--text)] mt-1 font-normal">Indeks pancaran cahaya kulit optimal</p>
            </motion.div>

            <motion.div
              variants={floatVariants(-16, 2)}
              animate="animate"
              transition={floatTransition(1, 5.5)}
              className="absolute -bottom-4 -right-4 w-[180px] p-4 rounded-2xl bg-white/80 dark:bg-[#1C1C1C]/80 border border-black/5 dark:border-white/10 backdrop-blur-xl shadow-md z-20"
            >
              <div>
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-[var(--text)]">Skin Hydration</span>
                  <span className="font-bold text-[var(--text-heading)]">94.2%</span>
                </div>
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: "94.2%" }} />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-[var(--text)]">Collagen Density</span>
                  <span className="font-bold text-[var(--text-heading)]">88.7%</span>
                </div>
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--border-strong)] rounded-full" style={{ width: "88.7%" }} />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={floatVariants(-8, 3)}
              animate="animate"
              transition={floatTransition(1.5, 4.2)}
              className="absolute top-24 -right-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1C1C1C]/90 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm text-xs font-bold z-20"
              style={{ color: "var(--text-strong)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Doctor Approved</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MIDDLE AREA: PROBLEM & SOLUTION
         ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8 relative z-10 bg-black/[0.02] dark:bg-black/20 border-y border-black/5 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span
              variants={floatVariants(-4, 0.3)}
              animate="animate"
              transition={floatTransition(0, 3.5)}
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-[var(--border)] bg-[var(--bg-surface)]/60 text-[var(--accent)]"
            >
              Masalah & Solusi
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-[var(--text-heading)]">
              Kendala Operasional Klinik Anda?{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? "from-cyan-400 to-teal-300" : "from-[#C9A96E] to-[#D4956A]"}`}>
                Ada Solusinya
              </span>
            </h2>
            <p className="text-[var(--text)] text-sm sm:text-base max-w-xl mx-auto font-normal">
              Ratusan klinik telah beralih ke sistem digital. Kelola booking, jadwal, data pasien, dan follow-up dalam satu platform terintegrasi.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {problems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="rounded-2xl p-5 flex items-start gap-4 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    background: `var(--accent-soft)`,
                    borderColor: "var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  <X className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-heading)" }}>
                    {item.problem}
                  </p>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500" />
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>
                      {item.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MIDDLE AREA: SOCIAL PROOF (STATS)
         ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeUp}
        className="py-12 px-4 md:px-8 z-10 relative"
      >
        <div className="max-w-5xl mx-auto rounded-3xl p-8 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md"
          style={{
            boxShadow: isDark
              ? "inset 0 0 15px rgba(255,255,255,0.02), 0 10px 40px rgba(0,0,0,0.5)"
              : "inset 0 0 15px rgba(255,255,255,0.3), var(--shadow-sm)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {stats.map((s, idx) => (
              <div key={s.label} className="relative group">
                <p className="text-3xl sm:text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-strong)] to-[var(--text)]">
                  <AnimatedCounter value={s.value} />
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
                  {s.label}
                </p>
                {idx < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-black/5 dark:bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          MIDDLE AREA: CRM FEATURE SHOWCASE (NEW)
         ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8 relative z-10" id="crm-features">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-black mb-4 text-[var(--text-heading)]"
            >
              Semua Fitur untuk Kelola Klinik Anda
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[var(--text)] text-sm sm:text-base max-w-lg mx-auto"
            >
              Dari manajemen pasien hingga dashboard bisnis — semua terintegrasi dalam satu platform yang mudah digunakan.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {crmFeatures.map((feature, idx) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="rounded-2xl p-6 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md hover:border-[var(--accent)] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border bg-[var(--accent-soft)] border-[var(--border)] shadow-inner group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="font-bold text-base mb-2 text-[var(--text-heading)] group-hover:text-[var(--accent)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[var(--text)] text-sm leading-relaxed font-normal">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <motion.button
              onClick={() => navigate("/auth/register")}
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ background: "var(--accent)" }}
              aria-label="Mulai gratis menggunakan Skinova CRM"
            >
              Coba Gratis 14 Hari <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MIDDLE AREA: FEATURES (LAYANAN)
         ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8 relative z-10" id="services">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-black mb-4 text-[var(--text-heading)]"
            >
              Layanan Unggulan Kami
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[var(--text)] text-sm sm:text-base max-w-lg mx-auto"
            >
              Treatment premium dengan hasil terukur — dikelola melalui sistem CRM terintegrasi untuk pengalaman pasien yang lebih baik.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-6 gap-6"
          >
            {/* Main Card */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="md:col-span-4 rounded-3xl p-8 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md hover:border-[var(--accent)] flex flex-col justify-between cursor-pointer group transition-all duration-300 relative overflow-hidden min-h-[500px]"
              onClick={() => navigate("/portal/services")}
            >
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                <img src="img/facial_glow.jpeg" alt={services[0].title} className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t dark:from-black/80 dark:via-black/20 from-white/95 via-white/40 to-transparent" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-raised)] border border-[var(--border)] flex items-center justify-center text-4xl mb-6 shadow-inner">
                  {services[0].emoji}
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-heading)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {services[0].title}
                </h3>
                <p className="text-[var(--text)] text-sm max-w-md font-normal leading-relaxed">
                  {services[0].desc}. Menggunakan sistem stimulasi partikel dingin AI untuk mencerahkan secara instan tanpa iritasi.
                </p>
              </div>
              <div className="flex justify-between items-center mt-8 border-t border-black/5 dark:border-white/5 pt-4 relative z-10">
                <span className="text-[var(--accent)] text-sm font-bold tracking-wide font-mono">{services[0].price}</span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--text)] font-bold group-hover:text-[var(--accent)] transition-colors">
                  Detail Layanan <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>

            {/* Side Cards */}
            <div className="md:col-span-2 flex flex-col gap-4 h-full">
              {services.slice(1).map((service, i) => (
                <motion.div
                  key={service.title}
                  variants={staggerItem}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  className="rounded-3xl p-5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md hover:border-[var(--accent)] flex flex-col justify-between cursor-pointer group transition-all duration-300 relative overflow-hidden flex-1"
                  onClick={() => navigate("/portal/services")}
                >
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                    <img src={`img/${["botox.webp", "laser.jpg", "chemical.jpg"][i]}`} alt={service.title} className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t dark:from-black/80 dark:via-black/20 from-white/95 via-white/40 to-transparent" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] flex items-center justify-center text-2xl mb-3 shadow-inner">
                      {service.emoji}
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-heading)] mb-1 group-hover:text-[var(--accent)] transition-colors">{service.title}</h3>
                    <p className="text-[var(--text)] text-xs leading-relaxed font-normal opacity-80 line-clamp-2">{service.desc}</p>
                  </div>
                  <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-2 relative z-10 flex justify-between items-center">
                    <p className="text-[var(--accent)] text-xs font-bold font-mono">{service.price}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="text-center mt-12">
            <motion.button
              onClick={() => navigate("/portal/services")}
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:opacity-80 transition-colors cursor-pointer bg-white/60 dark:bg-white/5 px-6 py-2.5 rounded-full border border-black/5 dark:border-white/5 hover:border-[var(--accent)]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Lihat semua layanan <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MIDDLE AREA: WORKFLOW — HOW IT WORKS
         ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8 relative z-10 bg-black/[0.02] dark:bg-black/20 border-y border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-[var(--text-heading)]">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-[var(--text)] text-sm sm:text-base max-w-lg mx-auto font-normal">
              Empat langkah mudah untuk mulai menggunakan Skinova CRM di klinik Anda.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                variants={staggerItem}
                className="relative text-center p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Step Number */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-lg font-black border-2"
                  style={{
                    color: "var(--accent)",
                    borderColor: "var(--accent)",
                    background: "var(--accent-soft)",
                  }}
                >
                  {step.step}
                </div>

                {/* Connector line (desktop) */}
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-[2px]"
                    style={{
                      background: `linear-gradient(to right, var(--accent), transparent)`,
                      opacity: 0.3,
                    }}
                  />
                )}

                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text-heading)" }}>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MIDDLE AREA: TRUST (KEUNGGULAN)
         ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-center mb-16 text-[var(--text-heading)]"
          >
            Mengapa Memilih Skinova?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Keamanan Data Terjamin",
                desc: "Data pasien terenkripsi penuh sesuai standar privasi. Hanya staf berwenang yang dapat mengakses informasi sensitif.",
                delay: 0.1,
              },
              {
                icon: BellRing,
                title: "Integrasi WhatsApp",
                desc: "Reminder otomatis, notifikasi booking, dan follow-up pasien langsung via WhatsApp — tanpa biaya tambahan.",
                delay: 0.3,
              },
              {
                icon: Clock,
                title: "Support Cepat & Mudah",
                desc: "Tim support siap membantu via WhatsApp dan telepon. Setup awal dibantu gratis — tidak perlu staf IT khusus.",
                delay: 0.5,
              },
            ].map(({ icon: Icon, title, desc, delay }) => (
              <motion.div
                key={title}
                variants={floatVariants(-10, 0.8)}
                animate="animate"
                transition={floatTransition(delay, 4.5)}
                className="rounded-3xl p-8 text-center bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md hover:bg-white/80 dark:hover:bg-white/10 transition-colors duration-300 relative group"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 border bg-[var(--accent-soft)] border-[var(--border)] shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-[var(--text-heading)]">{title}</h3>
                <p className="text-[var(--text)] text-xs sm:text-sm leading-relaxed font-normal">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MIDDLE AREA: TESTIMONIALS
         ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8 relative z-10 bg-black/[0.02] dark:bg-black/20 border-y border-black/5 dark:border-white/5" id="testimonials">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black mb-3 text-[var(--text-heading)]"
            >
              Yang Mereka Katakan
            </motion.h2>
            <p className="text-[var(--text)] text-xs sm:text-sm">
              Pengalaman nyata dari pasien dan mitra klinik yang menggunakan Skinova.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                variants={floatVariants(idx % 2 === 0 ? -12 : -8, idx % 2 === 0 ? 1 : -1)}
                animate="animate"
                transition={floatTransition(idx * 0.4, 5 + idx * 0.5)}
                className="rounded-3xl p-6 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md hover:border-[var(--accent)]/30 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                    ))}
                  </div>
                  <p className="text-[var(--text-strong)] text-xs sm:text-sm italic leading-relaxed font-normal">
                    "{t.text}"
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold font-mono text-[var(--accent)]">{t.name}</p>
                    {t.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: t.badge === 'PEMILIK KLINIK' ? 'var(--accent-soft)' : 'var(--info-soft)',
                          color: t.badge === 'PEMILIK KLINIK' ? 'var(--accent)' : 'var(--info)',
                          border: `1px solid ${t.badge === 'PEMILIK KLINIK' ? 'var(--accent)' : 'var(--info)'}33`,
                        }}
                      >
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text)" }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MIDDLE AREA: FAQ
         ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8 relative z-10" id="faq">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black mb-3 text-[var(--text-heading)]">
              Pertanyaan Umum
            </h2>
            <p className="text-[var(--text)] text-sm font-normal max-w-lg mx-auto">
              Temukan jawaban seputar CRM, layanan klinik, booking, dan perawatan di Skinova.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-3"
          >
            {[
              {
                q: "Apa saja fitur utama Skinova CRM?",
                a: "Skinova CRM memiliki 6 fitur utama: Manajemen Pasien (data & riwayat terpusat), Appointment Otomatis (booking online + deteksi bentrok), Reminder WhatsApp (pengingat jadwal & promo), Riwayat Treatment Digital (catatan lengkap), Dashboard Bisnis (grafik pendapatan & okupansi real-time), serta Membership & Poin Reward (program loyalitas terintegrasi).",
              },
              {
                q: "Apakah data pasien aman di Skinova CRM?",
                a: "Keamanan adalah prioritas utama kami. Seluruh data pasien disimpan dengan enkripsi penuh, akses berbasis peran (role-based), dan backup otomatis harian. Kami juga mematuhi standar perlindungan data pribadi yang berlaku di Indonesia.",
              },
              {
                q: "Berapa biaya berlangganan Skinova CRM?",
                a: "Kami menawarkan free trial 14 hari tanpa biaya dan tanpa kartu kredit. Setelah masa trial, tersedia paket bulanan dan tahunan dengan harga terjangkau — mulai dari Rp 299.000/bulan. Tim kami akan membantu Anda memilih paket yang sesuai dengan ukuran klinik.",
              },
              {
                q: "Apakah bisa integrasi dengan WhatsApp existing?",
                a: "Ya! Skinova CRM terintegrasi penuh dengan WhatsApp API. Reminder jadwal, notifikasi booking, dan follow-up pasien terkirim otomatis tanpa perlu instalasi tambahan. Cukup hubungkan nomor WhatsApp klinik Anda.",
              },
              {
                q: "Bagaimana cara booking jadwal treatment?",
                a: "Booking mudah melalui website kami setelah mendaftar akun: pilih treatment, pilih jadwal yang tersedia, dan konfirmasi. Anda juga bisa booking langsung melalui WhatsApp atau datang ke klinik.",
              },
              {
                q: "Apakah ada program loyalitas atau promo rutin?",
                a: "Ya! Kami memiliki program poin reward yang bisa ditukar dengan treatment gratis, voucher ulang tahun spesial, dan promo bulanan untuk pasien setia. Daftar sekarang untuk mulai mengumpulkan poin.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-2xl"
                  style={{ color: "var(--text-strong)" }}
                >
                  <span className="font-semibold text-sm md:text-base leading-snug flex-1">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                    style={{
                      background: "var(--bg-raised)",
                      border: "1px solid var(--border)",
                      color: "var(--accent)",
                    }}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM AREA: FINAL CTA
         ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-8 text-center relative overflow-hidden z-10 bg-black/[0.01] dark:bg-black/40 border-t border-black/5 dark:border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_center,var(--accent-soft),transparent)] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            variants={floatVariants(-8, 0.5)}
            animate="animate"
            transition={floatTransition(0.1, 4.5)}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[var(--accent-soft)] border border-[var(--accent)]/20 mb-6"
            style={{
              boxShadow: isDark ? "0 0 20px rgba(56,189,248,0.2)" : "0 4px 15px rgba(201,169,110,0.15)",
            }}
          >
            <Sparkles className="w-8 h-8 text-[var(--accent)] animate-pulse" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-[var(--text-heading)] leading-tight">
            Kelola Klinik Anda dengan Skinova CRM
          </h2>

          <p className="text-[var(--text)] text-sm sm:text-base mb-8 max-w-md mx-auto font-normal leading-relaxed">
            Coba gratis 14 hari tanpa kartu kredit. Tim kami siap membantu setup awal dan migrasi data klinik Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => navigate("/auth/register")}
              whileHover={{
                scale: 1.06,
                y: -4,
                boxShadow: isDark ? "0 0 30px rgba(56,189,248,0.5)" : "0 10px 30px rgba(201,169,110,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-black text-white text-base shadow-md cursor-pointer transition-all border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ background: "var(--accent)", borderColor: "var(--accent)" }}
              aria-label="Coba Skinova CRM gratis 14 hari"
            >
              Coba Gratis 14 Hari
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => navigate("/auth/login")}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-5 rounded-2xl font-bold text-base bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              style={{ color: "var(--text-strong)" }}
              aria-label="Masuk ke portal pasien"
            >
              Masuk ke Portal Pasien
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM AREA: FOOTER
         ═══════════════════════════════════════════════════════ */}
      <GuestFooter isDark={isDark} />
    </div>
  );
};

export default GuestLandingPage;
