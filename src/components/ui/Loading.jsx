import { Sparkles } from 'lucide-react'

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center"
    style={{ background: 'var(--bg-base)' }}>
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse"
        style={{ background: 'var(--accent-soft)' }}>
        <Sparkles className="w-7 h-7" style={{ color: 'var(--accent)' }} />
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Memuat...</p>
    </div>
  </div>
)

export default Loading