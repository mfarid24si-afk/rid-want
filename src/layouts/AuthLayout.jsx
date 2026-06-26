import { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Sparkles, Heart, Star } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'
import { RisingParticles } from '../components/guest/RisingParticles'

const AuthLayout = () => {
  const { theme } = useTheme()
  const leftPanelRef = useRef(null)

  const handleMouseMove = (e) => {
    if (leftPanelRef.current) {
      const { clientX, clientY } = e;
      const rect = leftPanelRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      leftPanelRef.current.style.setProperty('--mouse-x', `${x}px`);
      leftPanelRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  }

  const isDark = theme === 'dark'

  // Efek Melayang Lambat (Floating Effect)
  const floatTransition = (delay = 0, duration = 5) => ({
    y: {
      duration: duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay: delay,
    }
  });

  return (
    <div className="min-h-screen flex transition-colors duration-300" style={{ background: 'var(--bg-base)' }}>
      {/* Left Branding Panel (Cinematic Cosmic / Weightless Panel) */}
      <div
        ref={leftPanelRef}
        onMouseMove={handleMouseMove}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden transition-colors duration-500"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #141414 0%, #1e1e1e 50%, #0d1b2a 100%)'
            : 'linear-gradient(135deg, #FDF8F5 0%, #F5ECE5 50%, #ebd7c7 100%)',
          borderRight: '1px solid var(--border)',
          '--mouse-x': '50%',
          '--mouse-y': '50%',
        }}
      >
        {/* Glow Nebula Kanan Atas */}
        <div
          className={`absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full blur-[80px] pointer-events-none transition-all duration-500 ${
            isDark ? 'bg-violet-600/10' : 'bg-[#C9A96E]/8'
          }`}
        />

        {/* Glow Nebula Kiri Bawah */}
        <div
          className={`absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full blur-[70px] pointer-events-none transition-all duration-500 ${
            isDark ? 'bg-cyan-600/10' : 'bg-rose-300/8'
          }`}
        />

        {/* Mouse Follower Glow (Pendaran Neon Interaktif) */}
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none opacity-40"
          style={{
            background: isDark
              ? 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.04) 50%, transparent 80%)'
              : 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(201, 169, 110, 0.12), rgba(212, 149, 106, 0.04) 50%, transparent 80%)'
          }}
        />

        {/* Partikel Melayang Menentang Gravitasi */}
        <RisingParticles theme={theme} />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 select-none">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={floatTransition(0, 4.5)}
            className="mb-8"
          >
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center border shadow-lg"
              style={{ 
                background: 'var(--accent)', 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: isDark ? '0 0 20px rgba(56, 189, 248, 0.3)' : '0 8px 20px rgba(201, 169, 110, 0.2)'
              }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1 
            animate={{ y: [0, -6, 0] }}
            transition={floatTransition(0.3, 5)}
            className="text-4xl font-black text-center mb-3 tracking-tight"
            style={{ color: 'var(--text-heading)' }}
          >
            Aura Clinic
          </motion.h1>
          
          <motion.p 
            animate={{ y: [0, -6, 0] }}
            transition={floatTransition(0.6, 5.2)}
            className="text-base text-center mb-10 max-w-sm font-medium"
            style={{ color: 'var(--text)' }}
          >
            Sistem Manajemen Klinik Kecantikan &amp; Estetika AI Modern
          </motion.p>

          {/* List Fitur Melayang */}
          <div className="space-y-4 w-full max-w-sm">
            {[
              { icon: Heart,    title: 'Manajemen Pelanggan',   desc: 'Kelola data pasien & rekam medis dengan mudah', delay: 0.1 },
              { icon: Star,     title: 'Penjadwalan Otomatis',  desc: 'Atur janji temu estetika secara real-time', delay: 0.2 },
              { icon: Sparkles, title: 'Laporan & Analitik',    desc: 'Dapatkan analitik kepuasan & kemajuan kulit bertenaga AI', delay: 0.3 },
            ].map(({ icon: Icon, title, desc, delay }) => (
              <motion.div 
                key={title} 
                animate={{ y: [0, -8, 0] }}
                transition={floatTransition(delay, 5.5)}
                className="flex items-center gap-4 rounded-2xl p-4 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-md dark:shadow-inner"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--accent-soft)] border border-[var(--border)]">
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm text-[var(--text-heading)]">{title}</h3>
                  <p className="text-xs text-[var(--text)] mt-0.5 font-normal leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div 
        className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 transition-colors duration-300"
        style={{ background: 'var(--bg-surface)' }}
      >
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout