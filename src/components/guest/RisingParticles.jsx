import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const RisingParticles = ({ theme }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 35 partikel acak
    const pts = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1, // 1px ke 4px
      x: Math.random() * 100, // Posisi horizontal acak (%)
      duration: Math.random() * 14 + 10, // Kecepatan lambat (10s - 24s)
      delay: Math.random() * -20, // Mulai di tengah animasi agar alami
      opacity: Math.random() * 0.4 + 0.1, // Transparansi halus
    }));
    setParticles(pts);
  }, []);

  const isDark = theme === "dark";
  const pColor = isDark ? "bg-[#38bdf8]/45" : "bg-[#C9A96E]/45";
  const glowShadow = isDark ? "0 0 10px rgba(56, 189, 248, 0.5)" : "0 0 10px rgba(201, 169, 110, 0.5)";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${pColor}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: "-2%",
            boxShadow: glowShadow,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [0, -1200], // Bergerak ke ATAS menentang gravitasi
            x: [0, Math.sin(p.id) * 20, 0], // Goyangan halus ke kiri-kanan
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default RisingParticles;
