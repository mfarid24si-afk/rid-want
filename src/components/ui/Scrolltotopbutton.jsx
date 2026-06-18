import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER_PX = 400

const ScrollToTopButton = () => {
  // useState — kontrol visibilitas tombol berdasarkan posisi scroll
  const [visible, setVisible] = useState(false)

  // useRef — menyimpan ID requestAnimationFrame untuk throttle scroll handler,
  // tidak perlu trigger re-render setiap kali berubah
  const tickingRef = useRef(false)

  // useEffect — pasang scroll listener sekali saat mount
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true

      requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX)
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup — lepas listener saat unmount agar tidak memory leak
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      className="fixed bottom-6 left-6 z-[9970] w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
      style={{
        background: 'var(--accent)',
        boxShadow: 'var(--shadow-lg)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </button>
  )
}

export default ScrollToTopButton