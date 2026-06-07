import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div
        className={`relative w-full ${maxWidth} rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: 'var(--bg-raised)' }}
          >
            <X className="w-4 h-4" style={{ color: 'var(--text)' }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal