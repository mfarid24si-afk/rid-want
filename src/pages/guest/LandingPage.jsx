import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
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
  Activity,
} from "lucide-react";
import LocationMap from "../../components/guest/Locationmap";
import RisingParticles from "../../components/guest/RisingParticles";

// ==========================================
// DUMMY DATA (Struktur tidak diubah)
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

// ==========================================
// ANIMASI UTAMA: ANTIGRAVITY CONFIGS
// ==========================================

// 1. Efek Melayang Lambat (Floating Effect)
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

// 2. Anti-Gravity Scroll (Fade-in + Slide-up)
const scrollFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1], // Cubic-bezier easeOut
    },
  },
};

// 3. Staggered Entrance
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

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const containerRef = useRef(null);

  // Efek Mouse Follower Glow (Interactive Pointer)
  // Menghitung koordinat cursor dan memperbarui CSS variables
  // tanpa menyebabkan re-render terus menerus pada React
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
      {/* ── BACKGROUND LAYER & GLOW ACCENTS ────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Glow Nebula Kanan Atas */}
        <div
          className={`absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] transition-all duration-500 ${
            isDark ? "bg-violet-600/10" : "bg-[#C9A96E]/8"
          }`}
        />

        {/* Glow Nebula Kiri Bawah */}
        <div
          className={`absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] transition-all duration-500 ${
            isDark ? "bg-cyan-600/10" : "bg-rose-300/8"
          }`}
        />

        {/* Glow Nebula Tengah (Interaktif) */}
        <div
          className={`absolute top-[35%] left-[25%] w-[40vw] h-[40vw] rounded-full blur-[130px] transition-all duration-500 ${
            isDark ? "bg-teal-500/5" : "bg-amber-300/5"
          }`}
        />

        {/* Mouse Follower Glow (Pendaran Neon Interaktif) */}
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none opacity-40"
          style={{
            background: isDark
              ? "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.12), rgba(99, 102, 241, 0.05) 50%, transparent 80%)"
              : "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(201, 169, 110, 0.15), rgba(212, 149, 106, 0.05) 50%, transparent 80%)",
          }}
        />
      </div>

      {/* Partikel Melayang Menentang Gravitasi */}
      <RisingParticles theme={theme} />

      {/* ── HERO SECTION (Weightless Showcase) ──────────────── */}
      <section className="relative pt-24 pb-20 px-4 md:px-8 z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Sisi Kiri: Teks Promosi & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 text-left flex flex-col justify-center animate-fade-in"
          >
            {/* Badge Terapung */}
            <motion.div
              variants={floatVariants(-6, 0.5)}
              animate="animate"
              transition={floatTransition(0, 4)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-[var(--border)] bg-[var(--bg-surface)]/60 text-[var(--accent)] backdrop-blur-md self-start shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_0_15px_rgba(56,189,248,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Klinik Estetika AI Berstandar Internasional
            </motion.div>

            {/* Judul Utama Cinematic */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight"
              style={{ color: "var(--text-heading)" }}
            >
              Tampil{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDark
                    ? "from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    : "from-[#C9A96E] via-[#D4956A] to-[#B8935A]"
                }`}
              >
                Percaya Diri
              </span>{" "}
              dengan Perawatan Terbaik
            </h1>

            {/* Paragraf Keterangan */}
            <p className="text-[var(--text)] text-base md:text-lg mb-8 max-w-xl leading-relaxed font-normal">
              Didukung dokter bersertifikat internasional dan teknologi estetika
              AI terkini, Aura Clinic hadir untuk membantu Anda tampil optimal
              setiap hari dengan sensasi perawatan premium yang tenang dan
              melayang.
            </p>

            {/* Tombol CTA dengan Magnetic Hover */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => navigate("/portal/booking")}
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  boxShadow: isDark
                    ? "0 0 25px rgba(56,189,248,0.4)"
                    : "0 8px 25px rgba(201,169,110,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base cursor-pointer transition-all border"
                style={{
                  background: "var(--accent)",
                  borderColor: "var(--accent)",
                }}
              >
                <CalendarPlus className="w-5 h-5 text-white/80" />
                Booking Konsultasi Gratis
              </motion.button>

              <motion.button
                onClick={() => navigate("/portal/tracking")}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md cursor-pointer transition-all"
                style={{ color: "var(--text-strong)" }}
              >
                <ListOrdered
                  className="w-5 h-5"
                  style={{ color: "var(--text)" }}
                />
                Cek Antrean Saya
              </motion.button>
            </div>
          </motion.div>

          {/* Sisi Kanan: Multi-layered Floating Beauty Cards (Aura Premium Skin Analyzer) */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[460px]"
          >
            {/* Glow Bulat di Belakang */}
            <div className="absolute w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-[70px] animate-pulse z-0" />

            {/* Main Layer: Premium Skincare Image Card */}
            <motion.div
              variants={floatVariants(-12, 1)}
              animate="animate"
              transition={floatTransition(0, 6)}
              className="relative w-[280px] h-[360px] rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-lg dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] z-10"
              style={{
                boxShadow: isDark
                  ? "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)"
                  : "0 15px 30px rgba(74, 55, 40, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Image background */}
              <img
                src="img/facial.webp"
                alt="Aura Luxury Treatment"
                className="w-full h-full object-cover"
              />
              
              {/* Soft overlay gradient matching the theme */}
              <div className="absolute inset-0 bg-gradient-to-t dark:from-black/90 dark:via-black/45 dark:to-transparent from-[#4A3728]/80 via-[#4A3728]/25 to-transparent" />

              {/* Text label at the bottom of the image card */}
              <div className="absolute bottom-5 left-5 right-5 text-left text-white">
                <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] font-bold uppercase">
                  Aura Facial Assessment
                </span>
                <h4 className="text-lg font-bold mt-1 text-white leading-snug">
                  Sensasi Perawatan Mewah &amp; Menenangkan
                </h4>
              </div>
            </motion.div>

            {/* Floating Layer 1: Skin Analyzer Score (Top Left) */}
            <motion.div
              variants={floatVariants(-22, -2)}
              animate="animate"
              transition={floatTransition(0.5, 5)}
              className="absolute top-8 -left-4 w-[160px] p-4 rounded-2xl bg-white/80 dark:bg-[#1C1C1C]/80 border border-black/5 dark:border-white/10 backdrop-blur-xl shadow-md z-20"
              style={{
                boxShadow: isDark
                  ? "0 10px 25px rgba(0,0,0,0.3)"
                  : "0 10px 25px rgba(74,55,40,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                <span className="text-[9px] font-bold font-mono text-[var(--accent)] tracking-wider">
                  GLOW REPORT
                </span>
              </div>
              
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[var(--text-heading)]">
                  98.4%
                </span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                  Radiant
                </span>
              </div>
              <p className="text-[10px] text-[var(--text)] mt-1 font-normal leading-tight">
                Indeks pancaran cahaya kulit optimal
              </p>
            </motion.div>

            {/* Floating Layer 2: Hydration & Collagen Metrics (Bottom Right) */}
            <motion.div
              variants={floatVariants(-16, 2)}
              animate="animate"
              transition={floatTransition(1, 5.5)}
              className="absolute -bottom-4 -right-4 w-[190px] p-4 rounded-2xl bg-white/80 dark:bg-[#1C1C1C]/80 border border-black/5 dark:border-white/10 backdrop-blur-xl shadow-md z-20"
              style={{
                boxShadow: isDark
                  ? "0 10px 25px rgba(0,0,0,0.3)"
                  : "0 10px 25px rgba(74,55,40,0.06)",
              }}
            >
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-[var(--text)]">Skin Hydration</span>
                    <span className="font-bold text-[var(--text-heading)]">94.2%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: "94.2%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-[var(--text)]">Collagen Density</span>
                    <span className="font-bold text-[var(--text-heading)]">88.7%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--border-strong)] rounded-full" style={{ width: "88.7%" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Layer 3: Doctor Approved Badge (Top Right) */}
            <motion.div
              variants={floatVariants(-8, 3)}
              animate="animate"
              transition={floatTransition(1.5, 4.2)}
              className="absolute top-24 -right-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1C1C1C]/90 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm text-xs font-bold text-[var(--text-strong)] z-20 shadow-[0_4px_12px_rgba(74,55,40,0.05)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Doctor Approved</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS SECTION (Floating Bar) ───────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeUp}
        className="py-12 px-4 md:px-8 z-10 relative"
      >
        {/* Container Utama Glassmorphism */}
        <div
          className="max-w-5xl mx-auto rounded-3xl p-8 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative"
          style={{
            boxShadow: isDark
              ? "inset 0 0 15px rgba(255,255,255,0.02), 0 10px 40px rgba(0,0,0,0.5)"
              : "inset 0 0 15px rgba(255,255,255,0.3), var(--shadow-sm)",
          }}
        >
          {/* Grid Statik */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {stats.map((s, idx) => (
              <div key={s.label} className="relative group">
                <p className="text-3xl sm:text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-strong)] to-[var(--text)] drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
                  {s.label}
                </p>

                {/* Garis Pemisah Vertikal */}
                {idx < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-black/5 dark:bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── LAYANAN UNGGULAN (Asymmetric Grid) ─────────────── */}
      <section className="py-20 px-4 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
              Treatment premium dengan hasil terukur, dipandu teknologi
              diagnosis kecerdasan buatan terdepan.
            </motion.p>
          </div>

          {/* Grid Layanan Asimetris */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-6 gap-6"
          >
            {/* MASTER GRID CONTAINER - Pastikan pembungkus paling luarnya memiliki class grid-cols-1 md:grid-cols-6 */}

            {/* Kolom Kiri: FACIAL GLOW (Penuh dari atas sampai bawah) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              onClick={() => navigate("/portal/services")}
              className="md:col-span-4 rounded-3xl p-8 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-[var(--accent)] hover:shadow-[0_8px_30px_rgba(201,169,110,0.15)] dark:hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] flex flex-col justify-between cursor-pointer group transition-all duration-300 relative overflow-hidden h-full min-h-[500px]"
            >
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                <img
                  src="img/facial_glow.jpeg"
                  alt={services[0].title}
                  className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
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
                  {services[0].desc}. Menggunakan sistem stimulasi partikel
                  dingin AI untuk mencerahkan secara instan tanpa iritasi.
                </p>
              </div>

              <div className="flex justify-between items-center mt-8 border-t border-black/5 dark:border-white/5 pt-4 relative z-10">
                <span className="text-[var(--accent)] text-sm font-bold tracking-wide font-mono">
                  {services[0].price}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--text)] font-bold group-hover:text-[var(--accent)] transition-colors">
                  Detail Perawatan{" "}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>

            {/* SUB-GRID KANAN: Pembungkus untuk 3 card samping agar berjejer ke bawah */}
            <div className="md:col-span-2 flex flex-col gap-4 h-full">
              {/* Card 2: BOTOX TREATMENT */}
              <motion.div
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                onClick={() => navigate("/portal/services")}
                className="rounded-3xl p-5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-[var(--accent)] flex flex-col justify-between cursor-pointer group transition-all duration-300 relative overflow-hidden flex-1 min-h-[160px]"
              >
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                  <img
                    src="img/botox.webp"
                    alt={services[1].title}
                    className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t dark:from-black/80 dark:via-black/20 from-white/95 via-white/40 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] flex items-center justify-center text-2xl mb-3 shadow-inner">
                    {services[1].emoji}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-heading)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                    {services[1].title}
                  </h3>
                  <p className="text-[var(--text)] text-xs leading-relaxed font-normal opacity-80 line-clamp-2">
                    {services[1].desc}
                  </p>
                </div>

                <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-2 relative z-10 flex justify-between items-center">
                  <p className="text-[var(--accent)] text-xs font-bold font-mono">
                    {services[1].price}
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>

              {/* Card 3: LASER REJUV. */}
              <motion.div
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                onClick={() => navigate("/portal/services")}
                className="rounded-3xl p-5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-[var(--accent)] flex flex-col justify-between cursor-pointer group transition-all duration-300 relative overflow-hidden flex-1 min-h-[160px]"
              >
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                  <img
                    src="img/laser.jpg"
                    alt={services[2].title}
                    className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t dark:from-black/80 dark:via-black/20 from-white/95 via-white/40 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] flex items-center justify-center text-2xl mb-3 shadow-inner">
                    {services[2].emoji}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-heading)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                    {services[2].title}
                  </h3>
                  <p className="text-[var(--text)] text-xs leading-relaxed font-normal opacity-80 line-clamp-2">
                    {services[2].desc}
                  </p>
                </div>

                <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-2 relative z-10 flex justify-between items-center">
                  <p className="text-[var(--accent)] text-xs font-bold font-mono">
                    {services[2].price}
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>

              {/* Card 4: CHEMICAL PEELING (Sekarang ikut masuk ke sisi kanan secara vertikal) */}
              <motion.div
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                onClick={() => navigate("/portal/services")}
                className="rounded-3xl p-5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-[var(--accent)] flex flex-col justify-between cursor-pointer group transition-all duration-300 relative overflow-hidden flex-1 min-h-[160px]"
              >
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                  <img
                    src="img/chemical.jpg"
                    alt={services[3].title}
                    className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t dark:from-black/80 dark:via-black/20 from-white/95 via-white/40 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] flex items-center justify-center text-2xl mb-3 shadow-inner">
                    {services[3].emoji}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-heading)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                    {services[3].title}
                  </h3>
                  <p className="text-[var(--text)] text-xs leading-relaxed font-normal opacity-80 line-clamp-2">
                    {services[3].desc}. Pembersihan mendalam dengan micro-peel.
                  </p>
                </div>

                <div className="mt-4 border-t border-black/5 dark:bg-white/5 pt-2 relative z-10 flex justify-between items-center">
                  <p className="text-[var(--accent)] text-xs font-bold font-mono">
                    {services[3].price}
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            </div>
            
          </motion.div>

          {/* Tombol Lihat Semua */}
          <div className="text-center mt-12">
            <motion.button
              onClick={() => navigate("/portal/services")}
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:opacity-80 transition-colors cursor-pointer bg-white/60 dark:bg-white/5 px-6 py-2.5 rounded-full border border-black/5 dark:border-white/5 hover:border-[var(--accent)]/20"
            >
              Lihat semua layanan <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── KEUNGGULAN SECTION (Gently Floating Cards) ──────── */}
      <section className="py-20 px-4 md:px-8 relative z-10 bg-black/[0.02] dark:bg-black/20 border-y border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-center mb-16 text-[var(--text-heading)]"
          >
            Mengapa Memilih Aura Clinic?
          </motion.h2>

          {/* Grid Keunggulan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Dokter Tersertifikasi",
                desc: "Seluruh dokter kami memiliki sertifikasi estetika internasional (AAAM, BCAM).",
                iconColor: "text-[var(--accent)]",
                iconBg: "bg-[var(--accent-soft)] border-[var(--border)]",
                floatDelay: 0.1,
              },
              {
                icon: Award,
                title: "Teknologi Terkini",
                desc: "Peralatan laser dan perawatan berbasis robotika pintar diupdate setiap tahun.",
                iconColor: "text-[var(--accent)]",
                iconBg: "bg-[var(--accent-soft)] border-[var(--border)]",
                floatDelay: 0.3,
              },
              {
                icon: Clock,
                title: "Layanan Cepat",
                desc: "Sistem antrean digital cerdas — pantau estimasi waktu secara real-time dari ponsel.",
                iconColor: "text-[var(--accent)]",
                iconBg: "bg-[var(--accent-soft)] border-[var(--border)]",
                floatDelay: 0.5,
              },
            ].map(
              ({ icon: Icon, title, desc, iconBg, iconColor, floatDelay }) => (
                <motion.div
                  key={title}
                  variants={floatVariants(-10, 0.8)}
                  animate="animate"
                  transition={floatTransition(floatDelay, 4.5)}
                  className="rounded-3xl p-8 text-center bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/80 dark:hover:bg-white/10 transition-colors duration-300 relative group"
                >
                  {/* Custom glow border saat hover */}
                  <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-[var(--accent)]/30 group-hover:shadow-[0_8px_20px_rgba(201,169,110,0.06)] dark:group-hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all duration-300 pointer-events-none" />

                  {/* Kontainer Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${iconBg} shadow-inner group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>

                  {/* Konten Teks */}
                  <h3 className="font-bold text-lg mb-3 text-[var(--text-heading)]">
                    {title}
                  </h3>
                  <p className="text-[var(--text)] text-xs sm:text-sm leading-relaxed font-normal">
                    {desc}
                  </p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION (Speech Bubbles) ───────────── */}
      <section className="py-20 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black mb-3 text-[var(--text-heading)]"
            >
              Kata Pasien Kami
            </motion.h2>
            <p className="text-[var(--text)] text-xs sm:text-sm">
              Privasi medis terjamin, identitas disensor sesuai regulasi.
            </p>
          </div>

          {/* Testimonials Grid dengan Efek Floating Berbeda Delay */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                variants={floatVariants(
                  idx % 2 === 0 ? -12 : -8,
                  idx % 2 === 0 ? 1 : -1,
                )}
                animate="animate"
                transition={floatTransition(idx * 0.4, 5 + idx * 0.5)}
                className="rounded-3xl p-6 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-[var(--accent)]/30 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                {/* Rating Bintang */}
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)] filter drop-shadow-[0_0_5px_rgba(201,169,110,0.4)]"
                      />
                    ))}
                  </div>
                  <p className="text-[var(--text-strong)] text-xs sm:text-sm italic leading-relaxed font-normal">
                    "{t.text}"
                  </p>
                </div>

                {/* Nama Pasien */}
                <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <p className="text-xs font-bold font-mono text-[var(--accent)]">
                    {t.name}
                  </p>
                  <span className="text-[9px] font-mono bg-[var(--accent-soft)] text-[var(--accent)] px-1.5 py-0.5 rounded border border-[var(--accent)]/20 font-bold uppercase">
                    VERIFIED
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAPS & CONTACT SECTION ─────────────────────────── */}
      <section className="relative z-10 border-t border-black/5 dark:border-white/5">
        <LocationMap />
      </section>

      {/* ── FINAL CTA SECTION (Cinematic Glow Endpoint) ───────── */}
      <section className="py-24 px-4 md:px-8 text-center relative overflow-hidden z-10 bg-black/[0.01] dark:bg-black/40 border-t border-black/5 dark:border-white/5">
        {/* Glow Radial Final */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_center,var(--accent-soft),transparent)] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            variants={floatVariants(-8, 0.5)}
            animate="animate"
            transition={floatTransition(0.1, 4.5)}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[var(--accent-soft)] border border-[var(--accent)]/20 shadow-[0_4px_15px_rgba(201,169,110,0.15)] dark:shadow-[0_0_20px_rgba(56,189,248,0.2)] mb-6"
          >
            <Sparkles className="w-8 h-8 text-[var(--accent)] animate-pulse" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-[var(--text-heading)] leading-tight">
            Mulai Perjalanan Estetika Anda
          </h2>

          <p className="text-[var(--text)] text-sm sm:text-base mb-8 max-w-md mx-auto font-normal leading-relaxed">
            Konsultasi pertama dengan dokter tersertifikasi gratis. Sistem
            antrean digital kami mempermudah booking tanpa ribet.
          </p>

          <motion.button
            onClick={() => navigate("/portal/booking")}
            whileHover={{
              scale: 1.06,
              y: -4,
              boxShadow: isDark
                ? "0 0 30px rgba(56,189,248,0.5)"
                : "0 10px 30px rgba(201,169,110,0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-black text-white text-base shadow-md cursor-pointer transition-all border"
            style={{
              background: "var(--accent)",
              borderColor: "var(--accent)",
            }}
          >
            Booking Sekarang — Gratis
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
