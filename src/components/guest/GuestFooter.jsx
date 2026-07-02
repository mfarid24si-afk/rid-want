import React from 'react'
import { Sparkles, Zap, Globe, Link2, MessageSquare, Share2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const footerLinks = {
  'Layanan': [
    { label: 'Perawatan Kulit',   path: '/portal/services' },
    { label: 'Perawatan Wajah',   path: '/portal/services' },
    { label: 'Anti Aging',        path: '/portal/services' },
    { label: 'Body Treatment',    path: '/portal/services' },
  ],
  'Pasien': [
    { label: 'Booking Konsultasi', path: '/portal/booking' },
    { label: 'Tracker Antrean',    path: '/portal/tracking' },
    { label: 'Poin Reward',        path: '/portal/loyalty' },
    { label: 'Voucher Saya',       path: '/portal/voucher' },
  ],
  'Informasi': [
    { label: 'Tentang Klinik',   path: '/portal/about' },
    { label: 'Promo & Diskon',   path: '/portal/promo' },
    { label: 'Riwayat Treatment', path: '/portal/history' },
  ],
}

const socialLinks = [
  { icon: MessageSquare, label: 'WhatsApp',  href: '#' },
  { icon: Globe,         label: 'Website',   href: '#' },
  { icon: Share2,        label: 'Instagram', href: '#' },
  { icon: Link2,         label: 'TikTok',    href: '#' },
  { icon: Zap,           label: 'Telegram',  href: '#' },
]

const GuestFooter = () => {
  return (
    <footer
      className="mt-12"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Grid atas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent)' }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p
                  className="font-bold text-base leading-none"
                  style={{ color: 'var(--text-heading)' }}
                >
                  Skinova
                </p>
                <p className="text-xs" style={{ color: 'var(--text)' }}>
                  Klinik Kecantikan &amp; Estetika
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>
              Klinik kecantikan berstandar internasional dengan dokter
              bersertifikat dan teknologi estetika terkini.
            </p>
            {/* Sosial media */}
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: 'var(--bg-raised)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-strong)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-soft)'
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-raised)'
                    e.currentTarget.style.color = 'var(--text-strong)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p
                className="text-sm font-bold mb-3"
                style={{ color: 'var(--text-heading)' }}
              >
                {heading}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.path}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text)')}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Jam operasional */}
        <div
          className="rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
          }}
        >
          {[
            { label: '📍 Lokasi', value: 'Jl. Kecantikan No. 88, Jakarta Selatan' },
            { label: '📞 Telepon', value: '(021) 888-SKIN' },
            { label: '🕐 Jam Buka', value: 'Sen–Sab, 09.00 – 20.00 WIB' },
          ].map((info) => (
            <div key={info.label}>
              <p
                className="text-xs font-semibold mb-0.5"
                style={{ color: 'var(--text)' }}
              >
                {info.label}
              </p>
              <p style={{ color: 'var(--text-strong)' }}>{info.value}</p>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-xs"
          style={{
            borderTop: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          <p>© 2025 Skinova. Seluruh hak dilindungi.</p>
          <div className="flex gap-4">
            <a href="#" style={{ color: 'var(--text)' }}>Kebijakan Privasi</a>
            <a href="#" style={{ color: 'var(--text)' }}>Syarat &amp; Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default GuestFooter
